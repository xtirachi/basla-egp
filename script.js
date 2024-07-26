function navigateTo(page) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(page).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const startButtons = document.querySelectorAll('.start-btn');
    const finishButtons = document.querySelectorAll('.finish-btn');
    const timers = document.querySelectorAll('.timer');
    const uploadInputs = document.querySelectorAll('.upload');
    
    startButtons.forEach((button, index) => {
        button.addEventListener('click', () => startTimer(timers[index]));
    });
    
    finishButtons.forEach((button, index) => {
        button.addEventListener('click', () => stopTimer(timers[index], index));
    });

    uploadInputs.forEach((input, index) => {
        input.addEventListener('change', (event) => uploadFile(event.target.files[0], index));
    });
});

let interval;
let startTime;

function startTimer(timerElement) {
    startTime = Date.now();
    interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timerElement.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer(timerElement, index) {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    const formattedTime = formatTime(elapsedTime);
    timerElement.textContent = formattedTime;
    const ixitiraCode = prompt("Enter İxtiraçı kodu:");
    const theme = document.querySelector('.page').id.split('-page')[0];
    const activity = timerElement.parentElement.querySelector('h2').innerText;
    logActivity(theme, activity, formattedTime, ixitiraCode);
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

function uploadFile(file, index) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result.split(',')[1];
        const theme = document.querySelector('.page').id.split('-page')[0];
        const activity = document.querySelectorAll('.activity-box h2')[index].innerText;
        google.script.run.withSuccessHandler(fileUrl => {
            alert(`File uploaded: ${fileUrl}`);
        }).uploadFile({
            base64: base64,
            mimeType: file.type,
            fileName: file.name,
            theme: theme,
            activity: activity
        });
    };
    reader.readAsDataURL(file);
}

function logActivity(theme, activity, timeSpent, ixitiraCode) {
    google.script.run.logActivity({
        theme: theme,
        activity: activity,
        timeSpent: timeSpent,
        ixitiraCode: ixitiraCode
    });
}
