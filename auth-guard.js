/**
 * Auth Guard - Protección de acceso a Materiales y Presentaciones
 * Verifica que el usuario tenga una sesión autorizada en el Portal antes de mostrar el contenido.
 */
(function() {
  const ALLOWED_EMAILS = [
    'rodrigomontero89@gmail.com',
    'rodrigomonteroduran@gmail.com'
  ];

  function uncloak() {
    const cloak = document.getElementById('auth-guard-cloak');
    if (cloak) cloak.remove();
  }

  // Si se ejecuta en local mediante file:// (por ejemplo desde un zip descargado), permitir ejecución inmediata
  if (window.location.protocol === 'file:') {
    uncloak();
    return;
  }

  function getPortalUrl() {
    const currentPath = window.location.pathname;
    const idx = currentPath.search(/\/(Workshops|Presentaciones)\//i);
    if (idx !== -1) {
      return currentPath.substring(0, idx + 1) + 'index.html';
    }
    const matMatch = currentPath.match(/^(.*\/materiales\/)/i);
    if (matMatch) {
      return matMatch[1] + 'index.html';
    }
    return '../../index.html';
  }

  function checkAuth() {
    const loggedUser = localStorage.getItem('portal_logged_user');
    if (!loggedUser) return false;
    
    const email = loggedUser.trim().toLowerCase();
    return ALLOWED_EMAILS.includes(email);
  }

  if (!checkAuth()) {
    // Guardar URL actual para redirigir automáticamente tras el login
    try {
      sessionStorage.setItem('portal_redirect_url', window.location.href);
    } catch (e) {}

    const portalUrl = getPortalUrl();
    const redirectParam = encodeURIComponent(window.location.href);
    const dest = portalUrl + (portalUrl.includes('?') ? '&' : '?') + 'redirect=' + redirectParam;
    window.location.replace(dest);
    return;
  }

  // Si está autorizado, remover de inmediato el bloqueo visual
  uncloak();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', uncloak);
  }

  // Barra flotante: únicamente acceso a "Volver al Portal"
  window.addEventListener('DOMContentLoaded', function() {
    uncloak();

    if (document.getElementById('portal-back-btn')) return;

    const portalUrl = getPortalUrl();
    const backBtn = document.createElement('a');
    backBtn.id = 'portal-back-btn';
    backBtn.href = portalUrl;
    backBtn.title = 'Volver al Portal de Materiales';
    backBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Portal</span>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #portal-back-btn {
        position: fixed;
        bottom: 18px;
        left: 18px;
        z-index: 99999;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.88);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #f8fafc;
        padding: 8px 14px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      #portal-back-btn:hover {
        background: #0f766e;
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(15, 118, 110, 0.4);
        border-color: rgba(255, 255, 255, 0.3);
      }
      @media print {
        #portal-back-btn,
        #portal-action-widget {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(backBtn);
  });
})();
