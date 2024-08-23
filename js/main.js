let offset = 0;

function syncTimeWithAPI() {
    fetch("https://worldtimeapi.org/api/ip")
        .then((response) => {
            if (!response.ok) {
                throw new Error("API limit reached");
            }
            return response.json();
        })
        .then((data) => {
            const serverTime = new Date(data.utc_datetime).getTime();
            const localTime = Date.now();
            offset = serverTime - localTime;
            updateDisplayTime(); // Immediately update after syncing
        })
        .catch(() => {
            // If API fails, offset is unchanged, so continue with local time
        });
}

function updateDisplayTime() {
    const n = document.querySelector(".display-time");

    const now = new Date(Date.now() + offset);
    const formattedTime = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    n.textContent = formattedTime;
}

// Initial sync with the API
syncTimeWithAPI();

// Update time locally every second
setInterval(updateDisplayTime, 1000);

// Periodically resync with the API every 5 minutes to correct any drift
setInterval(syncTimeWithAPI, 300000); // 300000 ms = 5 minutes
