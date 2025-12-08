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

    const { prompt, images, analysisIntent, perspective } = body;

    // Validation: Required fields
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

    // Enhanced prompt for ghosting recovery analysis
    const enhancedPrompt = `You are an AI relationship communication expert specializing in ghosting detection and recovery strategies. Analyze the provided chat screenshots and provide ghosting analysis.

FIRST - VALIDATE: Check if these are actually chat screenshots. If they are NOT chat screenshots (like random photos, landscapes, objects, etc.), respond with:
{
  "isGhosted": false,
  "ghostingStage": "",
  "ghostingProbability": 0,
  "recommendedMessage": [],
  "recommendedTone": "",
  "recoveryChance": 0,
  "moveOnAdvice": null,
  "confidenceScore": 0,
  "toolType": "ghosting-recovery",
  "error": "Invalid image. Please upload clear chat screenshots only."
}

IF THEY ARE CHAT SCREENSHOTS, analyze them and provide:

ANALYSIS INTENT: ${analysisIntent || "Detect if I'm being ghosted"}
PERSPECTIVE: ${perspective || 'The other person'}

USER CONTEXT: ${prompt}

Provide a comprehensive ghosting analysis with:

1. **IS GHOSTED** (boolean): Whether ghosting is occurring

2. **GHOSTING STAGE**: Exact stage from these options:
   - "Early Fade" (gradual decrease, <1 week)
   - "Soft Ghost" (clear drop, 1-2 weeks)  
   - "Hard Ghost" (complete silence, 2+ weeks)
   - "Zombie Risk" (they might return)

3. **GHOSTING PROBABILITY** (0-1): Likelihood ghosting is happening

4. **RECOMMENDED MESSAGES** (array): At least 5 copy-ready text options for recovery, considering the conversation context and ghosting stage

5. **RECOMMENDED TONE**: Guidelines for the message tone (e.g., "light, no guilt, single emoji")

6. **RECOVERY CHANCE** (0-1): Probability the other person will reply if recommended message is sent

7. **MOVE ON ADVICE** (string or null): If recoveryChance < 0.25, provide 1-sentence actionable tip to move on

8. **CONFIDENCE SCORE** (0-1): Based on image clarity and analysis complexity

Base your analysis on message frequency, response times, conversation flow, emotional cues, and recent activity patterns. Consider the ghosting stage when crafting recovery messages.

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
      model: 'x-ai/grok-4.1-fast',
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
      responseFormat: {
        type: 'json_schema' as const,
        jsonSchema: {
          name: 'ghosting_recovery_response',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              isGhosted: {
                type: 'boolean',
                description: 'Whether ghosting is occurring',
              },
              ghostingStage: {
                type: 'string',
                description: 'Ghosting stage: Early Fade, Soft Ghost, Hard Ghost, or Zombie Risk',
              },
              ghostingProbability: {
                type: 'number',
                minimum: 0,
                maximum: 1,
                description: 'Likelihood ghosting is happening (0-1)',
              },
              recommendedMessage: {
                type: 'array',
                items: { type: 'string' },
                minItems: 5,
                description: 'At least 5 copy-ready text options for recovery',
              },
              recommendedTone: {
                type: 'string',
                description: 'Guidelines for the message tone',
              },
              recoveryChance: {
                type: 'number',
                minimum: 0,
                maximum: 1,
                description: 'Probability the other person will reply (0-1)',
              },
              moveOnAdvice: {
                type: ['string', 'null'],
                description: '1-sentence actionable tip if recoveryChance < 0.25',
              },
              confidenceScore: {
                type: 'number',
                minimum: 0,
                maximum: 1,
                description: 'Confidence level from 0.0 to 1.0',
              },
              toolType: {
                type: 'string',
                enum: ['ghosting-recovery'],
                description: 'Tool type identifier',
              },
              error: {
                type: 'string',
                description: 'Error message if images are not chat screenshots',
              },
            },
            required: [
              'isGhosted',
              'ghostingStage',
              'ghostingProbability',
              'recommendedMessage',
              'recommendedTone',
              'recoveryChance',
              'moveOnAdvice',
              'confidenceScore',
              'toolType',
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
