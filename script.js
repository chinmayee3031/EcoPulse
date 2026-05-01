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
            loginModal.classList.remove('hidden');
            modalRoleTitle.textContent = `Login as ${state.role.charAt(0).toUpperCase() + state.role.slice(1)}`;
            usernameInput.focus();
        });
    });

    confirmLoginBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (!name) {
            alert('Please enter your name to continue.');
            return;
        }

        state.user = name;
        loginModal.classList.add('hidden');
        landingHero.classList.add('hidden');
        loginView.classList.add('hidden');

        // Update top navigation bar UI
        userInfo.classList.remove('hidden');
        displayName.textContent = `${state.user} (${state.role.toUpperCase()})`;

        // Hide/Show portal views based on role
        officialView.classList.add('hidden');
        workerView.classList.add('hidden');
        citizenView.classList.add('hidden');

        if (state.role === 'official') {
            officialView.classList.remove('hidden');
            initOfficialView();
        } else if (state.role === 'worker') {
            workerView.classList.remove('hidden');
            initWorkerView();
        } else if (state.role === 'citizen') {
            citizenView.classList.remove('hidden');
            document.querySelector('#citizen-view h1').textContent = `Welcome, ${state.user}`;
            initCitizenView();
        }
        
        if (window.lucide) window.lucide.createIcons();
    });

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        state.user = null;
        state.role = null;

        userInfo.classList.add('hidden');
        officialView.classList.add('hidden');
        workerView.classList.add('hidden');
        citizenView.classList.add('hidden');

        landingHero.classList.remove('hidden');
        loginView.classList.remove('hidden');

        if (window.lucide) window.lucide.createIcons();
    });

    // 5. Views Initialization Logic
    function initOfficialView() {
        const workerListBody = document.getElementById('worker-list-body');
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

        document.getElementById('broadcast-btn').onclick = () => {
            const message = prompt("Enter announcement/broadcast message for citizens:");
            if (message) alert("Broadcast sent to all citizens: " + message);
        };
        
        document.getElementById('reply-citizen-btn').onclick = () => {
            alert("Opening pending citizen messages...");
        };

        document.getElementById('notify-workers-btn').onclick = () => {
            alert("General notification sent to all workers!");
        };
        
        if (window.lucide) window.lucide.createIcons();
    }

    function initWorkerView() {
        document.getElementById('worker-greeting').textContent = `Hello, ${state.user}`;
        document.getElementById('worker-gps-location').textContent = 'Main St. - Sector 4 (Coords: 15.3647, 75.1240)';

        // Simulate progress bar
        const progressBar = document.getElementById('worker-route-progress');
        progressBar.style.width = '60%';
        
        document.getElementById('refresh-gps').onclick = () => {
            alert('GPS tracking updated successfully.');
        };
    }

    function initCitizenView() {
        reportIssueCard.onclick = () => {
            reportModal.classList.remove('hidden');
        };

        cancelReportBtn.onclick = () => {
            reportModal.classList.add('hidden');
        };

        submitReportBtn.onclick = () => {
            const issueType = document.getElementById('issue-type').value;
            const location = document.getElementById('issue-location').value || 'Unspecified Sector';

            state.reports.push({ id: Date.now(), type: issueType, location, time: 'Just now' });
            alert('Report submitted to command center successfully!');
            
            // Close and reset
            reportModal.classList.add('hidden');
            document.getElementById('issue-location').value = '';
            
            updateOfficialReports();
        };
        
        document.getElementById('send-official-message').onclick = () => {
            const msgInput = document.getElementById('citizen-message-input');
            if(msgInput.value.trim() !== '') {
                alert('Message sent to city administrators!');
                msgInput.value = '';
            }
        };
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
