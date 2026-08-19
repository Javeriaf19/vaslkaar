const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { category, skills, aesthetics, experience } = req.body;

    const prompts = {
      'project-ideas': `Generate 5 creative freelance project ideas that a designer/creator can build for their portfolio or sell to clients. Each should be specific, actionable, and include potential earning.`,
      'hackathon-ideas': `Generate 5 unique hackathon project ideas that combine design + technology. Focus on AI-powered tools, creative tech, or social impact projects. Make them winnable and impressive.`,
      'income-boost': `Generate 5 specific, actionable ways this freelancer can increase their income in the next 30 days. Be concrete — not generic advice. Include estimated extra monthly income for each.`,
      'skill-growth': `Suggest 5 high-value skills this freelancer should learn next to increase their earning potential. Include why each skill is in demand and estimated income boost.`,
      'passive-income': `Generate 5 realistic passive income ideas for a creative freelancer. Focus on digital products, templates, courses, or automated services they can build once and sell repeatedly.`,
      'opportunities': `Generate 8 specific freelance opportunities, gigs, or job listings that would be perfect for this freelancer right now. Include the platform to find them, expected pay range, and how to apply. Mix: 3 quick gigs (earn this week), 3 ongoing clients (monthly income), 2 dream projects (career-building). Be very specific with job titles and platforms.`,
    };

    const systemPrompt = `You are VASLKAAR's AI Growth Advisor for freelance creatives. You give specific, actionable, personalized advice — never generic.

Rules:
- Be specific: name exact platforms, tools, price points
- Every suggestion must be actionable TODAY
- Include realistic earning estimates in PKR and USD
- Match suggestions to the freelancer's skills and style
- Never say "consider" or "you might want to" — be direct
- Use emojis sparingly for visual scanning
- Return ONLY valid JSON — no markdown, no code fences

Return a JSON object with this format:
{
  "title": "Category title",
  "ideas": [
    {
      "title": "Specific idea title",
      "description": "2-3 sentence actionable description",
      "earning": "Rs. X - Y / $X - $Y",
      "difficulty": "Easy|Medium|Hard",
      "timeframe": "How long to execute",
      "action": "First step to take right now",
      "platform": "Where to do this (if applicable)",
      "link": "URL to the platform (if applicable)"
    }
  ]
}`;

    const userPrompt = `Freelancer Profile:
- Skills: ${(skills || []).join(', ') || 'Graphic Design, Video Editing'}
- Aesthetic style: ${(aesthetics || []).join(', ') || 'Modern, Minimal'}
- Experience level: ${experience || 'Intermediate'}

Category: ${category || 'project-ideas'}

${prompts[category] || prompts['project-ideas']}

Remember: return ONLY valid JSON.`;

    const models = ['openai/gpt-oss-120b', 'qwen/qwen3.6-27b'];
    let content = null;

    for (const model of models) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model,
          temperature: 0.8,
          max_tokens: 3000,
        });
        content = completion.choices[0]?.message?.content;
        if (content) break;
      } catch (e) {
        console.error(`Model ${model} failed:`, e.message);
        continue;
      }
    }

    if (!content) throw new Error('All models failed');

    // Parse JSON
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      let cleaned = content.replace(/```(?:json)?\s*\n?/g, '').replace(/\n?```/g, '').trim();
      cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error('Invalid JSON response');
    }

    // Ensure structure
    if (!result.ideas) result.ideas = [];
    if (!result.title) result.title = category;

    return res.status(200).json(result);

  } catch (error) {
    console.error('Ideas error:', error);
    return res.status(500).json({ error: 'Failed to generate ideas. Try again.', details: error.message });
  }
};
