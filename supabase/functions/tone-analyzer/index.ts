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
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, images, analysisIntent, perspective } = body;

    // Validation: Required fields
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

    // Enhanced prompt for tone analysis
    const enhancedPrompt =
      `You are an AI relationship communication expert. Analyze the provided chat screenshots and provide a comprehensive tone analysis.

FIRST - VALIDATE: Check if these are actually chat screenshots. If they are NOT chat screenshots (like random photos, landscapes, objects, etc.), respond with:
{
  "overallTone": "",
  "userTone": "",
  "otherPersonTone": "",
  "toxicityLevel": "",
  "emotionalSignals": [],
  "conversationHealth": "",
  "confidenceScore": 0,
  "toolType": "tone-analyzer",
  "error": "Invalid image. Please upload clear chat screenshots only."
}

IF THEY ARE CHAT SCREENSHOTS, analyze them and provide:

ANALYSIS INTENT: ${analysisIntent || "General tone analysis"}
PERSPECTIVE: ${perspective || "Both sides"}

USER CONTEXT: ${prompt}

Provide a detailed tone analysis with:

1. **OVERALL TONE**: The dominant emotional tone of the conversation (e.g., "Supportive", "Confrontational", "Playful", "Tense", "Warm", "Cold", "Passive Aggressive")

2. **USER TONE**: Specific analysis of the user's tone based on their messages

3. **OTHER PERSON TONE**: Specific analysis of the other person's tone

4. **TOXICITY LEVEL**: Rate the toxicity from "None" to "High" with explanation

5. **EMOTIONAL SIGNALS**: Array of 3-5 specific emotions detected (e.g., ["Frustration", "Affection", "Uncertainty", "Defensiveness", "Excitement"])

6. **CONVERSATION HEALTH**: Overall health assessment ("Healthy", "Concerning", "Needs Attention", "Toxic", "Recovering")

7. **CONFIDENCE SCORE**: Confidence level from 0.0 to 1.0 based on image clarity and analysis complexity

The user's request: ${prompt}

Respond in the exact JSON format specified.`;

    // Build the content array with enhanced prompt and images
    const content: any[] = [{ type: "text", text: enhancedPrompt }];

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
          name: "tone_analysis_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallTone: {
                type: "string",
                description: "The dominant emotional tone of the conversation",
              },
              userTone: {
                type: "string",
                description: "Specific analysis of the user's tone",
              },
              otherPersonTone: {
                type: "string",
                description: "Specific analysis of the other person's tone",
              },
              toxicityLevel: {
                type: "string",
                description: "Toxicity level rating",
              },
              emotionalSignals: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5,
                description: "Array of specific emotions detected",
              },
              conversationHealth: {
                type: "string",
                description: "Overall health assessment of the conversation",
              },
              confidenceScore: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "Confidence level from 0.0 to 1.0",
              },
              toolType: {
                type: "string",
                enum: ["tone-analyzer"],
                description: "Tool type identifier",
              },
              error: {
                type: "string",
                description: "Error message if images are not chat screenshots",
              },
            },
            required: [
              "overallTone",
              "userTone",
              "otherPersonTone",
              "toxicityLevel",
              "emotionalSignals",
              "conversationHealth",
              "confidenceScore",
              "toolType",
            ],
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

    return new Response(JSON.stringify(responseContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
