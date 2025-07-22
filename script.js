console.log('lets write js');

let currentSong = new Audio();
let currentIndex = 0; // Track the current song index
let songs = []; 

async function getsongs() {
    // Fetch the JSON file directly
    let a = await fetch("/songs.json"); 
    let fetchedSongs = await a.json(); 
    console.log("Fetched Songs:", fetchedSongs); 
    return fetchedSongs; 
}


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00"; 
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

const playMusic = (track, pause = false) => {
    // 'track' will now be a full path like "/songs/Khalid - Young Dumb.mp3"
    currentSong.src = track; 
    if (!pause) {
        currentSong.play();
    }
    document.querySelector("#play").src = "pause.svg"; // Corrected to use ID selector for play button

   
    const songNameForDisplay = decodeURI(track.split('/').pop().replace(/\.mp3$/, ''));
    document.querySelector(".songinfo").innerHTML = songNameForDisplay;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {
    songs = await getsongs(); // Assign the fetched songs to the global 'songs' array
    console.log("Songs available:", songs);

    if (songs.length > 0) {
        playMusic(songs[0], true); 
        currentIndex = 0;
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    let listHTML = "";
    for (const song of songs) {
       
        const displayName = decodeURI(song.split('/').pop().replace(/\.mp3$/, ''));
        listHTML += `<li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${displayName}</div> 
                <div>Song Artist</div>
            </div>
            <div class="playlibrary">
                <img class="playlibrary invert" src="play.svg" alt="">
            </div>
        </li>`;
    }
    songUL.innerHTML = listHTML;

  
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
           
            playMusic(songs[index]);
            currentIndex = index; 
        });
    });

    // Play/Pause button logic
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

    let prevBtn = document.querySelector("#previous"); 
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            playMusic(songs[currentIndex]);
        }
    });

   
    let nextBtn = document.querySelector("#next"); 
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

    // Volume control
    let volume = document.querySelector("#volume");
    volume.addEventListener("input", () => {
        currentSong.volume = volume.value;
    });

    // Time update 
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

   
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
}

main();