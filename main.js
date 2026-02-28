document.addEventListener('DOMContentLoaded', () => {
    const APP_DATA_KEY = 'dashboardData_v2';
    let dashboardData;

    // 1. 데이터 구조
    function getInitialData() {
        return {
            status: { 'd-soon': 0, 'yuhyo': 0, 'chimrye': 0, 'chulseok': 0, 'preaching': 0, 'elka': 0, 'saesungdo': 0 },
            cumulativeStatus: { 'd-soon': 0, 'yuhyo': 0, 'chimrye': 0, 'chulseok': 0 },
            missions: Array.from({ length: 16 }, (_, i) => ({ id: `mission-${i + 1}`, title: `미션 ${i + 1}`, progress: 0, goal: 10 })),
            cumulativeScore: 0
        };
    }

    // 2. 데이터 불러오기
    function loadData() {
        const savedDataString = localStorage.getItem(APP_DATA_KEY);
        if (savedDataString) {
            try {
                const savedData = JSON.parse(savedDataString);
                if (savedData && savedData.missions && savedData.missions.length === 16) {
                    dashboardData = savedData;
                } else { throw new Error("Saved data is corrupted."); }
            } catch (error) {
                dashboardData = getInitialData();
            }
        } else {
            dashboardData = getInitialData();
        }
    }

    // 3. 데이터 저장
    function saveData() {
        localStorage.setItem(APP_DATA_KEY, JSON.stringify(dashboardData));
    }

    // 4. 화면 렌더링 함수들 (변경 없음)
    function renderAll() {
        renderStatus();
        renderCumulativeStatus();
        renderCumulativeScore();
        renderBingo();
        renderMissions();
    }
    function renderStatus() { Object.keys(dashboardData.status).forEach(id => { const el = document.getElementById(id); if (el) el.textContent = `${dashboardData.status[id] || 0}명`; }); }
    function renderCumulativeStatus() { Object.keys(dashboardData.cumulativeStatus).forEach(key => { const el = document.getElementById(`cumulative-${key}`); if(el) el.textContent = `${dashboardData.cumulativeStatus[key] || 0}명`; }); }
    function renderCumulativeScore() { const el = document.getElementById('cumulative-score'); if (el) el.textContent = dashboardData.cumulativeScore || 0; }
    function renderBingo() { const bingoGrid = document.querySelector('.bingo-grid'); if (!bingoGrid) return; bingoGrid.innerHTML = ''; dashboardData.missions.forEach((mission, i) => { const cell = document.createElement('div'); cell.classList.add('bingo-cell'); cell.textContent = mission ? mission.title : `미션 ${i + 1}`; if (mission && mission.progress >= mission.goal) { cell.style.backgroundColor = '#ff69b4'; cell.style.color = 'white'; } bingoGrid.appendChild(cell); }); }
    function renderMissions() { const missionList = document.getElementById('mission-list'); if (!missionList) return; missionList.innerHTML = ''; dashboardData.missions.forEach(mission => { const listItem = document.createElement('li'); const progressPct = mission.goal > 0 ? (mission.progress / mission.goal) * 100 : 0; listItem.innerHTML = `<div class="mission-details"><span class="mission-title">${mission.title}</span><span class="mission-progress-text">달성률 <span>${mission.progress}명</span></span></div><div class="progress-bar-container"><div class="progress-bar" style="width: ${progressPct}%"></div></div>`; missionList.appendChild(listItem); }); }

    // 5. 초기화 기능
    function handleReset() {
        // 진단을 위해 확인창을 잠시 제거하고, 성공 경고창을 먼저 띄웁니다.
        alert('성공: handleReset 함수가 실행되었습니다!');
        dashboardData = getInitialData();
        saveData();
        renderAll();
        alert('모든 데이터가 초기화되었습니다.');
    }

    // --- 기본 로직 실행 ---
    loadData();
    renderAll();

    // --- 최후의 진단 코드 ---
    // 기존의 버튼 연결 코드를 모두 삭제하고 아래 코드로 대체합니다.
    document.body.addEventListener('click', function(event) {
        const target = event.target;
        const info = `[클릭 진단]
태그: ${target.tagName}
ID: ${target.id}
클래스: ${target.className}`;
        
        alert(info);

        // 만약 진단 결과 클릭된 것의 ID가 'reset-button'이 맞다면, 초기화 함수를 실행!
        if (target.id === 'reset-button') {
            handleReset();
        }
    }, true);
});
