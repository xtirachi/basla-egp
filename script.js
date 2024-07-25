let timers = {};

function startActivity(activityId) {
    if (timers[activityId]) {
        clearInterval(timers[activityId].interval);
    }
    const startTime = new Date();
    timers[activityId] = { startTime: startTime, interval: setInterval(() => {
        const elapsedTime = new Date() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        document.getElementById(`timer-${activityId}`).innerText = `${minutes} dəqiqə`;
    }, 1000) };
}

function completeActivity(activityId) {
    if (timers[activityId]) {
        clearInterval(timers[activityId].interval);
        const elapsedTime = new Date() - timers[activityId].startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        alert(`Fəaliyyət ${minutes} dəqiqə çəkdi.`);
        delete timers[activityId];
    }
}
