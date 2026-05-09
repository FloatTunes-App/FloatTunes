// ------------------------------------------------------------
// UI MODULE (buttons, panels, lyrics, playback controls)
// ------------------------------------------------------------
const UIMod = {
  name: "UIMod",

  init(app) {
    this.app = app;

    // DOM elements
    this.trackTitle   = document.getElementById("track-title");
    this.lyricsPanel  = document.getElementById("lyrics-panel");

    // Buttons
    this.btnBack      = document.getElementById("btn-back");
    this.btnLyrics    = document.getElementById("btn-lyrics");
    this.btnRelated   = document.getElementById("btn-related");

    this.btnPlay      = document.getElementById("btn-play");
    this.btnPause     = document.getElementById("btn-pause");
    this.btnPrev      = document.getElementById("btn-prev");
    this.btnNext      = document.getElementById("btn-next");
    this.btnRepeat    = document.getElementById("btn-repeat");
    this.btnShuffle   = document.getElementById("btn-shuffle");

    // ------------------------------------------------------------
    // PLAY
    // ------------------------------------------------------------
    this.btnPlay.onclick = () => {
      app.audio.play();
      this.showPauseState();
    };

    // ------------------------------------------------------------
    // PAUSE
    // ------------------------------------------------------------
    this.btnPause.onclick = () => {
      app.audio.pause();
      this.showPlayState();
    };

    // ------------------------------------------------------------
    // NEXT / PREV (call AudioMod engine)
    // ------------------------------------------------------------
    this.btnNext.onclick = () => {
      console.log("[UIMod] NEXT clicked");
      AudioMod.playNext(this.app);
      this.showPauseState();
    };

    this.btnPrev.onclick = () => {
      console.log("[UIMod] PREV clicked");
      AudioMod.playPrev(this.app);
      this.showPauseState();
    };

    // ------------------------------------------------------------
    // REPEAT
    // ------------------------------------------------------------
    this.btnRepeat.onclick = () => {
      AudioMod.repeat = !AudioMod.repeat;

      if (AudioMod.repeat) {
        AudioMod.shuffle = false;
        this.btnShuffle.classList.remove("active");
        this.btnRepeat.classList.add("active");
      } else {
        this.btnRepeat.classList.remove("active");
      }

      console.log("[UIMod] REPEAT =", AudioMod.repeat);
    };

    // ------------------------------------------------------------
    // SHUFFLE
    // ------------------------------------------------------------
    this.btnShuffle.onclick = () => {
      AudioMod.shuffle = !AudioMod.shuffle;

      if (AudioMod.shuffle) {
        AudioMod.repeat = false;
        this.btnRepeat.classList.remove("active");
        this.btnShuffle.classList.add("active");
      } else {
        this.btnShuffle.classList.remove("active");
      }

      console.log("[UIMod] SHUFFLE =", AudioMod.shuffle);
    };

    // ------------------------------------------------------------
    // RELATED
    // ------------------------------------------------------------
    this.btnRelated.onclick = () => {
      console.log("[UIMod] RELATED clicked");
      AudioMod.toggleRelated(this.app);
      this.btnRelated.classList.toggle("active", AudioMod.relatedMode);
    };

    // ------------------------------------------------------------
    // LYRICS
    // ------------------------------------------------------------
    this.btnLyrics.onclick = () => this.toggleLyrics();

    // ------------------------------------------------------------
    // BACK
    // ------------------------------------------------------------
    this.btnBack.onclick = () => ClusterMod.backToRoot(app);
  },

  // ------------------------------------------------------------
  // UI STATE HELPERS
  // ------------------------------------------------------------
  showPauseState() {
    this.btnPlay.style.display = "none";
    this.btnPause.style.display = "inline-flex";
  },

  showPlayState() {
    this.btnPause.style.display = "none";
    this.btnPlay.style.display = "inline-flex";
  },

  // ------------------------------------------------------------
  // TOGGLE LYRICS PANEL
  // ------------------------------------------------------------
  toggleLyrics() {
    const path = this.app.currentLyricsPath;
    if (!path) return;

    if (this.lyricsPanel.style.display === "block") {
      this.lyricsPanel.style.display = "none";
      return;
    }

    fetch(path)
      .then(r => r.text())
      .then(text => {
        this.lyricsPanel.textContent = text;
        this.lyricsPanel.style.display = "block";
      })
      .catch(() => {});
  }
};
