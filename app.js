/* ==========================================================================
   PORTAL DE MATERIALES DE APOYO - LÓGICA JAVASCRIPT (VANILLA ES6+)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIGURACIÓN DE FIREBASE (CLOUD FIRESTORE) ---
  const firebaseConfig = {
    apiKey: "AIzaSyBFuJMDGPKG-DFsS1hZHatVrRYR7cQmntc",
    authDomain: "materiales-139c3.firebaseapp.com",
    projectId: "materiales-139c3",
    storageBucket: "materiales-139c3.firebasestorage.app",
    messagingSenderId: "790835818171",
    appId: "1:790835818171:web:eab087f7557d3bc3c0839e",
    measurementId: "G-9943HYF6C6"
  };

  let firestoreDb = null;
  let firebaseAuth = null;
  let isCloudConnected = false;
  let currentUserPhoto = localStorage.getItem('portal_logged_photo') || null;

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
      description: 'De RPA a la orquestación inteligente. Inmersión en el ecosistema de SS&C WorkHQ.',
      url: './Workshops/WorkHQ/index.html',
      tags: ['WorkHQ', 'SS&C', 'Workshop', 'Capacitación'],
      bannerBg: 'linear-gradient(135deg, #0284c7, #6366f1)',
      icon: 'fa-graduation-cap'
    },
    {
      id: 'clase-01-entornos-virtualizados',
      title: 'Clase 01 - Introducción a Entornos Virtualizados',
      category: 'presentaciones',
      folder: 'Entornos Virtualizados',
      description: 'Qué es la virtualización, conceptos clave, retos, hipervisores, infraestructura virtual, cloud computing y mapa de herramientas.',
      url: './Presentaciones/Entornos Virtualizados/clase_01_introduccion_entornos_virtualizados_para_teams/clase_01_introduccion_entornos_virtualizados.html',
      tags: ['Entornos Virtualizados', 'Virtualización', 'Hipervisores', 'Cloud', 'UTN'],
      bannerBg: 'linear-gradient(135deg, #0f766e, #0284c7)',
      icon: 'fa-file-powerpoint'
    },
    {
      id: 'clase-02-arquitecturas-vm-contenedores',
      title: 'Clase 02 - Arquitecturas de Virtualización, VM y Contenedores',
      category: 'presentaciones',
      folder: 'Entornos Virtualizados',
      description: 'Arquitecturas de virtualización, componentes de una plataforma, máquinas virtuales, contenedores y criterios de decisión.',
      url: './Presentaciones/Entornos Virtualizados/clase_02_arquitecturas_vm_contenedores_para_teams/clase_02_arquitecturas_vm_contenedores.html',
      tags: ['Entornos Virtualizados', 'Arquitectura', 'VM', 'Contenedores', 'Docker'],
      bannerBg: 'linear-gradient(135deg, #0f766e, #6366f1)',
      icon: 'fa-file-powerpoint'
    }
  ];

  // Carpetas Iniciales predeterminadas
  const DEFAULT_FOLDERS = [
    {
      id: 'folder-entornos-virtualizados',
      name: 'Entornos Virtualizados',
      category: 'presentaciones',
      description: 'Clases, arquitecturas y material didáctico de Entornos Virtualizados.',
      icon: 'fa-folder',
      bannerBg: 'linear-gradient(135deg, #0f766e, #14b8a6)',
      color: 'emerald'
    }
  ];

  const DEFAULT_VISUAL_SETTINGS = {
    theme: 'emerald',
    title: 'Rodrigo Montero Durán',
    logoIcon: 'fa-briefcase'
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
  let currentFolder = null;

  // Elementos DOM - Autenticación
  const authScreen = document.getElementById('authScreen');
  const appDashboard = document.getElementById('appDashboard');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const authAlert = document.getElementById('authAlert');
  const appAuthLogo = document.getElementById('appAuthLogo');
  const btnGoogleLogin = document.getElementById('btnGoogleLogin');

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

  // Elementos DOM - Navegación de Carpetas (Breadcrumbs)
  const folderBreadcrumbs = document.getElementById('folderBreadcrumbs');
  const breadcrumbsPath = document.getElementById('breadcrumbsPath');
  const btnBackBreadcrumb = document.getElementById('btnBackBreadcrumb');
  const btnEditCurrentFolder = document.getElementById('btnEditCurrentFolder');
  const btnDeleteCurrentFolder = document.getElementById('btnDeleteCurrentFolder');
  
  // Elementos DOM - Modales de Materiales
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
  const matCategorySelect = document.getElementById('matCategorySelect');
  const matFolderSelect = document.getElementById('matFolderSelect');
  const matIconSelect = document.getElementById('matIconSelect');

  const editMaterialModal = document.getElementById('editMaterialModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const cancelEditModal = document.getElementById('cancelEditModal');
  const editMaterialForm = document.getElementById('editMaterialForm');
  const editMatIdInput = document.getElementById('editMatIdInput');
  const editMatTitleInput = document.getElementById('editMatTitleInput');
  const editMatCategorySelect = document.getElementById('editMatCategorySelect');
  const editMatFolderSelect = document.getElementById('editMatFolderSelect');
  const editMatIconSelect = document.getElementById('editMatIconSelect');
  const editMatUrlInput = document.getElementById('editMatUrlInput');
  const editMatDescInput = document.getElementById('editMatDescInput');
  const editMatTagsInput = document.getElementById('editMatTagsInput');
  const btnDeleteMaterial = document.getElementById('btnDeleteMaterial');

  // Elementos DOM - Modales de Carpetas
  const addFolderModal = document.getElementById('addFolderModal');
  const btnOpenAddFolderModal = document.getElementById('btnOpenAddFolderModal');
  const closeAddFolderModal = document.getElementById('closeAddFolderModal');
  const cancelAddFolderModal = document.getElementById('cancelAddFolderModal');
  const addFolderForm = document.getElementById('addFolderForm');
  const folderNameInput = document.getElementById('folderNameInput');
  const folderCategorySelect = document.getElementById('folderCategorySelect');
  const folderDescInput = document.getElementById('folderDescInput');
  const folderColorSelect = document.getElementById('folderColorSelect');

  const editFolderModal = document.getElementById('editFolderModal');
  const closeEditFolderModal = document.getElementById('closeEditFolderModal');
  const cancelEditFolderModal = document.getElementById('cancelEditFolderModal');
  const editFolderForm = document.getElementById('editFolderForm');
  const editFolderIdInput = document.getElementById('editFolderIdInput');
  const editFolderNameInput = document.getElementById('editFolderNameInput');
  const editFolderCategorySelect = document.getElementById('editFolderCategorySelect');
  const editFolderDescInput = document.getElementById('editFolderDescInput');
  const editFolderColorSelect = document.getElementById('editFolderColorSelect');
  const btnDeleteFolderModal = document.getElementById('btnDeleteFolderModal');

  const themeModal = document.getElementById('themeModal');
  const closeThemeModal = document.getElementById('closeThemeModal');
  const cancelThemeModal = document.getElementById('cancelThemeModal');
  const themeForm = document.getElementById('themeForm');
  const themeTitleInput = document.getElementById('themeTitleInput');
  const themeLogoIconSelect = document.getElementById('themeLogoIconSelect');
  const themeCards = document.querySelectorAll('.theme-card');

  // Elementos DOM - Nube Firebase
  const cloudStatusBadge = document.getElementById('cloudStatusBadge');
  const btnSyncCloud = document.getElementById('btnSyncCloud');

  let selectedThemeValue = 'emerald';

  // --- 0. CONFIGURACIÓN VISUAL, NUBE FIREBASE Y REPOSITORIO ---

  function updateCloudBadge(connected, text) {
    if (!cloudStatusBadge) return;
    if (connected) {
      cloudStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      cloudStatusBadge.style.color = '#34d399';
      cloudStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      cloudStatusBadge.innerHTML = `<i class="fas fa-circle" style="font-size: 7px;"></i> ${text || 'Nube Conectada'}`;
    } else {
      cloudStatusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
      cloudStatusBadge.style.color = '#f87171';
      cloudStatusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      cloudStatusBadge.innerHTML = `<i class="fas fa-exclamation-circle" style="font-size: 8px;"></i> ${text || 'Modo Local'}`;
    }
  }

  function initFirebaseAndCloudSync() {
    try {
      if (window.firebase && typeof firebase.initializeApp === 'function') {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        firestoreDb = firebase.firestore();
        firebaseAuth = firebase.auth();
        isCloudConnected = true;
        updateCloudBadge(true, 'Nube Conectada (Firebase)');

        // Escuchar estado de sesión de Firebase Auth (Google)
        firebaseAuth.onAuthStateChanged((user) => {
          if (user) {
            const email = (user.email || '').toLowerCase();
            if (ALLOWED_EMAILS.includes(email)) {
              currentUser = email;
              currentUserPhoto = user.photoURL || null;
              localStorage.setItem('portal_logged_user', currentUser);
              if (currentUserPhoto) {
                localStorage.setItem('portal_logged_photo', currentUserPhoto);
              }
              showDashboard();
            } else {
              firebaseAuth.signOut().catch(e => console.warn(e));
              showAuthAlert(`La cuenta de Google (${email}) no está en la lista de correos autorizados.`);
            }
          }
        });

        // Escucha en tiempo real (onSnapshot)
        const configDocRef = firestoreDb.collection('portal').doc('config');
        configDocRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            console.log('⚡ Sincronización en vivo recibida desde Firebase Firestore:', data);

            // 1. Sincronizar Ajustes Visuales
            if (data.visualSettings) {
              localStorage.setItem('portal_visual_settings', JSON.stringify(data.visualSettings));
              applyVisualSettings();

              const currentVisual = getVisualSettings();
              if (themeTitleInput) themeTitleInput.value = currentVisual.title || '';
              if (themeLogoIconSelect) themeLogoIconSelect.value = currentVisual.logoIcon || 'fa-briefcase';
              selectedThemeValue = currentVisual.theme || 'emerald';
              themeCards.forEach(card => {
                card.classList.toggle('active', card.dataset.themeValue === selectedThemeValue);
              });
            }

            // 2. Sincronizar Carpetas si existen en la nube
            if (data.folders && Array.isArray(data.folders)) {
              localStorage.setItem('portal_folders_list', JSON.stringify(data.folders));
            }

            // 3. Sincronizar Materiales si existen en la nube
            if (data.materials && Array.isArray(data.materials)) {
              localStorage.setItem('portal_materials_list', JSON.stringify(data.materials));
            }

            // 4. Sincronizar Contraseña desde la base de datos en la nube
            if (data.password) {
              currentPassword = data.password;
              localStorage.setItem('portal_password', data.password);
            }

            if (currentUser) {
              renderMaterials();
            }
          } else {
            // El documento aún no existe en Firebase: sembrar con configuración actual
            console.log('Inicializando documento de configuración en Firebase Firestore...');
            configDocRef.set({
              password: currentPassword,
              visualSettings: getVisualSettings(),
              folders: getFolders(),
              materials: getMaterials(),
              updatedAt: new Date().toISOString()
            }, { merge: true }).catch(err => {
              console.warn('Nota: no se pudo sembrar Firestore:', err);
            });
          }
        }, (error) => {
          console.warn('Error en conexión con Firestore (verificar reglas de seguridad):', error);
          updateCloudBadge(false, 'Error de Permisos');
        });
      } else {
        updateCloudBadge(false, 'SDK No Cargado');
      }
    } catch (e) {
      console.warn('Firebase no inicializado:', e);
      updateCloudBadge(false, 'Modo Local');
    }
  }

  async function loadRepoConfig() {
    // Iniciar conexión y sincronización en tiempo real con Firebase
    initFirebaseAndCloudSync();
    try {
      const response = await fetch('./config.json', { cache: 'no-cache' });
      if (response.ok) {
        const repoData = await response.json();
        const localVisual = localStorage.getItem('portal_visual_settings');
        const localTime = localStorage.getItem('portal_config_updated_at');

        // Si la PC/Navegador es nuevo O si config.json en GitHub es más reciente que la sesión local
        const repoTime = repoData.exportedAt || repoData.updatedAt;
        const isRepoNewer = repoTime && (!localTime || new Date(repoTime) > new Date(localTime));

        if (!localVisual || isRepoNewer) {
          if (repoData.visualSettings) {
            localStorage.setItem('portal_visual_settings', JSON.stringify(repoData.visualSettings));
          }
          if (repoData.folders) {
            localStorage.setItem('portal_folders_list', JSON.stringify(repoData.folders));
          }
          if (repoData.materials) {
            localStorage.setItem('portal_materials_list', JSON.stringify(repoData.materials));
          }
          if (repoTime) {
            localStorage.setItem('portal_config_updated_at', repoTime);
          }
        }

        applyVisualSettings();
        if (currentUser) {
          renderMaterials();
        }
      }
    } catch (e) {
      console.log('Falla al cargar config.json o ejecutando localmente:', e);
      try {
        const currentList = JSON.parse(localStorage.getItem('portal_materials_list') || '[]');
        const existingIds = new Set(currentList.map(m => m.id));
        const missingDefaults = DEFAULT_MATERIALS.filter(m => !existingIds.has(m.id));
        let updatedMaterials = [...currentList, ...missingDefaults];

        // Asegurar que items por defecto tengan su carpeta asignada
        updatedMaterials.forEach(m => {
          const def = DEFAULT_MATERIALS.find(d => d.id === m.id);
          if (def && def.folder && !m.folder) {
            m.folder = def.folder;
          }
        });
        localStorage.setItem('portal_materials_list', JSON.stringify(updatedMaterials));

        const currentFolders = JSON.parse(localStorage.getItem('portal_folders_list') || '[]');
        const existingFolderNames = new Set(currentFolders.map(f => f.name));
        const missingFolders = DEFAULT_FOLDERS.filter(f => !existingFolderNames.has(f.name));
        if (missingFolders.length > 0) {
          const mergedFolders = [...currentFolders, ...missingFolders];
          localStorage.setItem('portal_folders_list', JSON.stringify(mergedFolders));
        }

        if (currentUser) {
          renderMaterials();
        }
      } catch (err) {
        console.error('Error sincronizando materiales/carpetas locales:', err);
      }
    }
  }

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

    const colors = THEME_GRADIENTS[themeName] || THEME_GRADIENTS.emerald;
    const shapeSvg = LOGO_SVG_SHAPES[logoIconClass] || LOGO_SVG_SHAPES['fa-briefcase'];

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
    selectedThemeValue = settings.theme || 'emerald';

    // Aplicar tema en data-theme
    if (selectedThemeValue === 'default') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', selectedThemeValue);
    }

    // Aplicar título dinámico con degradado en la última palabra
    if (appHeaderTitle) {
      const fullTitle = settings.title || 'Rodrigo Montero Durán';
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
    const logoIconClass = settings.logoIcon || 'fa-briefcase';
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

  function checkAndHandleRedirect() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || sessionStorage.getItem('portal_redirect_url');
      if (redirectUrl) {
        sessionStorage.removeItem('portal_redirect_url');
        window.location.replace(redirectUrl);
        return true;
      }
    } catch (e) {
      console.warn('Error en redirección automática:', e);
    }
    return false;
  }

  async function checkSession() {
    applyVisualSettings();
    await loadRepoConfig();
    if (currentUser && ALLOWED_EMAILS.includes(currentUser.toLowerCase())) {
      if (!checkAndHandleRedirect()) {
        showDashboard();
      }
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('redirect') || sessionStorage.getItem('portal_redirect_url')) {
        showAuthAlert('Debes iniciar sesión para acceder al material solicitado.');
      }
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
    if (currentUserPhoto) {
      userAvatar.innerHTML = `<img src="${currentUserPhoto}" alt="Avatar" referrerpolicy="no-referrer">`;
    } else {
      userAvatar.textContent = currentUser.charAt(0).toUpperCase();
    }
    renderMaterials();
  }

  // Inicio de Sesión con Google
  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener('click', async () => {
      authAlert.classList.add('hidden');

      // Restricción de seguridad de OAuth / Google: requiere http o https
      if (window.location.protocol === 'file:') {
        showAuthAlert('Google Sign-In requiere un servidor web (http:// o https://). Cuando publiques tu web en GitHub Pages funcionará automáticamente. Para probarlo ahora en tu PC, haz doble clic en "iniciar_portal.bat" (o usa la contraseña de acceso).');
        return;
      }

      if (!firebaseAuth) {
        showAuthAlert('Servicio de autenticación no inicializado. Asegúrate de tener conexión a internet o ingresa con contraseña.');
        return;
      }

      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      try {
        btnGoogleLogin.disabled = true;
        btnGoogleLogin.style.opacity = '0.7';

        const result = await firebaseAuth.signInWithPopup(provider);
        const user = result.user;
        const email = (user.email || '').toLowerCase();

        if (!ALLOWED_EMAILS.includes(email)) {
          await firebaseAuth.signOut();
          showAuthAlert(`Acceso denegado: La cuenta (${email}) no está en la lista de correos autorizados.`);
          return;
        }

        currentUser = email;
        currentUserPhoto = user.photoURL || null;
        localStorage.setItem('portal_logged_user', currentUser);
        if (currentUserPhoto) {
          localStorage.setItem('portal_logged_photo', currentUserPhoto);
        }
        if (!checkAndHandleRedirect()) {
          showDashboard();
        }
      } catch (error) {
        console.error('Error al autenticar con Google:', error);
        if (error.code === 'auth/popup-closed-by-user') {
          // Popup cerrado por el usuario voluntariamente
        } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
          showAuthAlert('Google Sign-In requiere ejecutarse bajo protocolo http:// o https:// (como GitHub Pages o http://localhost:8000).');
        } else if (error.code === 'auth/unauthorized-domain') {
          const currentHost = window.location.hostname || 'tu dominio actual';
          showAuthAlert(`Dominio no autorizado en Firebase ("${currentHost}"). Agrega "${currentHost}" en Firebase Console > Authentication > Settings > Authorized domains.`);
        } else {
          showAuthAlert('Error al conectar con Google: ' + (error.message || error.code));
        }
      } finally {
        btnGoogleLogin.disabled = false;
        btnGoogleLogin.style.opacity = '1';
      }
    });
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
    currentUserPhoto = null;
    localStorage.removeItem('portal_logged_photo');
    localStorage.setItem('portal_logged_user', currentUser);
    if (!checkAndHandleRedirect()) {
      showDashboard();
    }
  });

  btnLogout.addEventListener('click', () => {
    if (firebaseAuth && firebaseAuth.currentUser) {
      firebaseAuth.signOut().catch(e => console.warn(e));
    }
    localStorage.removeItem('portal_logged_user');
    localStorage.removeItem('portal_logged_photo');
    currentUser = null;
    currentUserPhoto = null;
    emailInput.value = '';
    passwordInput.value = '';
    authAlert.classList.add('hidden');
    showLogin();
  });

  function showAuthAlert(msg) {
    authAlert.textContent = msg;
    authAlert.classList.remove('hidden');
  }

  // --- 2. GESTIÓN DE MATERIALES, CARPETAS Y ALMACENAMIENTO ---

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
    localStorage.setItem('portal_config_updated_at', new Date().toISOString());
  }

  function getFolders() {
    const saved = localStorage.getItem('portal_folders_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error al parsear carpetas:', err);
      }
    }
    localStorage.setItem('portal_folders_list', JSON.stringify(DEFAULT_FOLDERS));
    return DEFAULT_FOLDERS;
  }

  function saveFolders(list) {
    localStorage.setItem('portal_folders_list', JSON.stringify(list));
    localStorage.setItem('portal_config_updated_at', new Date().toISOString());
  }

  function getBannerForCategory(category) {
    switch(category) {
      case 'workshops': return 'linear-gradient(135deg, #0284c7, #6366f1)';
      case 'presentaciones': return 'linear-gradient(135deg, #d97706, #e11d48)';
      case 'proyectos': return 'linear-gradient(135deg, #059669, #2563eb)';
      default: return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    }
  }

  function getBannerForFolder(color) {
    switch(color) {
      case 'emerald': return 'linear-gradient(135deg, #059669, #0d9488)';
      case 'indigo': return 'linear-gradient(135deg, #4f46e5, #6366f1)';
      case 'amber': return 'linear-gradient(135deg, #d97706, #f59e0b)';
      case 'rose': return 'linear-gradient(135deg, #e11d48, #f43f5e)';
      case 'cyan': return 'linear-gradient(135deg, #0284c7, #06b6d4)';
      default: return 'linear-gradient(135deg, #059669, #0d9488)';
    }
  }

  function populateFolderSelect(selectElem, category, selectedValue = '') {
    if (!selectElem) return;
    const folders = getFolders();
    const matching = folders.filter(f => !category || f.category === category);

    selectElem.innerHTML = '<option value="">(Nivel Raíz - Sin Carpeta)</option>';
    matching.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.name;
      opt.textContent = `📁 ${f.name}`;
      if (f.name === selectedValue) {
        opt.selected = true;
      }
      selectElem.appendChild(opt);
    });
  }

  function openFolder(folderName) {
    currentFolder = folderName;
    const folders = getFolders();
    const folder = folders.find(f => f.name === folderName);
    if (folder && activeTab !== 'all' && activeTab !== folder.category) {
      activeTab = folder.category;
      tabBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === activeTab);
      });
    }
    renderMaterials();
  }

  function renderFolderCard(folder, materials) {
    const card = document.createElement('div');
    card.className = 'folder-card glass-panel';

    const itemsCount = materials.filter(m => m.folder === folder.name).length;
    const categoryLabel = {
      workshops: 'Workshops',
      presentaciones: 'Presentaciones',
      proyectos: 'Proyectos'
    }[folder.category] || folder.category;

    const badgeClass = `badge-${folder.category}`;
    const countText = `${itemsCount} ${itemsCount === 1 ? (folder.category === 'presentaciones' ? 'presentación' : 'material') : (folder.category === 'presentaciones' ? 'presentaciones' : 'materiales')}`;

    card.innerHTML = `
      <div class="card-banner" style="background: ${folder.bannerBg || getBannerForFolder(folder.color)}">
        <div class="card-banner-content">
          <div class="card-icon-badge">
            <i class="fas fa-folder-open folder-icon-large"></i>
          </div>
          <span class="card-category-badge ${badgeClass}">${categoryLabel}</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title"><i class="fas fa-folder" style="color: var(--accent-primary); margin-right: 6px;"></i> ${escapeHtml(folder.name)}</h3>
        <p class="card-description">${escapeHtml(folder.description || 'Carpeta organizada de materiales y recursos.')}</p>
        <div class="folder-items-count">
          <i class="fas fa-layer-group"></i> ${countText}
        </div>
        <div class="card-footer" style="margin-top: 18px;">
          <button class="btn-card-edit btn-folder-edit" data-name="${escapeHtml(folder.name)}" title="Editar esta carpeta">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-card-folder-open btn-folder-enter" data-name="${escapeHtml(folder.name)}">
            Abrir Carpeta <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-folder-edit')) {
        e.stopPropagation();
        openEditFolderModal(folder.name);
      } else {
        openFolder(folder.name);
      }
    });

    cardsGrid.appendChild(card);
  }

  function renderMaterialCard(item, showFolderBadge = false) {
    const card = document.createElement('div');
    card.className = 'material-card glass-panel';

    const categoryLabel = {
      workshops: 'Workshop',
      presentaciones: 'Presentación',
      proyectos: 'Proyecto'
    }[item.category] || item.category;

    const badgeClass = `badge-${item.category}`;
    const itemIcon = item.icon || (item.category === 'workshops' ? 'fa-laptop-code' : item.category === 'presentaciones' ? 'fa-file-powerpoint' : 'fa-project-diagram');

    const folderBadgeHtml = (showFolderBadge && item.folder) ? `
      <div class="folder-origin-tag">
        <i class="fas fa-folder"></i> ${escapeHtml(item.folder)}
      </div>
    ` : '';

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
        ${folderBadgeHtml}
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
  }

  function renderMaterials() {
    const materials = getMaterials();
    const folders = getFolders();
    cardsGrid.innerHTML = '';

    updateTabCounts(materials);

    const isSearching = searchQuery.trim() !== '';

    if (isSearching) {
      if (folderBreadcrumbs) folderBreadcrumbs.classList.add('hidden');
      const query = searchQuery.toLowerCase();
      const filtered = materials.filter(item => {
        const matchesTab = (activeTab === 'all') || (item.category === activeTab);
        const matchesSearch = item.title.toLowerCase().includes(query) ||
                              item.description.toLowerCase().includes(query) ||
                              (item.folder && item.folder.toLowerCase().includes(query)) ||
                              (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));
        return matchesTab && matchesSearch;
      });

      if (filtered.length === 0) {
        cardsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        emptyState.querySelector('h3').textContent = 'No se encontraron materiales';
        emptyState.querySelector('p').textContent = 'Intenta con otras palabras clave o busca en otra categoría.';
        return;
      }

      cardsGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');

      filtered.forEach(item => {
        renderMaterialCard(item, true);
      });
      return;
    }

    // Navegación jerárquica (sin búsqueda)
    if (currentFolder !== null) {
      const activeFolderObj = folders.find(f => f.name === currentFolder);
      if (folderBreadcrumbs) folderBreadcrumbs.classList.remove('hidden');

      const categoryName = {
        workshops: 'Workshops',
        presentaciones: 'Presentaciones',
        proyectos: 'Proyectos'
      }[activeFolderObj ? activeFolderObj.category : activeTab] || 'Apartado';

      if (breadcrumbsPath) {
        breadcrumbsPath.innerHTML = `
          <span class="breadcrumb-crumb" id="breadcrumbRootTab"><i class="fas fa-th-large"></i> ${escapeHtml(categoryName)}</span>
          <span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>
          <span class="breadcrumb-current"><i class="fas fa-folder-open"></i> ${escapeHtml(currentFolder)}</span>
        `;

        const breadcrumbRootTab = document.getElementById('breadcrumbRootTab');
        if (breadcrumbRootTab) {
          breadcrumbRootTab.addEventListener('click', () => {
            currentFolder = null;
            renderMaterials();
          });
        }
      }

      const folderMaterials = materials.filter(m => m.folder === currentFolder);

      if (folderMaterials.length === 0) {
        cardsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        emptyState.querySelector('h3').textContent = 'Esta carpeta está vacía';
        emptyState.querySelector('p').textContent = 'Puedes agregar o mover materiales a esta carpeta con el botón "Nuevo Material".';
        return;
      }

      cardsGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');

      folderMaterials.forEach(item => {
        renderMaterialCard(item, false);
      });
    } else {
      if (folderBreadcrumbs) folderBreadcrumbs.classList.add('hidden');

      const matchingFolders = folders.filter(f => (activeTab === 'all') || (f.category === activeTab));
      const matchingMaterials = materials.filter(m => {
        const isRoot = !m.folder;
        const matchesTab = (activeTab === 'all') || (m.category === activeTab);
        return isRoot && matchesTab;
      });

      if (matchingFolders.length === 0 && matchingMaterials.length === 0) {
        cardsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        emptyState.querySelector('h3').textContent = 'No se encontraron materiales ni carpetas';
        emptyState.querySelector('p').textContent = 'Intenta ajustar la búsqueda o seleccionar otra categoría en el menú superior.';
        return;
      }

      cardsGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');

      // 1. Renderizar Carpetas primero
      matchingFolders.forEach(folder => {
        renderFolderCard(folder, materials);
      });

      // 2. Renderizar Materiales de la raíz
      matchingMaterials.forEach(item => {
        renderMaterialCard(item, false);
      });
    }
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
      currentFolder = null;
      renderMaterials();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMaterials();
  });

  // Eventos de Breadcrumbs
  if (btnBackBreadcrumb) {
    btnBackBreadcrumb.addEventListener('click', () => {
      currentFolder = null;
      renderMaterials();
    });
  }

  if (btnEditCurrentFolder) {
    btnEditCurrentFolder.addEventListener('click', () => {
      if (currentFolder) {
        openEditFolderModal(currentFolder);
      }
    });
  }

  if (btnDeleteCurrentFolder) {
    btnDeleteCurrentFolder.addEventListener('click', () => {
      if (currentFolder) {
        deleteFolderByName(currentFolder);
      }
    });
  }

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
      showPassAlert('Las contraseñas no coinciden.');
      return;
    }

    currentPassword = next;
    localStorage.setItem('portal_password', currentPassword);
    localStorage.setItem('portal_config_updated_at', new Date().toISOString());

    // Guardar en la base de datos Firebase Firestore
    if (firestoreDb) {
      firestoreDb.collection('portal').doc('config').set({
        password: next,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      .then(() => console.log('Contraseña actualizada en Firebase Firestore'))
      .catch(err => console.error('Error guardando contraseña en Firebase:', err));
    }

    closePassModal();
    alert('¡Contraseña actualizada exitosamente en la base de datos!');
  });

  function showPassAlert(msg) {
    passAlert.textContent = msg;
    passAlert.classList.remove('hidden');
  }

  // --- 4. AÑADIR MATERIAL NUEVO ---

  if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => {
      addMaterialForm.reset();
      if (activeTab !== 'all') {
        matCategorySelect.value = activeTab;
      }
      populateFolderSelect(matFolderSelect, matCategorySelect.value, currentFolder || '');
      addMaterialModal.classList.remove('hidden');
    });

    if (matCategorySelect) {
      matCategorySelect.addEventListener('change', () => {
        populateFolderSelect(matFolderSelect, matCategorySelect.value, matFolderSelect.value);
      });
    }

    const closeAdd = () => addMaterialModal.classList.add('hidden');
    closeAddModal.addEventListener('click', closeAdd);
    cancelAddModal.addEventListener('click', closeAdd);

    addMaterialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('matTitleInput').value.trim();
      const category = matCategorySelect.value;
      const folderVal = matFolderSelect ? matFolderSelect.value.trim() : '';
      const icon = matIconSelect ? matIconSelect.value : 'fa-laptop-code';
      const url = document.getElementById('matUrlInput').value.trim();
      const description = document.getElementById('matDescInput').value.trim();
      const tagsRaw = document.getElementById('matTagsInput').value.trim();

      const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [category];

      const newMaterial = {
        id: 'mat-' + Date.now(),
        title,
        category,
        folder: folderVal || null,
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
    populateFolderSelect(editMatFolderSelect, item.category, item.folder || '');
    if (editMatIconSelect) {
      editMatIconSelect.value = item.icon || 'fa-laptop-code';
    }
    editMatUrlInput.value = item.url;
    editMatDescInput.value = item.description;
    editMatTagsInput.value = (item.tags || []).join(', ');

    editMaterialModal.classList.remove('hidden');
  }

  if (editMatCategorySelect) {
    editMatCategorySelect.addEventListener('change', () => {
      populateFolderSelect(editMatFolderSelect, editMatCategorySelect.value, editMatFolderSelect.value);
    });
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
    const folderVal = editMatFolderSelect ? editMatFolderSelect.value.trim() : '';
    const icon = editMatIconSelect ? editMatIconSelect.value : 'fa-laptop-code';
    const tagsRaw = editMatTagsInput.value.trim();

    materials[index] = {
      ...materials[index],
      title: editMatTitleInput.value.trim(),
      category: category,
      folder: folderVal || null,
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

  // --- 6. GESTIÓN DE CARPETAS (CREAR, EDITAR, ELIMINAR) ---

  if (btnOpenAddFolderModal) {
    btnOpenAddFolderModal.addEventListener('click', () => {
      addFolderForm.reset();
      if (activeTab !== 'all') {
        folderCategorySelect.value = activeTab;
      }
      addFolderModal.classList.remove('hidden');
    });

    const closeAddFolder = () => addFolderModal.classList.add('hidden');
    if (closeAddFolderModal) closeAddFolderModal.addEventListener('click', closeAddFolder);
    if (cancelAddFolderModal) cancelAddFolderModal.addEventListener('click', closeAddFolder);

    addFolderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = folderNameInput.value.trim();
      const category = folderCategorySelect.value;
      const description = folderDescInput.value.trim();
      const color = folderColorSelect.value;

      if (!name) return;

      const folders = getFolders();
      if (folders.some(f => f.name.toLowerCase() === name.toLowerCase() && f.category === category)) {
        alert('Ya existe una carpeta con este nombre en este apartado.');
        return;
      }

      const newFolder = {
        id: 'folder-' + Date.now(),
        name,
        category,
        description,
        color,
        bannerBg: getBannerForFolder(color),
        icon: 'fa-folder'
      };

      folders.push(newFolder);
      saveFolders(folders);
      closeAddFolder();
      renderMaterials();
    });
  }

  function openEditFolderModal(folderName) {
    const folders = getFolders();
    const folder = folders.find(f => f.name === folderName);
    if (!folder) return;

    editFolderIdInput.value = folder.id || folder.name;
    editFolderNameInput.value = folder.name;
    editFolderCategorySelect.value = folder.category || 'presentaciones';
    editFolderDescInput.value = folder.description || '';
    editFolderColorSelect.value = folder.color || 'emerald';

    editFolderModal.classList.remove('hidden');
  }

  const closeEditFolder = () => editFolderModal.classList.add('hidden');
  if (closeEditFolderModal) closeEditFolderModal.addEventListener('click', closeEditFolder);
  if (cancelEditFolderModal) cancelEditFolderModal.addEventListener('click', closeEditFolder);

  if (editFolderForm) {
    editFolderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editFolderIdInput.value;
      const folders = getFolders();
      const index = folders.findIndex(f => (f.id === id || f.name === id));
      if (index === -1) return;

      const oldName = folders[index].name;
      const newName = editFolderNameInput.value.trim();
      const category = editFolderCategorySelect.value;
      const description = editFolderDescInput.value.trim();
      const color = editFolderColorSelect.value;

      folders[index] = {
        ...folders[index],
        name: newName,
        category,
        description,
        color,
        bannerBg: getBannerForFolder(color)
      };

      saveFolders(folders);

      if (oldName !== newName) {
        const materials = getMaterials();
        materials.forEach(m => {
          if (m.folder === oldName) {
            m.folder = newName;
          }
        });
        saveMaterials(materials);

        if (currentFolder === oldName) {
          currentFolder = newName;
        }
      }

      closeEditFolder();
      renderMaterials();
    });
  }

  function deleteFolderByName(folderName) {
    if (!folderName) return;
    if (confirm(`¿Estás seguro de que deseas eliminar la carpeta "${folderName}"? Los materiales contenidos no se borrarán; volverán al nivel raíz.`)) {
      const folders = getFolders();
      const updatedFolders = folders.filter(f => f.name !== folderName);
      saveFolders(updatedFolders);

      const materials = getMaterials();
      materials.forEach(m => {
        if (m.folder === folderName) {
          delete m.folder;
        }
      });
      saveMaterials(materials);

      if (currentFolder === folderName) {
        currentFolder = null;
      }
      closeEditFolder();
      renderMaterials();
    }
  }

  if (btnDeleteFolderModal) {
    btnDeleteFolderModal.addEventListener('click', () => {
      const folderName = editFolderNameInput.value;
      deleteFolderByName(folderName);
    });
  }

  // --- 7. MODAL DE CONFIGURACIÓN VISUAL Y TEMA ---

  if (btnOpenThemeModal) {
    btnOpenThemeModal.addEventListener('click', () => {
      const settings = getVisualSettings();
      themeTitleInput.value = settings.title || 'Rodrigo Montero Durán';
      if (themeLogoIconSelect) {
        themeLogoIconSelect.value = settings.logoIcon || 'fa-briefcase';
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
      const title = themeTitleInput.value.trim() || 'Rodrigo Montero Durán';
      const logoIcon = themeLogoIconSelect ? themeLogoIconSelect.value : 'fa-briefcase';

      const settings = {
        theme: selectedThemeValue,
        title: title,
        logoIcon: logoIcon
      };

      localStorage.setItem('portal_visual_settings', JSON.stringify(settings));
      localStorage.setItem('portal_config_updated_at', new Date().toISOString());
      applyVisualSettings();
      closeTheme();

      // Guardar inmediatamente en Firebase Cloud Firestore (sincroniza en tiempo real a todos los dispositivos)
      if (firestoreDb) {
        firestoreDb.collection('portal').doc('config').set({
          visualSettings: settings,
          updatedAt: new Date().toISOString()
        }, { merge: true })
        .then(() => {
          console.log('✅ Configuración visual guardada y sincronizada en Firebase Firestore');
        })
        .catch(err => {
          console.error('Error al sincronizar con Firebase:', err);
        });
      }
    });

    // --- Respaldo, Nube y Exportación / Importación ---
    const btnExportConfig = document.getElementById('btnExportConfig');
    const btnImportConfig = document.getElementById('btnImportConfig');
    const importFileInput = document.getElementById('importFileInput');

    if (btnSyncCloud) {
      btnSyncCloud.addEventListener('click', async () => {
        if (!firestoreDb) {
          alert('Firebase Firestore no está disponible en este momento. Revisa tu conexión a internet.');
          return;
        }

        btnSyncCloud.disabled = true;
        btnSyncCloud.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';

        try {
          await firestoreDb.collection('portal').doc('config').set({
            visualSettings: getVisualSettings(),
            folders: getFolders(),
            materials: getMaterials(),
            updatedAt: new Date().toISOString()
          }, { merge: true });

          alert('¡Sincronización en la nube completada! El diseño, las carpetas y los materiales están ahora guardados en Firebase y se verán idénticos en todos tus dispositivos.');
        } catch (err) {
          alert('Error al sincronizar con Firebase: ' + err.message + '\n\nTip: Verifica que las reglas de seguridad de Firestore estén en modo prueba o permitan lectura/escritura en /portal/{document=**}.');
          console.error(err);
        } finally {
          btnSyncCloud.disabled = false;
          btnSyncCloud.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Subir Todo a la Nube';
        }
      });
    }

    if (btnExportConfig) {
      btnExportConfig.addEventListener('click', () => {
        const repoConfigData = {
          visualSettings: getVisualSettings(),
          folders: getFolders(),
          materials: getMaterials(),
          exportedAt: new Date().toISOString()
        };

        const jsonStr = JSON.stringify(repoConfigData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (btnImportConfig && importFileInput) {
      btnImportConfig.addEventListener('click', () => {
        importFileInput.click();
      });

      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.visualSettings) {
              localStorage.setItem('portal_visual_settings', JSON.stringify(data.visualSettings));
            }
            if (data.folders && Array.isArray(data.folders)) {
              localStorage.setItem('portal_folders_list', JSON.stringify(data.folders));
            }
            if (data.materials && Array.isArray(data.materials)) {
              localStorage.setItem('portal_materials_list', JSON.stringify(data.materials));
            }
            if (data.password) {
              localStorage.setItem('portal_password', data.password);
              currentPassword = data.password;
            }
            if (data.exportedAt) {
              localStorage.setItem('portal_config_updated_at', data.exportedAt);
            }

            applyVisualSettings();
            renderMaterials();
            alert('¡Configuración, carpetas y materiales cargados con éxito en este navegador!');
            closeTheme();
          } catch (err) {
            alert('Error al leer el archivo de respaldo. Asegúrate de seleccionar un archivo JSON válido.');
            console.error('Error importando configuración:', err);
          }
        };
        reader.readAsText(file);
      });
    }
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
