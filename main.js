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

// Teachable Machine Integration
const URL = "https://teachablemachine.withgoogle.com/models/tdrEBMMYA/";
let model, webcam, labelContainer, maxPredictions;

async function initTest() {
    const startBtn = document.querySelector('.start-btn');
    startBtn.textContent = '로딩 중...';
    startBtn.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").innerHTML = '';
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const resultWrapper = document.createElement("div");
        resultWrapper.className = "result-bar-wrapper";
        resultWrapper.innerHTML = `
            <div class="result-label"></div>
            <div class="bar-container">
                <div class="bar-fill" style="width: 0%"></div>
            </div>
            <div class="result-percent">0%</div>
        `;
        labelContainer.appendChild(resultWrapper);
    }
    
    startBtn.style.display = 'none';
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const wrapper = labelContainer.childNodes[i];
        wrapper.querySelector('.result-label').textContent = className;
        wrapper.querySelector('.bar-fill').style.width = probability + "%";
        wrapper.querySelector('.result-percent').textContent = probability + "%";
    }
}

window.initTest = initTest;