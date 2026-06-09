export function initSidebar() {
  const toggleThemeBtn = document.getElementById('toggle-theme');
  
  // Theme Toggle Logic
  // Check system preference or saved preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
    toggleThemeBtn.textContent = 'Light Mode';
  }

  toggleThemeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    toggleThemeBtn.textContent = isDark ? 'Light Mode' : 'Night Mode';
    if(window.appState) window.appState.theme = isDark ? 'dark' : 'light';
  });

  // Navigation Logic (Mock)
  document.getElementById('nav-map').addEventListener('click', () => {
    console.log('Switch to Map View');
  });
  
  document.getElementById('nav-gallery').addEventListener('click', () => {
    console.log('Switch to Video Gallery');
    alert('Video Gallery - Coming in Phase 4');
  });

  document.getElementById('nav-admin').addEventListener('click', () => {
    console.log('Switch to Admin');
    alert('Admin Dashboard - Coming in Phase 3');
  });
}
