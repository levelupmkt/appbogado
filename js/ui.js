/* ============================================================================
   APPBOGADO · UI
   ----------------------------------------------------------------------------
   Comportamiento compartido por index-institucional.html y las landings:
     · menú móvil accesible
     · sombra del header al hacer scroll
     · aparición de bloques al entrar en pantalla (.reveal)
     · filtros de píldoras
   Uso: <script src="js/ui.js" defer></script>
   ============================================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- 1. Menú */
  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const panel = document.querySelector("[data-nav-panel]");
    if (!toggle || !panel) return;

    const setState = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("has-nav-open", open);
    };

    toggle.addEventListener("click", () => {
      setState(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Cerrar al navegar a una sección
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setState(false);
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setState(false);
        toggle.focus();
      }
    });

    // Al volver a escritorio se restablece el estado
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) setState(false);
    });
  }

  /* -------------------------------------------------------------- 2. Header */
  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------------------- 3. Reveal */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------- 4. Filtros */
  function initFilters() {
    document.querySelectorAll("[data-filter-group]").forEach((group) => {
      group.addEventListener("click", (e) => {
        const pill = e.target.closest(".pill");
        if (!pill || !group.contains(pill)) return;

        group.querySelectorAll(".pill").forEach((p) => {
          p.classList.remove("is-active");
          p.setAttribute("aria-pressed", "false");
        });
        pill.classList.add("is-active");
        pill.setAttribute("aria-pressed", "true");
      });
    });
  }

  /* ------------------------------------------------------------ 5. Arranque */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeader();
    initReveal();
    initFilters();
  });
})();
