function navigateTo(page) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(`${page}-page`).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    const startButtons = document.querySelectorAll('.start-btn');
    const finishButtons = document.querySelectorAll('.finish-btn');
    const uploadInputs = document.querySelectorAll('.upload');
    const timers = document.querySelectorAll('.timer');
    
    startButtons.forEach((button, index) => {
        button.addEventListener('click', () => startTimer(timers[index]));
    });
    
    finishButtons.forEach((button, index) => {
        button.addEventListener('click', () => stopTimer(timers[index], uploadInputs[index], index));
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

function stopTimer(timerElement, uploadInput, activityIndex) {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    const formattedTime = formatTime(elapsedTime);
    timerElement.textContent = formattedTime;

    const ixtiraciKodu = prompt('İxtiraçı kodunu daxil edin:');
    if (ixtiraciKodu) {
        const theme = document.querySelector('h1').textContent;
        const activity = document.querySelectorAll('.activity-box h2')[activityIndex].textContent;

        uploadFile(uploadInput.files[0], theme, activity, formattedTime, ixtiraciKodu);
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

function uploadFile(file, theme, activity, timeSpent, ixtiraciKodu) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = {
            base64: event.target.result.split(',')[1],
            mimeType: file.type,
            fileName: file.name,
            theme: theme,
            activity: activity,
            timeSpent: timeSpent,
            ixtiraciKodu: ixtiraciKodu
        };
        
        google.script.run
            .withSuccessHandler(fileUrl => {
                alert(`File uploaded successfully: ${fileUrl}`);
            })
            .uploadFile(data);
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
