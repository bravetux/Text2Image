// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the current month as a two-digit string (e.g., "09" for September)
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const directoryUrl = `http://bravetux.com/bg/${currentMonth}/`;

    const response = await fetch(directoryUrl);
    if (!response.ok) {
      console.error(`Failed to fetch directory listing from ${directoryUrl}. Status: ${response.status}`);
      throw new Error(`Could not access the image directory. The server responded with status: ${response.status}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    if (!doc) {
      throw new Error("Failed to parse the directory listing page.");
    }

    // Find all anchor tags and extract their href attributes
    const links = Array.from(doc.querySelectorAll("a"));
    const imageUrls = links
      .map(link => link.getAttribute("href"))
      // Filter for common image file extensions
      .filter((href): href is string => !!href && /\.(jpg|jpeg|png|gif|webp)$/i.test(href))
      // Ensure the URLs are absolute
      .map(href => new URL(href, directoryUrl).href);

    return new Response(JSON.stringify({ images: imageUrls }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Failed to list images via HTTP:", error.message);
    return new Response(JSON.stringify({ error: `Failed to retrieve images. Reason: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})