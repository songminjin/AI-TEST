document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Initial Data Setup & Local Storage --- 
    const initialData = {
        activityStatus: { today: { simple: 0, valid: 0, baptism: 0, attendance: 0, online: 0 }, total: { simple: 0, valid: 0, baptism: 0, attendance: 0, online: 0 } },
        educationStatus: { today: { preaching: 0, elca: 0, newBeliever: 0, onlineEdu: 0 }, total: { preaching: 0, elca: 0, newBeliever: 0, onlineEdu: 0 } },
        missions: Array.from({ length: 16 }, (_, i) => ({ id: i, title: `미션 ${i + 1}`, current: 0, goal: 10 })),
        bingoMissions: Array.from({ length: 16 }, (_, i) => `미션${i + 1}`),
        bingoCompleted: Array(16).fill(false),
        letterCount: 0
    };

    let data = JSON.parse(localStorage.getItem('festivalData')) || JSON.parse(JSON.stringify(initialData));
    
    if (!data.hasOwnProperty('bingoMissions')) data.bingoMissions = initialData.bingoMissions;
    if (!data.hasOwnProperty('bingoCompleted')) data.bingoCompleted = initialData.bingoCompleted;
    if (!data.hasOwnProperty('letterCount')) data.letterCount = initialData.letterCount;

    const todayInput = {
        activityStatus: { simple: 0, valid: 0, baptism: 0, attendance: 0, online: 0 },
        educationStatus: { preaching: 0, elca: 0, newBeliever: 0, onlineEdu: 0 }
    };

    // --- 2. DOM Element References ---
    const activityListEl = document.getElementById('edit-today-activity');
    const educationListEl = document.getElementById('edit-today-education');
    const missionListEl = document.getElementById('edit-mission-list');

    // --- 3. Rendering Functions ---
    function renderAll() {
        renderStatusEditor(activityListEl, 'activityStatus', { simple: '단순', valid: '유효', baptism: '침례', attendance: '출석', online: '온라인' }, todayInput.activityStatus);
        renderStatusEditor(educationListEl, 'educationStatus', { preaching: '프리칭', elca: '엘카', newBeliever: '새성도', onlineEdu: '온라인' }, todayInput.educationStatus);
        renderMissions();
    }

    function renderStatusEditor(container, category, labels, statusData) {
        container.innerHTML = '';
        for (const key in labels) {
            const value = statusData[key] || 0;
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="label">${labels[key]}</span>
                <div class="controls">
                    <button data-action="decrement" data-category="${category}" data-key="${key}">-</button>
                    <input type="number" value="${value}" readonly data-category="${category}" data-key="${key}">
                    <button data-action="increment" data-category="${category}" data-key="${key}">+</button>
                </div>
            `;
            container.appendChild(li);
        }
    }
    
    // ✨ BUG FIX: Restore the mission rendering function body
    function renderMissions() {
        missionListEl.innerHTML = '';
        data.missions.forEach(mission => {
            const progress = mission.goal > 0 ? (mission.current / mission.goal) * 100 : 0;
            const li = document.createElement('li');
            li.dataset.missionId = mission.id;
            li.innerHTML = `
                <div class="mission-title">${mission.title}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-text-label">달성률</span>
                    <span class="progress-value">${mission.current}명</span>
                </div>
                <div class="controls">
                    <button data-action="decrement" data-mission-id="${mission.id}">-</button>
                    <button data-action="increment" data-mission-id="${mission.id}">+</button>
                </div>
            `;
            missionListEl.appendChild(li);
        });
    }

    // --- 4. Event Handling ---
    // ✨ BUG FIX: Restore the button click handling function body
    function handleControlClick(e) {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const { action, category, key, missionId } = button.dataset;

        if (key) { 
            const statusData = category === 'activityStatus' ? todayInput.activityStatus : todayInput.educationStatus;
            let currentValue = statusData[key] || 0;
            currentValue = action === 'increment' ? currentValue + 1 : Math.max(0, currentValue - 1);
            statusData[key] = currentValue;
            const input = button.parentElement.querySelector('input');
            if(input) input.value = currentValue;

        } else if (missionId) { 
            const mission = data.missions.find(m => m.id == missionId);
            if (!mission) return;
            let currentValue = mission.current;
            currentValue = action === 'increment' ? currentValue + 1 : Math.max(0, currentValue - 1);
            mission.current = currentValue;

            data.bingoCompleted[mission.id] = (mission.goal > 0 && mission.current >= mission.goal);
            
            const missionItemEl = button.closest('li[data-mission-id]');
            if(missionItemEl) {
                const progress = mission.goal > 0 ? (mission.current / mission.goal) * 100 : 0;
                missionItemEl.querySelector('.progress-bar').style.width = `${progress}%`;
                missionItemEl.querySelector('.progress-value').textContent = `${currentValue}명`;
            }
        }
    }

    document.querySelector('main').addEventListener('click', handleControlClick);
    
    // --- 5. Save Logic ---
    document.getElementById('save-btn').addEventListener('click', () => {
        for (const key in todayInput.activityStatus) {
            data.activityStatus.total[key] = (data.activityStatus.total[key] || 0) + (todayInput.activityStatus[key] || 0);
            data.activityStatus.today[key] = todayInput.activityStatus[key] || 0;
        }

        for (const key in todayInput.educationStatus) {
            data.educationStatus.total[key] = (data.educationStatus.total[key] || 0) + (todayInput.educationStatus[key] || 0);
            data.educationStatus.today[key] = todayInput.educationStatus[key] || 0;
        }

        localStorage.setItem('festivalData', JSON.stringify(data));
        alert('저장되었습니다!');
        window.location.href = 'index.html';
    });

    // --- 6. Reset Button Logic ---
    document.getElementById('reset-edit-btn').addEventListener('click', () => {
        if (confirm('오늘 활동 기록을 수정하시겠습니까?\n기존 누적 점수에서 오늘 입력했던 값이 모두 차감되며, 새로 입력할 수 있도록 준비됩니다.')) {
            
            for (const key in data.activityStatus.today) {
                data.activityStatus.total[key] = (data.activityStatus.total[key] || 0) - (data.activityStatus.today[key] || 0);
            }
            for (const key in data.educationStatus.today) {
                data.educationStatus.total[key] = (data.educationStatus.total[key] || 0) - (data.educationStatus.today[key] || 0);
            }

            data.activityStatus.today = { simple: 0, valid: 0, baptism: 0, attendance: 0, online: 0 };
            data.educationStatus.today = { preaching: 0, elca: 0, newBeliever: 0, onlineEdu: 0 };
            
            alert('오늘 활동 기록이 초기화되었습니다. 새로운 값을 입력하고 저장하세요.');
        }
    });

    // --- 7. Initial Render ---
    renderAll();
});