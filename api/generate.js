const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are VASLKAAR, an AI portfolio and business assistant for freelance creatives.
Your job is to write Behance case studies and LinkedIn posts that sound like the actual creator wrote them — specific, personal, professional.

Rules:
- Never use generic phrases: "innovative", "cutting-edge", "seamless", "leveraged", "elevate", "synergy"
- Always write in first person
- Be specific about the design decisions made
- Match the creator's tone (their Design DNA is provided)
- Keep Behance full_description between 200-300 words
- LinkedIn short: under 150 chars. Medium: around 300 chars. Long: around 500 chars with hashtags
- All hashtags must start with #
- Generate alt texts based on the described project (since you can't see the images)
- Return ONLY valid JSON — no markdown, no code fences, no explanation

You must return ONLY a valid JSON object in this exact format:
{
  "behance": {
    "title": "Catchy, SEO-optimized project title",
    "challenge": "What problem needed solving (2-3 sentences)",
    "process": "How the creator approached it (2-3 sentences)",
    "solution": "Final result and impact (2-3 sentences)",
    "tools": ["Tool1", "Tool2"],
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
    "full_description": "Complete 200-300 word project description"
  },
  "linkedin": {
    "short": "Under 150 character post",
    "medium": "Around 300 character post with story hook",
    "long": "Around 500 character post with narrative and hashtags"
  },
  "seo": {
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
    "alt_texts": ["Alt text for image 1", "Alt text for image 2"],
    "meta_description": "160 character meta description",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }
}`;

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate API key
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured. Add it to Vercel Environment Variables.' });
  }

  try {
    const { description, projectName, clientType, tools, imageCount, dnaProfile } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Project description is required.' });
    }

    // Build the user prompt
    const dnaString = dnaProfile
      ? `Aesthetic: ${(dnaProfile.aesthetics || []).join(', ') || 'Not specified'}. Inspirations: ${dnaProfile.inspirations || 'Not specified'}. Style notes: ${dnaProfile.description || 'Not specified'}.`
      : 'No Design DNA provided.';

    const userPrompt = `Creator's Design DNA: ${dnaString}

Project Details:
- Project Name: ${projectName || 'Not provided (suggest one)'}
- Client Type: ${clientType || 'Not specified'}
- Description: ${description}
- Tools Used: ${(tools || []).join(', ') || 'Not specified'}
- Number of images: ${imageCount || 1}

Generate the complete Behance case study, LinkedIn posts, and SEO package for this project. Generate ${imageCount || 1} alt texts (one per image). Remember: return ONLY valid JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Groq');
    }

    // Parse JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Validate structure
    if (!result.behance || !result.linkedin || !result.seo) {
      throw new Error('Response missing required sections (behance, linkedin, seo)');
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Generation error:', error);

    // Handle specific Groq errors
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Check your GROQ_API_KEY.' });
    }

    return res.status(500).json({
      error: 'Generation failed. Please try again.',
      details: error.message,
    });
  }
};
