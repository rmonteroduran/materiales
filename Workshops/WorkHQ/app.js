/**
 * SS&C WorkHQ Workshop Presentation Application
 * Core Interactive Logic & Event Controllers
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Variables
  let currentSlide = 0;
  const totalSlides = 7;
  let isReadingMode = false;
  let isSimulating = false;
  let simTimeout = null;

  // DOM Element References
  const deckContainer = document.getElementById('deck-container');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const currentSlideEl = document.getElementById('current-slide');
  const totalSlidesEl = document.getElementById('total-slides');
  const progressBar = document.getElementById('progress-bar');
  const dotsContainer = document.getElementById('dots-container');
  
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnModeToggle = document.getElementById('btn-mode-toggle');
  const btnOverview = document.getElementById('btn-overview');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnStartWorkshop = document.getElementById('btn-start-workshop');
  
  const overviewModal = document.getElementById('overview-modal');
  const modalClose = document.getElementById('modal-close');
  const overviewGrid = document.getElementById('overview-grid');

  // Initialize Presentation Components
  initDots();
  initOverviewGrid();
  updateSlide(0);

  if (btnStartWorkshop) {
    btnStartWorkshop.addEventListener('click', () => updateSlide(1));
  }

  /* ==========================================================================
     Slide Navigation Logic
     ========================================================================== */
  function updateSlide(index) {
    if (index < 0 || index > totalSlides) return;
    currentSlide = index;

    // Update active slide class
    slides.forEach((slide) => {
      const slideIdx = parseInt(slide.getAttribute('data-slide-index'), 10);
      if (slideIdx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Handle Local Video playback state on Slide 0
    const slide0Video = document.getElementById('slide-0-video');
    if (slide0Video) {
      if (currentSlide === 0) {
        slide0Video.play().catch(err => console.warn('Autoplay error:', err));
      } else {
        slide0Video.pause();
      }
    }

    // Update Indicators
    currentSlideEl.textContent = currentSlide;
    const progressPercent = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Update Footer Dots
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    dots.forEach((dot) => {
      const dotIdx = parseInt(dot.getAttribute('data-slide-index'), 10);
      dot.classList.toggle('active', dotIdx === currentSlide);
    });

    // Scroll to top of slide content
    const activeSlide = slides.find(s => parseInt(s.getAttribute('data-slide-index'), 10) === currentSlide);
    if (activeSlide) activeSlide.scrollTop = 0;
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      updateSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      updateSlide(currentSlide - 1);
    }
  }

  // Event Listeners for Nav Buttons
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);

  // Initialize Footer Navigation Dots
  function initDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === currentSlide ? 'active' : ''}`;
      dot.setAttribute('data-slide-index', i);
      dot.setAttribute('title', i === 0 ? 'Slide 0: Video Intro' : `Ir a Slide ${i}`);
      dot.addEventListener('click', () => updateSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (overviewModal && overviewModal.classList.contains('active')) {
        closeOverview();
      }
      if (settingsModal && settingsModal.classList.contains('active')) {
        closeSettings();
      }
      if (document.body.classList.contains('app-fullscreen')) {
        disableCssFullscreenFallback();
      }
      return;
    }

    if (isReadingMode) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        updateSlide(0);
        break;
      case 'End':
        e.preventDefault();
        updateSlide(totalSlides);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'o':
      case 'O':
        toggleOverview();
        break;
    }
  });

  /* ==========================================================================
     Overview Modal Grid
     ========================================================================== */
  function initOverviewGrid() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide) => {
      const index = parseInt(slide.getAttribute('data-slide-index'), 10);
      const headerTitle = slide.querySelector('h1, h2')?.textContent || `Slide ${index}`;
      
      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${index === currentSlide ? 'active' : ''}`;
      thumb.innerHTML = `
        <span class="thumb-num">SLIDE ${index}</span>
        <span class="thumb-title">${headerTitle}</span>
      `;

      thumb.addEventListener('click', () => {
        updateSlide(index);
        closeOverview();
      });

      overviewGrid.appendChild(thumb);
    });
  }

  function toggleOverview() {
    initOverviewGrid();
    overviewModal.classList.toggle('active');
  }

  function closeOverview() {
    overviewModal.classList.remove('active');
  }

  btnOverview.addEventListener('click', toggleOverview);
  modalClose.addEventListener('click', closeOverview);
  overviewModal.addEventListener('click', (e) => {
    if (e.target === overviewModal) closeOverview();
  });

  /* ==========================================================================
     View Mode Toggle (Presenter vs Reading / Dashboard)
     ========================================================================== */
  function setViewMode(readingMode, save = true) {
    isReadingMode = readingMode;
    document.body.classList.toggle('reading-mode', isReadingMode);
    document.body.classList.toggle('presentation-mode', !isReadingMode);

    const btnText = btnModeToggle.querySelector('.btn-text');
    const btnIcon = btnModeToggle.querySelector('i');

    if (btnText && btnIcon) {
      if (isReadingMode) {
        btnText.textContent = 'Modo Presentación';
        btnIcon.className = 'fa-solid fa-slideshare';
      } else {
        btnText.textContent = 'Modo Lectura';
        btnIcon.className = 'fa-solid fa-border-all';
        updateSlide(currentSlide);
      }
    }

    if (save) {
      localStorage.setItem('workhq_workshop_viewmode', isReadingMode ? 'reading' : 'presentation');
    }
  }

  btnModeToggle.addEventListener('click', () => {
    setViewMode(!isReadingMode, true);
  });

  /* ==========================================================================
     Robust Fullscreen Handler with Fallback & Vendor Prefixes
     ========================================================================== */
  function getFullscreenElement() {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement ||
           document.msFullscreenElement ||
           (document.body.classList.contains('app-fullscreen') ? document.body : null);
  }

  function toggleFullscreen() {
    const fsElement = getFullscreenElement();
    const docEl = document.documentElement;

    if (!fsElement) {
      // Try native Fullscreen API with vendor fallbacks
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => {
          console.warn('Native requestFullscreen failed, using CSS fallback:', err);
          enableCssFullscreenFallback();
        });
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      } else {
        enableCssFullscreenFallback();
      }
    } else {
      // Exit Fullscreen
      if (document.body.classList.contains('app-fullscreen')) {
        disableCssFullscreenFallback();
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.warn(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  function enableCssFullscreenFallback() {
    document.body.classList.add('app-fullscreen');
    updateFullscreenIcon(true);
  }

  function disableCssFullscreenFallback() {
    document.body.classList.remove('app-fullscreen');
    updateFullscreenIcon(false);
  }

  function updateFullscreenIcon(isFullscreen) {
    if (!btnFullscreen) return;
    const icon = btnFullscreen.querySelector('i');
    if (icon) {
      if (isFullscreen) {
        icon.className = 'fa-solid fa-compress';
        btnFullscreen.setAttribute('title', 'Salir de Pantalla Completa (F / Esc)');
      } else {
        icon.className = 'fa-solid fa-expand';
        btnFullscreen.setAttribute('title', 'Pantalla Completa (F)');
      }
    }
  }

  // Listen to native fullscreenchange events across all browser engines
  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, () => {
      const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      if (!isFS) {
        document.body.classList.remove('app-fullscreen');
      }
      updateFullscreenIcon(isFS || document.body.classList.contains('app-fullscreen'));
    });
  });

  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);

  /* ==========================================================================
     SLIDE 2: Interactive Timeline Era Switcher
     ========================================================================== */
  const timelineTabs = document.querySelectorAll('.timeline-tab');
  const eraCards = document.querySelectorAll('.era-card');

  timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedEra = tab.getAttribute('data-era');

      timelineTabs.forEach(t => t.classList.remove('active'));
      eraCards.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetCard = document.getElementById(`era-card-${selectedEra}`);
      if (targetCard) targetCard.classList.add('active');
    });
  });

  /* ==========================================================================
     SLIDE 3: Market Comparison Table Filters
     ========================================================================== */
  const pillBtns = document.querySelectorAll('.pill-btn');
  const tableRows = document.querySelectorAll('.market-table tbody tr');

  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const table = document.querySelector('.market-table');
      if (!table) return;

      const cells = table.querySelectorAll('th, td');
      cells.forEach(cell => cell.style.opacity = '1');

      if (filter === 'orchestration') {
        table.querySelectorAll('tr').forEach(row => {
          const cols = row.children;
          if (cols.length >= 5) {
            cols[1].style.opacity = '0.3';
            cols[3].style.opacity = '0.3';
            cols[4].style.opacity = '0.3';
          }
        });
      } else if (filter === 'ai') {
        table.querySelectorAll('tr').forEach(row => {
          const cols = row.children;
          if (cols.length >= 5) {
            cols[1].style.opacity = '0.3';
            cols[2].style.opacity = '0.3';
            cols[4].style.opacity = '0.3';
          }
        });
      } else if (filter === 'governance') {
        table.querySelectorAll('tr').forEach(row => {
          const cols = row.children;
          if (cols.length >= 5) {
            cols[1].style.opacity = '0.3';
            cols[2].style.opacity = '0.3';
            cols[3].style.opacity = '0.3';
          }
        });
      }
    });
  });

  /* ==========================================================================
     SLIDE 6: SS&C Architecture Component Switcher
     ========================================================================== */
  const archBoxes = document.querySelectorAll('.arch-box');
  const archInfos = document.querySelectorAll('.arch-info-card');

  archBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const archKey = box.getAttribute('data-arch');

      archBoxes.forEach(b => b.classList.remove('active'));
      archInfos.forEach(info => info.classList.remove('active'));

      box.classList.add('active');
      const targetInfo = document.getElementById(`arch-info-${archKey}`);
      if (targetInfo) targetInfo.classList.add('active');
    });
  });

  /* ==========================================================================
     SLIDE 7: WorkHQ Process Simulator Logic
     ========================================================================== */
  const btnRunSim = document.getElementById('btn-run-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const simStatus = document.getElementById('sim-status');
  const simLog = document.getElementById('sim-log');
  const consoleClear = document.getElementById('console-clear');

  const simSteps = [
    document.getElementById('sim-step-1'),
    document.getElementById('sim-step-2'),
    document.getElementById('sim-step-3'),
    document.getElementById('sim-step-4'),
    document.getElementById('sim-step-5')
  ];

  const simConnectors = [
    document.getElementById('sim-conn-1'),
    document.getElementById('sim-conn-2'),
    document.getElementById('sim-conn-3'),
    document.getElementById('sim-conn-4')
  ];

  function addLogLine(msg, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `log-line log-${type}`;
    line.innerHTML = `<span class="text-muted">[${timestamp}]</span> ${msg}`;
    simLog.appendChild(line);
    simLog.scrollTop = simLog.scrollHeight;
  }

  function resetSimulator() {
    clearTimeout(simTimeout);
    isSimulating = false;
    simStatus.textContent = 'Listo para ejecutar';
    simStatus.className = 'sim-status-badge';

    simSteps.forEach(step => {
      if (step) {
        step.className = 'sim-step';
        const statusEl = step.querySelector('.step-status');
        if (statusEl) statusEl.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Pendiente';
      }
    });

    simConnectors.forEach(conn => {
      if (conn) conn.classList.remove('active');
    });

    btnRunSim.disabled = false;
  }

  function runSimulation() {
    if (isSimulating) return;
    resetSimulator();

    isSimulating = true;
    btnRunSim.disabled = true;
    simStatus.textContent = 'En ejecución...';
    simStatus.className = 'sim-status-badge badge-info';
    
    addLogLine('=== Iniciando Orquestación de Proceso WorkHQ ===', 'info');

    // Step 1: Human Upload
    executeStep(0, () => {
      addLogLine('[Humano] Solicitud recibida desde Portal Web. Documentos adjuntos: DNI_Usuario.pdf, Recibo.pdf', 'info');
      
      // Step 2: AI IDP Extraction
      executeStep(1, () => {
        addLogLine('[IA Agent] WorkHQ IDP extrayendo campos... OCR completado con 99.4% de confianza.', 'ai');
        addLogLine('[IA Agent] Datos validados: Nombre: Carlos Rossi, Ingreso: $4,500 USD/mes.', 'ai');

        // Step 3: Blue Prism RPA
        executeStep(2, () => {
          addLogLine('[RPA Bot] Blue Prism Digital Worker iniciado. Conectando a Mainframe Legacy & Buró de Crédito...', 'info');
          addLogLine('[RPA Bot] Score Veraz/Equifax: 780 (Riesgo Bajo). Registro en Core Bancario OK.', 'success');

          // Step 4: Decision Engine AI
          executeStep(3, () => {
            addLogLine('[IA Decision] Evaluando política de riesgo automatizada de SS&C WorkHQ...', 'ai');
            addLogLine('[IA Decision] Recomendación: Crédito Pre-Aprobado por $25,000 USD (Regla #R-841)', 'ai');

            // Step 5: Chorus BPM Orchestration
            executeStep(4, () => {
              addLogLine('[Chorus BPM] Caso cerrado automáticamente. Contrato digital generado y enviado por mail.', 'success');
              addLogLine('=== Proceso Orquestado Exitosamente en 1.8 segundos ===', 'success');

              simStatus.textContent = 'Proceso Completado (1.8s)';
              simStatus.className = 'sim-status-badge badge-success';
              btnRunSim.disabled = false;
              isSimulating = false;
            }, 1000);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 800);
  }

  function executeStep(index, nextCallback, delay = 1000) {
    simTimeout = setTimeout(() => {
      // Mark step active
      const currentStepEl = simSteps[index];
      if (currentStepEl) {
        currentStepEl.classList.add('running');
        const statusEl = currentStepEl.querySelector('.step-status');
        if (statusEl) statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
      }

      setTimeout(() => {
        if (currentStepEl) {
          currentStepEl.classList.remove('running');
          currentStepEl.classList.add('completed');
          const statusEl = currentStepEl.querySelector('.step-status');
          if (statusEl) statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Completado';
        }

        if (simConnectors[index]) {
          simConnectors[index].classList.add('active');
        }

        if (nextCallback) nextCallback();
      }, delay);

    }, 300);
  }

  if (btnRunSim) btnRunSim.addEventListener('click', runSimulation);
  if (btnResetSim) btnResetSim.addEventListener('click', () => {
    resetSimulator();
    addLogLine('[INFO] Simulador reiniciado.', 'info');
  });

  if (consoleClear) {
    consoleClear.addEventListener('click', () => {
      simLog.innerHTML = '<div class="log-line text-muted">[INFO] Consola limpia.</div>';
    });
  }

  /* ==========================================================================
     Brand & Theme Customization Manager
     ========================================================================== */
  const btnSettings = document.getElementById('btn-settings');
  const settingsModal = document.getElementById('settings-modal');
  const settingsModalClose = document.getElementById('settings-modal-close');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const btnResetSettings = document.getElementById('btn-reset-settings');

  const cfgBrandTitle = document.getElementById('cfg-brand-title');
  const cfgBrandSubtitle = document.getElementById('cfg-brand-subtitle');
  const cfgLogoType = document.getElementById('cfg-logo-type');
  const cfgLogoIcon = document.getElementById('cfg-logo-icon');
  const cfgLogoUrl = document.getElementById('cfg-logo-url');
  const groupLogoIcon = document.getElementById('group-logo-icon');
  const groupLogoUrl = document.getElementById('group-logo-url');

  const cfgColorPrimary = document.getElementById('cfg-color-primary');
  const cfgColorSecondary = document.getElementById('cfg-color-secondary');
  const cfgColorBg = document.getElementById('cfg-color-bg');
  const cfgColorSurface = document.getElementById('cfg-color-surface');

  const presetChips = document.querySelectorAll('.preset-chip');

  const defaultTheme = {
    brandTitle: 'SS&C WorkHQ',
    brandSubtitle: 'Enterprise Orchestration Workshop',
    logoType: 'icon',
    logoIcon: 'fa-solid fa-layer-group',
    logoUrl: '',
    colorPrimary: '#00d2ff',
    colorSecondary: '#a855f7',
    colorBg: '#0b0f19',
    colorSurface: '#131a2a'
  };

  const themePresets = {
    ssc: defaultTheme,
    blue: {
      brandTitle: 'Enterprise Automation',
      brandSubtitle: 'Digital Transformation Workshop',
      logoType: 'icon',
      logoIcon: 'fa-solid fa-building-columns',
      logoUrl: '',
      colorPrimary: '#2563eb',
      colorSecondary: '#38bdf8',
      colorBg: '#0f172a',
      colorSurface: '#1e293b'
    },
    emerald: {
      brandTitle: 'Cyber Automation',
      brandSubtitle: 'AI & Process Orchestration',
      logoType: 'icon',
      logoIcon: 'fa-solid fa-network-wired',
      logoUrl: '',
      colorPrimary: '#10b981',
      colorSecondary: '#06b6d4',
      colorBg: '#064e3b',
      colorSurface: '#065f46'
    },
    purple: {
      brandTitle: 'Intelligent AI Swarm',
      brandSubtitle: 'Agentic Process Workshop',
      logoType: 'icon',
      logoIcon: 'fa-solid fa-brain',
      logoUrl: '',
      colorPrimary: '#a855f7',
      colorSecondary: '#ec4899',
      colorBg: '#1e1b4b',
      colorSurface: '#312e81'
    },
    gold: {
      brandTitle: 'Executive Suite',
      brandSubtitle: 'Process Intelligence Forum',
      logoType: 'icon',
      logoIcon: 'fa-solid fa-crown',
      logoUrl: '',
      colorPrimary: '#eab308',
      colorSecondary: '#f97316',
      colorBg: '#18181b',
      colorSurface: '#27272a'
    }
  };

  function openSettings() {
    if (settingsModal) settingsModal.classList.add('active');
  }

  function closeSettings() {
    if (settingsModal) settingsModal.classList.remove('active');
  }

  if (btnSettings) btnSettings.addEventListener('click', openSettings);
  if (settingsModalClose) settingsModalClose.addEventListener('click', closeSettings);
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeSettings();
    });
  }

  if (cfgLogoType) {
    cfgLogoType.addEventListener('change', () => {
      if (cfgLogoType.value === 'url') {
        groupLogoIcon.style.display = 'none';
        groupLogoUrl.style.display = 'flex';
      } else {
        groupLogoIcon.style.display = 'flex';
        groupLogoUrl.style.display = 'none';
      }
    });
  }

  function applyTheme(theme, save = true) {
    // Apply CSS Variables
    document.documentElement.style.setProperty('--accent-ssc', theme.colorPrimary);
    document.documentElement.style.setProperty('--accent-cyan', theme.colorPrimary);
    document.documentElement.style.setProperty('--accent-violet', theme.colorSecondary);
    document.documentElement.style.setProperty('--bg-dark', theme.colorBg);
    document.documentElement.style.setProperty('--bg-surface', theme.colorSurface);

    // Apply Brand Titles
    const brandTitleEls = document.querySelectorAll('.brand-title');
    brandTitleEls.forEach(el => el.textContent = theme.brandTitle);

    const brandSubtitleEl = document.querySelector('.brand-subtitle');
    if (brandSubtitleEl) brandSubtitleEl.textContent = theme.brandSubtitle;

    // Apply Logos
    const logoBadges = document.querySelectorAll('.logo-badge');
    logoBadges.forEach(logoBadge => {
      if (theme.logoType === 'url' && theme.logoUrl && theme.logoUrl.trim() !== '') {
        logoBadge.innerHTML = `<img src="${theme.logoUrl}" alt="Logo">`;
      } else {
        logoBadge.innerHTML = `<i class="${theme.logoIcon || 'fa-solid fa-layer-group'}"></i>`;
      }
    });

    // Apply Browser Tab Favicon
    const faviconLink = document.getElementById('favicon');
    if (faviconLink) {
      if (theme.logoType === 'url' && theme.logoUrl && theme.logoUrl.trim() !== '') {
        faviconLink.href = theme.logoUrl;
      } else {
        faviconLink.href = 'favicon.svg';
      }
    }

    // Form sync
    if (cfgBrandTitle) cfgBrandTitle.value = theme.brandTitle;
    if (cfgBrandSubtitle) cfgBrandSubtitle.value = theme.brandSubtitle;
    if (cfgLogoType) cfgLogoType.value = theme.logoType || 'icon';
    if (cfgLogoIcon) cfgLogoIcon.value = theme.logoIcon || 'fa-solid fa-layer-group';
    if (cfgLogoUrl) cfgLogoUrl.value = theme.logoUrl || '';
    if (cfgColorPrimary) cfgColorPrimary.value = theme.colorPrimary;
    if (cfgColorSecondary) cfgColorSecondary.value = theme.colorSecondary;
    if (cfgColorBg) cfgColorBg.value = theme.colorBg;
    if (cfgColorSurface) cfgColorSurface.value = theme.colorSurface;

    if (groupLogoIcon && groupLogoUrl) {
      if (theme.logoType === 'url') {
        groupLogoIcon.style.display = 'none';
        groupLogoUrl.style.display = 'flex';
      } else {
        groupLogoIcon.style.display = 'flex';
        groupLogoUrl.style.display = 'none';
      }
    }

    // Synchronize preset chips UI state
    if (presetChips && presetChips.length > 0) {
      presetChips.forEach(c => {
        const key = c.getAttribute('data-preset');
        if (theme.presetKey && theme.presetKey === key) {
          c.classList.add('active');
        } else if (!theme.presetKey && themePresets[key] && themePresets[key].colorPrimary === theme.colorPrimary) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    }

    if (save) {
      localStorage.setItem('workhq_workshop_theme', JSON.stringify(theme));
    }
  }

  // Preset Chips Event
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      const selectedPreset = themePresets[presetKey] || defaultTheme;
      applyTheme({ ...selectedPreset, presetKey }, true);
    });
  });

  // Save Button
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const customTheme = {
        brandTitle: cfgBrandTitle.value || 'SS&C WorkHQ',
        brandSubtitle: cfgBrandSubtitle.value || 'Enterprise Orchestration Workshop',
        logoType: cfgLogoType.value,
        logoIcon: cfgLogoIcon.value,
        logoUrl: cfgLogoUrl.value,
        colorPrimary: cfgColorPrimary.value,
        colorSecondary: cfgColorSecondary.value,
        colorBg: cfgColorBg.value,
        colorSurface: cfgColorSurface.value,
        presetKey: 'custom'
      };
      applyTheme(customTheme, true);
      closeSettings();
    });
  }

  // Reset Button
  if (btnResetSettings) {
    btnResetSettings.addEventListener('click', () => {
      localStorage.removeItem('workhq_workshop_theme');
      localStorage.removeItem('workhq_workshop_viewmode');
      applyTheme({ ...defaultTheme, presetKey: 'ssc' }, true);
      setViewMode(false, false);
    });
  }

  // Load Saved Settings on Init
  const savedTheme = localStorage.getItem('workhq_workshop_theme');
  if (savedTheme) {
    try {
      applyTheme(JSON.parse(savedTheme), false);
    } catch (e) {
      console.error('Error loading saved theme:', e);
    }
  }

  const savedViewMode = localStorage.getItem('workhq_workshop_viewmode');
  if (savedViewMode) {
    setViewMode(savedViewMode === 'reading', false);
  }

  /* ==========================================================================
     Screen Resolution & Viewport Height Auto-Adjuster
     ========================================================================== */
  function handleScreenResolutionAdaptation() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Toggle screen resolution utility classes on body
    document.body.classList.toggle('res-compact-height', height < 768);
    document.body.classList.toggle('res-tall-height', height >= 900);
    document.body.classList.toggle('res-small-width', width < 900);
  }

  // Initial resolution check & dynamic listeners
  handleScreenResolutionAdaptation();
  window.addEventListener('resize', handleScreenResolutionAdaptation);
  window.addEventListener('orientationchange', handleScreenResolutionAdaptation);

});

