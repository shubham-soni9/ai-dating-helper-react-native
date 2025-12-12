// Setup type definitions for built-in Supabase Runtime APIs
// eslint-disable-next-line import/no-unresolved
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
// eslint-disable-next-line import/no-unresolved
import { OpenRouter } from '@openrouter/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY');
      throw new Error('Server configuration error: Missing API Key');
    }

    const client = new OpenRouter({ apiKey: OPENROUTER_API_KEY });

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate images array length (max 3 images)
    if (images.length > 3) {
      return new Response(JSON.stringify({ error: 'Maximum 3 images are allowed.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate that images are provided and appear to be screenshots
    const validImages = images.filter((img) => img && typeof img === 'string' && img.length > 0);
    if (validImages.length === 0) {
      return new Response(JSON.stringify({ error: 'Please provide valid chat screenshots.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced prompt for better analysis
    const enhancedPrompt = `You are a relationship expert AI. Analyze the provided chat screenshots and provide comprehensive de-escalation guidance.

FIRST - VALIDATE: Check if these are actually chat screenshots. If they are NOT chat screenshots (like random photos, landscapes, objects, etc.), respond with:
{
  "situationAnalysis": "",
  "partnerEmotions": [],
  "partnerNeeds": [],
  "suggestions": [],
  "approach": "",
  "nextSteps": [],
  "error": "Please provide screenshots of your chat conversations, not other types of images."
}

IF THEY ARE CHAT SCREENSHOTS, analyze them and provide:

1. **SITUATION ANALYSIS**: Briefly explain what's happening in the conversation - the context, main issues, and current state of the relationship dynamic.

2. **PARTNER'S EMOTIONS**: Identify 2-4 specific emotions your partner is likely feeling right now (e.g., frustrated, hurt, disappointed, anxious, angry, confused, etc.)

3. **PARTNER'S NEEDS**: Identify 2-4 underlying needs or desires your partner has in this situation (e.g., feeling heard, getting reassurance, needing space, wanting validation, etc.)

4. **DE-ESCALATION SUGGESTIONS**: Provide 3-5 specific message suggestions that directly address the situation and partner's emotional needs.

5. **APPROACH STRATEGY**: Explain the overall approach you should take - the mindset, tone, and general strategy.

6. **NEXT STEPS**: Provide 2-4 concrete actions to take after sending the initial de-escalation message.

The user's request: ${prompt}

Respond in the exact JSON format specified.`;

    // Build the content array with enhanced prompt and images
    const content: any[] = [{ type: 'text', text: enhancedPrompt }];

    // Add all images to the content
    images.forEach((image, index) => {
      if (image) {
        content.push({
          type: 'image_url',
          imageUrl: { url: image },
        });
      }
    });

    const completion = await client.chat.send({
      model: Deno.env.get('OPENROUTER_MODEL') ?? 'x-ai/grok-4.1-fast',
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
      responseFormat: {
        type: 'json_schema' as const,
        jsonSchema: {
          name: 'deescalator_response',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              situationAnalysis: {
                type: 'string',
                description: "Analysis of what's happening in the conversation",
              },
              partnerEmotions: {
                type: 'array',
                items: { type: 'string' },
                minItems: 2,
                maxItems: 4,
                description: "Partner's current emotions",
              },
              partnerNeeds: {
                type: 'array',
                items: { type: 'string' },
                minItems: 2,
                maxItems: 4,
                description: "Partner's underlying needs",
              },
              suggestions: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                maxItems: 5,
                description: 'Specific message suggestions for de-escalation',
              },
              approach: {
                type: 'string',
                description: 'General approach strategy for handling the situation',
              },
              nextSteps: {
                type: 'array',
                items: { type: 'string' },
                minItems: 2,
                maxItems: 4,
                description: 'Recommended next steps after sending the message',
              },
              error: {
                type: 'string',
                description: 'Error message if images are not chat screenshots',
              },
            },
            required: [
              'situationAnalysis',
              'partnerEmotions',
              'partnerNeeds',
              'suggestions',
              'approach',
              'nextSteps',
            ],
            additionalProperties: false,
          },
        },
      },
      stream: false,
    });

    const contentStr = completion.choices?.[0]?.message?.content;

    if (!contentStr) {
      console.error('No content in response:', completion);
      throw new Error('No content received from AI provider');
    }

    let responseContent;
    try {
      responseContent = typeof contentStr === 'string' ? JSON.parse(contentStr) : contentStr;
    } catch {
      console.error('Failed to parse response content:', contentStr);
      throw new Error('Failed to parse response from AI provider');
    }

    return new Response(JSON.stringify(responseContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
