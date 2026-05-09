// ------------------------------------------------------------
// cluster.page.js — FINAL VERSION WITH CLOUD REBUILD
// ------------------------------------------------------------
const ClusterPageMod = {
  page: 1,
  perPage: 10,
  totalPages: 1,
  bands: [],
  app: null,

  init(app) {
    this.app = app;

    // read bands from JSON
    this.bands = (app.data && Array.isArray(app.data.bands)) ? app.data.bands : [];
    this.totalPages = Math.max(1, Math.ceil(this.bands.length / this.perPage));

    // ⭐ FIRST PAGE LOAD (with clouds)
    this.loadPage(1);
  },

  getPageBands(page) {
    const p = Math.min(Math.max(page, 1), this.totalPages);
    const start = (p - 1) * this.perPage;
    return this.bands.slice(start, start + this.perPage);
  },

  loadPage(page) {
    if (!this.app) return;

    // clamp page
    this.page = Math.min(Math.max(page, 1), this.totalPages);

    const sliced = this.getPageBands(this.page);

    // clone full JSON, replace only bands
    const newData = {
      ...this.app.data,
      bands: sliced
    };

    // ------------------------------------------------------------
    // ⭐ CLEAR OLD GALAXY
    // ------------------------------------------------------------
    if (ClusterMod.clear) {
      ClusterMod.clear(this.app);
    } else {
      this.app.scene.children = this.app.scene.children.filter(obj => obj.isLight);
    }

    // ------------------------------------------------------------
    // ⭐ REBUILD CLOUDS (ALWAYS)
    // ------------------------------------------------------------
    if (Clouds && Clouds.init) {
      Clouds.init(this.app);
    }

    // ------------------------------------------------------------
    // ⭐ BUILD NEW PAGE STARS
    // ------------------------------------------------------------
    ClusterMod.buildFromJSON(this.app, newData);

    // ------------------------------------------------------------
    // UI UPDATE
    // ------------------------------------------------------------
    this.updateButtons();
    const num = document.getElementById("page-number");
    if (num) num.textContent = this.page;
  },

  next() {
    this.loadPage(this.page + 1);
  },

  prev() {
    this.loadPage(this.page - 1);
  },

  updateButtons() {
    const prev = document.getElementById("page-prev");
    const next = document.getElementById("page-next");
    const num  = document.getElementById("page-number");

    if (prev) prev.style.opacity = this.page === 1 ? "0.3" : "1";
    if (next) next.style.opacity = this.page === this.totalPages ? "0.3" : "1";
    if (num)  num.textContent = this.page;
  }
};
