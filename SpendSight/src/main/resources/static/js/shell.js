/* =====================================================
   shell.js — Codigo compartido entre TODAS las paginas
              - Guard de sesion
              - Inicializar topbar (nombre + avatar)
              - Marcar enlace activo en sidebar
              - Logout
   Debe cargarse DESPUES de storage.js
===================================================== */

(function () {
  /* ── 1. Guard de sesion ── */
  const sess = session.get();
  if (!sess) {
    window.location.href = 'auth.html';
    return;
  }

  /* ── 2. Topbar: avatar y nombre ── */
  const av = document.getElementById('topbar-avatar');
  const nm = document.getElementById('topbar-username');

  if (av) {
    const letter = sess.avatar
      || (sess.nombres || 'S').substring(0, 2).toUpperCase();
    av.textContent   = letter;
    av.style.fontSize = '14px';
    if (sess.avatar) av.style.background = 'var(--bg3)';
  }
  if (nm) {
    nm.textContent = sess.nombres || '';
  }

  /* ── 3. Marcar enlace activo segun la URL actual ── */
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar .nav-item').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href && href === current) {
      link.classList.add('active');
    }
  });

  /* ── 4. Pre-llenar config con datos de sesion si esta vacio ── */
  try {
    const cfg = JSON.parse(localStorage.getItem('ss_config') || '{}');
    if (!cfg.nombres && sess.nombres) {
      cfg.nombres = `${sess.nombres} ${sess.apellidos || ''}`.trim();
      cfg.correo  = sess.email || '';
      localStorage.setItem('ss_config', JSON.stringify(cfg));
    }
  } catch (_) {}
})();

/* ── Logout ── */
function doLogout() {
  session.clear();
  window.location.href = 'auth.html';
}
