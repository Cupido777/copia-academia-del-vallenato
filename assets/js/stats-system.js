=== ARCHIVO: stats-system.js ===
/* SISTEMA ESTADÍSTICAS - ACADEMIA DEL VALLENATO CARTAGENA */
class StatsSystem {
  constructor() {
    this.stats = { totalVisits: 0, pageViews: {}, clickEvents: {}, lastVisit: null };
    this.init();
  }

  // Inicialización optimizada
  init() {
    this.loadStats();
    this.trackVisit();
    this.trackClicks();
    this.setupStatsPanel();
    window.addEventListener("beforeunload", () => this.saveStats());
  }

  // Carga datos desde localStorage
  loadStats() {
    const s = localStorage.getItem("academia-vallenato-stats");
    if (s) this.stats = JSON.parse(s);
  }

  // Guarda estadísticas
  saveStats() {
    localStorage.setItem("academia-vallenato-stats", JSON.stringify(this.stats));
  }

  // Registra visitas optimizado
  trackVisit() {
    const p = window.location.pathname;
    const n = new Date().toISOString();
    
    this.stats.totalVisits++;
    this.stats.pageViews[p] = (this.stats.pageViews[p] || 0) + 1;
    this.stats.lastVisit = n;
    
    this.saveStats();
  }

  // Seguimiento de clics optimizado
  trackClicks() {
    // Enlaces principales
    const t = document.querySelectorAll("a[data-section], .btn, .service-link, .instrument-actions a");
    t.forEach(l => {
      l.addEventListener("click", () => {
        const s = l.getAttribute("data-section") || l.textContent.trim();
        this.stats.clickEvents[s] = (this.stats.clickEvents[s] || 0) + 1;
        this.saveStats();
      }, { passive: true });
    });

    // Botones de compra
    const b = document.querySelectorAll(".buy-btn, .purchase-btn");
    b.forEach(btn => {
      btn.addEventListener("click", () => {
        const p = btn.getAttribute("data-product") || "Producto desconocido";
        const k = `compra_${p}`;
        this.stats.clickEvents[k] = (this.stats.clickEvents[k] || 0) + 1;
        this.saveStats();
      }, { passive: true });
    });
  }

  // Panel de estadísticas optimizado
  setupStatsPanel() {
    this.createStatsButton();
    
    const c = document.getElementById("close-stats");
    if (c) c.addEventListener("click", () => this.hideStatsPanel());

    // Doble clic en logo para mostrar panel
    const l = document.querySelector(".logo");
    if (l) {
      let count = 0, t;
      l.addEventListener("click", () => {
        count++;
        if (count === 1) {
          t = setTimeout(() => count = 0, 500);
        } else if (count === 2) {
          clearTimeout(t);
          count = 0;
          this.toggleStatsPanel();
        }
      }, { passive: true });
    }
  }

  // Botón flotante del panel
  createStatsButton() {
    const b = document.createElement("button");
    b.id = "stats-toggle";
    b.className = "stats-toggle";
    b.innerHTML = '<i class="fas fa-chart-bar"></i>';
    b.setAttribute("aria-label", "Mostrar estadísticas");
    b.addEventListener("click", () => this.toggleStatsPanel());
    document.body.appendChild(b);
  }

  // Alternar visibilidad del panel
  toggleStatsPanel() {
    const p = document.getElementById("stats-panel");
    p.classList.contains("visible") ? this.hideStatsPanel() : this.showStatsPanel();
  }

  // Mostrar panel con datos actualizados
  showStatsPanel() {
    const p = document.getElementById("stats-panel");
    const t = document.getElementById("total-visits");
    const pg = document.getElementById("top-pages");

    // Actualizar visitas totales
    t.textContent = this.stats.totalVisits.toLocaleString();

    // Top 5 páginas más visitadas
    const s = Object.entries(this.stats.pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    pg.innerHTML = "";
    s.forEach(([page, views]) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="page-name">${this.getPageName(page)}</span>: <span class="page-views">${views}</span>`;
      pg.appendChild(li);
    });

    p.classList.add("visible");
    p.removeAttribute("hidden");
  }

  // Ocultar panel
  hideStatsPanel() {
    const p = document.getElementById("stats-panel");
    p.classList.remove("visible");
    p.setAttribute("hidden", "true");
  }

  // Traducción de rutas a nombres legibles
  getPageName(path) {
    const n = {
      "/": "Inicio", "/index.html": "Inicio", "/pages/servicios.html": "Servicios",
      "/pages/clases.html": "Clases", "/pages/musica-en-vivo.html": "Música en Vivo",
      "/pages/instrumentos.html": "Instrumentos", "/pages/contacto.html": "Contacto"
    };
    return n[path] || path;
  }

  // Métodos para integraciones futuras
  getStats() {
    return {
      ...this.stats,
      topPages: this.getTopPages(5),
      popularSections: this.getPopularSections(5)
    };
  }

  getTopPages(limit = 5) {
    return Object.entries(this.stats.pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([page, views]) => ({ page, views }));
  }

  getPopularSections(limit = 5) {
    return Object.entries(this.stats.clickEvents)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([section, clicks]) => ({ section, clicks }));
  }
}
