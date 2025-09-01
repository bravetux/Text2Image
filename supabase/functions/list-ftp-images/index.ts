import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { FTPClient } from "https://deno.land/x/ftp@v2.1.0/mod.ts";

// IMPORTANT: You must configure this base URL to match your public CDN or file server.
// This is the public web address where your FTP images can be accessed.
// Replace "https://your-public-url.com/path/to/images/" with your actual URL.
// Example: "https://cdn.bravetux.com/"
const IMAGE_BASE_URL = "https://your-public-url.com/path/to/images/";

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

    if (!ftpHost || !ftpUser || !ftpPassword) {
      console.error("FTP credentials are not set in environment variables.");
      return new Response(JSON.stringify({ error: "FTP configuration is missing on the server. Please ensure secrets are set." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ftp = new FTPClient(ftpHost, {
      user: ftpUser,
      pass: ftpPassword,
      port: 21,
    });

    await ftp.connect();

    const currentMonth = new Date().getMonth() + 1;
    const directory = `/${currentMonth}`;
    
    let files: string[] = [];
    try {
      files = await ftp.list(directory);
    } catch (listError) {
      console.warn(`Could not list files in directory ${directory}:`, listError.message);
      files = [];
    } finally {
      await ftp.close();
    }
    
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `${IMAGE_BASE_URL}${currentMonth}/${file}`);

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