async function fetchNowPlaying() {
                try {
                    const response = await fetch(
                        "https://azuracast34031.hostkey.in/api/nowplaying_static/nextradiouk.json"
                    );
                    const data = await response.json();

                    // Set Now Playing
                    document.getElementById("current-song").innerText =
                        data.now_playing.song.title + " - " + data.now_playing.song.artist;
                    document.getElementById("album-art").src = data.now_playing.song.art;

                    // Set Playing Soon
                    document.getElementById("playing-soon").innerText =
                        "Playing Next: " + data.playing_next.song.artist;
                } catch (error) {
                    console.error("Error fetching now playing data:", error);
                }
            }

            setInterval(fetchNowPlaying, 10000);
            window.onload = fetchNowPlaying;
            function openPlayer() {
                window.open(
                    "https://azuracast34031.hostkey.in/public/nextradiouk",
                    "_blank",
                    "width=600,height=400,noopener,noreferrer"
                );
            }
            async function fetchNowPlaying() {
                try {
                    const [scheduleResponse, nowPlayingResponse] = await Promise.all([
                        fetch("https://azuracast34031.hostkey.in/api/station/2/schedule"),
                        fetch("https://azuracast34031.hostkey.in/api/nowplaying/2")
                    ]);

                    const scheduleData = await scheduleResponse.json();
                    const nowPlayingData = await nowPlayingResponse.json();

                    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
                    let currentShow = "The Sound of Now!";

                    scheduleData.forEach((schedule) => {
                        const startTime = schedule.start_timestamp;
                        const endTime = schedule.end_timestamp;
                        const showName = schedule.name;
                        if (now >= startTime && now <= endTime) {
                            currentShow = showName;
                        }
                    });

                    if (nowPlayingData.live.is_live && nowPlayingData.live.streamer_name) {
                        currentShow = nowPlayingData.live.streamer_name;
                    }

                    document.getElementById("current-show").innerHTML = `On Air: <span>${currentShow}</span>`;
                } catch (error) {
                    console.error("Error fetching data:", error);
                    document.getElementById("current-show").innerHTML = "Error loading schedule.";
                }
            }

            fetchNowPlaying();
            setInterval(fetchNowPlaying, 30000); // Refresh every 30 seconds
