// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const imageUrl = url.searchParams.get('url')

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Image URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch the image from the original source
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`)
    }

    // Get the image data as a blob
    const imageBlob = await response.blob()
    const contentType = response.headers.get('Content-Type') || 'image/jpeg'

    // Return the image data with appropriate headers
    return new Response(imageBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for a year
      },
      status: 200,
    })
  } catch (error) {
    console.error('Image proxy error:', error.message)
    return new Response(JSON.stringify({ error: `Failed to proxy image. Reason: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})