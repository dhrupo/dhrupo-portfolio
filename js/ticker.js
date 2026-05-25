(function(){
  var el = document.querySelector('[data-ticker]');
  if (!el) return;

  var CACHE_KEY = 'last_commit_v1';
  var CACHE_TTL_MS = 60 * 60 * 1000;

  function readCache(){
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
      return parsed;
    } catch(e) { return null; }
  }
  function writeCache(data){
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data })); } catch(e) {}
  }

  function relativeTime(iso){
    var diffMs = Date.now() - new Date(iso).getTime();
    var mins = Math.round(diffMs / 60000);
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.round(hrs / 24);
    if (days < 30) return days + 'd ago';
    return Math.round(days / 30) + 'mo ago';
  }

  function localTime(){
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    var offsetMin = -d.getTimezoneOffset();
    var sign = offsetMin >= 0 ? '+' : '-';
    var offH = Math.abs(Math.floor(offsetMin / 60));
    return hh + ':' + mm + ' UTC' + sign + offH;
  }

  function render(commit){
    var base = 'uptime — 7 years coding';
    var commitPart = commit ? ' · last commit ' + relativeTime(commit.at) + ' (' + commit.repo + ')' : '';
    var time = ' · ' + localTime();
    el.textContent = base + commitPart + time;
  }

  function fetchLastCommit(){
    var cached = readCache();
    if (cached) { render(cached.data); scheduleClockTick(cached.data); return; }
    fetch('https://api.github.com/users/dhrupo/events/public?per_page=30')
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(events){
        var push = events.find(function(e){ return e.type === 'PushEvent'; });
        if (!push) { render(null); scheduleClockTick(null); return; }
        var data = { at: push.created_at, repo: push.repo.name };
        writeCache(data);
        render(data);
        scheduleClockTick(data);
      })
      .catch(function(){ render(null); scheduleClockTick(null); });
  }

  function scheduleClockTick(commit){
    setInterval(function(){ render(commit); }, 60 * 1000);
  }

  fetchLastCommit();
})();
