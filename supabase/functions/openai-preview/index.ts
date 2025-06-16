
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced input sanitization
const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .slice(0, 10000) // Limit to 10k chars
    .replace(/[<>'"&]/g, (match) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match as keyof typeof entities];
    });
};

// Rate limiting (simple in-memory approach)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

const checkRateLimit = (clientId: string): boolean => {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return false;
  }
  
  clientData.count++;
  return true;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientId = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced input sanitization
    const sanitizedPrompt = sanitizeInput(prompt);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing OpenAI request for prompt length:', sanitizedPrompt.length);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful AI assistant. Provide a concise, helpful response to demonstrate how the prompt works. Keep responses under 500 words and ensure they are safe and appropriate.' 
            },
            { role: 'user', content: sanitizedPrompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        
        let errorMessage = 'Failed to generate preview';
        if (response.status === 401) {
          errorMessage = 'API authentication failed';
        } else if (response.status === 429) {
          errorMessage = 'Service is busy. Please try again later.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid request format';
        }

        return new Response(
          JSON.stringify({ error: errorMessage }),
          { 
            status: response.status >= 500 ? 500 : 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error('No content in OpenAI response:', data);
        return new Response(
          JSON.stringify({ error: 'No response generated' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('OpenAI request successful');

      return new Response(
        JSON.stringify({ content: content.trim() }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Request timeout. Please try again.' }),
          {
            status: 408,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in OpenAI preview function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
