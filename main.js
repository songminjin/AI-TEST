document.addEventListener('DOMContentLoaded', () => {

    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'edit.html';
      });
    }

    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            localStorage.removeItem('festivalData');
            window.location.reload();
        }
    });

    const initialData = {
        activityStatus: { today: { simple: 0, valid: 0, baptism: 0, attendance: 0, online: 0 }, total: { simple: 0, valid: 0, baptism: 0, attendance: 0, online: 0 } },
        educationStatus: { today: { preaching: 0, elca: 0, newBeliever: 0, onlineEdu: 0 }, total: { preaching: 0, elca: 0, newBeliever: 0, onlineEdu: 0 } },
        missions: Array.from({ length: 16 }, (_, i) => ({ id: i, title: `미션 내용`, current: 0, goal: 10 })),
        bingoMissions: Array.from({ length: 16 }, (_, i) => `미션${i + 1}`),
        bingoCompleted: Array(16).fill(false),
        letterCount: 0
    };

    let data = JSON.parse(localStorage.getItem('festivalData')) || JSON.parse(JSON.stringify(initialData));
    
    if (!data.educationStatus.total) {
        data.educationStatus.total = JSON.parse(JSON.stringify(initialData.educationStatus.total));
    }
    if (data.missions.length !== 16) {
        data.missions = initialData.missions;
    }

    function renderDashboard() {
        const mainPageElements = document.getElementById('total-score');
        if (!mainPageElements) return;

        for (const type of ['today', 'total']) {
            for (const key in data.activityStatus[type]) {
                const el = document.querySelector(`#${type}-activity-status [data-key="${key}"]`);
                if (el) el.textContent = `${data.activityStatus[type][key] || 0}명`;
            }
        }

        for (const key in data.educationStatus.total) {
            const el = document.querySelector(`#total-education-status [data-key="${key}"]`);
            if (el) el.textContent = `${data.educationStatus.total[key] || 0}명`;
        }

        const bingoGrid = document.getElementById('bingo-grid');
        if(bingoGrid) {
            bingoGrid.innerHTML = '';
            data.bingoMissions.forEach((title, index) => {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                cell.textContent = title;
                if (data.bingoCompleted[index]) {
                    cell.classList.add('completed');
                }
                bingoGrid.appendChild(cell);
            });
        }
        
        const letterCountEl = document.getElementById('letter-count');
        if (letterCountEl) letterCountEl.textContent = data.letterCount;

        const missionList = document.getElementById('mission-list');
        if (missionList) {
            missionList.innerHTML = '';
            data.missions.forEach(mission => {
                const item = document.createElement('li');
                item.classList.add('mission-item');
                const progress = mission.goal > 0 ? (mission.current / mission.goal) * 100 : 0;
                item.innerHTML = `
                    <div class="title">${mission.title}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%;"></div>
                    </div>
                    <div class="progress-text">${mission.current} / ${mission.goal}</div>
                `;
                if (mission.current >= mission.goal) {
                    item.classList.add('completed');
                }
                missionList.appendChild(item);
            });
        }
        
        calculateAndRenderTotalScore();
    }

    function calculateBingoLines(completed) {
        const lines = [
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
            [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
            [0, 5, 10, 15], [3, 6, 9, 12]
        ];
        return lines.reduce((count, line) => count + (line.every(index => completed[index]) ? 1 : 0), 0);
    }

    function calculateAndRenderTotalScore() {
        let score = 0;
        const activityScores = { simple: 5, valid: 50, baptism: 500, attendance: 1000, online: 5 };
        const educationScores = { preaching: 5, newBeliever: 10, elca: 20, onlineEdu: 0 };

        for (const key in data.activityStatus.total) {
            score += (data.activityStatus.total[key] || 0) * (activityScores[key] || 0);
        }

        for (const key in data.educationStatus.total) {
            score += (data.educationStatus.total[key] || 0) * (educationScores[key] || 0);
        }
        
        score += calculateBingoLines(data.bingoCompleted) * 10;
        score += (data.letterCount || 0) * 2;
        
        // --- BUG FIX: Only add mission score if missions are actually completed ---
        const completedMissions = data.missions.filter(m => m.current >= m.goal).length;
        score += completedMissions * 20;

        const totalScoreEl = document.getElementById('total-score');
        if(totalScoreEl) totalScoreEl.textContent = score;
    }

    renderDashboard();
});