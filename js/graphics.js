/* ============================================
   VASLKAAR — Graphic Studio Module (HTML-to-Image)
   Auto-renders project case studies into a 4-Slide
   Multi-Page LinkedIn/Instagram Carousel & Doc Studio
   ============================================ */

let GRAPHIC_STATE = {
  format: 'square',
  theme: 'gold',
  currentSlide: 1,
  slides: {
    1: {
      badge: 'CASE STUDY • 2026',
      headline: 'Brand Identity & Visual System',
      sub: 'Crafted strategic visual storytelling with high-converting creative assets.',
      statNum: '+180%',
      statLabel: 'Brand Reach',
      author: '@vaslkaar.creative',
    },
    2: {
      badge: '02 • THE STRATEGIC CHALLENGE',
      headline: 'Problem vs Strategic Solution',
      sub: 'Client needed a cohesive visual identity to stand out in a saturated market and establish immediate trust.',
      statNum: '100%',
      statLabel: 'Custom Strategy',
      author: '@vaslkaar.creative',
    },
    3: {
      badge: '03 • VISUAL DELIVERABLES',
      headline: 'Design System & Palette',
      sub: 'Engineered cohesive typography, logo mark variations, and complete brand color guidelines.',
      statNum: '12+',
      statLabel: 'Core Deliverables',
      author: '@vaslkaar.creative',
    },
    4: {
      badge: '04 • RESULTS & OUTCOME',
      headline: 'Measurable Impact & Next Steps',
      sub: 'Full case study live on Behance. Available for freelance design contracts & creative direction.',
      statNum: '🚀 High',
      statLabel: 'Market Impact',
      author: '@vaslkaar.creative',
    }
  },
  global: {
    image: null,
    colors: ['#C9A84C', '#1C1917', '#E4E4E7'],
    brand: 'Creative Brand',
    tools: ['Figma', 'Photoshop', 'Illustrator']
  }
};

// ---- Initialize Studio from AI Result ---- //
function initGraphicStudio(projectData, aiResult) {
  if (!projectData || !aiResult) return;

  const b = aiResult.behance || {};
  const l = aiResult.linkedin || {};
  const dna = typeof getDNA === 'function' ? getDNA() : null;

  const brand = projectData.brandName || projectData.name || 'Creative Brand';
  const authorName = dna?.profession ? `${dna.profession.toLowerCase().replace(/\s+/g, '')}.co` : 'vaslkaar.studio';
  const tools = (projectData.tools && projectData.tools.length > 0) ? projectData.tools : (b.tools || ['Figma', 'Photoshop']);

  GRAPHIC_STATE.global = {
    image: projectData.images && projectData.images.length > 0 ? projectData.images[0] : null,
    colors: projectData.dominantColors && projectData.dominantColors.length > 0
      ? projectData.dominantColors
      : ['#C9A84C', '#1C1917', '#E4E4E7'],
    brand: brand,
    tools: tools
  };

  // Populate 4 Slides with rich project data
  GRAPHIC_STATE.slides = {
    1: {
      badge: `${(projectData.clientType || 'DESIGN').toUpperCase()} • ${new Date().getFullYear()}`,
      headline: b.title || `${brand} Visual System`,
      sub: l.short || (b.solution ? b.solution.substring(0, 140) + '...' : projectData.description || ''),
      statNum: '+180%',
      statLabel: 'Brand Reach',
      author: `@${authorName}`,
    },
    2: {
      badge: '02 • THE CHALLENGE & PROCESS',
      headline: 'Strategic Problem Solving',
      sub: b.challenge ? (b.challenge.substring(0, 140) + '...') : `Crafted bespoke brand positioning for ${brand} to accelerate conversion and brand recall.`,
      statNum: 'Phase 2',
      statLabel: 'Execution',
      author: `@${authorName}`,
    },
    3: {
      badge: '03 • ASSET SHOWCASE',
      headline: 'Visual Architecture & Palette',
      sub: b.solution ? (b.solution.substring(0, 140) + '...') : `Engineered complete visual identity including typography hierarchy, color codes, and responsive design components.`,
      statNum: `${tools.length || 3}+`,
      statLabel: 'Design Tools',
      author: `@${authorName}`,
    },
    4: {
      badge: '04 • IMPACT & CTA',
      headline: 'Project Results & Key Takeaway',
      sub: `Full case study published on Behance. Seeking new design commissions — let's build your brand!`,
      statNum: '100%',
      statLabel: 'Delivered',
      author: `@${authorName}`,
    }
  };

  GRAPHIC_STATE.currentSlide = 1;
  syncGraphicInputs();
  renderGraphicArtboard();
}

// ---- Slide Switcher ---- //
function selectGraphicSlide(slideNumber) {
  GRAPHIC_STATE.currentSlide = slideNumber;

  document.querySelectorAll('.graphic-slide-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-vasl-gray');
  });

  const activeBtn = document.getElementById(`slide-btn-${slideNumber}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-vasl-gray');
  }

  syncGraphicInputs();
  renderGraphicArtboard();
}

// ---- Sync Inputs with Current Slide ---- //
function syncGraphicInputs() {
  const current = GRAPHIC_STATE.slides[GRAPHIC_STATE.currentSlide] || GRAPHIC_STATE.slides[1];
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('g-input-badge', current.badge);
  setVal('g-input-headline', current.headline);
  setVal('g-input-sub', current.sub);
  setVal('g-input-stat-num', current.statNum);
  setVal('g-input-stat-label', current.statLabel);
  setVal('g-input-author', current.author);
}

// ---- Format Switcher ---- //
function setGraphicFormat(format) {
  GRAPHIC_STATE.format = format;

  document.querySelectorAll('.graphic-format-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-vasl-gray');
  });

  const activeBtn = document.getElementById(`format-${format}-btn`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-vasl-gray');
  }

  renderGraphicArtboard();
}

// ---- Theme Switcher ---- //
function setGraphicTheme(theme) {
  GRAPHIC_STATE.theme = theme;

  document.querySelectorAll('.graphic-theme-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-vasl-gray');
  });

  const activeBtn = document.getElementById(`theme-${theme}-btn`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-vasl-gray');
  }

  renderGraphicArtboard();
}

// ---- Live Update on Input ---- //
function updateGraphicLive() {
  const current = GRAPHIC_STATE.slides[GRAPHIC_STATE.currentSlide];
  if (!current) return;

  current.badge = document.getElementById('g-input-badge')?.value || '';
  current.headline = document.getElementById('g-input-headline')?.value || '';
  current.sub = document.getElementById('g-input-sub')?.value || '';
  current.statNum = document.getElementById('g-input-stat-num')?.value || '';
  current.statLabel = document.getElementById('g-input-stat-label')?.value || '';
  current.author = document.getElementById('g-input-author')?.value || '';

  renderGraphicArtboard();
}

// ---- Reset to Defaults ---- //
function resetGraphicDefaults() {
  if (APP.currentProject && APP.generatedResult) {
    initGraphicStudio(APP.currentProject, APP.generatedResult);
    showToast('Slide deck reset to original ✨');
  }
}

// ---- Render The Visual Artboard for Current Slide ---- //
function renderGraphicArtboard() {
  const artboard = document.getElementById('graphic-artboard');
  if (!artboard) return;

  const { format, theme, currentSlide, slides, global } = GRAPHIC_STATE;
  const current = slides[currentSlide] || slides[1];

  // Set classes
  artboard.className = `graphic-artboard theme-${theme} format-${format} shadow-2xl rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative`;

  // Dynamic Theme Colors
  const themeStyles = {
    gold: {
      badgeBg: 'rgba(201, 168, 76, 0.15)',
      badgeText: '#C9A84C',
      badgeBorder: '1px solid rgba(201, 168, 76, 0.4)',
      titleColor: '#FFFFFF',
      subColor: '#A1A1AA',
      footerBg: 'rgba(255, 255, 255, 0.05)',
      footerBorder: 'rgba(255, 255, 255, 0.1)',
      accentColor: '#C9A84C',
      cardBg: 'rgba(255, 255, 255, 0.04)'
    },
    minimal: {
      badgeBg: '#F4F4F5',
      badgeText: '#18181B',
      badgeBorder: '1px solid #E4E4E7',
      titleColor: '#18181B',
      subColor: '#52525B',
      footerBg: '#F4F4F5',
      footerBorder: '#E4E4E7',
      accentColor: '#18181B',
      cardBg: '#F4F4F5'
    },
    cyber: {
      badgeBg: 'rgba(99, 102, 241, 0.15)',
      badgeText: '#818CF8',
      badgeBorder: '1px solid rgba(99, 102, 241, 0.4)',
      titleColor: '#F8FAFC',
      subColor: '#94A3B8',
      footerBg: 'rgba(255, 255, 255, 0.05)',
      footerBorder: 'rgba(99, 102, 241, 0.2)',
      accentColor: '#38BDF8',
      cardBg: 'rgba(99, 102, 241, 0.06)'
    },
    emerald: {
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeText: '#34D399',
      badgeBorder: '1px solid rgba(16, 185, 129, 0.4)',
      titleColor: '#ECFDF5',
      subColor: '#A7F3D0',
      footerBg: 'rgba(0, 0, 0, 0.2)',
      footerBorder: 'rgba(16, 185, 129, 0.2)',
      accentColor: '#10B981',
      cardBg: 'rgba(16, 185, 129, 0.08)'
    }
  }[theme] || themeStyles.gold;

  const colorDots = (global.colors || []).slice(0, 4).map(c => `
    <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background-color:${c}; border: 1.5px solid rgba(255,255,255,0.4); box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
  `).join('');

  const toolPills = (global.tools || []).slice(0, 3).map(t => `
    <span style="display:inline-block; padding:3px 8px; border-radius:6px; background:${themeStyles.cardBg}; border:1px solid ${themeStyles.footerBorder}; font-size:10px; font-weight:600; color:${themeStyles.titleColor};">${escapeHtml(t)}</span>
  `).join('');

  const titleSize = format === 'banner' ? 'font-size: 1.35rem; line-height: 1.25;' : 'font-size: 1.55rem; line-height: 1.25;';

  // Middle Section Customization per Slide Number
  let centerSnippet = '';
  if (currentSlide === 1) {
    centerSnippet = global.image ? `
      <div style="display:flex; align-items:center; gap:12px; margin-top:4px;">
        <div style="width:70px; height:70px; border-radius:10px; overflow:hidden; border:2px solid ${themeStyles.accentColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.25); flex-shrink:0;">
          <img src="${global.image}" alt="Preview" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <span style="font-size:11px; font-weight:600; color:${themeStyles.titleColor}; opacity:0.9;">Extracted Brand Palette</span>
          <div style="display:flex; align-items:center; gap:6px;">${colorDots}</div>
        </div>
      </div>
    ` : `<div style="display:flex; align-items:center; gap:6px;">${colorDots}</div>`;
  } else if (currentSlide === 2) {
    centerSnippet = `
      <div style="background:${themeStyles.cardBg}; padding:10px 14px; border-radius:10px; border:1px solid ${themeStyles.footerBorder}; margin-top:2px;">
        <p style="font-size:0.75rem; color:${themeStyles.subColor}; margin:0; line-height:1.4;">
          <strong style="color:${themeStyles.accentColor};">Strategy:</strong> Diagnosed brand positioning, established visual pillars, and produced user-centered deliverables.
        </p>
      </div>
    `;
  } else if (currentSlide === 3) {
    centerSnippet = `
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:2px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:11px; font-weight:600; color:${themeStyles.subColor};">Palette:</span>
          ${colorDots}
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-size:11px; font-weight:600; color:${themeStyles.subColor};">Tools:</span>
          ${toolPills}
        </div>
      </div>
    `;
  } else if (currentSlide === 4) {
    centerSnippet = `
      <div style="background:${themeStyles.badgeBg}; border:${themeStyles.badgeBorder}; padding:10px 14px; border-radius:10px; margin-top:2px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <span style="font-size:11px; font-weight:700; color:${themeStyles.badgeText}; display:block;">Ready for collaboration?</span>
          <span style="font-size:10px; color:${themeStyles.subColor};">Connect on LinkedIn or Behance</span>
        </div>
        <span style="font-size:14px;">🤝</span>
      </div>
    `;
  }

  artboard.innerHTML = `
    <!-- Decorative background glow -->
    <div style="position:absolute; top:-30px; right:-30px; width:160px; height:160px; border-radius:50%; background:${themeStyles.accentColor}; opacity:0.12; filter:blur(40px); pointer-events:none;"></div>

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; z-index:2;">
      <div style="display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; background:${themeStyles.badgeBg}; border:${themeStyles.badgeBorder};">
        <span style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${themeStyles.badgeText}; font-family:'Plus Jakarta Sans', sans-serif;">
          ${escapeHtml(current.badge)}
        </span>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${themeStyles.subColor}; opacity:0.8;">
          SLIDE ${currentSlide}/4
        </span>
      </div>
    </div>

    <!-- Center Content -->
    <div style="margin: 12px 0; z-index:2; flex:1; display:flex; flex-direction:column; justify-content:center;">
      <h2 style="${titleSize} font-weight:800; color:${themeStyles.titleColor}; margin:0 0 8px 0; font-family:'Plus Jakarta Sans', sans-serif; letter-spacing:-0.02em;">
        ${escapeHtml(current.headline)}
      </h2>
      <p style="font-size:0.82rem; color:${themeStyles.subColor}; line-height:1.45; margin:0 0 10px 0; max-width:94%;">
        ${escapeHtml(current.sub)}
      </p>
      ${centerSnippet}
    </div>

    <!-- Footer -->
    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; padding-top:10px; border-top:1px solid ${themeStyles.footerBorder}; z-index:2;">
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="padding:3px 8px; border-radius:6px; background:${themeStyles.footerBg}; border:1px solid ${themeStyles.footerBorder};">
          <span style="font-size:10px; font-weight:700; color:${themeStyles.accentColor}; font-family:'Plus Jakarta Sans', sans-serif;">
            ${escapeHtml(current.statNum)}
          </span>
          <span style="font-size:9px; color:${themeStyles.subColor}; margin-left:3px;">
            ${escapeHtml(current.statLabel)}
          </span>
        </div>
      </div>
      <div style="font-size:10px; font-weight:600; color:${themeStyles.subColor}; font-family:'Plus Jakarta Sans', sans-serif;">
        ${escapeHtml(current.author)}
      </div>
    </div>
  `;
}

// ---- Export Single Current Slide PNG ---- //
async function downloadGraphicPNG() {
  const artboard = document.getElementById('graphic-artboard');
  if (!artboard) return;

  if (typeof html2canvas === 'undefined') {
    showToast('Loading image engine...');
    return;
  }

  const btn = document.getElementById('download-graphic-btn');
  const originalHtml = btn ? btn.innerHTML : '';

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="animate-spin mr-1">⏳</span> Exporting...';
    }

    const canvas = await html2canvas(artboard, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const imageURI = canvas.toDataURL('image/png');
    const safeHeadline = (GRAPHIC_STATE.slides[GRAPHIC_STATE.currentSlide]?.headline || 'slide')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 24);

    const filename = `${safeHeadline}_slide${GRAPHIC_STATE.currentSlide}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Slide ${GRAPHIC_STATE.currentSlide} exported in 2x High-Res! 🖼️✨`);
  } catch (e) {
    console.error('Export failed:', e);
    showToast('Failed to export slide');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}

// ---- Export Entire 4-Slide Carousel Deck ---- //
async function downloadFullCarouselDeck() {
  if (typeof html2canvas === 'undefined') {
    showToast('Loading image engine...');
    return;
  }

  showToast('📦 Exporting all 4 carousel slides...');
  const initialSlide = GRAPHIC_STATE.currentSlide;

  for (let s = 1; s <= 4; s++) {
    selectGraphicSlide(s);
    await new Promise(r => setTimeout(r, 180)); // Allow render

    const artboard = document.getElementById('graphic-artboard');
    if (artboard) {
      try {
        const canvas = await html2canvas(artboard, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        });

        const imageURI = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `carousel_slide_${s}_of_4.png`;
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(`Slide ${s} export failed:`, err);
      }
    }
  }

  // Restore initial slide
  selectGraphicSlide(initialSlide);
  showToast('🎉 All 4 Carousel Deck slides exported successfully!');
}
