/* Sparkle Aurora — resource preview dataset; replace with real API for production */
(() => {
  'use strict';
  const resources = [
    { name: 'Figma', url: 'https://www.figma.com/', category: '设计创作', description: '在浏览器里协作设计，从想法到原型一气呵成。', emblem: 'F', hue: '#ba8ce9', mark: '#332445', tags: ['UI', 'UX', '界面', '原型'] },
    { name: 'Visual Studio Code', url: 'https://code.visualstudio.com/', category: '开发工具', description: '轻盈而强大的跨平台代码编辑器。', emblem: '{ }', hue: '#8dccf8', mark: '#1b405e', tags: ['代码', '编辑器', 'VSCode'] },
    { name: 'Obsidian', url: 'https://obsidian.md/', category: '效率办公', description: '连接笔记与知识，让每个念头相互启发。', emblem: '◇', hue: '#d6b2ff', mark: '#422958', tags: ['Markdown', '笔记', '知识'] },
    { name: 'GitHub', url: 'https://github.com/', category: '开发工具', description: '托管代码、协作开发，让优秀想法不断生长。', emblem: '⌘', hue: '#ececff', mark: '#373449', tags: ['Git', '代码托管', '开源'] },
    { name: 'Blender', url: 'https://www.blender.org/', category: '设计创作', description: '开放自由的 3D 创作，从建模到动画。', emblem: 'B', hue: '#ffca88', mark: '#594029', tags: ['3D', '动画', '渲染'] },
    { name: 'Docker', url: 'https://www.docker.com/', category: '开发工具', description: '容器化开发与部署，让环境保持一致。', emblem: '▦', hue: '#8acbff', mark: '#224569', tags: ['容器', '部署', 'DevOps'] },
    { name: 'Android Studio', url: 'https://developer.android.com/studio', category: '开发工具', description: '官方 Android IDE，从 Compose 到构建发布。', emblem: 'A', hue: '#8ce6b0', mark: '#204b36', tags: ['Android', 'Kotlin', 'Compose'] },
    { name: 'Cloudflare', url: 'https://www.cloudflare.com/', category: '网络服务', description: '连接、保护并加速你的互联网应用。', emblem: '☁', hue: '#ffc38f', mark: '#62422e', tags: ['CDN', 'DNS', '安全', '网络'] },
    { name: 'VLC', url: 'https://www.videolan.org/vlc/', category: '影音娱乐', description: '免费、开源的跨平台多媒体播放器。', emblem: '▶', hue: '#ffcc89', mark: '#67502b', tags: ['播放器', '音频', '视频'] },
    { name: 'Firefox', url: 'https://www.mozilla.org/firefox/new/', category: '网络服务', description: '关注开放网络与隐私的浏览器。', emblem: '◉', hue: '#ffb4a4', mark: '#613046', tags: ['浏览器', '网络', '隐私'] },
    { name: 'Notion', url: 'https://www.notion.so/', category: '效率办公', description: '把文档、项目与团队协作放在一处。', emblem: 'N', hue: '#f6f5fa', mark: '#3d3c4b', tags: ['项目', '文档', '协作'] },
    { name: 'Penpot', url: 'https://penpot.app/', category: '设计创作', description: '开源设计与原型工具，让协作自由发生。', emblem: 'P', hue: '#c3a5ff', mark: '#403059', tags: ['设计', '原型', '开源'] }
  ];
  const categories = ['全部', '设计创作', '开发工具', '效率办公', '网络服务', '影音娱乐'];
  const $ = (selector) => document.querySelector(selector);
  const tabs = $('#categoryTabs');
  const grid = $('#resourceGrid');
  const count = $('#resourceCount');
  const moreButton = $('#viewMore');
  const favoritesButton = $('#favoritesOnly');
  const dialog = $('#searchDialog');
  const searchInput = $('#globalSearchInput');
  const resultBox = $('#searchResults');
  const root = document.documentElement;
  const STORAGE_FAVORITES = 'sparkle-aurora-favorites-v1';
  const STORAGE_THEME = 'sparkle-liquid-theme-v2';
  let selectedCategory = '全部';
  let favoritesOnly = false;
  let expanded = false;
  let dialogSelected = 0;
  let currentSearchResults = [];
  let toastTimer;

  const safeLoad = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const safeSave = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const favorites = new Set(Array.isArray(safeLoad(STORAGE_FAVORITES, [])) ? safeLoad(STORAGE_FAVORITES, []) : []);
  const loadedTheme = safeLoad(STORAGE_THEME, 'light');
  root.dataset.theme = loadedTheme === 'light' ? 'light' : 'dark';
  const $themeToggle = $('#themeToggle');
  const setThemeLabel = () => $themeToggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? '切换浅色模式' : '切换深色模式');
  setThemeLabel();
  $themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    safeSave(STORAGE_THEME, root.dataset.theme);
    setThemeLabel();
    showToast(root.dataset.theme === 'dark' ? '已切换深色模式' : '已切换浅色模式');
  });

  const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
  const matchesQuery = (item, rawQuery) => {
    const q = rawQuery.trim().toLocaleLowerCase();
    return !q || [item.name, item.description, item.category, item.url, ...item.tags].some(value => value.toLocaleLowerCase().includes(q));
  };
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  function resourceIcon(item) {
    const icon = make('span', 'resource-icon', item.emblem);
    icon.style.color = item.hue;
    icon.style.background = item.mark;
    return icon;
  }
  function toggleFavorite(itemName) {
    if (favorites.has(itemName)) favorites.delete(itemName); else favorites.add(itemName);
    safeSave(STORAGE_FAVORITES, [...favorites]);
    renderResources();
    showToast(favorites.has(itemName) ? `已收藏 ${itemName}` : `已取消收藏 ${itemName}`);
  }
  function resourceCard(item) {
    const article = make('article', 'resource-card');
    const upper = make('div', 'resource-upper');
    const title = make('div', 'resource-title');
    title.append(make('div', 'resource-name', item.name), make('span', 'resource-domain', new URL(item.url).hostname.replace('www.', '')));
    const favorite = make('button', 'favorite-button', favorites.has(item.name) ? '♥' : '♡');
    favorite.type = 'button';
    favorite.setAttribute('aria-label', `${favorites.has(item.name) ? '取消收藏' : '收藏'} ${item.name}`);
    favorite.setAttribute('aria-pressed', String(favorites.has(item.name)));
    favorite.addEventListener('click', () => toggleFavorite(item.name));
    upper.append(resourceIcon(item), title, favorite);
    const desc = make('p', 'resource-desc', item.description);
    const bottom = make('div', 'resource-bottom');
    const anchor = make('a', 'resource-visit');
    anchor.href = item.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', `打开 ${item.name} 官方网站（新标签页）`);
    anchor.append(document.createTextNode('访问官网 '), make('span', '', '↗'));
    bottom.append(make('span', 'resource-category', item.category), anchor);
    article.append(upper, desc, bottom);
    return article;
  }
  function renderTabs() {
    tabs.replaceChildren();
    categories.forEach(category => {
      const button = make('button', 'tab', category);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(category === selectedCategory));
      button.addEventListener('click', () => {
        selectedCategory = category;
        expanded = false;
        renderTabs(); renderResources();
      });
      tabs.append(button);
    });
  }
  function renderResources() {
    const filtered = resources.filter(item => (selectedCategory === '全部' || item.category === selectedCategory) && (!favoritesOnly || favorites.has(item.name)));
    const visible = expanded ? filtered : filtered.slice(0, 6);
    grid.replaceChildren();
    if (!visible.length) {
      const empty = make('div', 'empty-state');
      empty.append(make('b', '', favoritesOnly ? '这里还没有心动的收藏。' : '没有找到匹配的资源。'), make('span', '', favoritesOnly ? '点击资源卡片右上角的 ♡，就能收藏喜欢的工具。' : '换个分类继续探索吧。'));
      grid.append(empty);
    } else visible.forEach(item => grid.append(resourceCard(item)));
    count.textContent = `展示 ${visible.length} / ${filtered.length} 个资源 · 预览示例数据`;
    moreButton.hidden = filtered.length <= 6;
    moreButton.replaceChildren(document.createTextNode(expanded ? '收起资源 ' : '显示更多 '), make('span', '', expanded ? '↑' : '↓'));
    favoritesButton.setAttribute('aria-pressed', String(favoritesOnly));
    favoritesButton.querySelector('span').textContent = favoritesOnly ? '♥' : '♡';
  }
  favoritesButton.addEventListener('click', () => { favoritesOnly = !favoritesOnly; expanded = false; renderResources(); });
  moreButton.addEventListener('click', () => { expanded = !expanded; renderResources(); });
  renderTabs();
  renderResources();

  function openSearch() {
    if (!dialog.open) dialog.showModal();
    searchInput.value = '';
    dialogSelected = 0;
    renderSearch();
    searchInput.focus();
  }
  function closeSearch() { if (dialog.open) dialog.close(); }
  function searchResultButton(item, index) {
    const button = make('button', 'search-result');
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', String(index === dialogSelected));
    const info = make('span');
    info.append(make('strong', '', item.name), make('small', '', `${item.category} · ${item.description}`));
    button.append(resourceIcon(item), info, make('span', '', '↗'));
    button.addEventListener('click', () => window.open(item.url, '_blank', 'noopener,noreferrer'));
    button.addEventListener('mouseenter', () => { dialogSelected = index; updateSelectedSearch(); });
    return button;
  }
  function updateSelectedSearch() {
    resultBox.querySelectorAll('.search-result').forEach((button, index) => button.setAttribute('aria-selected', String(index === dialogSelected)));
  }
  function renderSearch() {
    currentSearchResults = resources.filter(item => matchesQuery(item, searchInput.value)).slice(0, 9);
    resultBox.replaceChildren();
    dialogSelected = 0;
    if (!currentSearchResults.length) {
      const empty = make('div', 'empty-state');
      empty.append(make('b', '', '没有找到相应资源'), make('span', '', '试试更简短的关键词，例如「设计」「代码」。'));
      resultBox.append(empty);
    } else currentSearchResults.forEach((item, index) => resultBox.append(searchResultButton(item, index)));
  }
  $('#openSearch').addEventListener('click', openSearch);
  $('#previewSearch').addEventListener('click', openSearch);
  $('#discoverSearch').addEventListener('click', openSearch);
  $('#closeSearch').addEventListener('click', closeSearch);
  searchInput.addEventListener('input', renderSearch);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); dialog.open ? closeSearch() : openSearch();
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeSearch(); });
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (currentSearchResults.length) dialogSelected = (dialogSelected + (event.key === 'ArrowDown' ? 1 : -1) + currentSearchResults.length) % currentSearchResults.length;
      updateSelectedSearch();
      resultBox.querySelector('[aria-selected="true"]')?.scrollIntoView({block: 'nearest'});
    } else if (event.key === 'Enter' && currentSearchResults[dialogSelected]) {
      event.preventDefault();
      window.open(currentSearchResults[dialogSelected].url, '_blank', 'noopener,noreferrer');
    }
  });

  const menuButton = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  const closeMenu = () => { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '打开导航菜单'); };
  menuButton.addEventListener('click', () => { mobileNav.hidden = !mobileNav.hidden; const open = !mobileNav.hidden; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单'); });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); }, {passive: true});
  $('#year').textContent = String(new Date().getFullYear());

  // Lightweight interactive lens: movement only on pointer-capable devices.
  const heroArt = $('#heroArt');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
    let raf = 0;
    heroArt.addEventListener('pointermove', event => {
      if (raf) return;
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      raf = requestAnimationFrame(() => {
        heroArt.style.setProperty('--lens-x', `${Math.round(x * 42)}px`);
        heroArt.style.setProperty('--lens-y', `${Math.round(y * 35)}px`);
        raf = 0;
      });
    }, {passive: true});
    heroArt.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--lens-x', '0px');
      heroArt.style.setProperty('--lens-y', '0px');
    });
  }
})();
