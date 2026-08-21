/* ============================================
   VASLKAAR — Ideas Lab Module
   AI-powered project, income & growth ideas
   with Real Platform Search & Interactive Roadmaps
   ============================================ */

// Store currently loaded ideas
let CURRENT_IDEAS_CACHE = [];

// ---- Helper: Generate Verified Real URLs (Zero Broken Links) ---- //
function getVerifiedPlatformUrl(platform, searchKeyword, defaultTitle) {
  const rawQuery = (searchKeyword || defaultTitle || 'freelance creative').trim();
  const query = encodeURIComponent(rawQuery);
  const p = (platform || '').toLowerCase().trim();

  if (p.includes('upwork')) {
    return `https://www.upwork.com/nx/search/jobs/?q=${query}&sort=recency`;
  }
  if (p.includes('fiverr')) {
    return `https://www.fiverr.com/search/gigs?query=${query}&source=top-bar`;
  }
  if (p.includes('linkedin')) {
    return `https://www.linkedin.com/jobs/search/?keywords=${query}&f_TPR=r86400&location=Worldwide&f_WT=2`;
  }
  if (p.includes('devpost') || p.includes('hackathon')) {
    return `https://devpost.com/hackathons?search=${query}`;
  }
  if (p.includes('contra')) {
    return `https://contra.com/freelance-jobs?query=${query}`;
  }
  if (p.includes('wellfound') || p.includes('angel')) {
    return `https://wellfound.com/jobs?query=${query}`;
  }
  if (p.includes('dribbble')) {
    return `https://dribbble.com/jobs?keyword=${query}`;
  }
  if (p.includes('gumroad')) {
    return `https://gumroad.com/discover?query=${query}`;
  }
  if (p.includes('creative market')) {
    return `https://creativemarket.com/search?q=${query}`;
  }
  if (p.includes('youtube')) {
    return `https://www.youtube.com/results?search_query=${query}+tutorial+full+course`;
  }
  // Default fallback
  return `https://www.google.com/search?q=${query}+freelance+jobs+apply+online`;
}

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
    CURRENT_IDEAS_CACHE = data.ideas || [];
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
    'project-ideas': '🎨 Project Ideas & Portfolios',
    'hackathon-ideas': '🏆 Winning Hackathon Concepts',
    'income-boost': '💰 30-Day Income Boost Roadmap',
    'skill-growth': '📈 High-Income Skills Roadmap',
    'passive-income': '🔄 Digital Products & Passive Income',
  };

  titleEl.textContent = data.title || categoryTitles[category] || 'Growth Lab';

  const ideas = data.ideas || [];
  if (ideas.length === 0) {
    listEl.innerHTML = '<p class="text-vasl-gray text-center py-8">No ideas generated. Try another category.</p>';
    return;
  }

  const difficultyColors = {
    'Easy': 'text-vasl-success bg-vasl-success/10 border border-vasl-success/20',
    'Medium': 'text-vasl-warning bg-vasl-warning/10 border border-vasl-warning/20',
    'Hard': 'text-vasl-error bg-vasl-error/10 border border-vasl-error/20',
  };

  listEl.innerHTML = ideas.map((idea, i) => {
    const verifiedUrl = getVerifiedPlatformUrl(idea.platform, idea.searchKeyword || idea.title, idea.title);
    const hasRoadmap = Boolean(idea.roadmap);

    return `
    <div class="bg-white rounded-card border border-vasl-light-gray/50 p-6 hover:border-vasl-gold/40 transition-all shadow-sm" style="animation: fadeInUp 0.4s ease ${i * 0.1}s both">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <h3 class="font-heading font-semibold text-base flex-1">${escapeHtml(idea.title || '')}</h3>
        <div class="flex items-center gap-2 flex-shrink-0">
          ${idea.difficulty ? `<span class="text-[10px] font-heading font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[idea.difficulty] || difficultyColors.Medium}">${idea.difficulty}</span>` : ''}
          ${idea.earning ? `<span class="text-xs font-heading font-semibold text-vasl-gold bg-vasl-gold/10 px-2.5 py-0.5 rounded-full border border-vasl-gold/20">${escapeHtml(idea.earning)}</span>` : ''}
        </div>
      </div>

      <!-- Description -->
      <p class="text-vasl-gray font-body text-sm leading-relaxed mb-4">${escapeHtml(idea.description || '')}</p>
      
      <!-- Meta Badges -->
      <div class="flex flex-wrap items-center gap-2 text-xs font-body mb-4">
        ${idea.timeframe ? `<span class="bg-vasl-bg px-2.5 py-1 rounded-md text-vasl-gray">⏱ ${escapeHtml(idea.timeframe)}</span>` : ''}
        ${idea.platform ? `<span class="bg-vasl-bg px-2.5 py-1 rounded-md text-vasl-gray">📍 ${escapeHtml(idea.platform)}</span>` : ''}
      </div>

      <!-- Action Box -->
      ${idea.action ? `
      <div class="bg-vasl-bg/70 rounded-input p-3 border border-vasl-light-gray/40 mb-4">
        <p class="text-xs font-body text-vasl-dark">
          <span class="font-heading font-bold text-vasl-gold">⚡ First Step Today:</span> ${escapeHtml(idea.action)}
        </p>
      </div>` : ''}

      <!-- Bottom Actions & Roadmap Trigger -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-vasl-light-gray/40">
        <div class="flex items-center gap-2">
          ${hasRoadmap ? `
          <button type="button" onclick="toggleIdeaRoadmap(${i})" class="btn-outline py-1.5 px-3 text-xs font-heading font-semibold flex items-center gap-1.5 text-vasl-dark">
            <i data-lucide="map" class="w-3.5 h-3.5 text-vasl-gold"></i>
            <span id="roadmap-btn-text-${i}">🗺️ View Step-by-Step Roadmap</span>
          </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-2">
          <a href="${escapeHtml(verifiedUrl)}" target="_blank" class="btn-gold py-1.5 px-4 text-xs font-heading font-semibold flex items-center gap-1.5">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            Open Live ${escapeHtml(idea.platform || 'Platform')} ↗
          </a>
        </div>
      </div>

      <!-- Expandable Roadmap Container -->
      ${hasRoadmap ? `
      <div id="idea-roadmap-${i}" class="hidden mt-5 pt-4 border-t border-dashed border-vasl-light-gray/80 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-vasl-gold flex items-center gap-1.5">
            <span>🗺️ Execution Roadmap & Real Resources</span>
          </h4>
          <button onclick="copyRoadmapText(${i})" class="text-xs text-vasl-gray hover:text-vasl-dark font-body flex items-center gap-1">
            <i data-lucide="copy" class="w-3 h-3"></i> Copy Plan
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <!-- Phase 1 -->
          <div class="bg-vasl-bg/90 rounded-card p-3 border border-vasl-light-gray/40">
            <div class="flex items-center gap-1.5 font-heading font-semibold text-vasl-dark mb-1.5">
              <span class="w-4 h-4 bg-vasl-gold text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              <span>${escapeHtml(idea.roadmap?.phase1?.title || 'Setup & Foundations')}</span>
            </div>
            <ul class="space-y-1 text-vasl-gray list-disc list-inside mb-2">
              ${(idea.roadmap?.phase1?.steps || ['Setup toolchain & environment', 'Create initial design components']).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
            <div class="pt-2 border-t border-vasl-light-gray/30 flex flex-wrap gap-1">
              ${(idea.roadmap?.phase1?.freeTools || ['Figma', 'Canva', 'CapCut']).map(t => `<span class="bg-white px-1.5 py-0.5 rounded text-[10px] text-vasl-dark font-medium border border-vasl-light-gray/30">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>

          <!-- Phase 2 -->
          <div class="bg-vasl-bg/90 rounded-card p-3 border border-vasl-light-gray/40">
            <div class="flex items-center gap-1.5 font-heading font-semibold text-vasl-dark mb-1.5">
              <span class="w-4 h-4 bg-vasl-gold text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>${escapeHtml(idea.roadmap?.phase2?.title || 'Build & Skill Up')}</span>
            </div>
            <ul class="space-y-1 text-vasl-gray list-disc list-inside mb-2">
              ${(idea.roadmap?.phase2?.steps || ['Watch tutorials & apply techniques', 'Build portfolio sample piece']).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
            <div class="pt-2 border-t border-vasl-light-gray/30">
              <a href="https://www.youtube.com/results?search_query=${encodeURIComponent((idea.roadmap?.phase2?.learningQuery || idea.title) + ' full tutorial course')}" target="_blank" class="text-vasl-gold hover:underline text-[10px] font-heading font-semibold flex items-center gap-1">
                <i data-lucide="play-circle" class="w-3 h-3"></i>
                Free Learning Tutorials ↗
              </a>
            </div>
          </div>

          <!-- Phase 3 -->
          <div class="bg-vasl-bg/90 rounded-card p-3 border border-vasl-light-gray/40">
            <div class="flex items-center gap-1.5 font-heading font-semibold text-vasl-dark mb-1.5">
              <span class="w-4 h-4 bg-vasl-gold text-white rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>${escapeHtml(idea.roadmap?.phase3?.title || 'Monetize & Pitch')}</span>
            </div>
            <ul class="space-y-1 text-vasl-gray list-disc list-inside mb-2">
              ${(idea.roadmap?.phase3?.steps || ['Publish on platform with keywords', 'Direct message 5 target clients']).map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
            <div class="pt-2 border-t border-vasl-light-gray/30">
              <a href="${escapeHtml(verifiedUrl)}" target="_blank" class="text-vasl-success hover:underline text-[10px] font-heading font-semibold flex items-center gap-1">
                <i data-lucide="check-circle" class="w-3 h-3"></i>
                Target: ${escapeHtml(idea.platform || 'Launch Platform')} ↗
              </a>
            </div>
          </div>
        </div>
      </div>
      ` : ''}
    </div>
  `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---- Toggle Roadmap Accordion ---- //
function toggleIdeaRoadmap(index) {
  const container = document.getElementById(`idea-roadmap-${index}`);
  const btnText = document.getElementById(`roadmap-btn-text-${index}`);
  if (!container) return;

  const isHidden = container.classList.contains('hidden');
  if (isHidden) {
    container.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Hide Roadmap ▴';
  } else {
    container.classList.add('hidden');
    if (btnText) btnText.textContent = '🗺️ View Step-by-Step Roadmap';
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---- Copy Complete Roadmap ---- //
function copyRoadmapText(index) {
  const idea = CURRENT_IDEAS_CACHE[index];
  if (!idea) return;

  const r = idea.roadmap || {};
  const text = [
    `🗺️ ROADMAP: ${idea.title}`,
    `Potential Earning: ${idea.earning || 'N/A'} | Difficulty: ${idea.difficulty || 'Medium'}`,
    '',
    `📌 ${r.phase1?.title || 'Phase 1: Setup'}`,
    (r.phase1?.steps || []).map(s => `• ${s}`).join('\n'),
    `Free Tools: ${(r.phase1?.freeTools || []).join(', ')}`,
    '',
    `📌 ${r.phase2?.title || 'Phase 2: Build'}`,
    (r.phase2?.steps || []).map(s => `• ${s}`).join('\n'),
    '',
    `📌 ${r.phase3?.title || 'Phase 3: Monetize'}`,
    (r.phase3?.steps || []).map(s => `• ${s}`).join('\n'),
    `Target: ${idea.platform || 'Freelance Platform'}`,
  ].join('\n');

  copyToClipboard(text);
  showToast('Roadmap copied to clipboard! 📋✨');
}

// ---- Hide Results / Back to Categories ---- //
function hideIdeasResults() {
  document.getElementById('ideas-categories').classList.remove('hidden');
  document.getElementById('ideas-loading').classList.add('hidden');
  document.getElementById('ideas-results').classList.add('hidden');
}
