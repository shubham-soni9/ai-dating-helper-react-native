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

    const { prompt, images, roastIntent, focusArea } = body;

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

    // Validate images array length (max 1 image for profile roast)
    if (images.length > 1) {
      return new Response(JSON.stringify({ error: 'Only 1 profile screenshot is allowed.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate that image is provided and appears to be a profile screenshot
    const validImages = images.filter((img) => img && typeof img === 'string' && img.length > 0);
    if (validImages.length === 0) {
      return new Response(JSON.stringify({ error: 'Please provide a valid profile screenshot.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced prompt for profile roast analysis
    const enhancedPrompt = `You are an AI dating profile expert specializing in profile analysis and optimization. Analyze the provided dating profile screenshot and give a comprehensive roast/praise with actionable feedback.

FIRST - VALIDATE: Check if this is actually a dating profile screenshot. If it is NOT a dating profile (like random photos, landscapes, objects, memes, etc.), respond with:
{
  "profileScore": 0,
  "roastHeadline": "",
  "strengths": [],
  "weaknesses": [],
  "quickFixes": [],
  "photoScores": [],
  "bioScore": 0,
  "confidenceScore": 0,
  "toolType": "profile-roast",
  "error": "Invalid image. Please upload a clear dating-profile screenshot."
}

IF IT IS A DATING PROFILE SCREENSHOT, analyze it and provide:

ROAST INTENT: ${roastIntent || 'Brutal but helpful'}
FOCUS AREA: ${focusArea || 'All'}

USER CONTEXT: ${prompt}

Provide a comprehensive profile analysis with:

1. **PROFILE SCORE** (0-100): Overall profile quality score

2. **ROAST HEADLINE** (string): A witty, attention-grabbing one-liner that summarizes the profile

3. **STRENGTHS** (array): At least 3 positive aspects of the profile

4. **WEAKNESSES** (array): At least 3 areas that need improvement

5. **QUICK FIXES** (array): At least 3 specific, actionable improvements

6. **PHOTO SCORES** (array): Individual scores for each photo (0-100), only if photos are visible

7. **BIO SCORE** (0-100): Score for bio/prompts content, only if text content is visible

8. **CONFIDENCE SCORE** (0-1): Based on image clarity and analysis complexity

ROAST STYLE GUIDE:
- Brutal but helpful: Honest criticism with constructive solutions
- Gentle & encouraging: Soft feedback with positive reinforcement  
- Gen-Z humor: Modern, meme-aware jokes and references
- Executive summary: Professional, no-nonsense analysis

FOCUS AREA LOGIC:
- All: Include all scores and feedback
- Photos only: Only include photoScores, skip bioScore
- Bio/prompts only: Only include bioScore, skip photoScores  
- First photo + first prompt: Focus on first photo and first text element

The user's request: ${prompt}

Respond in the exact JSON format specified.`;

    // Build the content array with enhanced prompt and image
    const content: any[] = [{ type: 'text', text: enhancedPrompt }];

    // Add the profile image to the content
    if (images[0]) {
      content.push({
        type: 'image_url',
        imageUrl: { url: images[0] },
      });
    }

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
          name: 'profile_roast_response',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              profileScore: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Overall profile quality score (0-100)',
              },
              roastHeadline: {
                type: 'string',
                description: 'Witty one-liner summary of the profile',
              },
              strengths: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                description: 'Positive aspects of the profile',
              },
              weaknesses: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                description: 'Areas that need improvement',
              },
              quickFixes: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                description: 'Specific actionable improvements',
              },
              photoScores: {
                type: 'array',
                items: { type: 'number' },
                description: 'Individual scores for each photo (0-100)',
              },
              bioScore: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Score for bio/prompts content (0-100)',
              },
              confidenceScore: {
                type: 'number',
                minimum: 0,
                maximum: 1,
                description: 'Confidence level from 0.0 to 1.0',
              },
              toolType: {
                type: 'string',
                enum: ['profile-roast'],
                description: 'Tool type identifier',
              },
              error: {
                type: ['string', 'null'],
                description: 'Error message if image is not a dating profile',
              },
            },
            required: [
              'profileScore',
              'roastHeadline',
              'strengths',
              'weaknesses',
              'quickFixes',
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
