function navigateTo(page) {
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('#' + page + '-page').classList.remove('hidden');
    if (page !== 'gallery') {
        document.querySelector('#theme-title').textContent = getThemeTitle(page);
        document.querySelector('#activities-list').innerHTML = getActivitiesHTML(page);
    } else {
        loadGallery();
    }
}

function navigateBack() {
    document.querySelector('.main-page').classList.remove('hidden');
    document.querySelector('#theme-page').classList.add('hidden');
    document.querySelector('#gallery-page').classList.add('hidden');
}

function getThemeTitle(theme) {
    switch (theme) {
        case 'steam':
            return 'STEAM və İnnovasiya';
        case 'experiment':
            return 'Eksperiment və Tədqiqat';
        case 'arts':
            return 'İncəsənət və Yaradıcılıq';
        case 'heritage':
            return 'Mədəni İrs və Səyahət';
        default:
            return '';
    }
}

function getActivitiesHTML(theme) {
    const activities = {
        steam: [
            'Günəş saatı qurun',
            'Hidravlik ekskavator yaradın'
        ],
        experiment: [
            'Sfinksin altında gizli mesajı tapın',
            'Almanı mumiyalayın',
            'Papirus hazırlayın'
        ],
        arts: [
            'Sfinksi rəngləyin',
            'Mumiya üçün qutu yaradın',
            'Kağızdan gəmi düzəldin',
            'Piramida modeli yaradın'
        ],
        heritage: [
            'Sfinksi araşdırın',
            'Misirə virtual səyahət edin',
            'Nil çayı haqqında məlumat əldə edin'
        ]
    };

    return activities[theme].map(activity => `
        <div class="activity-box">
            <h2>${activity}</h2>
            <button onclick="startTimer(this)">Başla</button>
            <button onclick="stopTimer(this)">Bitir</button>
            <div class="timer">00:00:00</div>
            <input type="file" onchange="uploadFile(event, '${activity}')">
            <button onclick="finishActivity('${theme}', '${activity}', this)">Tamamla</button>
        </div>
    `).join('');
}

let timerInterval;

function startTimer(button) {
    const timerElement = button.nextElementSibling.nextElementSibling;
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = new Date(seconds * 1000).toISOString().substr(11, 8);
    }, 1000);
}

function stopTimer(button) {
    clearInterval(timerInterval);
}

function uploadFile(event, activity) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        google.script.run.withSuccessHandler(url => {
            alert('File uploaded successfully: ' + url);
        }).uploadFileToDrive(base64Data, file.name);
    };
    reader.readAsDataURL(file);
}

function finishActivity(theme, activity, button) {
    const timerElement = button.previousElementSibling.previousElementSibling;
    const timeSpent = timerElement.textContent;
    const ixtriaciKodu = prompt('İxtiraçı kodunu daxil edin:');
    google.script.run.logActivity(theme, activity, timeSpent, ixtriaciKodu);
}
