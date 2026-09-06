/* ==========================================================================
   PORTAL DE MATERIALES DE APOYO - LÓGICA JAVASCRIPT (VANILLA ES6+)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Configuración y Usuarios Autorizados
  const ALLOWED_EMAILS = [
    'rodrigomontero89@gmail.com',
    'rodrigomonteroduran@gmail.com'
  ];
  
  const DEFAULT_PASSWORD = 'Materiales2026!';

  // Materiales Iniciales predeterminados
  const DEFAULT_MATERIALS = [
    {
      id: 'workhq-ssnc',
      title: 'SS&C WorkHQ',
      category: 'workshops',
      description: 'Herramienta interactiva y centro de apoyo operativo de SS&C WorkHQ con guías y simulaciones visuales.',
      url: './Workshops/WorkHQ/index.html',
      tags: ['WorkHQ', 'SS&C', 'Workshop', 'Capacitación'],
      bannerBg: 'linear-gradient(135deg, #0284c7, #6366f1)',
      icon: 'fa-laptop-code'
    },
    {
      id: 'presentacion-ejecutiva-2026',
      title: 'Presentación Estratégica 2026',
      category: 'presentaciones',
      description: 'Plantilla y estructura máster para presentaciones de negocios, propuestas técnicas y workshops.',
      url: '#',
      tags: ['Diapositivas', 'Estrategia', 'Executive'],
      bannerBg: 'linear-gradient(135deg, #d97706, #e11d48)',
      icon: 'fa-file-powerpoint'
    },
    {
      id: 'portal-unificado-materiales',
      title: 'Portal Unificado de Materiales',
      category: 'proyectos',
      description: 'Hub centralizado con acceso seguro a todas las plataformas, workshops y proyectos profesionales.',
      url: './index.html',
      tags: ['Portal Web', 'Dashboard', 'CSS3/JS'],
      bannerBg: 'linear-gradient(135deg, #059669, #2563eb)',
      icon: 'fa-layer-group'
    }
  ];

  const DEFAULT_VISUAL_SETTINGS = {
    theme: 'default',
    title: 'Materiales Pro',
    logoIcon: 'fa-cubes'
  };

  const THEME_GRADIENTS = {
    default: { start: '#6366f1', end: '#8b5cf6' },
    emerald: { start: '#10b981', end: '#14b8a6' },
    sunset: { start: '#f43f5e', end: '#f59e0b' },
    cyber: { start: '#06b6d4', end: '#d946ef' },
    slate: { start: '#38bdf8', end: '#64748b' }
  };

  const LOGO_SVG_SHAPES = {
    'fa-cubes': `<g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M50 25 L75 38 L50 51 L25 38 Z" fill="rgba(255,255,255,0.25)" /><path d="M25 50 L50 63 L75 50" /><path d="M25 62 L50 75 L75 62" /></g>`,
    'fa-layer-group': `<g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M50 22 L80 37 L50 52 L20 37 Z" fill="rgba(255,255,255,0.25)" /><path d="M20 50 L50 65 L80 50" /><path d="M20 63 L50 78 L80 63" /></g>`,
    'fa-rocket': `<g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 18 C65 25 72 45 68 62 L50 54 L32 62 C28 45 35 25 50 18 Z" fill="rgba(255,255,255,0.25)" /><path d="M32 62 L22 75 L38 70" /><path d="M68 62 L78 75 L62 70" /><circle cx="50" cy="38" r="5" fill="#ffffff" /></g>`,
    'fa-brain': `<g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 40 C20 40 20 60 32 65 C32 75 48 78 50 68 C52 78 68 75 68 65 C80 60 80 40 70 40 C72 25 55 20 50 30 C45 20 28 25 30 40 Z" fill="rgba(255,255,255,0.2)" /><path d="M50 30 L50 68" /><path d="M38 48 C44 48 44 58 50 58" /></g>`,
    'fa-briefcase': `<g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="35" width="60" height="42" rx="6" fill="rgba(255,255,255,0.2)" /><path d="M38 35 V26 C38 22 42 20 50 20 C58 20 62 22 62 26 V35" /><path d="M20 50 H80" /><rect x="44" y="46" width="12" height="9" rx="2" fill="#ffffff" /></g>`,
    'fa-laptop-code': `<g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="24" width="52" height="36" rx="4" fill="rgba(255,255,255,0.2)" /><path d="M15 68 H85 L80 60 H20 Z" fill="#ffffff" /><path d="M38 36 L32 42 L38 48" /><path d="M62 36 L68 42 L62 48" /></g>`
  };

  // Estado de la Aplicación
  let currentPassword = localStorage.getItem('portal_password') || DEFAULT_PASSWORD;
  let currentUser = localStorage.getItem('portal_logged_user') || null;
  let activeTab = 'all';
  let searchQuery = '';

  // Elementos DOM - Autenticación
  const authScreen = document.getElementById('authScreen');
  const appDashboard = document.getElementById('appDashboard');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const authAlert = document.getElementById('authAlert');
  const appAuthLogo = document.getElementById('appAuthLogo');

  // Elementos DOM - Dashboard Nav & User & Branding
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const userAvatar = document.getElementById('userAvatar');
  const btnLogout = document.getElementById('btnLogout');
  const btnOpenPasswordModal = document.getElementById('btnOpenPasswordModal');
  const btnOpenThemeModal = document.getElementById('btnOpenThemeModal');
  const appHeaderTitle = document.getElementById('appHeaderTitle');
  const appHeaderLogo = document.getElementById('appHeaderLogo');

  // Elementos DOM - Filtros y Búsqueda
  const searchInput = document.getElementById('searchInput');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cardsGrid = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');
  
  // Elementos DOM - Modales
  const passwordModal = document.getElementById('passwordModal');
  const closePasswordModal = document.getElementById('closePasswordModal');
  const cancelPasswordModal = document.getElementById('cancelPasswordModal');
  const passwordForm = document.getElementById('passwordForm');
  const currentPassInput = document.getElementById('currentPassInput');
  const newPassInput = document.getElementById('newPassInput');
  const confirmPassInput = document.getElementById('confirmPassInput');
  const passAlert = document.getElementById('passAlert');

  const addMaterialModal = document.getElementById('addMaterialModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const closeAddModal = document.getElementById('closeAddModal');
  const cancelAddModal = document.getElementById('cancelAddModal');
  const addMaterialForm = document.getElementById('addMaterialForm');
  const matIconSelect = document.getElementById('matIconSelect');

  const editMaterialModal = document.getElementById('editMaterialModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const cancelEditModal = document.getElementById('cancelEditModal');
  const editMaterialForm = document.getElementById('editMaterialForm');
  const editMatIdInput = document.getElementById('editMatIdInput');
  const editMatTitleInput = document.getElementById('editMatTitleInput');
  const editMatCategorySelect = document.getElementById('editMatCategorySelect');
  const editMatIconSelect = document.getElementById('editMatIconSelect');
  const editMatUrlInput = document.getElementById('editMatUrlInput');
  const editMatDescInput = document.getElementById('editMatDescInput');
  const editMatTagsInput = document.getElementById('editMatTagsInput');
  const btnDeleteMaterial = document.getElementById('btnDeleteMaterial');

  const themeModal = document.getElementById('themeModal');
  const closeThemeModal = document.getElementById('closeThemeModal');
  const cancelThemeModal = document.getElementById('cancelThemeModal');
  const themeForm = document.getElementById('themeForm');
  const themeTitleInput = document.getElementById('themeTitleInput');
  const themeLogoIconSelect = document.getElementById('themeLogoIconSelect');
  const themeCards = document.querySelectorAll('.theme-card');

  let selectedThemeValue = 'default';

  // --- 0. CONFIGURACIÓN VISUAL E ICONOS ---

  function getVisualSettings() {
    const saved = localStorage.getItem('portal_visual_settings');
    if (saved) {
      try {
        return { ...DEFAULT_VISUAL_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error cargando ajustes visuales:', e);
      }
    }
    return DEFAULT_VISUAL_SETTINGS;
  }

  function updateDynamicFavicon(logoIconClass, themeName) {
    const appFavicon = document.getElementById('appFavicon');
    if (!appFavicon) return;

    const colors = THEME_GRADIENTS[themeName] || THEME_GRADIENTS.default;
    const shapeSvg = LOGO_SVG_SHAPES[logoIconClass] || LOGO_SVG_SHAPES['fa-cubes'];

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.start}" />
          <stop offset="100%" stop-color="${colors.end}" />
        </linearGradient>
      </defs>
      <rect width="90" height="90" x="5" y="5" rx="24" fill="url(#favGrad)" />
      ${shapeSvg}
    </svg>`;

    appFavicon.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
  }

  function applyVisualSettings() {
    const settings = getVisualSettings();
    selectedThemeValue = settings.theme || 'default';

    // Aplicar tema en data-theme
    if (selectedThemeValue === 'default') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', selectedThemeValue);
    }

    // Aplicar título dinámico con degradado en la última palabra
    if (appHeaderTitle) {
      const fullTitle = settings.title || 'Materiales Pro';
      const parts = fullTitle.trim().split(' ');
      if (parts.length > 1) {
        const lastWord = parts.pop();
        appHeaderTitle.innerHTML = `${escapeHtml(parts.join(' '))} <span class="gradient-text">${escapeHtml(lastWord)}</span>`;
      } else {
        appHeaderTitle.innerHTML = `<span class="gradient-text">${escapeHtml(fullTitle)}</span>`;
      }
    }
    document.title = `${settings.title || 'Portal de Materiales'} | Rodrigo Montero Durán`;

    // Aplicar icono del logo en header y login
    const logoIconClass = settings.logoIcon || 'fa-cubes';
    if (appHeaderLogo) {
      appHeaderLogo.innerHTML = `<i class="fas ${logoIconClass}"></i>`;
    }
    if (appAuthLogo) {
      appAuthLogo.innerHTML = `<i class="fas ${logoIconClass}"></i>`;
    }


    // Actualizar dinámicamente el favicon de la pestaña para coincidir exactamente con el icono de la web
    updateDynamicFavicon(logoIconClass, selectedThemeValue);
  }

  // --- 1. GESTIÓN DE SESIÓN Y LOGIN ---

  function checkSession() {
    applyVisualSettings();
    if (currentUser && ALLOWED_EMAILS.includes(currentUser.toLowerCase())) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    authScreen.classList.remove('hidden');
    appDashboard.classList.add('hidden');
  }

  function showDashboard() {
    authScreen.classList.add('hidden');
    appDashboard.classList.remove('hidden');
    userEmailDisplay.textContent = currentUser;
    userAvatar.textContent = currentUser.charAt(0).toUpperCase();
    renderMaterials();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const pass = passwordInput.value;

    authAlert.classList.add('hidden');

    if (!ALLOWED_EMAILS.includes(email)) {
      showAuthAlert('Correo no autorizado. Por favor utiliza un correo registrado.');
      return;
    }

    if (pass !== currentPassword) {
      showAuthAlert('Contraseña incorrecta. Por favor intenta de nuevo.');
      return;
    }

    // Login Exitoso
    currentUser = email;
    localStorage.setItem('portal_logged_user', currentUser);
    showDashboard();
  });

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('portal_logged_user');
    currentUser = null;
    emailInput.value = '';
    passwordInput.value = '';
    authAlert.classList.add('hidden');
    showLogin();
  });

  function showAuthAlert(msg) {
    authAlert.textContent = msg;
    authAlert.classList.remove('hidden');
  }

  // --- 2. GESTIÓN DE MATERIALES, ALMACENAMIENTO Y EDICIÓN ---

  function getMaterials() {
    const saved = localStorage.getItem('portal_materials_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error al parsear materiales:', err);
      }
    }
    const legacyCustom = JSON.parse(localStorage.getItem('portal_custom_materials') || '[]');
    const initialList = [...DEFAULT_MATERIALS, ...legacyCustom];
    localStorage.setItem('portal_materials_list', JSON.stringify(initialList));
    return initialList;
  }

  function saveMaterials(list) {
    localStorage.setItem('portal_materials_list', JSON.stringify(list));
  }

  function getBannerForCategory(category) {
    switch(category) {
      case 'workshops': return 'linear-gradient(135deg, #0284c7, #6366f1)';
      case 'presentaciones': return 'linear-gradient(135deg, #d97706, #e11d48)';
      case 'proyectos': return 'linear-gradient(135deg, #059669, #2563eb)';
      default: return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    }
  }

  function renderMaterials() {
    const materials = getMaterials();
    cardsGrid.innerHTML = '';

    const filtered = materials.filter(item => {
      const matchesTab = (activeTab === 'all') || (item.category === activeTab);
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(query) ||
                            item.description.toLowerCase().includes(query) ||
                            (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));
      return matchesTab && matchesSearch;
    });

    updateTabCounts(materials);

    if (filtered.length === 0) {
      cardsGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    cardsGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'material-card glass-panel';

      const categoryLabel = {
        workshops: 'Workshop',
        presentaciones: 'Presentación',
        proyectos: 'Proyecto'
      }[item.category] || item.category;

      const badgeClass = `badge-${item.category}`;
      const itemIcon = item.icon || (item.category === 'workshops' ? 'fa-laptop-code' : item.category === 'presentaciones' ? 'fa-file-powerpoint' : 'fa-project-diagram');

      card.innerHTML = `
        <div class="card-banner" style="background: ${item.bannerBg || getBannerForCategory(item.category)}">
          <div class="card-banner-content">
            <div class="card-icon-badge">
              <i class="fas ${itemIcon}"></i>
            </div>
            <span class="card-category-badge ${badgeClass}">${categoryLabel}</span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <p class="card-description">${escapeHtml(item.description)}</p>
          <div class="card-tags">
            ${(item.tags || []).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="card-footer">
            <button class="btn-card-edit" data-id="${item.id}" title="Editar este material">
              <i class="fas fa-edit"></i> Editar
            </button>
            <a href="${item.url}" ${item.url.startsWith('http') || item.url.includes('.html') ? 'target="_blank"' : ''} class="btn-card-action">
              Abrir Web <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      `;

      const editBtn = card.querySelector('.btn-card-edit');
      editBtn.addEventListener('click', () => openEditModal(item.id));

      cardsGrid.appendChild(card);
    });
  }

  function updateTabCounts(materials) {
    const counts = {
      all: materials.length,
      workshops: materials.filter(m => m.category === 'workshops').length,
      presentaciones: materials.filter(m => m.category === 'presentaciones').length,
      proyectos: materials.filter(m => m.category === 'proyectos').length
    };

    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-workshops').textContent = counts.workshops;
    document.getElementById('count-presentaciones').textContent = counts.presentaciones;
    document.getElementById('count-proyectos').textContent = counts.proyectos;
  }

  // Eventos de Filtro y Búsqueda
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderMaterials();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMaterials();
  });

  // --- 3. CAMBIO DE CONTRASEÑA ---

  btnOpenPasswordModal.addEventListener('click', () => {
    passwordForm.reset();
    passAlert.classList.add('hidden');
    passwordModal.classList.remove('hidden');
  });

  function closePassModal() {
    passwordModal.classList.add('hidden');
  }

  closePasswordModal.addEventListener('click', closePassModal);
  cancelPasswordModal.addEventListener('click', closePassModal);

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const curr = currentPassInput.value;
    const next = newPassInput.value;
    const confirm = confirmPassInput.value;

    if (curr !== currentPassword) {
      showPassAlert('La contraseña actual es incorrecta.');
      return;
    }

    if (next.length < 6) {
      showPassAlert('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (next !== confirm) {
      showPassAlert('Las contraseñas nuevas no coinciden.');
      return;
    }

    currentPassword = next;
    localStorage.setItem('portal_password', currentPassword);
    alert('¡Contraseña actualizada exitosamente!');
    closePassModal();
  });

  function showPassAlert(msg) {
    passAlert.textContent = msg;
    passAlert.classList.remove('hidden');
  }

  // --- 4. AÑADIR MATERIAL NUEVO ---

  if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => {
      addMaterialForm.reset();
      addMaterialModal.classList.remove('hidden');
    });

    const closeAdd = () => addMaterialModal.classList.add('hidden');
    closeAddModal.addEventListener('click', closeAdd);
    cancelAddModal.addEventListener('click', closeAdd);

    addMaterialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('matTitleInput').value.trim();
      const category = document.getElementById('matCategorySelect').value;
      const icon = matIconSelect ? matIconSelect.value : 'fa-laptop-code';
      const url = document.getElementById('matUrlInput').value.trim();
      const description = document.getElementById('matDescInput').value.trim();
      const tagsRaw = document.getElementById('matTagsInput').value.trim();

      const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [category];

      const newMaterial = {
        id: 'mat-' + Date.now(),
        title,
        category,
        icon,
        url: url || '#',
        description,
        tags,
        bannerBg: getBannerForCategory(category)
      };

      const materials = getMaterials();
      materials.push(newMaterial);
      saveMaterials(materials);

      closeAdd();
      renderMaterials();
    });
  }

  // --- 5. EDITAR Y ELIMINAR MATERIALES ---

  function openEditModal(id) {
    const materials = getMaterials();
    const item = materials.find(m => m.id === id);

    if (!item) return;

    editMatIdInput.value = item.id;
    editMatTitleInput.value = item.title;
    editMatCategorySelect.value = item.category;
    if (editMatIconSelect) {
      editMatIconSelect.value = item.icon || 'fa-laptop-code';
    }
    editMatUrlInput.value = item.url;
    editMatDescInput.value = item.description;
    editMatTagsInput.value = (item.tags || []).join(', ');

    editMaterialModal.classList.remove('hidden');
  }

  function closeEdit() {
    editMaterialModal.classList.add('hidden');
  }

  closeEditModal.addEventListener('click', closeEdit);
  cancelEditModal.addEventListener('click', closeEdit);

  editMaterialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editMatIdInput.value;
    const materials = getMaterials();
    const index = materials.findIndex(m => m.id === id);

    if (index === -1) return;

    const category = editMatCategorySelect.value;
    const icon = editMatIconSelect ? editMatIconSelect.value : 'fa-laptop-code';
    const tagsRaw = editMatTagsInput.value.trim();

    materials[index] = {
      ...materials[index],
      title: editMatTitleInput.value.trim(),
      category: category,
      icon: icon,
      url: editMatUrlInput.value.trim(),
      description: editMatDescInput.value.trim(),
      tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [category],
      bannerBg: getBannerForCategory(category)
    };

    saveMaterials(materials);
    closeEdit();
    renderMaterials();
  });

  btnDeleteMaterial.addEventListener('click', () => {
    const id = editMatIdInput.value;
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.')) {
      const materials = getMaterials();
      const updated = materials.filter(m => m.id !== id);
      saveMaterials(updated);
      closeEdit();
      renderMaterials();
    }
  });

  // --- 6. MODAL DE CONFIGURACIÓN VISUAL Y TEMA ---

  if (btnOpenThemeModal) {
    btnOpenThemeModal.addEventListener('click', () => {
      const settings = getVisualSettings();
      themeTitleInput.value = settings.title || 'Materiales Pro';
      if (themeLogoIconSelect) {
        themeLogoIconSelect.value = settings.logoIcon || 'fa-cubes';
      }

      themeCards.forEach(card => {
        if (card.dataset.themeValue === settings.theme) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      themeModal.classList.remove('hidden');
    });

    const closeTheme = () => themeModal.classList.add('hidden');
    closeThemeModal.addEventListener('click', closeTheme);
    cancelThemeModal.addEventListener('click', closeTheme);

    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedThemeValue = card.dataset.themeValue;
      });
    });

    themeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = themeTitleInput.value.trim() || 'Materiales Pro';
      const logoIcon = themeLogoIconSelect ? themeLogoIconSelect.value : 'fa-cubes';

      const settings = {
        theme: selectedThemeValue,
        title: title,
        logoIcon: logoIcon
      };

      localStorage.setItem('portal_visual_settings', JSON.stringify(settings));
      applyVisualSettings();
      closeTheme();
    });
  }

  // Utilidad Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Inicializar Comprobación de Sesión y Visual
  checkSession();
});
