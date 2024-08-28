// scripts.js

document.querySelector('.dropdown-btn').addEventListener('click', function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    const isVisible = dropdownContent.style.display === 'block';
    
    dropdownContent.style.display = isVisible ? 'none' : 'block';
  });
  
  // Close the dropdown menu when clicking outside
  window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-btn')) {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach(dropdown => {
        if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
        }
      });
    }
  });
  