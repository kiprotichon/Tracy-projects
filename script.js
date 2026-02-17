  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAml9c8wcBQu72ExvGNr0qOqv5S-crEQyA",
    authDomain: "rental-manager-3ed27.firebaseapp.com",
    projectId: "rental-manager-3ed27",
    storageBucket: "rental-manager-3ed27.firebasestorage.app",
    messagingSenderId: "1040764747173",
    appId: "1:1040764747173:web:73071327167a76e9ccfc4c"
  };
// Elements
const loading = document.getElementById('loading');
const loginScreen = document.getElementById('login-screen');
const app = initializeApp(firebaseConfig);
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const logoutBtn = document.getElementById('logout-btn');
const navLinks = document.querySelectorAll('.nav-link');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

// Show/hide loading
function showLoading() { loading.classList.remove('hidden'); }
function hideLoading() { loading.classList.add('hidden'); }

// Show page
function showPage(pageId) {
  document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
  document.getElementById(pageId)?.classList.remove('hidden');

  navLinks.forEach(link => link.classList.remove('bg-blue-700'));
  document.querySelector(`[data-page="${pageId.split('-')[1]}"]`)?.classList.add('bg-blue-700');

  sidebar.classList.remove('open');
}

// Sidebar toggle
toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

// Close sidebar on outside click (mobile)
document.addEventListener('click', e => {
  if (window.innerWidth >= 1024) return;
  if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Nav links
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage('dashboard-page'); // Default, replace with dynamic
  });
});

// Replace the entire login-form listener with this
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    loginError.textContent = "Please enter email and password";
    loginError.classList.remove('hidden');
    return;
  }

  showLoading();
  loginError.classList.add('hidden');

  try {
    console.log("Attempting login with:", email); // ← debug line

    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log("Login success:", userCredential.user.uid);

    hideLoading();
    loginScreen.classList.add('hidden');
    app.classList.remove('hidden');
    showPage('dashboard-page');

  } catch (error) {
    hideLoading();
    
    console.error("Login failed:", error.code, error.message); // ← important debug
    
    let msg = "Login failed. Please try again.";
    
    if (error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password') {
      msg = "Incorrect email or password";
    } else if (error.code === 'auth/too-many-requests') {
      msg = "Too many attempts. Try again later or reset password";
    } else if (error.code.includes('network')) {
      msg = "Network error – check your internet";
    } else {
      msg = error.message || "Unknown error";
    }

    loginError.textContent = msg;
    loginError.classList.remove('hidden');
  }
});
// Logout
logoutBtn.addEventListener('click', () => {
  showLoading();
  auth.signOut().then(() => {
    hideLoading();
    app.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  });
});

// Auth state listener
auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.classList.add('hidden');
    app.classList.remove('hidden');
    showPage('dashboard-page');
  } else {
    app.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  }
});

// Initialize charts (example)
function initCharts() {
  const occupancyCtx = document.getElementById('occupancyChart');
  if (occupancyCtx) {
    new Chart(occupancyCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Occupancy Rate (%)',
          data: [75, 75, 87.5, 87.5, 87.5, 100, 87.5, 87.5, 75, 75],
          fill: false,
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  const rentSummaryCtx = document.getElementById('rentSummaryChart');
  if (rentSummaryCtx) {
    new Chart(rentSummaryCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Expected Rent',
            data: [2400, 2400, 3100, 3100, 3100, 3100, 3100, 3100, 3100, 3100],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: 'Collected Rent',
            data: [2400, 2400, 3100, 3100, 3100, 3100, 2800, 3100, 3100, 2350],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// Call initCharts when dashboard loads
document.addEventListener('DOMContentLoaded', initCharts);
