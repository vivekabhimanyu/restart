function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
    closeAllDropdowns();
    closeAllSubmenus();
  }
  
  function closeSidebar() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    closeAllDropdowns();
    closeAllSubmenus();
  }
  
  function toggleDropdown(dropdownId) {
    closeAllDropdowns();
    closeAllSubmenus();
    var dropdown = document.getElementById(dropdownId);
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }
  
  function showSubmenu(submenuId) {
    closeAllSubmenus();
    var submenu = document.getElementById(submenuId);
    if (submenu.style.display === "block") {
      submenu.style.display = "none";
    } else {
      submenu.style.display = "block";
    }
  }
  
  function closeAllDropdowns() {
    var dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(function (dropdown) {
      dropdown.style.display = "none";
    });
  }
  
  function closeAllSubmenus() {
    var submenus = document.querySelectorAll(".submenu");
    submenus.forEach(function (submenu) {
      submenu.style.display = "none";
    });
  }
  
  function closeAllMenus() {
    closeSidebar();
    closeAllDropdowns();
    closeAllSubmenus();
  }
  
  // Event listener for outside clicks
  document.addEventListener("click", function (event) {
    var sidebar = document.getElementById("sidebar");
    var isClickInsideSidebar = sidebar.contains(event.target);
    var isClickOnMenuIcon = event.target.closest(".menu-icon");
    var isClickInsideDropdown = event.target.closest(".dropdown");
    var isClickInsideSubmenu = event.target.closest(".submenu");
  
    // Close menus if clicked outside of sidebar, dropdowns, or submenus
    if (!isClickInsideSidebar && !isClickOnMenuIcon && !isClickInsideDropdown && !isClickInsideSubmenu) {
      closeAllMenus();
    }
    if (overlay && event.target === overlay) {
      closeAllMenus();
    }
  });
  function home(){
    console.log("button clicked");
  }
  document.addEventListener('DOMContentLoaded', function () {
    // Your JavaScript code here
    function toggleDropdown(dropdownId) {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) { // Ensure the dropdown element exists before trying to manipulate it
        if (dropdown.style.display === "none" || !dropdown.style.display) {
          dropdown.style.display = "block";  // Show the dropdown
        } else {
          dropdown.style.display = "none";   // Hide the dropdown
        }
      }
    }
  });
function access(){
    window.location.href = "/restart/access.html";
  }
