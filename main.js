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
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      alert('제휴 문의가 성공적으로 전송되었습니다. 확인 후 연락드리겠습니다!');
      partnershipForm.reset();
    } else {
      alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  } catch (error) {
    alert('네트워크 오류가 발생했습니다.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Teachable Machine Integration with File Upload
const URL = "https://teachablemachine.withgoogle.com/models/tdrEBMMYA/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('image-preview');
    const uploadLabel = document.querySelector('.upload-label');
    const reader = new FileReader();

    uploadLabel.textContent = '분석 중...';
    
    reader.onload = async function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        
        await loadModel();
        await predict(preview);
        
        uploadLabel.textContent = '사진 변경하기';
    };
    
    reader.readAsDataURL(file);
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const resultWrapper = document.createElement("div");
        resultWrapper.className = "result-bar-wrapper";
        resultWrapper.innerHTML = `
            <div class="result-label">${className}</div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${probability}%"></div>
            </div>
            <div class="result-percent">${probability}%</div>
        `;
        labelContainer.appendChild(resultWrapper);
    }
}

window.handleFileUpload = handleFileUpload;