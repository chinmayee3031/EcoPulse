/**
 * EcoTrack | Smart Waste Management System
 * Core Logic & IoT Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // State Management
    const state = {
        bins: {
            wet: { level: 75, threshold: 80 },
            dry: { level: 40, threshold: 85 },
            recyclable: { level: 60, threshold: 80 },
            hazardous: { level: 15, threshold: 90 }
        },
        alerts: [
            { id: 1, type: 'critical', msg: 'Wet Waste Bin #42 is 95% full', time: '2 mins ago' },
            { id: 2, type: 'warning', msg: 'Route B-12 delay due to traffic', time: '15 mins ago' },
            { id: 3, type: 'info', msg: 'Battery low on Smart Bin #108', time: '1 hour ago' }
        ],
        currentView: 'dashboard'
    };

    // --- DOM Elements ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const alertsContainer = document.getElementById('alerts-container');
    const optimizeBtn = document.getElementById('optimize-route-btn');
    const routeCanvas = document.getElementById('route-canvas');

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.getAttribute('data-view');
            
            // Update Active Nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Switch Views
            views.forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`${viewId}-view`);
            if (targetView) targetView.classList.add('active');
        });
    });

    // --- Dashboard Updates ---
    function updateProgressBars() {
        Object.keys(state.bins).forEach(type => {
            const data = state.bins[type];
            const circle = document.getElementById(`${type}-circle`);
            const text = circle?.parentElement.querySelector('.percentage');
            
            if (circle && text) {
                const strokeDash = `${data.level}, 100`;
                circle.setAttribute('stroke-dasharray', strokeDash);
                text.textContent = `${data.level}%`;
            }
        });
    }

    // Simulate IoT Data
    setInterval(() => {
        Object.keys(state.bins).forEach(type => {
            // Randomly increment/decrement levels slightly
            const change = Math.floor(Math.random() * 3) - 1; 
            state.bins[type].level = Math.max(0, Math.min(100, state.bins[type].level + change));
        });
        updateProgressBars();
    }, 5000);

    // --- Alerts System ---
    function renderAlerts() {
        if (!alertsContainer) return;
        alertsContainer.innerHTML = '';
        state.alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `alert-item ${alert.type}`;
            div.innerHTML = `
                <div class="alert-icon">
                    <i data-lucide="${alert.type === 'critical' ? 'alert-octagon' : (alert.type === 'warning' ? 'alert-triangle' : 'info')}"></i>
                </div>
                <div class="alert-content">
                    <p>${alert.msg}</p>
                    <span>${alert.time}</span>
                </div>
            `;
            alertsContainer.appendChild(div);
        });
        if (window.lucide) window.lucide.createIcons();
    }

    // --- IntelliRoute Map Simulation ---
    function initMapSimulation() {
        if (!routeCanvas) return;
        const ctx = routeCanvas.getContext('2d');
        const parent = routeCanvas.parentElement;
        
        // Handle Resize
        function resize() {
            routeCanvas.width = parent.offsetWidth;
            routeCanvas.height = parent.offsetHeight;
            drawMap();
        }

        const nodes = [];
        for (let i = 0; i < 8; i++) {
            nodes.push({
                x: Math.random() * 0.8 + 0.1,
                y: Math.random() * 0.6 + 0.2,
                id: i
            });
        }

        function drawMap() {
            ctx.clearRect(0, 0, routeCanvas.width, routeCanvas.height);
            
            // Draw "Roads" (Connections)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            nodes.forEach((node, idx) => {
                const next = nodes[(idx + 1) % nodes.length];
                ctx.moveTo(node.x * routeCanvas.width, node.y * routeCanvas.height);
                ctx.lineTo(next.x * routeCanvas.width, next.y * routeCanvas.height);
            });
            ctx.stroke();

            // Draw Active Route (Glow Effect)
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
            ctx.beginPath();
            nodes.slice(0, 4).forEach((node, idx) => {
                const x = node.x * routeCanvas.width;
                const y = node.y * routeCanvas.height;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw Nodes (Bins)
            nodes.forEach(node => {
                ctx.fillStyle = node.id < 4 ? '#00ff88' : '#334155';
                ctx.beginPath();
                ctx.arc(node.x * routeCanvas.width, node.y * routeCanvas.height, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw Truck
            const truckNode = nodes[0];
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.arc(truckNode.x * routeCanvas.width, truckNode.y * routeCanvas.height, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        window.addEventListener('resize', resize);
        resize();

        // Animation loop
        function animate() {
            // Simple logic to move truck could go here
            requestAnimationFrame(animate);
        }
        animate();
    }

    optimizeBtn.addEventListener('click', () => {
        optimizeBtn.textContent = 'Optimizing...';
        optimizeBtn.disabled = true;
        
        setTimeout(() => {
            optimizeBtn.textContent = 'Route Optimized!';
            optimizeBtn.style.background = '#10b981';
            
            // Show toast or alert
            const newAlert = { 
                id: Date.now(), 
                type: 'info', 
                msg: 'Route optimized for Sector 7-B. Saving 12% fuel.', 
                time: 'Just now' 
            };
            state.alerts.unshift(newAlert);
            renderAlerts();

            setTimeout(() => {
                optimizeBtn.textContent = 'Optimize Route';
                optimizeBtn.style.background = '';
                optimizeBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // --- Initialization ---
    updateProgressBars();
    renderAlerts();
    initMapSimulation();
});
