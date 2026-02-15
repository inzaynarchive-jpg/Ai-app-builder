/**
 * API Route: Generate App
 * 
 * POST /api/generate
 * Generates a new application based on user prompt using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase'
import { generateApp, extractProjectName } from '@/lib/ai'
import type { GenerateRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body: GenerateRequest = await request.json()
    const { prompt, name } = body

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
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

    console.log(`Generating app for user ${user.id}`)

    // Extract project name from prompt if not provided
    const projectName = name || extractProjectName(prompt)

    // Create initial project record with 'generating' status
    const { data: project, error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: projectName,
        description: prompt,
        status: 'generating',
        code: { files: [] },
        ai_model: 'claude-sonnet-4',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating project:', insertError)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    // Generate app code using AI (this may take some time)
    const startTime = Date.now()
    
    try {
      const generatedCode = await generateApp(prompt)
      const generationTime = Date.now() - startTime

      // Update project with generated code
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update({
          code: generatedCode,
          status: 'ready',
          generation_time: generationTime,
        })
        .eq('id', project.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating project:', updateError)
        return NextResponse.json(
          { error: 'Failed to update project' },
          { status: 500 }
        )
      }

      // Update user's project count
      await supabase.rpc('increment', {
        table_name: 'user_profiles',
        column_name: 'total_generations',
        row_id: user.id
      })

      console.log(`App generated successfully in ${generationTime}ms`)

      return NextResponse.json({
        success: true,
        project: updatedProject,
      })

    } catch (generateError) {
      console.error('Error generating app:', generateError)

      // Update project status to 'failed'
      await supabase
        .from('projects')
        .update({
          status: 'failed',
        })
        .eq('id', project.id)

      return NextResponse.json(
        { error: 'Failed to generate app' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
