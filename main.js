const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const partnershipForm = document.getElementById('partnership-form');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  themeToggle.textContent = 'Switch to Light Mode';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    body.removeAttribute('data-theme');
    themeToggle.textContent = 'Switch to Dark Mode';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Switch to Light Mode';
    localStorage.setItem('theme', 'dark');
  }
});

// Form Submission Handling
partnershipForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(partnershipForm);
  const data = Object.fromEntries(formData.entries());
  
  console.log('Partnership Inquiry Data:', data);
  
  // Simple UI Feedback
  alert('제휴 문의가 접수되었습니다. 감사합니다!');
  partnershipForm.reset();
});