// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { OpenRouter } from "@openrouter/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY");
      throw new Error("Server configuration error: Missing API Key");
    }

    const client = new OpenRouter({ apiKey: OPENROUTER_API_KEY });

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (_e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { prompt, image } = body;

    // Validation: Both prompt and image are compulsory
    if (!prompt || !image) {
      return new Response(
        JSON.stringify({ error: 'Both "prompt" and "image" are required.' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Process image: if it's raw base64, prepend data URI scheme
    let imageUrl = image;
    if (!image.startsWith("http") && !image.startsWith("data:")) {
      imageUrl = `data:image/jpeg;base64,${image}`;
    }

    const completion = await client.chat.send({
      model: "x-ai/grok-4.1-fast",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", imageUrl: { url: imageUrl } },
          ],
        },
      ],
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "suggestions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              dmSuggestions: {
                type: "array",
                items: { type: "string" },
                minItems: 5,
                maxItems: 5,
              },
              hints: {
                type: "array",
                items: { type: "string" },
                minItems: 5,
                maxItems: 5,
              },
            },
            required: ["dmSuggestions", "hints"],
            additionalProperties: false,
          },
        },
      },
      stream: false,
    });

    const contentStr = completion.choices?.[0]?.message?.content;

    if (!contentStr) {
      console.error("No content in response:", completion);
      throw new Error("No content received from AI provider");
    }

    let content;
    try {
      content = typeof contentStr === "string"
        ? JSON.parse(contentStr)
        : contentStr;
    } catch (_e) {
      console.error("Failed to parse response content:", contentStr);
      throw new Error("Failed to parse response from AI provider");
    }

    return new Response(
      JSON.stringify(content),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
