/* ============================================
   VASLKAAR — Ideas Lab Module
   AI-powered project, income & growth ideas
   ============================================ */

// ---- Get user profile for personalized ideas ---- //
function getIdeasProfile() {
  const dna = typeof getDNA === 'function' ? getDNA() : null;
  return {
    skills: dna?.aesthetics || ['Graphic Design', 'Video Editing'],
    aesthetics: dna?.aesthetics || ['Modern'],
    experience: 'Intermediate',
  };
}

// ---- Generate Ideas ---- //
async function generateIdeas(category) {
  const categoriesEl = document.getElementById('ideas-categories');
  const loadingEl = document.getElementById('ideas-loading');
  const resultsEl = document.getElementById('ideas-results');

  // Show loading
  categoriesEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');
  resultsEl.classList.add('hidden');

  const profile = getIdeasProfile();

  try {
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: category,
        skills: profile.skills,
        aesthetics: profile.aesthetics,
        experience: profile.experience,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to generate ideas');
    }

    const data = await response.json();
    displayIdeasResults(data, category);
  } catch (error) {
    console.error('Ideas error:', error);
    showToast('Ideas generation failed — try again');
    hideIdeasResults();
  }
}

// ---- Display Results ---- //
function displayIdeasResults(data, category) {
  const loadingEl = document.getElementById('ideas-loading');
  const resultsEl = document.getElementById('ideas-results');
  const titleEl = document.getElementById('ideas-results-title');
  const listEl = document.getElementById('ideas-list');

  loadingEl.classList.add('hidden');
  resultsEl.classList.remove('hidden');

  const categoryTitles = {
    'project-ideas': '🎨 Project Ideas',
    'hackathon-ideas': '🏆 Hackathon Ideas',
    'income-boost': '💰 Income Boost Tips',
    'skill-growth': '📈 Skills to Learn',
    'passive-income': '🔄 Passive Income Ideas',
  };

  titleEl.textContent = data.title || categoryTitles[category] || 'Ideas';

  const ideas = data.ideas || [];
  if (ideas.length === 0) {
    listEl.innerHTML = '<p class="text-vasl-gray text-center py-8">No ideas generated. Try another category.</p>';
    return;
  }

  const difficultyColors = {
    'Easy': 'text-vasl-success bg-vasl-success/10',
    'Medium': 'text-vasl-warning bg-vasl-warning/10',
    'Hard': 'text-vasl-error bg-vasl-error/10',
  };

  listEl.innerHTML = ideas.map((idea, i) => `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-6 hover:border-vasl-gold/30 transition-colors" style="animation: fadeInUp 0.4s ease ${i * 0.1}s both">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <h3 class="font-heading font-semibold text-base flex-1">${escapeHtml(idea.title || '')}</h3>
        <div class="flex items-center gap-2 flex-shrink-0">
          ${idea.difficulty ? `<span class="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full ${difficultyColors[idea.difficulty] || difficultyColors.Medium}">${idea.difficulty}</span>` : ''}
          ${idea.earning ? `<span class="text-xs font-heading font-semibold text-vasl-gold bg-vasl-gold/10 px-2 py-0.5 rounded-full">${escapeHtml(idea.earning)}</span>` : ''}
        </div>
      </div>
      <p class="text-vasl-gray font-body text-sm leading-relaxed mb-3">${escapeHtml(idea.description || '')}</p>
      <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs font-body text-vasl-gray">
        ${idea.timeframe ? `<span>⏱ ${escapeHtml(idea.timeframe)}</span>` : ''}
        ${idea.platform ? `<span>📍 ${escapeHtml(idea.platform)}</span>` : ''}
      </div>
      ${idea.action ? `
      <div class="mt-4 pt-3 border-t border-vasl-light-gray/30">
        <p class="text-sm font-body"><span class="font-heading font-semibold text-vasl-gold">First step:</span> ${escapeHtml(idea.action)}</p>
      </div>` : ''}
      ${idea.link ? `
      <div class="mt-3">
        <a href="${escapeHtml(idea.link)}" target="_blank" class="text-vasl-gold text-sm font-heading font-medium hover:underline inline-flex items-center gap-1">
          Open Platform →
        </a>
      </div>` : ''}
    </div>
  `).join('');
}

// ---- Hide Results / Back to Categories ---- //
function hideIdeasResults() {
  document.getElementById('ideas-categories').classList.remove('hidden');
  document.getElementById('ideas-loading').classList.add('hidden');
  document.getElementById('ideas-results').classList.add('hidden');
}
