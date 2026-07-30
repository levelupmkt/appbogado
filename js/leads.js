/* ============================================================
   AppBogado — Captura de Leads (compartido por las 3 campañas)
   Reemplaza el <script> embebido de cada landing por:
   <script src="/assets/js/leads.js" defer></script>
   y agrega  data-ab-form="abogado|cliente|convenio"  al <form>.
   ============================================================ */
(function () {
  "use strict";

  // --- 1. Captura de atribución (Meta / Google / etc.) ---
  function getAttribution() {
    const p = new URLSearchParams(location.search);
    const attr = {};
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","gclid"]
      .forEach(k => { const v = p.get(k); if (v) attr[k] = v; });
    attr.landing_path = location.pathname;
    attr.referrer = document.referrer || null;
    return attr;
  }

  // --- 2. Endpoint del backend (AJUSTAR a tu API real) ---
  const LEADS_ENDPOINT = "/api/leads";

  // --- 3. Envío del lead ---
  async function submitLead(payload) {
    // TODO backend: confirmar método, headers y auth con tu equipo.
    const res = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Lead POST failed: " + res.status);
    return res.json().catch(() => ({}));
  }

  // --- 4. Píxel de Meta (se dispara al convertir) ---
  function trackConversion(tipo) {
    // TODO: instalar el píxel base de Meta en el <head> antes de esto.
    if (window.fbq) window.fbq("track", "Lead", { content_category: tipo });
    if (window.gtag) window.gtag("event", "generate_lead", { lead_type: tipo });
  }

  // --- 5. Validaciones mínimas ---
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = v => v.replace(/\D/g, "").length >= 9;

  // --- 6. Enganche automático de formularios ---
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("form[data-ab-form]").forEach(function (form) {
      const tipo = form.getAttribute("data-ab-form"); // abogado | cliente | convenio

      // Solo dígitos en teléfono
      const tel = form.querySelector('input[type="tel"]');
      if (tel) tel.addEventListener("input", e => { e.target.value = e.target.value.replace(/[^\d]/g, ""); });

      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        // Validación genérica por campos presentes
        let ok = true;
        if ("email" in data && !isEmail(data.email || "")) ok = false;
        if ("tel"   in data && !isPhone(data.tel   || "")) ok = false;
        if (form.querySelector("[required]:invalid")) ok = false;
        if (!ok) { form.reportValidity && form.reportValidity(); return; }

        const payload = { tipo, ...data, ...getAttribution(), ts: new Date().toISOString() };

        try {
          await submitLead(payload);
        } catch (err) {
          console.error(err);
          // No bloquees la UX si el POST falla en demo; en prod muestra aviso.
        }
        trackConversion(tipo);

        // Estado de éxito: oculta el form, muestra .ab-success si existe
        const box = form.closest("[data-ab-formbox]") || form.parentElement;
        const success = box && box.querySelector("[data-ab-success]");
        if (success) { form.style.display = "none"; success.style.display = "block";
          success.scrollIntoView({ behavior: "smooth", block: "center" }); }

        console.log("LEAD ["+tipo+"] →", payload);
      });
    });
  });
})();
