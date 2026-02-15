/**
 * Deployment Library
 * 
 * Handles deployment of generated applications to Vercel.
 * Provides one-click deployment functionality.
 */

import type { GeneratedCode } from '@/types'

/**
 * Vercel API configuration
 */
const VERCEL_API_URL = 'https://api.vercel.com'
const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

/**
 * Deploy a project to Vercel
 */
export async function deployToVercel(
  projectName: string,
  code: GeneratedCode
): Promise<{ url: string; deploymentId: string }> {
  if (!VERCEL_TOKEN) {
    throw new Error('Vercel token not configured')
  }

  try {
    console.log('Deploying project to Vercel:', projectName)

    // Prepare files for deployment
    const files = code.files.map(file => ({
      file: file.path,
      data: file.content
    }))

    // Create deployment payload
    const deploymentPayload = {
      name: sanitizeProjectName(projectName),
      files: files,
      projectSettings: {
        framework: 'static',
        buildCommand: null,
        outputDirectory: null,
      },
      target: 'production',
    }

    // Add team ID if configured
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    }

    let deployUrl = `${VERCEL_API_URL}/v13/deployments`
    if (VERCEL_TEAM_ID) {
      deployUrl += `?teamId=${VERCEL_TEAM_ID}`
    }

    // Create deployment
    const response = await fetch(deployUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(deploymentPayload),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Vercel deployment error:', error)
      throw new Error(`Deployment failed: ${error.error?.message || 'Unknown error'}`)
    }

    const deployment = await response.json()
    
    console.log('Deployment created:', deployment.id)

    // Wait for deployment to be ready (with timeout)
    const deploymentUrl = await waitForDeployment(deployment.id, 60000) // 60 second timeout

    return {
      url: deploymentUrl,
      deploymentId: deployment.id,
    }

  } catch (error) {
    console.error('Error deploying to Vercel:', error)
    throw error
  }
}

/**
 * Wait for a deployment to be ready
 */
async function waitForDeployment(
  deploymentId: string,
  timeout: number = 60000
): Promise<string> {
  const startTime = Date.now()
  const pollInterval = 2000 // Check every 2 seconds

  while (Date.now() - startTime < timeout) {
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
      }

      let checkUrl = `${VERCEL_API_URL}/v13/deployments/${deploymentId}`
      if (VERCEL_TEAM_ID) {
        checkUrl += `?teamId=${VERCEL_TEAM_ID}`
      }

      const response = await fetch(checkUrl, { headers })
      
      if (!response.ok) {
        throw new Error('Failed to check deployment status')
      }

      const deployment = await response.json()

      // Check if deployment is ready
      if (deployment.readyState === 'READY') {
        return `https://${deployment.url}`
      }

      // Check if deployment failed
      if (deployment.readyState === 'ERROR') {
        throw new Error('Deployment failed')
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, pollInterval))

    } catch (error) {
      console.error('Error checking deployment status:', error)
      throw error
    }
  }

  throw new Error('Deployment timeout')
}

/**
 * Sanitize project name for Vercel
 * Vercel project names must be lowercase and alphanumeric with hyphens
 */
function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) || 'my-app'
}

/**
 * Get deployment status
 */
export async function getDeploymentStatus(deploymentId: string): Promise<{
  status: string;
  url?: string;
}> {
  if (!VERCEL_TOKEN) {
    throw new Error('Vercel token not configured')
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
    }

    let checkUrl = `${VERCEL_API_URL}/v13/deployments/${deploymentId}`
    if (VERCEL_TEAM_ID) {
      checkUrl += `?teamId=${VERCEL_TEAM_ID}`
    }

    const response = await fetch(checkUrl, { headers })
    
    if (!response.ok) {
      throw new Error('Failed to get deployment status')
    }

    const deployment = await response.json()

    return {
      status: deployment.readyState,
      url: deployment.readyState === 'READY' ? `https://${deployment.url}` : undefined,
    }

  } catch (error) {
    console.error('Error getting deployment status:', error)
    throw error
  }
}

/**
 * Delete a deployment from Vercel
 */
export async function deleteDeployment(deploymentId: string): Promise<void> {
  if (!VERCEL_TOKEN) {
    throw new Error('Vercel token not configured')
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
    }

    let deleteUrl = `${VERCEL_API_URL}/v13/deployments/${deploymentId}`
    if (VERCEL_TEAM_ID) {
      deleteUrl += `?teamId=${VERCEL_TEAM_ID}`
    }

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      throw new Error('Failed to delete deployment')
    }

  } catch (error) {
    console.error('Error deleting deployment:', error)
    throw error
  }
}

/**
 * Mock deployment for development/testing
 * Use this when Vercel token is not configured
 */
export async function mockDeploy(
  projectName: string,
  code: GeneratedCode
): Promise<{ url: string; deploymentId: string }> {
  console.log('Using mock deployment (Vercel token not configured)')
  
  // Simulate deployment delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const mockId = `mock-${Date.now()}`
  const mockUrl = `https://${sanitizeProjectName(projectName)}-${mockId}.vercel.app`
  
  return {
    url: mockUrl,
    deploymentId: mockId,
  }
}
