document.addEventListener('DOMContentLoaded', () => {
    const APP_DATA_KEY = 'dashboardData_v2'; // Use a consistent key
    let dashboardData;

    // --- 1. Load data from localStorage or create new ---
    function loadData() {
        const savedData = localStorage.getItem(APP_DATA_KEY);
        if (savedData) {
            dashboardData = JSON.parse(savedData);
        } else {
            // If no data exists, create a fresh structure
            dashboardData = {
                status: {
                    'd-soon': 0, 'yuhyo': 0, 'chimrye': 0, 'chulseok': 0,
                    'preaching': 0, 'elka': 0, 'saesungdo': 0
                },
                missions: Array.from({ length: 16 }, (_, i) => ({
                    id: `mission-${i + 1}`,
                    title: `미션${i + 1}`,
                    progress: 0,
                    goal: 10 
                }))
            };
        }
    }

    // --- 2. Populate the form with loaded data ---
    function populateForm() {
        // Populate status and education fields
        for (const id in dashboardData.status) {
            const input = document.getElementById(id);
            if (input) {
                input.value = dashboardData.status[id] || 0;
            }
        }

        // Populate mission progress fields
        const missionList = document.getElementById('mission-edit-list');
        missionList.innerHTML = '';
        dashboardData.missions.forEach(mission => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <label for="${mission.id}">${mission.title}</label>
                <input type="number" id="${mission.id}" value="${mission.progress}" min="0" data-goal="${mission.goal}">
            `;
            missionList.appendChild(listItem);
        });
    }

    // --- 3. Handle form submission ---
    function handleSave(event) {
        event.preventDefault();

        // Save status and education data
        for (const id in dashboardData.status) {
            const input = document.getElementById(id);
            if (input) {
                dashboardData.status[id] = parseInt(input.value) || 0;
            }
        }

        // Save mission progress data
        dashboardData.missions.forEach(mission => {
            const input = document.getElementById(mission.id);
            if (input) {
                mission.progress = parseInt(input.value) || 0;
            }
        });

        // Save the entire updated object to localStorage
        localStorage.setItem(APP_DATA_KEY, JSON.stringify(dashboardData));
        alert('데이터가 저장되었습니다.');
        window.location.href = 'index.html'; // Go back to the main dashboard
    }

    // --- Initialization ---
    loadData();
    populateForm();
    document.getElementById('edit-form').addEventListener('submit', handleSave);
});
