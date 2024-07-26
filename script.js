function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', function() {
    const startButtons = document.querySelectorAll('.start-btn');
    const finishButtons = document.querySelectorAll('.finish-btn');
    const uploadButtons = document.querySelectorAll('.upload-btn');
    const timers = document.querySelectorAll('.timer');

    startButtons.forEach((button, index) => {
        const activityId = button.closest('.activity-box').getAttribute('data-activity-id');
        if (localStorage.getItem(`${activityId}_started`)) {
            button.disabled = true;
        }
        button.addEventListener('click', () => startTimer(timers[index], activityId));
    });

    finishButtons.forEach((button, index) => {
        const activityId = button.closest('.activity-box').getAttribute('data-activity-id');
        button.addEventListener('click', () => stopTimer(timers[index], activityId));
    });

    uploadButtons.forEach((button, index) => {
        const activityId = button.closest('.activity-box').getAttribute('data-activity-id');
        if (localStorage.getItem(`${activityId}_uploaded`)) {
            button.disabled = true;
        }
        button.addEventListener('click', () => uploadFile(index, activityId));
    });
});

let interval;
let startTime;

function startTimer(timerElement, activityId) {
    startTime = Date.now();
    localStorage.setItem(`${activityId}_started`, true);
    interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timerElement.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer(timerElement, activityId) {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    const formattedTime = formatTime(elapsedTime);
    timerElement.textContent = formattedTime;
    const ixtiraCode = prompt("İxtiraçı kodunu daxil edin:");
    if (ixtiraCode) {
        logActivity(timerElement.closest('.activity-box'), formattedTime, ixtiraCode, activityId);
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function logActivity(activityBox, timeSpent, ixtiraCode, activityId) {
    const theme = document.querySelector('header h1').textContent;
    const activity = activityBox.querySelector('h2').textContent;
    const data = {
        theme: theme,
        activity: activity,
        timeSpent: timeSpent,
        ixtiraCode: ixtiraCode
    };
    fetch('https://script.google.com/macros/s/AKfycby3oe21E18BiocCPdJGR-UxTbuLRZ4N82X-48DJT6cCStL9aoftmJk_jcdG3HvbIliP/exec', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
}

function uploadFile(index, activityId) {
    const fileInput = document.querySelectorAll('.upload')[index];
    const file = fileInput.files[0];
    if (file) {
        const ixtiraCode = prompt("İxtiraçı kodunu daxil edin:");
        if (ixtiraCode) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64 = reader.result.split(',')[1];
                const data = {
                    fileName: file.name,
                    mimeType: file.type,
                    base64: base64,
                    ixtiraCode: ixtiraCode
                };
                fetch('https://script.google.com/macros/s/AKfycby3oe21E18BiocCPdJGR-UxTbuLRZ4N82X-48DJT6cCStL9aoftmJk_jcdG3HvbIliP/exec', {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    alert('File uploaded successfully: ' + result.fileUrl);
                    localStorage.setItem(`${activityId}_uploaded`, true);
                    document.querySelectorAll('.upload-btn')[index].disabled = true;
                })
                .catch(error => console.error('Error:', error));
            };
            reader.readAsDataURL(file);
        }
    }
}
