/**
 * API Route: Deploy App
 * 
 * POST /api/deploy
 * Deploys a generated app to Vercel
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase'
import { deployToVercel, mockDeploy } from '@/lib/deployer'
import type { DeployRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body: DeployRequest = await request.json()
    const { project_id } = body

    // Validate input
    if (!project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Get user from authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify user with Supabase
    const supabase = createServiceSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get project from database
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if project is ready to deploy
    if (project.status !== 'ready' && project.status !== 'deployed') {
      return NextResponse.json(
        { error: 'Project is not ready to deploy' },
        { status: 400 }
      )
    }

    console.log(`Deploying project ${project.id} to Vercel`)

    // Create deployment log entry
    const { data: deploymentLog } = await supabase
      .from('deployment_logs')
      .insert({
        project_id: project.id,
        user_id: user.id,
        status: 'pending',
        deployment_provider: 'vercel',
      })
      .select()
      .single()

    try {
      const startTime = Date.now()
      
      // Deploy to Vercel (or use mock if token not configured)
      let deploymentResult
      
      if (process.env.VERCEL_TOKEN) {
        deploymentResult = await deployToVercel(project.name, project.code)
      } else {
        // Use mock deployment for development
        deploymentResult = await mockDeploy(project.name, project.code)
      }
      
      const buildTime = Date.now() - startTime

      // Update project with deployment URL
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update({
          deploy_url: deploymentResult.url,
          status: 'deployed',
        })
        .eq('id', project.id)
        .select()
        .single()

      if (updateError) {
        throw new Error('Failed to update project')
      }

      // Update deployment log
      if (deploymentLog) {
        await supabase
          .from('deployment_logs')
          .update({
            status: 'success',
            deploy_url: deploymentResult.url,
            build_time: buildTime,
          })
          .eq('id', deploymentLog.id)
      }

      console.log(`Project deployed successfully: ${deploymentResult.url}`)

      return NextResponse.json({
        success: true,
        deploy_url: deploymentResult.url,
        project: updatedProject,
      })

    } catch (deployError) {
      console.error('Error deploying project:', deployError)

      // Update deployment log
      if (deploymentLog) {
        await supabase
          .from('deployment_logs')
          .update({
            status: 'failed',
            error_message: deployError instanceof Error ? deployError.message : 'Unknown error',
          })
          .eq('id', deploymentLog.id)
      }

      return NextResponse.json(
        { error: 'Failed to deploy project' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in deploy API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
