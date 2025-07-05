// Collapsible Navigation Menu
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      // Change hamburger icon when menu is open
      if (navMenu.classList.contains("active")) {
        navToggle.textContent = "✕";
        navToggle.setAttribute("aria-expanded", "true");
      } else {
        navToggle.textContent = "☰";
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when clicking on a link (for better UX)
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        navToggle.textContent = "☰";
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInsideNav =
        navToggle.contains(event.target) ||
        navMenu.contains(event.target);

      if (
        !isClickInsideNav &&
        navMenu.classList.contains("active")
      ) {
        navMenu.classList.remove("active");
        navToggle.textContent = "☰";
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});
