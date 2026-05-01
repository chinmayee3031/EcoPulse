function initOfficialView() {
    // ... existing code ...
    
    // Use optional chaining to safely assign handlers
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
    
    // ... rest of handlers ...
}
