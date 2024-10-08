const overlay = document.querySelector('.overlay');
const openButton = document.querySelector('.set-daily'); // Your button to open modal
const closeButton = document.querySelector('.close'); // The close button in the modal

// Show modal when "Set Daily Limit" button is clicked
openButton.addEventListener('click', () => {
  overlay.classList.add('show'); // Add 'show' class to display overlay and modal
});

// Hide modal when clicking the close button
closeButton.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent default link behavior
  overlay.classList.remove('show'); // Remove 'show' class to hide overlay and modal
});

// Optionally, hide modal when clicking outside the modal content
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('overlay')) {
    overlay.classList.remove('show');
  }
});
