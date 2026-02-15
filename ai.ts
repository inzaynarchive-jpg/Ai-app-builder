/**
 * AI Client Library
 * 
 * Handles all AI-related operations including code generation using Claude API.
 * This module communicates with Anthropic's Claude to generate web applications
 * based on natural language descriptions.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { GeneratedCode, CodeFile } from '@/types'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

/**
 * System prompt that instructs Claude how to generate web applications
 */
const SYSTEM_PROMPT = `You are an expert web developer. Your task is to generate complete, production-ready web applications based on user descriptions.

CRITICAL INSTRUCTIONS:
1. Generate a SINGLE, SELF-CONTAINED HTML file that includes all necessary code
2. Use inline CSS (within <style> tags) and inline JavaScript (within <script> tags)
3. Use React with CDN imports (DO NOT use npm or build tools)
4. Use Tailwind CSS via CDN
5. The app must be fully functional and ready to run by opening the HTML file
6. Include all necessary dependencies via CDN
7. Use modern, clean UI design with Tailwind CSS
8. Make the app responsive and mobile-friendly
9. Add helpful comments in the code

RESPONSE FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "files": [
    {
      "path": "index.html",
      "content": "<!DOCTYPE html>...",
      "language": "html"
    }
  ],
  "dependencies": {},
  "framework": "react"
}

DO NOT include any markdown formatting, explanations, or text outside the JSON.
The entire response must be valid JSON.`

/**
 * Generate a web application from a natural language prompt
 */
export async function generateApp(prompt: string): Promise<GeneratedCode> {
  try {
    console.log('Generating app with prompt:', prompt)

    // Create the message for Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a web application for: ${prompt}

Remember to:
- Create ONE self-contained HTML file
- Include React via CDN (https://unpkg.com/react@18/umd/react.production.min.js and https://unpkg.com/react-dom@18/umd/react-dom.production.min.js)
- Include Babel standalone for JSX (https://unpkg.com/@babel/standalone/babel.min.js)
- Include Tailwind CSS via CDN (https://cdn.tailwindcss.com)
- Make it beautiful and functional
- Return ONLY the JSON response as specified`
        }
      ]
    })

    // Extract the response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : ''

    console.log('Raw AI response:', responseText.substring(0, 200) + '...')

    // Parse the JSON response
    let generatedCode: GeneratedCode
    
    try {
      // Remove any markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      generatedCode = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Response text:', responseText)
      
      // Fallback: create a simple HTML file with error message
      generatedCode = createFallbackApp(prompt)
    }

    // Validate the generated code structure
    if (!generatedCode.files || !Array.isArray(generatedCode.files)) {
      throw new Error('Invalid generated code structure')
    }

    console.log('Successfully generated app with', generatedCode.files.length, 'files')
    
    return generatedCode

  } catch (error) {
    console.error('Error generating app:', error)
    
    // Return a fallback app if AI generation fails
    return createFallbackApp(prompt)
  }
}

/**
 * Create a fallback app when AI generation fails
 */
function createFallbackApp(prompt: string): GeneratedCode {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated App</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState } = React;
    
    function App() {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your App: ${escapeHtml(prompt)}
            </h1>
            <p className="text-gray-600 mb-6">
              This is a starter template for your app. The AI will generate a more sophisticated version.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> This is a placeholder. Try regenerating your app for a better result.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`

  return {
    files: [
      {
        path: 'index.html',
        content: htmlContent,
        language: 'html'
      }
    ],
    dependencies: {},
    framework: 'react'
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = { textContent: text } as any
  return div.innerHTML || text
}

/**
 * Extract project name from prompt
 */
export function extractProjectName(prompt: string): string {
  // Take the first few words and capitalize them
  const words = prompt.split(' ').slice(0, 5)
  const name = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return name.length > 50 ? name.substring(0, 47) + '...' : name
}

/**
 * Validate generated code
 */
export function validateGeneratedCode(code: GeneratedCode): boolean {
  if (!code.files || !Array.isArray(code.files)) {
    return false
  }
  
  if (code.files.length === 0) {
    return false
  }
  
  // Check that all files have required properties
  for (const file of code.files) {
    if (!file.path || !file.content || !file.language) {
      return false
    }
  }
  
  return true
}
