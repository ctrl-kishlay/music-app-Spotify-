console.log('lets write js');

let currentSong = new Audio();
let currentIndex = 0; // Track the current song index

async function getsongs() {
    let a = await fetch("https://github.com/ctrl-kishlay/music-app-Spotify-/tree/fac6e1eea7820424e5b1b605dc1074713df6df56/songs");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("https://github.com/ctrl-kishlay/music-app-Spotify-/tree/fac6e1eea7820424e5b1b605dc1074713df6df56/songs")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
    }
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {
    let songs = await getsongs();
    console.log(songs);
    if (songs.length > 0) {
        playMusic(songs[0], true);
        currentIndex = 0;
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    let listHTML = "";
    for (const song of songs) {
        listHTML += `<li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Song Artist</div>
            </div>
            <div class="playlibrary">
                <img class="playlibrary invert" src="play.svg" alt="">
            </div>
        </li>`;
    }
    songUL.innerHTML = listHTML;

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.querySelector(".info").firstElementChild.innerHTML;
            currentIndex = songs.indexOf(track.replaceAll(" ", "%20"));
            playMusic(track);
        });
    });

    let play = document.querySelector("#play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    let prevBtn = document.querySelector(".playbarbtns img:nth-child(1)");
    let nextBtn = document.querySelector(".playbarbtns img:nth-child(3)");
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            playMusic(songs[currentIndex]);
        }
    });
    nextBtn.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            playMusic(songs[currentIndex]);
        }
    });

    let libcollapse = document.querySelector("#libcollapse");
    let leftSidebar = document.querySelector(".left");
    libcollapse.addEventListener("click", () => {
        if (leftSidebar.style.display === "none" || window.getComputedStyle(leftSidebar).display === "none") {
            leftSidebar.style.display = "block";
            leftSidebar.classList.remove("hidden");
        } else {
            leftSidebar.style.display = "none";
            leftSidebar.classList.add("hidden");
        }
    });

    let volume = document.querySelector("#volume");
    volume.addEventListener("input", () => {
        currentSong.volume = volume.value;
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds === undefined) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

main();
