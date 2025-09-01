import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Client } from 'https://esm.sh/basic-ftp@5.0.5'

// The base URL for images is now configured via the `FTP_IMAGE_BASE_URL` secret.
// This is the public web address where your FTP images can be accessed.
// Example: "https://cdn.bravetux.com/"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const ftpHost = Deno.env.get("FTP_HOST");
    const ftpUser = Deno.env.get("FTP_USER");
    const ftpPassword = Deno.env.get("FTP_PASSWORD");
    const imageBaseUrl = Deno.env.get("FTP_IMAGE_BASE_URL");

    if (!ftpHost || !ftpUser || !ftpPassword || !imageBaseUrl) {
      console.error("FTP credentials or image base URL are not set in environment variables.");
      return new Response(JSON.stringify({ error: "FTP configuration is missing on the server. Please ensure all required secrets are set." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const client = new Client();
    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPassword,
      port: 21,
      secure: 'explicit'
    });

    const currentMonth = new Date().getMonth() + 1;
    const directory = `/${currentMonth}`;
    
    let files: { name: string }[] = [];
    try {
      files = await client.list(directory);
    } catch (listError) {
      console.warn(`Could not list files in directory ${directory}:`, listError.message);
      files = [];
    } finally {
      client.close();
    }
    
    const imageFiles = files
      .map(file => file.name)
      .filter(fileName => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName))
      .map(fileName => `${imageBaseUrl}${currentMonth}/${fileName}`);

    return new Response(JSON.stringify({ images: imageFiles }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("FTP connection or listing failed:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve images from the FTP server." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})