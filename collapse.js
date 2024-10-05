document.querySelector('.add-meal-btn').addEventListener('click', collapse);
document.querySelector('.add-workout-btn').addEventListener('click', collapse);

function collapse(e) {
  if (
    e.target.parentElement.nextElementSibling.style.height === '0px' ||
    !e.target.parentElement.nextElementSibling.style.height
  ) {
    // Show e.target.parentElement.nextElementSibling, set height to the full e.target.parentElement.nextElementSibling height
    e.target.parentElement.nextElementSibling.style.height =
      e.target.parentElement.nextElementSibling.scrollHeight + 40 + 'px';
    e.target.parentElement.nextElementSibling.classList.add('show'); // Add class to apply padding
  } else {
    // Hide e.target.parentElement.nextElementSibling
    e.target.parentElement.nextElementSibling.style.height = '0px';
    e.target.parentElement.nextElementSibling.classList.remove('show'); // Remove padding
  }
}
