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

// Form Submission Handling via AJAX
partnershipForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = partnershipForm.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '보내는 중...';
  submitBtn.disabled = true;

  const formData = new FormData(partnershipForm);
  
  try {
    const response = await fetch(partnershipForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      alert('제휴 문의가 성공적으로 전송되었습니다. 확인 후 연락드리겠습니다!');
      partnershipForm.reset();
    } else {
      const data = await response.json();
      if (data.errors) {
        alert(data.errors.map(error => error.message).join(", "));
      } else {
        alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  } catch (error) {
    alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});