async function fetchNowPlaying() {
    try {
        const [scheduleResponse, nowPlayingResponse] = await Promise.all([
            fetch("https://azuracast34031.hostkey.in/api/station/2/schedule"),
            fetch("https://azuracast34031.hostkey.in/api/nowplaying/2")
        ]);

        const scheduleData = await scheduleResponse.json();
        const nowPlayingData = await nowPlayingResponse.json();

        const now = Math.floor(Date.now() / 1000);
        let currentShow = "The Sound of Now!";

        scheduleData.forEach((schedule) => {
            if (now >= schedule.start_timestamp && now <= schedule.end_timestamp) {
                currentShow = schedule.name;
            }
        });

        if (nowPlayingData.live.is_live && nowPlayingData.live.streamer_name) {
            currentShow = nowPlayingData.live.streamer_name;
        }

        document.getElementById("current-show").innerHTML = `On Air: <span>${currentShow}</span>`;

        if (nowPlayingData.now_playing.song) {
            document.getElementById("current-song").innerText =
                nowPlayingData.now_playing.song.title + " - " + nowPlayingData.now_playing.song.artist;
            document.getElementById("album-art").src = nowPlayingData.now_playing.song.art;
        }

        if (nowPlayingData.playing_next && nowPlayingData.playing_next.song) {
            document.getElementById("playing-soon").innerText =
                "Playing Next: " + nowPlayingData.playing_next.song.artist;
        } else {
            document.getElementById("playing-soon").innerText = "Playing Next: Unknown";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("current-show").innerHTML = "Error loading schedule.";
    }
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 30000);

function openPlayer() {
    window.open(
        "https://azuracast34031.hostkey.in/public/nextradiouk",
        "_blank",
        "width=600,height=400,noopener,noreferrer"
    );
}
