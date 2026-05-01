/**
 * EcoPulse - Smart Waste Management System
 * Core Logic, Authentication, and Portal View Routing
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Application State Management
    const state = {
        user: null,
        role: null,
        bins: {
            wet: { level: 75, threshold: 80 },
            dry: { level: 40, threshold: 85 },
            recyclable: { level: 60, threshold: 80 },
            hazardous: { level: 15, threshold: 90 }
        },
        reports: [],
        announcements: [
            { id: 1, text: 'Collection in North District might be delayed due to heavy rain.' }
        ]
    };

    // 3. DOM Elements
    const roleCards = document.querySelectorAll('.role-card');
    const loginModal = document.getElementById('login-modal');
    const modalRoleTitle = document.getElementById('modal-role-title');
    const usernameInput = document.getElementById('username-input');
    const confirmLoginBtn = document.getElementById('confirm-login');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const displayName = document.getElementById('display-name');

    // Views
    const landingHero = document.getElementById('landing-hero');
    const loginView = document.getElementById('login-view');
    const officialView = document.getElementById('official-view');
    const workerView = document.getElementById('worker-view');
    const citizenView = document.getElementById('citizen-view');

    // Citizen elements
    const reportIssueCard = document.getElementById('report-issue-card');
    const reportModal = document.getElementById('report-modal');
    const submitReportBtn = document.getElementById('submit-report');
    const cancelReportBtn = document.getElementById('cancel-report');

    // 4. Authentication Logic
    roleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Find the closest role-card element if a button or div inside is clicked
            const targetCard = e.target.closest('.role-card');
            if (!targetCard) return;

            state.role = targetCard.getAttribute('data-role');

            // Show modal
            if (loginModal) {
                loginModal.classList.remove('hidden');
                modalRoleTitle.textContent = `Login as ${state.role.charAt(0).toUpperCase() + state.role.slice(1)}`;
                if (usernameInput) usernameInput.focus();
            }
        });
    });

    if (confirmLoginBtn) {
        confirmLoginBtn.addEventListener('click', () => {
            const name = usernameInput ? usernameInput.value.trim() : '';
            if (!name) {
                alert('Please enter your name to continue.');
                return;
            }

            state.user = name;
            if (loginModal) loginModal.classList.add('hidden');
            if (landingHero) landingHero.classList.add('hidden');
            if (loginView) loginView.classList.add('hidden');

            // Update top navigation bar UI
            if (userInfo) userInfo.classList.remove('hidden');
            if (displayName) displayName.textContent = `${state.user} (${state.role.toUpperCase()})`;

            // Hide/Show portal views based on role
            if (officialView) officialView.classList.add('hidden');
            if (workerView) workerView.classList.add('hidden');
            if (citizenView) citizenView.classList.add('hidden');

            if (state.role === 'official') {
                if (officialView) officialView.classList.remove('hidden');
                initOfficialView();
            } else if (state.role === 'worker') {
                if (workerView) workerView.classList.remove('hidden');
                initWorkerView();
            } else if (state.role === 'citizen') {
                if (citizenView) citizenView.classList.remove('hidden');
                const title = document.querySelector('#citizen-view h1');
                if (title) title.textContent = `Welcome, ${state.user}`;
                initCitizenView();
            }
            
            if (window.lucide) window.lucide.createIcons();
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            state.user = null;
            state.role = null;

            if (userInfo) userInfo.classList.add('hidden');
            if (officialView) officialView.classList.add('hidden');
            if (workerView) workerView.classList.add('hidden');
            if (citizenView) citizenView.classList.add('hidden');

            if (landingHero) landingHero.classList.remove('hidden');
            if (loginView) loginView.classList.remove('hidden');

            if (window.lucide) window.lucide.createIcons();
        });
    }

    // 5. Views Initialization Logic
    function initOfficialView() {
        const workerListBody = document.getElementById('worker-list-body');
        if (workerListBody) {
            workerListBody.innerHTML = `
                <tr>
                    <td style="padding: 12px; font-weight: 600;">Mark Spencer</td>
                    <td><span style="color: var(--success);">Active (044)</span></td>
                    <td>16 Bins</td>
                    <td>98%</td>
                    <td><button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="alert('Message sent to worker.')">Message</button></td>
                </tr>
                <tr>
                    <td style="padding: 12px; font-weight: 600;">Jane Doe</td>
                    <td><span style="color: var(--warning);">En-route</span></td>
                    <td>11 Bins</td>
                    <td>89%</td>
                    <td><button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="alert('Message sent to worker.')">Message</button></td>
                </tr>
            `;
        }

        const broadcastBtn = document.getElementById('broadcast-btn');
        if (broadcastBtn) {
            broadcastBtn.onclick = () => {
                const message = prompt("Enter announcement/broadcast message for citizens:");
                if (message) alert("Broadcast sent to all citizens: " + message);
            };
        }

        const replyCitizenBtn = document.getElementById('reply-citizen-btn');
        if (replyCitizenBtn) {
            replyCitizenBtn.onclick = () => {
                alert("Opening pending citizen messages...");
            };
        }

        const notifyWorkersBtn = document.getElementById('notify-workers-btn');
        if (notifyWorkersBtn) {
            notifyWorkersBtn.onclick = () => {
                alert("General notification sent to all workers!");
            };
        }
        
        if (window.lucide) window.lucide.createIcons();
    }

    function initWorkerView() {
        const workerGreeting = document.getElementById('worker-greeting');
        if (workerGreeting) workerGreeting.textContent = `Hello, ${state.user}`;
        const workerGpsLocation = document.getElementById('worker-gps-location');
        if (workerGpsLocation) workerGpsLocation.textContent = 'Main St. - Sector 4 (Coords: 15.3647, 75.1240)';

        const progressBar = document.getElementById('worker-route-progress');
        if (progressBar) progressBar.style.width = '60%';
        
        const refreshGps = document.getElementById('refresh-gps');
        if (refreshGps) {
            refreshGps.onclick = () => {
                alert('GPS tracking updated successfully.');
            };
        }
    }

    function initCitizenView() {
        if (reportIssueCard) {
            reportIssueCard.onclick = () => {
                if (reportModal) reportModal.classList.remove('hidden');
            };
        }

        if (cancelReportBtn) {
            cancelReportBtn.onclick = () => {
                if (reportModal) reportModal.classList.add('hidden');
            };
        }

        if (submitReportBtn) {
            submitReportBtn.onclick = () => {
                const issueType = document.getElementById('issue-type')?.value || 'Overflowing Bin';
                const location = document.getElementById('issue-location')?.value || 'Unspecified Sector';

                state.reports.push({ id: Date.now(), type: issueType, location, time: 'Just now' });
                alert('Report submitted to command center successfully!');
                
                // Reset Fields
                if (reportModal) reportModal.classList.add('hidden');
                const issueLocationInput = document.getElementById('issue-location');
                if (issueLocationInput) issueLocationInput.value = '';
                
                updateOfficialReports();
            };
        }
        
        const sendOfficialMessage = document.getElementById('send-official-message');
        if (sendOfficialMessage) {
            sendOfficialMessage.onclick = () => {
                const msgInput = document.getElementById('citizen-message-input');
                if (msgInput && msgInput.value.trim() !== '') {
                    alert('Message sent to city administrators!');
                    msgInput.value = '';
                }
            };
        }
    }

    function updateOfficialReports() {
        const reportsList = document.getElementById('citizen-reports-list');
        if (!reportsList) return;

        reportsList.innerHTML = '';
        state.reports.forEach(report => {
            const card = document.createElement('div');
            card.className = 'glass';
            card.style.padding = '12px';
            card.style.marginBottom = '8px';
            card.innerHTML = `<strong>${report.type}</strong><br><small style="color: var(--text-muted);">${report.location}</small>`;
            reportsList.appendChild(card);
        });
    }
});
