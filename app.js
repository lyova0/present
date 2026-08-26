let currentScreen = "question";
let noClicks = 0;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const screens = {
    question: $("#screen-question"),
    welcome: $("#screen-welcome"),
    memories: $("#screen-memories"),
    music: $("#screen-music"),
    letter: $("#screen-letter"),
    final: $("#screen-final")
};

const audio = $("#audio");
let audioReady = false;

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function showScreen(name) {
    if (!screens[name]) return;

    Object.values(screens).forEach(screen => {
        screen.classList.remove("active");
    });

    screens[name].classList.add("active");
    currentScreen = name;
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (name === "music") {
        prepareMusic();
    }
}

function fillContent() {
    $$("[data-recipient]").forEach(el => {
        el.textContent = GIFT.recipientName;
    });

    $$("[data-sender]").forEach(el => {
        el.textContent = GIFT.senderName;
    });

    $("#memoryIntro").textContent = GIFT.memoryIntro || "";
    $("#songTitle").textContent = GIFT.songTitle || "Մեր երգը";
    $("#songName").textContent = GIFT.songTitle || "Մեր երգը";
    $("#songDescription").textContent = GIFT.songDescription || "";

    $("#letterTitle").textContent =
        GIFT.letterTitle || "Մի բան, որ ուզում եմ ասել քեզ";

    $("#letterBody").innerHTML =
        escapeHTML(GIFT.letterText || "").replace(/\n/g, "<br>");

    $("#finalMessage").textContent =
        GIFT.finalMessage || "";

    renderMemories();
}

function renderMemories() {
    const wall = $("#memoryWall");
    const photos = Array.isArray(GIFT.photos) ? GIFT.photos : [];

    if (!photos.length) {
        wall.innerHTML = `
      <div class="empty-memory">
        <div>♡</div>
        <p>Այս պատմության մեջ դեռ նկարներ չկան։</p>
      </div>`;
        return;
    }

    wall.innerHTML = photos.map((photo, index) => `
    <figure class="memory-card memory-${index % 5}">
      <div class="photo-wrap">
        <img
          src="${escapeHTML(photo.src)}"
          alt="${escapeHTML(photo.caption || "Հիշողություն")}"
          loading="lazy"
          onerror="this.closest('.memory-card').classList.add('broken')"
        >
        <div class="photo-number">0${index + 1}</div>
      </div>
      ${photo.caption ? `<figcaption>${escapeHTML(photo.caption)}</figcaption>` : ""}
    </figure>
  `).join("");
}

/*
  Երաժշտություն
  ----------------------------------------------------------
  Կարևոր․ musicUrl-ը պետք է լինի DIRECT audio URL.
  Օրինակ՝ https://site.com/music/song.mp3

  YouTube / Spotify էջի սովորական URL-ը <audio> tag-ով
  չի նվագարկվի։ Դրանց համար պետք է համապատասխան embed API։
*/

function getYouTubeId(url) {
  const value = String(url || "").trim();

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return null;
}


function prepareMusic() {

  const url = String(GIFT.musicUrl || "").trim();

  const youtubeId = getYouTubeId(url);

  const youtubePlayer = document.querySelector("#youtubePlayer");
  const audioPlayer = document.querySelector("#audioPlayer");

  document.querySelector("#songName").textContent =
    GIFT.songTitle || "Մեր երգը";


  // Եթե հղում չկա
  if (!url || url.includes("VIDEO_ID")) {

    youtubePlayer.innerHTML = "";

    audioPlayer.hidden = true;

    document.querySelector("#musicError").textContent =
      "config.js-ում տեղադրիր YouTube-ի իրական հղումը։";

    return;
  }


  // ============================
  // YOUTUBE
  // ============================

  if (youtubeId) {

    audio.pause();

    audioPlayer.hidden = true;

    youtubePlayer.style.display = "block";


    youtubePlayer.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${youtubeId}?rel=0&playsinline=1"
        title="${GIFT.songTitle || "Մեր երգը"}"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share
        "
        allowfullscreen>
      </iframe>
    `;


    document.querySelector("#musicError").textContent = "";

    return;
  }


  // ============================
  // MP3 FALLBACK
  // ============================

  youtubePlayer.innerHTML = "";
  youtubePlayer.style.display = "none";

  audioPlayer.hidden = false;


  if (audio.src !== url) {

    audio.src = url;

    audio.load();
  }
}

async function toggleMusic() {
  if (!audioReady) {
    prepareMusic();
  }

  if (!audio.src) return;

  try {
    if (audio.paused) {
      await audio.play();
      updatePlayButtons(true);
      $("#musicError").textContent = "";
    } else {
      audio.pause();
      updatePlayButtons(false);
    }
  } catch (error) {
    $("#musicError").textContent =
      "Երաժշտությունը չհաջողվեց միացնել։ Ստուգիր musicUrl-ը․ այն պետք է լինի ուղիղ audio ֆայլի հղում։";
  }
}

function updatePlayButtons(isPlaying) {
  $("#playBtn").textContent = isPlaying ? "❚❚" : "▶";
  $("#floatingPlay").textContent = isPlaying ? "❚❚" : "▶";
  $("#floatingMusic").classList.toggle("visible", isPlaying || currentScreen === "music");
}

$("#playBtn")?.addEventListener("click", toggleMusic);
$("#floatingPlay")?.addEventListener("click", toggleMusic);

audio.addEventListener("loadedmetadata", () => {
  $("#duration").textContent = formatTime(audio.duration);
  $("#musicError").textContent = "";
});

audio.addEventListener("timeupdate", () => {
  $("#currentTime").textContent = formatTime(audio.currentTime);

  const percent = audio.duration
    ? (audio.currentTime / audio.duration) * 100
    : 0;

  $("#audioProgress").style.width = `${percent}%`;
});

audio.addEventListener("play", () => updatePlayButtons(true));
audio.addEventListener("pause", () => updatePlayButtons(false));
audio.addEventListener("ended", () => {
  updatePlayButtons(false);
  $("#audioProgress").style.width = "0%";
});

function nextFrom(button) {
  const next = button.dataset.next;
  if (next) showScreen(next);
}

$$("[data-next]").forEach(button => {
  button.addEventListener("click", () => nextFrom(button));
});

/*
  YES / NO
  ----------------------------------------------------------
  NO -> YES-ը մեծանում է, NO-ն փոքրանում։
  YES -> անմիջապես հաջորդ էջ։
*/

$("#yesBtn").addEventListener("click", () => {
  showScreen("welcome");
});

$("#noBtn").addEventListener("click", () => {
  noClicks++;

  const yesScale = Math.min(1 + noClicks * 0.20, 2.8);
  const noScale = Math.max(1 - noClicks * 0.13, 0.42);

  $("#yesBtn").style.transform = `scale(${yesScale})`;
  $("#noBtn").style.transform = `scale(${noScale})`;

  const messages = [
    "Համոզվա՞ծ ես։ 😌",
    "Մի քիչ էլ մտածիր… ❤️",
    "Վերջին շանսը։ 😄",
    "Այո-ն դեռ սպասում է քեզ ❤️"
  ];

  $("#noMessage").textContent =
    messages[Math.min(noClicks - 1, messages.length - 1)];
});

$("#replayBtn").addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  noClicks = 0;

  $("#yesBtn").style.transform = "";
  $("#noBtn").style.transform = "";
  $("#noMessage").textContent = "";

  updatePlayButtons(false);
  showScreen("question");
});

/*
  Հիշողության նկարի click -> մեծ preview
*/
document.addEventListener("click", (event) => {
  const image = event.target.closest(".memory-card img");
  if (!image) return;

  const overlay = document.createElement("div");
  overlay.className = "image-lightbox";
  overlay.innerHTML = `
    <button aria-label="Փակել">×</button>
    <img src="${image.src}" alt="${escapeHTML(image.alt)}">
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("open"));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.tagName === "BUTTON") {
      overlay.classList.remove("open");
      setTimeout(() => overlay.remove(), 250);
    }
  });
});

fillContent();