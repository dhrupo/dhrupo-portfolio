(function(){
  var root = document.documentElement;
  var btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  var icon = btn.querySelector('.theme-icon');

  function syncBtn(theme){
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (icon) icon.textContent = theme === 'dark' ? '☼' : '☾';
  }

  syncBtn(root.getAttribute('data-theme') || 'dark');

  function setTheme(theme){
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
    syncBtn(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  btn.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  window.__theme = { set: setTheme, get: function(){ return root.getAttribute('data-theme'); } };

  document.addEventListener('keydown', function(e){
    if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA') {
      setTheme(window.__theme.get() === 'dark' ? 'light' : 'dark');
    }
  });
})();
