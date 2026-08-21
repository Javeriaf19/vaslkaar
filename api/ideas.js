const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function cleanAndParseJson(content) {
  if (!content) throw new Error('Empty response');
  let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleaned = cleaned.replace(/```(?:json)?\s*\n?/gi, '').replace(/\n?```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  const firstBrace = cleaned.indexOf('{');
  if (firstBrace !== -1) {
    let sub = cleaned.substring(firstBrace);
    try {
      return JSON.parse(sub);
    } catch (e) {}

    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < sub.length; i++) {
      const c = sub[i];
      if (escape) { escape = false; continue; }
      if (c === '\\') { escape = true; continue; }
      if (c === '"') { inString = !inString; continue; }
      if (!inString) {
        if (c === '{') openBraces++;
        else if (c === '}') openBraces--;
        else if (c === '[') openBrackets++;
        else if (c === ']') openBrackets--;
      }
    }

    if (inString) sub += '"';
    while (openBrackets > 0) { sub += ']'; openBrackets--; }
    while (openBraces > 0) { sub += '}'; openBraces--; }

    try {
      return JSON.parse(sub);
    } catch (e) {
      console.error('Repair failed:', e.message);
    }
  }

  throw new Error('Invalid JSON format from AI');
}

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
      'project-ideas': `Generate 4 punchy, creative freelance project ideas that a creator can build for their portfolio or sell to clients. Each should be specific, actionable, and include potential earning.`,
      'hackathon-ideas': `Generate 4 unique hackathon project ideas that combine design + technology. Focus on AI tools, creative tech, or indie SaaS. Make them impressive and winnable.`,
      'income-boost': `Generate 4 specific, actionable ways this freelancer can increase income in the next 30 days. Be concrete with realistic PKR and USD estimates.`,
      'skill-growth': `Suggest 4 high-value skills this freelancer should learn next to increase earning potential. Include why each is in demand.`,
      'passive-income': `Generate 4 realistic passive income ideas (digital templates, UI kits, automated workflows) they can build once and sell repeatedly.`,
      'opportunities': `Generate 4 specific, high-fit freelance opportunities/gigs across Upwork, Fiverr, LinkedIn, and Devpost with clear action steps.`,
    };

    const systemPrompt = `You are VASLKAAR's AI Growth Advisor for freelance creatives. You give specific, actionable, personalized advice.

Rules:
- Be specific: name exact platforms (Upwork, Fiverr, LinkedIn, Devpost, Contra, Wellfound, Dribbble, Gumroad, YouTube)
- Include realistic earning estimates in PKR and USD
- For each item, include a concise 3-phase execution roadmap with tools and search keywords
- Return ONLY valid JSON — no markdown, no conversational text

Format:
{
  "title": "Category title",
  "ideas": [
    {
      "title": "Specific title",
      "description": "2-sentence actionable description",
      "earning": "Rs. 25,000 - 60,000 / $100 - $300",
      "difficulty": "Easy|Medium|Hard",
      "timeframe": "1-2 Weeks",
      "action": "Immediate first step",
      "platform": "Upwork|Fiverr|LinkedIn|Devpost|Contra|Wellfound|Dribbble|Gumroad|YouTube",
      "searchKeyword": "search keywords",
      "roadmap": {
        "phase1": {
          "title": "Setup & Foundations (Day 1-7)",
          "steps": ["Step 1", "Step 2"],
          "freeTools": ["Figma", "Canva", "CapCut", "GitHub"]
        },
        "phase2": {
          "title": "Build & Skill Up (Day 8-20)",
          "steps": ["Step 1", "Step 2"],
          "learningQuery": "Topic tutorial"
        },
        "phase3": {
          "title": "Launch & Monetize (Day 21-30)",
          "steps": ["Step 1", "Step 2"],
          "launchTarget": "Target platform"
        }
      }
    }
  ]
}`;

    const userPrompt = `Freelancer Profile:
- Skills: ${(skills || []).join(', ') || 'Graphic Design, Video Editing'}
- Aesthetic style: ${(aesthetics || []).join(', ') || 'Modern, Minimal'}
- Experience level: ${experience || 'Intermediate'}

Category: ${category || 'project-ideas'}
${prompts[category] || prompts['project-ideas']}

Return ONLY valid JSON.`;

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
          temperature: 0.7,
          max_tokens: 4096,
        });
        content = completion.choices[0]?.message?.content;
        if (content) break;
      } catch (e) {
        console.error(`Model ${model} failed:`, e.message);
        continue;
      }
    }

    if (!content) throw new Error('All AI models failed to respond');

    const result = cleanAndParseJson(content);

    if (!result.ideas) result.ideas = [];
    if (!result.title) result.title = category;

    return res.status(200).json(result);

  } catch (error) {
    console.error('Ideas error:', error);
    return res.status(500).json({ error: 'Failed to generate ideas. Please try again.', details: error.message });
  }
};
