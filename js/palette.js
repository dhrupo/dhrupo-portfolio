(function(){
  var dialog = document.getElementById('palette');
  var input = document.getElementById('palette-input');
  var list = document.getElementById('palette-list');
  if (!dialog || !input || !list) return;

  var COMMANDS = [
    { cat: 'nav',   name: 'about',     run: function(){ goto('#about'); } },
    { cat: 'nav',   name: 'work',      run: function(){ goto('#work'); } },
    { cat: 'nav',   name: 'contributions', run: function(){ goto('#contributions'); } },
    { cat: 'nav',   name: 'oss',       run: function(){ goto('#oss'); } },
    { cat: 'nav',   name: 'notes',     run: function(){ goto('#notes'); } },
    { cat: 'nav',   name: 'contact',   run: function(){ goto('#contact'); } },
    { cat: 'play',  name: 'snake game', run: function(){ closePalette(); window.location.href = 'game.html'; } },
    { cat: 'theme', name: 'dark',      run: function(){ if (window.__theme) window.__theme.set('dark'); } },
    { cat: 'theme', name: 'light',     run: function(){ if (window.__theme) window.__theme.set('light'); } },
    { cat: 'theme', name: 'toggle',    run: function(){ if (!window.__theme) return; var t = window.__theme.get(); window.__theme.set(t === 'dark' ? 'light' : 'dark'); } },
    { cat: 'copy',  name: 'email',         run: function(){ if (window.__site) window.__site.copy('dhrupo@gmail.com'); } },
    { cat: 'copy',  name: 'github url',    run: function(){ if (window.__site) window.__site.copy('https://github.com/dhrupo'); } },
    { cat: 'copy',  name: 'linkedin url',  run: function(){ if (window.__site) window.__site.copy('https://linkedin.com/in/niluthpal-purkayastha'); } },
    { cat: 'open',  name: 'github',    run: function(){ openUrl('https://github.com/dhrupo'); } },
    { cat: 'open',  name: 'linkedin',  run: function(){ openUrl('https://linkedin.com/in/niluthpal-purkayastha'); } },
    { cat: 'open',  name: 'wordpress', run: function(){ openUrl('https://profiles.wordpress.org/dhrupo/'); } },
    { cat: 'open',  name: 'resume',    run: function(){ openUrl('https://drive.google.com/file/d/1DuU2WIFN70kHioRdTSU-pgvZQTAWbRR-/view?usp=sharing'); } },
    { cat: 'sudo',  name: 'rm -rf ./boring-portfolio', run: runSudo, hidden: true }
  ];

  var recent = [];
  var selected = 0;
  var filtered = [];

  function goto(hash){
    closePalette();
    var el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  function openUrl(url){
    closePalette();
    window.open(url, '_blank', 'noopener');
  }
  function runSudo(){
    closePalette();
    if (!window.__site) return;
    var msgs = ['removing ./boring-portfolio…', 'kidding 😄 the new one is right here.'];
    var i = 0;
    function step(){
      window.__site.toast(msgs[i++]);
      if (i < msgs.length) setTimeout(step, 1200);
    }
    step();
  }

  function score(query, text){
    query = query.toLowerCase();
    text = text.toLowerCase();
    if (!query) return 1;
    var qi = 0, total = 0, run = 0;
    for (var i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) { qi++; run++; total += 1 + run; }
      else { run = 0; }
    }
    return qi === query.length ? total : 0;
  }

  function filterCommands(q){
    var showHidden = q.toLowerCase().indexOf('sudo') === 0;
    var scored = COMMANDS
      .filter(function(c){ return showHidden ? true : !c.hidden; })
      .map(function(c){
        var key = c.cat + ' ' + c.name;
        var s = score(q, key);
        var recentBonus = recent.indexOf(key) > -1 ? 100 - recent.indexOf(key) : 0;
        return { c: c, s: s + recentBonus };
      })
      .filter(function(x){ return x.s > 0; })
      .sort(function(a,b){ return b.s - a.s; });
    return scored.map(function(x){ return x.c; });
  }

  // Safe DOM rendering — createElement + textContent only.
  function render(){
    while (list.firstChild) list.removeChild(list.firstChild);
    filtered.forEach(function(c, i){
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === selected ? 'true' : 'false');
      li.dataset.idx = String(i);

      var cat = document.createElement('span');
      cat.className = 'pl-cat';
      cat.textContent = c.cat;

      var name = document.createElement('span');
      name.className = 'pl-name';
      name.textContent = c.name;

      li.appendChild(cat);
      li.appendChild(name);
      li.addEventListener('click', function(){ runIdx(i); });
      list.appendChild(li);
    });
  }

  function runIdx(i){
    var c = filtered[i];
    if (!c) return;
    var key = c.cat + ' ' + c.name;
    recent = [key].concat(recent.filter(function(k){ return k !== key; })).slice(0, 5);
    closePalette();
    c.run();
  }

  function openPalette(){
    if (dialog.open) return;
    input.value = '';
    filtered = filterCommands('');
    selected = 0;
    render();
    dialog.showModal();
    setTimeout(function(){ input.focus(); }, 10);
  }
  function closePalette(){ if (dialog.open) dialog.close(); }

  input.addEventListener('input', function(){
    filtered = filterCommands(input.value);
    selected = 0;
    render();
  });
  input.addEventListener('keydown', function(e){
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); runIdx(selected); }
  });
  dialog.addEventListener('click', function(e){ if (e.target === dialog) closePalette(); });

  document.addEventListener('keydown', function(e){
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) closePalette(); else openPalette();
    }
  });

  // Expose for click-driven openers
  window.__palette = { open: openPalette, close: closePalette };
})();
