/* ============================================
   VASLKAAR — Generate Module
   AI API calls + loading state management
   ============================================ */

// ---- Start Generation ---- //
async function startGeneration(projectData) {
  // Navigate to loading screen
  navigateTo('generating');

  // Animate progress steps
  animateGeneratingSteps();

  try {
    // Get DNA profile
    const dna = getDNA() || {};

    // Build request payload
    const payload = {
      description: projectData.description,
      projectName: projectData.name,
      clientType: projectData.clientType,
      tools: projectData.tools,
      imageCount: projectData.imageCount,
      dnaProfile: {
        aesthetics: dna.aesthetics || [],
        inspirations: dna.inspirations || '',
        description: dna.description || '',
      }
    };

    // Call API
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    // Validate result has expected structure
    if (!result.behance || !result.linkedin || !result.seo) {
      throw new Error('Invalid response format');
    }

    // Store result
    APP.generatedResult = result;

    // Display results
    if (typeof displayResults === 'function') {
      displayResults(result, projectData);
    }

    // Navigate to results
    navigateTo('results');

  } catch (error) {
    console.error('Generation failed:', error);

    // Show error with retry
    const statusEl = document.getElementById('generating-status');
    if (statusEl) {
      statusEl.innerHTML = `
        <span class="text-vasl-error">Generation failed. Please try again.</span>
        <br/>
        <button onclick="retryGeneration()" class="btn-gold mt-4 py-2.5 px-6 text-sm font-heading font-medium">
          Try Again
        </button>
        <button onclick="navigateTo('new-project')" class="btn-outline mt-2 py-2.5 px-6 text-sm font-heading font-medium ml-2">
          Go Back
        </button>
      `;
    }
  }
}

// ---- Retry ---- //
function retryGeneration() {
  if (APP.currentProject) {
    startGeneration(APP.currentProject);
  } else {
    navigateTo('new-project');
  }
}

// ---- Regenerate (from results screen) ---- //
function regenerateProject() {
  if (APP.currentProject) {
    startGeneration(APP.currentProject);
  }
}

// ---- Generating Steps Animation ---- //
function animateGeneratingSteps() {
  const steps = document.querySelectorAll('.gen-step');
  const statusEl = document.getElementById('generating-status');

  const messages = [
    'Analyzing your design...',
    'Writing Behance case study...',
    'Crafting LinkedIn posts...',
    'Generating SEO package...',
  ];

  // Reset all steps
  steps.forEach(s => {
    s.classList.remove('active', 'done');
  });

  // Animate each step
  let stepIndex = 0;
  const interval = setInterval(() => {
    if (stepIndex > 0 && steps[stepIndex - 1]) {
      steps[stepIndex - 1].classList.remove('active');
      steps[stepIndex - 1].classList.add('done');
    }

    if (stepIndex < steps.length) {
      steps[stepIndex].classList.add('active');
      if (statusEl) statusEl.textContent = messages[stepIndex] || '';
      stepIndex++;
    } else {
      clearInterval(interval);
    }
  }, 3000); // Every 3 seconds, advance a step

  // Store interval so we can clear on navigation
  APP._genInterval = interval;
}

// Clear interval on navigation away
const _origNavigateTo = navigateTo;
// Note: We override this cleanly in the init
