function navigateTo(theme) {
    window.location.href = `${theme}.html`;
}

document.addEventListener('DOMContentLoaded', function() {
    const startButtons = document.querySelectorAll('.start-btn');
    const finishButtons = document.querySelectorAll('.finish-btn');
    const timers = document.querySelectorAll('.timer');
    
    startButtons.forEach((button, index) => {
        button.addEventListener('click', () => startTimer(timers[index]));
    });
    
    finishButtons.forEach((button, index) => {
        button.addEventListener('click', () => stopTimer(timers[index]));
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

function stopTimer(timerElement) {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    const formattedTime = formatTime(elapsedTime);
    timerElement.textContent = formattedTime;
    alert(`Time spent: ${formattedTime}`);
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
