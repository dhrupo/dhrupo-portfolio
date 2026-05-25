(function(){
  var canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var COLS = 28, ROWS = 18, CELL = 22;
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;

  var SECTIONS = [
    { key: 'about',    label: 'about',    desc: 'Senior Software Engineer @ WPManageNinja. PHP, Vue 3, React, Gutenberg, REST.',     href: 'index.html#about' },
    { key: 'work',     label: 'work',     desc: 'Fluent Forms (700K+ installs) and Fluent Player — team products in WordPress.',      href: 'index.html#work' },
    { key: 'projects', label: 'projects', desc: '10 personal projects on GitHub & npm — mincut-context, codex-map, workmem…',         href: 'index.html#projects' },
    { key: 'notes',    label: 'notes',    desc: 'Short essays on plugin engineering & AI dev-tooling. First drafts coming soon.',     href: 'index.html#notes' },
    { key: 'contact',  label: 'contact',  desc: 'dhrupo@gmail.com · github.com/dhrupo · Sylhet, Bangladesh.',                         href: 'index.html#contact' }
  ];

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function color(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000';
  }

  var snake, dir, pendingDir, food, foundKeys, score, alive, won, paused, tickIntervalMs, lastTickAt;

  function reset(){
    snake = [{x:5,y:Math.floor(ROWS/2)}, {x:4,y:Math.floor(ROWS/2)}, {x:3,y:Math.floor(ROWS/2)}];
    dir = {x:1, y:0};
    pendingDir = dir;
    foundKeys = [];
    score = 0;
    alive = true;
    won = false;
    paused = false;
    tickIntervalMs = 130;
    lastTickAt = 0;
    clearDiscoveries();
    spawnFood();
    updateHUD();
  }

  function clearDiscoveries(){
    var ul = document.getElementById('game-discoveries');
    while (ul && ul.firstChild) ul.removeChild(ul.firstChild);
    var empty = document.getElementById('game-empty');
    if (empty) empty.style.display = 'flex';
  }

  function spawnFood(){
    var available = SECTIONS.filter(function(s){ return foundKeys.indexOf(s.key) === -1; });
    if (available.length === 0) { won = true; food = null; return; }
    var section = available[Math.floor(Math.random() * available.length)];
    var pos;
    var tries = 0;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * (ROWS - 1)) + 1 };
      tries++;
    } while (tries < 200 && snake.some(function(s){ return s.x === pos.x && s.y === pos.y; }));
    food = { x: pos.x, y: pos.y, section: section };
  }

  function tick(){
    if (!alive || won || paused) return;
    dir = pendingDir;
    var head = {
      x: (snake[0].x + dir.x + COLS) % COLS,
      y: (snake[0].y + dir.y + ROWS) % ROWS
    };
    if (snake.some(function(s){ return s.x === head.x && s.y === head.y; })) {
      alive = false;
      return;
    }
    snake.unshift(head);
    if (food && head.x === food.x && head.y === food.y) {
      score += 100;
      foundKeys.push(food.section.key);
      addDiscovery(food.section);
      tickIntervalMs = Math.max(70, tickIntervalMs - 6);
      spawnFood();
      updateHUD();
    } else {
      snake.pop();
    }
  }

  function draw(now){
    var bg = color('--bg');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle grid dots
    ctx.fillStyle = color('--border');
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        ctx.fillRect(x*CELL + CELL/2 - 1, y*CELL + CELL/2 - 1, 1, 1);
      }
    }

    // food (with pulse)
    if (food) {
      var fx = food.x * CELL, fy = food.y * CELL;
      var baseSize = CELL - 6;
      var pulse = reduceMotion ? 1 : (1 + Math.sin(now / 180) * 0.08);
      var size = baseSize * pulse;

      // outer glow ring
      if (!reduceMotion) {
        ctx.globalAlpha = 0.3 + Math.sin(now / 180) * 0.15;
        ctx.fillStyle = color('--accent');
        ctx.fillRect(fx + 1, fy + 1, CELL - 2, CELL - 2);
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = color('--accent');
      ctx.fillRect(fx + (CELL - size)/2, fy + (CELL - size)/2, size, size);

      ctx.fillStyle = color('--bg');
      ctx.font = 'bold 9px JetBrains Mono, ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(food.section.label.slice(0,4), fx + CELL/2, fy + CELL/2 + 1);
    }

    // snake
    for (var i = snake.length - 1; i >= 0; i--) {
      var s = snake[i];
      var inset = i === 0 ? 1 : 3;
      ctx.fillStyle = color('--prompt');
      ctx.globalAlpha = i === 0 ? 1 : Math.max(0.4, 1 - i * 0.06);
      ctx.fillRect(s.x*CELL + inset, s.y*CELL + inset, CELL - inset*2, CELL - inset*2);
    }
    ctx.globalAlpha = 1;

    // overlay state
    if (!alive || won || paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.72)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color('--fg-strong');
      ctx.font = 'bold 22px JetBrains Mono, ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var msg = won ? '$ tour complete ✓' : (paused ? '|| paused' : '$ game over');
      ctx.fillText(msg, canvas.width/2, canvas.height/2 - 16);

      ctx.font = '12px JetBrains Mono, ui-monospace, monospace';
      ctx.fillStyle = color('--fg-muted');
      var hint = won
        ? 'all five sections discovered — esc to return · R to play again'
        : (paused ? 'press P to resume' : 'press R to restart · esc to return');
      ctx.fillText(hint, canvas.width/2, canvas.height/2 + 12);

      if (won) {
        ctx.fillStyle = color('--prompt');
        ctx.fillText('score: ' + String(score).padStart(3, '0'), canvas.width/2, canvas.height/2 + 36);
      }
    }
  }

  function loop(now){
    if (!lastTickAt) lastTickAt = now;
    if (now - lastTickAt >= tickIntervalMs) {
      tick();
      lastTickAt = now;
    }
    draw(now);
    requestAnimationFrame(loop);
  }

  function updateHUD(){
    var s = document.getElementById('game-score');
    var f = document.getElementById('game-found');
    var t = document.getElementById('game-target');
    var c = document.getElementById('discoveries-count');
    var total = SECTIONS.length;
    if (s) s.textContent = String(score).padStart(3, '0');
    if (f) f.textContent = foundKeys.length + ' / ' + total;
    if (c) c.textContent = foundKeys.length + ' / ' + total;
    if (t) t.textContent = won ? 'done ✓' : (food ? food.section.label : '—');
  }

  function addDiscovery(section){
    var ul = document.getElementById('game-discoveries');
    var empty = document.getElementById('game-empty');
    if (!ul) return;
    if (empty) empty.style.display = 'none';

    var li = document.createElement('li');
    li.className = 'discovery';

    var head = document.createElement('div');
    head.className = 'discovery-head';

    var num = document.createElement('span');
    num.className = 'discovery-num';
    num.textContent = String(foundKeys.length).padStart(2, '0');

    var name = document.createElement('span');
    name.className = 'discovery-name';
    name.textContent = section.label;

    var ok = document.createElement('span');
    ok.className = 'discovery-ok';
    ok.textContent = '✓';

    head.appendChild(num);
    head.appendChild(name);
    head.appendChild(ok);

    var desc = document.createElement('p');
    desc.className = 'discovery-desc';
    desc.textContent = section.desc;

    var link = document.createElement('a');
    link.className = 'discovery-link';
    link.href = section.href;
    link.textContent = 'open →';

    li.appendChild(head);
    li.appendChild(desc);
    li.appendChild(link);
    ul.appendChild(li);

    li.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  function changeDir(nx, ny){
    if ((dir.x !== -nx || dir.y !== -ny) && (dir.x !== nx || dir.y !== ny)) {
      pendingDir = { x: nx, y: ny };
    }
  }

  document.addEventListener('keydown', function(e){
    var k = e.key;
    var blocking = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '];
    if (blocking.indexOf(k) !== -1) e.preventDefault();

    if (k === 'ArrowUp' || k === 'w' || k === 'W') changeDir(0, -1);
    else if (k === 'ArrowDown' || k === 's' || k === 'S') changeDir(0, 1);
    else if (k === 'ArrowLeft' || k === 'a' || k === 'A') changeDir(-1, 0);
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') changeDir(1, 0);
    else if (k === 'r' || k === 'R') reset();
    else if (k === 'p' || k === 'P') { if (alive && !won) paused = !paused; }
    else if (k === 'Escape') { window.location.href = 'index.html'; }
  });

  var restartBtn = document.getElementById('game-restart');
  if (restartBtn) restartBtn.addEventListener('click', function(){ reset(); canvas.focus(); });

  canvas.focus();
  canvas.addEventListener('click', function(){ canvas.focus(); });

  reset();
  requestAnimationFrame(loop);
})();
