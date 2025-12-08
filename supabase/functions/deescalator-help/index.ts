// Setup type definitions for built-in Supabase Runtime APIs
// eslint-disable-next-line import/no-unresolved
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// eslint-disable-next-line import/no-unresolved
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
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { prompt, images } = body;

    // Validation: Both prompt and images are compulsory
    if (!prompt || !images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Both "prompt" and "images" (array) are required.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate images array length (max 3 images)
    if (images.length > 3) {
      return new Response(
        JSON.stringify({ error: "Maximum 3 images are allowed." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate that images are provided and appear to be screenshots
    const validImages = images.filter((img) =>
      img && typeof img === "string" && img.length > 0
    );
    if (validImages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide valid chat screenshots." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Build the content array with prompt and images
    const content: any[] = [{ type: "text", text: prompt }];

    // Add all images to the content
    images.forEach((image, index) => {
      if (image) {
        content.push({
          type: "image_url",
          imageUrl: { url: image },
        });
      }
    });

    const completion = await client.chat.send({
      model: "x-ai/grok-4.1-fast",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      responseFormat: {
        type: "json_schema" as const,
        jsonSchema: {
          name: "deescalator_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5,
                description: "Specific message suggestions for de-escalation",
              },
              approach: {
                type: "string",
                description:
                  "General approach strategy for handling the situation",
              },
              nextSteps: {
                type: "array",
                items: { type: "string" },
                minItems: 2,
                maxItems: 4,
                description: "Recommended next steps after sending the message",
              },
            },
            required: ["suggestions", "approach", "nextSteps"],
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

    let responseContent;
    try {
      responseContent = typeof contentStr === "string"
        ? JSON.parse(contentStr)
        : contentStr;
    } catch {
      console.error("Failed to parse response content:", contentStr);
      throw new Error("Failed to parse response from AI provider");
    }

    return new Response(
      JSON.stringify(responseContent),
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
