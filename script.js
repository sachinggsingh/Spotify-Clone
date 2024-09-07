let currentSong;

const songs = [
  {
    name: "Tere Pyar Mein(PagalWorld.com.se).mp3",
    singer: "Arijit Singh, Nikhita Gandhi",
  },
  { name: "Papa_Meri_Jaan.mp3.mp3", singer: "Sonu Nigam" },
  {
    name: "Show-Me-The-Thumka(PagalWorldl).mp3",
    singer: "Shashwat Singh, Sunidhi Chauhan",
  },
  { name: "Backbone-(Mr-Jatt.com).mp3", singer: "Harrdy Sandhu" },
  { name: "Clash_1.mp3", singer: "Diljith Dosanjh" },
  { name: "Yaarr_Ni_Milyaa_1.mp3", singer: "Harrdy Sandhu" },
  { name: "Waalian.mp3", singer: "Harnoor" },
  { name: "Born_To_Shine_1.mp3", singer: "Diljith Dosanjh" },
];

function playTrack(track) {
  const playButton = document.querySelector("#play");

  // Stop the current song if any
  if (currentSong) {
    currentSong.pause();
    currentSong.currentTime = 0;
  }

  // Encode the track name to handle special characters
  currentSong = new Audio("/SuperSongs/" + encodeURIComponent(track.name));

  // Reset the seek bar to 0% for the new song
  const seekBar = document.querySelector(".circle");
  seekBar.style.left = "0%";

  // Load and play the new song
  currentSong.addEventListener("loadeddata", () => {
    document.querySelector(".songtime").innerText = `00:00 / ${formatTime(
      currentSong.duration
    )}`;
    playButton.src = "/svgALL/pause.svg";
    currentSong.play().catch((error) => {
      console.error("Error in playing audio", error);
    });
  });

  // Update the seek bar and time display as the song progresses
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    const progress = (currentSong.currentTime / currentSong.duration) * 100;
    seekBar.style.left = `${progress}%`;
  });
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function buttonPlay() {
  const playButton = document.querySelector("#play");
  playButton.addEventListener("click", () => {
    playButton.src = "/svgALL/play.svg";
    if (currentSong.paused) {
      playButton.src = "/svgALL/pause.svg";
      currentSong.play();
    } else {
      playButton.src = "/svgALL/play.svg";
      currentSong.pause();
    }
  });
}

function updateSeekBar() {
  const seekBar = document.querySelector(".seekbar");
  seekBar.addEventListener("click", (e) => {
    const percent = (e.offsetX / seekBar.getBoundingClientRect().width) * 100;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
    document.querySelector(".circle").style.left = `${percent}%`;
  });
}

function updatePreNext() {
  const nextButton = document.querySelector("#next");
  const prevButton = document.querySelector("#previous");

  prevButton.addEventListener("click", () => {
    const currentSongName = decodeURIComponent(
      currentSong.src.split("/").pop()
    );
    const index = songs.findIndex((song) => song.name === currentSongName);
    if (index > 0) {
      playTrack(songs[index - 1]);
      document.querySelector(".songinfo").innerHTML = formatSongName(
        songs[index - 1].name
      );
    }
  });

  nextButton.addEventListener("click", () => {
    const currentSongName = decodeURIComponent(
      currentSong.src.split("/").pop()
    );
    const index = songs.findIndex((song) => song.name === currentSongName);
    if (index < songs.length - 1) {
      playTrack(songs[index + 1]);
      document.querySelector(".songinfo").innerHTML = formatSongName(
        songs[index + 1].name
      );
    }
  });
}

function formatSongName(songName) {
  return songName
    .replace(".mp3", " ")
    .replace(/_1/g, " ")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace("_1", " ")
    .replace("(PagalWorldl)", " ")
    .replace("_", " ")
    .replace("(PagalWorld.com.se)", " ")
    .replace("Mr-Jatt.com", " ");
}

function onAboveBARLoad() {
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  document.querySelector(".songinfo").innerHTML = "Tere Pyar Mein";
}

function hamBurger() {
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
}

function closeHamBurger() {
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100vw";
  });
}

function letsControlVolume() {
  if (!currentSong) {
    console.error("currentSong is not defined");
    return;
  }

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    const volumeIcon = document.querySelector(".volume>img");
    volumeIcon.src = currentSong.volume > 0 ? "volume.svg" : "closeVolume.svg";
  });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = "closeVolume.svg";
      currentSong.volume = 0;
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = "volume.svg";
      currentSong.volume = 0.1;
      document.querySelector(".range input").value = 10;
    }
  });
}

function logoKeliye() {
  document.querySelector(".logo").addEventListener("click", function () {
    this.classList.add("animate");

    // Optional: remove animation class after completion to allow re-animation on subsequent clicks
    this.addEventListener("animationend", () => {
      this.classList.remove("animate");
    });
  });
}

function initializeMusicPlayer() {
  playTrack(songs[0]);

  let songList = document.querySelector(".songList ul");

  songs.forEach((song) => {
    let songItem = document.createElement("li");
    songItem.innerHTML = `
      <img  src="/svgALL/music.svg" alt="Music icon">
      <div class="info">
        <div>${formatSongName(song.name)}</div>
        <div>${song.singer}</div>
      </div>
      <span>Play Now</span>
      <img src="/svgALL/play.svg" alt="Play icon">
    `;

    songItem.addEventListener("click", () => {
      playTrack(song);
      document.querySelector(".songinfo").innerText = formatSongName(song.name);
      document.querySelector(".songtime").innerText = "00:00 / 00:00";
    });

    songList.appendChild(songItem);
  });

  logoKeliye();

  letsControlVolume();
  updatePreNext();
  closeHamBurger();
  hamBurger();
  onAboveBARLoad();
  buttonPlay();
  updateSeekBar();
}
initializeMusicPlayer();
