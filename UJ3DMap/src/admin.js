import { getCurrentSession, signIn, signOut } from './utils/auth.js';

export async function initAdminPanel() {
  const adminBtn = document.getElementById('nav-admin');
  const overlay = document.getElementById('admin-overlay');
  const loginForm = document.getElementById('admin-login-form');
  const dashboard = document.getElementById('admin-dashboard');
  const closeBtn = document.getElementById('close-admin');
  const logoutBtn = document.getElementById('admin-logout');

  if (!adminBtn || !overlay) return;

  adminBtn.addEventListener('click', async () => {
    overlay.style.display = 'flex';
    
    const { user, role } = await getCurrentSession();
    
    if (!user) {
      loginForm.style.display = 'flex';
      dashboard.style.display = 'none';
    } else if (role === 'admin') {
      loginForm.style.display = 'none';
      dashboard.style.display = 'flex';
    } else {
      alert('Access Denied: You must be an Admin to view this dashboard.');
      overlay.style.display = 'none';
    }
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  document.getElementById('login-submit').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    
    const { error } = await signIn(email, pass);
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      // Reload state
      adminBtn.click();
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await signOut();
    overlay.style.display = 'none';
    alert('Logged out successfully.');
  });
}
