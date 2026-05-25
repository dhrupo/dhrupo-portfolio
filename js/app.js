(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero typewriter
  function runTypewriter(){
    var el = document.querySelector('[data-typewriter]');
    if (!el) return;
    var target = el.getAttribute('data-typewriter');
    if (reduceMotion) { el.textContent = target; return; }
    el.textContent = '';
    var i = 0;
    function tick(){
      el.textContent = target.slice(0, ++i);
      if (i < target.length) setTimeout(tick, 32);
    }
    tick();
  }
  runTypewriter();

  // Scroll progress bar
  var progress = document.querySelector('.progress');
  function updateProgress(){
    if (!progress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var ratio = max > 0 ? h.scrollTop / max : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Copy-to-clipboard with toast
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg){
    if (!toast) return;
    toast.textContent = '// ' + msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 1800);
  }
  function copy(text){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ showToast('copied ' + text + ' ✓'); });
    } else {
      var t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly','');
      t.style.position = 'absolute'; t.style.left = '-9999px';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); showToast('copied ' + text + ' ✓'); }
      finally { document.body.removeChild(t); }
    }
  }
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-copy]');
    if (!el) return;
    e.preventDefault();
    copy(el.getAttribute('data-copy'));
  });

  window.__site = { copy: copy, toast: showToast };

  // Cheatsheet dialog
  var cheat = document.getElementById('cheatsheet');
  function openCheat(){ if (cheat && !cheat.open) cheat.showModal(); }
  function closeCheat(){ if (cheat && cheat.open) cheat.close(); }
  if (cheat) {
    cheat.addEventListener('click', function(e){
      if (e.target === cheat) closeCheat();
      if (e.target.matches('[data-close]')) closeCheat();
    });
  }

  // Keyboard: ?, G+H, Esc
  var lastKey = '';
  var lastKeyAt = 0;
  document.addEventListener('keydown', function(e){
    var inField = ['INPUT','TEXTAREA'].indexOf(document.activeElement.tagName) !== -1;
    if (inField) return;

    if (e.key === '?') { e.preventDefault(); openCheat(); return; }
    if (e.key === 'Escape') { closeCheat(); return; }

    if (e.key === 'g') { lastKey = 'g'; lastKeyAt = Date.now(); return; }
    if (e.key === 'h' && lastKey === 'g' && (Date.now() - lastKeyAt) < 1000) {
      lastKey = '';
      e.preventDefault();
      var home = document.getElementById('home');
      if (home) home.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
})();
