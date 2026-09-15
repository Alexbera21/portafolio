document.getElementById('year').textContent = new Date().getFullYear();

/* Tema claro/oscuro elegido por el visitante. Claro por defecto siempre,
   sin importar la preferencia del sistema operativo. Se recuerda en el navegador. */
(function(){
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');
  var icon = btn.querySelector('i');
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch(e) {}

  function apply(theme){
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      icon.className = 'ph-thin ph-sun text-base';
    } else {
      root.removeAttribute('data-theme');
      icon.className = 'ph-thin ph-moon text-base';
    }
  }
  apply(saved === 'dark' ? 'dark' : 'light');

  btn.addEventListener('click', function(){
    var isDark = root.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch(e) {}
  });
})();

/* Sombra en la barra de navegación al hacer scroll. */
(function(){
  var nav = document.getElementById('nav');
  function onScroll(){ nav.classList.toggle('shadow-md', window.scrollY > 4); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Resalta en el menú la sección que se está viendo. */
(function(){
  var links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var activeClasses = ['text-slate-900', 'dark:text-white', 'after:!right-0'];
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = map[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function(a){ a.classList.remove.apply(a.classList, activeClasses); });
        link.classList.add.apply(link.classList, activeClasses);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  Object.keys(map).forEach(function(id){
    var section = document.getElementById(id);
    if (section) io.observe(section);
  });
})();

/* Revelado al entrar en pantalla. IntersectionObserver, sin listeners de scroll. */
(function(){
  var hiddenClasses = ['opacity-0', 'translate-y-3'];
  var shownClasses = ['opacity-100', 'translate-y-0'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');

  function show(el){
    el.classList.remove.apply(el.classList, hiddenClasses);
    el.classList.add.apply(el.classList, shownClasses);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(show);
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function(el, i){ el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });
})();

/* Cambio de idioma. Guarda el texto español la primera vez y alterna. */
(function(){
  var btn = document.getElementById('langBtn');
  var lang = 'es';
  var nodes = document.querySelectorAll('[data-en]');
  nodes.forEach(function(n){ n.setAttribute('data-es', n.innerHTML); });

  btn.addEventListener('click', function(){
    lang = (lang === 'es') ? 'en' : 'es';
    nodes.forEach(function(n){ n.innerHTML = n.getAttribute('data-' + lang); });
    document.documentElement.lang = lang;
    btn.textContent = (lang === 'es') ? 'EN' : 'ES';
  });
})();
