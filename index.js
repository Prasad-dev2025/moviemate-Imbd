// Store original main content
let originalMainContent = '';

document.addEventListener("DOMContentLoaded", () => {
  const signInLink = document.getElementById("signin-link");
  const mainContent = document.getElementById("main-content");
  const menuDropdown = document.getElementById("menuDropdown");

  // Save original content on page load
  originalMainContent = mainContent.innerHTML;

  // Sign in link handler
  if (signInLink) {
    signInLink.addEventListener("click", (e) => {
      e.preventDefault();
      loadSignIn();
    });
  }

  // Menu dropdown handler
  if (menuDropdown) {
    menuDropdown.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Menu clicked!');
      openMenu();
    });
  }

  // Logo click to return home
  const logo = document.querySelector('.navbar-brand');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      loadHomePage();
    });
  }

  const menuLogo = document.querySelector('.menu-logo');

  if (menuLogo) {
    menuLogo.addEventListener('click', (e) => {
      e.preventDefault();
      goHomeHistory();
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page === 'signin') {
      loadSignIn(false);
    } else {
      loadHomePage(false);
    }
  });

  // Set initial state
  history.replaceState({ page: 'home' }, '', window.location.href);
});

// Menu functions
function openMenu() {
  console.log('Opening menu...');
  const menuOverlay = document.getElementById('menuOverlay');
  if (menuOverlay) {
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
    console.log('Menu opened successfully!');
  } else {
    console.error('Menu overlay not found!');
  }
}

function closeMenu() {
  console.log('Closing menu...');
  const menuOverlay = document.getElementById('menuOverlay');
  if (menuOverlay) {
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    console.log('Menu closed successfully!');
  }
}


function goHomeHistory() {
  closeMenu();
  history.pushState({ page: 'home' }, '', '/');
  loadHomePage(false);
}


function loadSignIn(pushState = true) {
  const mainContent = document.getElementById("main-content");

  fetch("signin-content.html")
    .then(res => res.text())
    .then(html => {
      // Clear main content and apply light background
      mainContent.innerHTML = html;
      mainContent.style.backgroundColor = "#f5f5f5";
      mainContent.style.minHeight = "100vh";

      // Push state to history so back button works
      if (pushState) {
        history.pushState({ page: 'signin' }, '', '#signin');
      }

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    })
    .catch(err => {
      console.error("Fetch error:", err);
      mainContent.innerHTML = `
        <div class="container text-center py-5">
          <h2 class="text-danger">Error loading sign-in page</h2>
          <p>Please try again later.</p>
          <button class="btn btn-warning" onclick="loadHomePage()">Go Back</button>
        </div>
      `;
    });
}

function loadHomePage(pushState = true) {
  const mainContent = document.getElementById("main-content");

  // Restore original content
  mainContent.innerHTML = originalMainContent;

  // Reset background styles
  mainContent.style.backgroundColor = "";
  mainContent.style.minHeight = "";

  // Push state to history
  if (pushState) {
    history.pushState({ page: 'home' }, '', window.location.pathname);
  }

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Reinitialize any carousels or other components
  if (typeof bootstrap !== 'undefined') {
    // Reinitialize Bootstrap carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
      new bootstrap.Carousel(carousel);
    });
  }
}