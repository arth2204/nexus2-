/* =====================================================================
   NEXUS CARPETE — monta a página a partir de window.STORE (config.js)
   e window.NX_VEHICLES (vehicles.js)
   Seções: utilitários · textos · modais · galeria/lightbox · veículo ·
   ofertas · CEP · confirmar pedido · listas · segurança · avaliações ·
   vídeos · antes/depois · contagem · menu · barra fixa ·
   animação de entrada
   ===================================================================== */
(function () {
  const S = window.STORE;
  const V = window.NX_VEHICLES;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const brl = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const icon = (name) => `<svg class="icon"><use href="#i-${name}"/></svg>`;
  const setAll = (sel, val, prop = "textContent") => $$(sel).forEach((el) => (el[prop] = val));
  const VERIFIED = `<svg class="verified-title-badge" viewBox="0 0 24 24" aria-label="Produto Verificado"><path fill="#1763cf" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/><path fill="#ffffff" d="M10.54 16.2 6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>`;

  /* ---------- Textos básicos ---------- */
  const titleEl = $(".buybox h1");
  if (titleEl) {
    const words = S.product.title.trim().split(/\s+/);
    const last = words.pop() || "";
    titleEl.innerHTML = `${esc(words.join(" "))} <span class="title-verified-group">${esc(last)}${VERIFIED}</span>`;
  }
  setAll("[data-rating]", S.product.rating);
  setAll("[data-rating-count]", S.product.ratingCount);
  setAll("[data-clients]", S.product.clients);
  setAll("[data-campaign]", S.campaignLabel);
  setAll("[data-discount-label]", S.discountLabel);
  setAll("[data-address]", S.brand.address);
  setAll("[data-email-text]", S.brand.email);
  setAll("[data-hours]", S.brand.hours);
  setAll("[data-about]", S.brand.about);
  setAll("[data-year]", new Date().getFullYear());
  $$("[data-email]").forEach((a) => { a.textContent = S.brand.email; a.href = "mailto:" + S.brand.email; });
  const mapQ = encodeURIComponent(S.brand.address);
  $$("[data-map]").forEach((f) => (f.src = `https://maps.google.com/maps?q=${mapQ}&z=17&output=embed`));
  $$("[data-map-link]").forEach((a) => (a.href = `https://www.google.com/maps/search/?api=1&query=${mapQ}`));

  /* ---------- Bloqueio de scroll de fundo (iOS/Mobile) ---------- */
  let scrollYLock = 0, activeOverlays = 0;
  const lockBodyScroll = () => {
    activeOverlays++;
    if (activeOverlays === 1) {
      scrollYLock = window.scrollY || document.documentElement.scrollTop || 0;
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");
    }
  };
  const unlockBodyScroll = () => {
    activeOverlays = Math.max(0, activeOverlays - 1);
    if (activeOverlays === 0) {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      html.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      const y = window.scrollY || html.scrollTop || 0;
      if (Math.abs(y - scrollYLock) > 2) window.scrollTo({ top: scrollYLock, left: 0, behavior: "instant" });
      requestAnimationFrame(() => (html.style.scrollBehavior = prev));
    }
  };
  // Toques fora do modal/drawer não movem a página no iOS
  document.addEventListener("touchmove", (e) => {
    if ((document.body.classList.contains("modal-open") || document.body.classList.contains("lb-open")) && !e.target.closest(".modal-card, [data-drawer]")) e.preventDefault();
  }, { passive: false });
  // Bloqueia pinça (zoom involuntário no Safari iOS)
  ["gesturestart", "gesturechange", "gestureend"].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault()));

  // Movimento do dedo: não abre zoom/lightbox quando a pessoa só está rolando
  let pageTouchStartX = 0, pageTouchStartY = 0, pageTouchMoved = false;
  window.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length === 1) { pageTouchStartX = e.touches[0].clientX; pageTouchStartY = e.touches[0].clientY; pageTouchMoved = false; }
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length === 1 && (Math.abs(e.touches[0].clientX - pageTouchStartX) > 7 || Math.abs(e.touches[0].clientY - pageTouchStartY) > 7)) pageTouchMoved = true;
  }, { passive: true });

  /* ---------- Modais (abrir/fechar genérico) ---------- */
  let lastFocus = null;
  const openModal = (m) => {
    lastFocus = document.activeElement;
    m.hidden = false;
    lockBodyScroll();
    requestAnimationFrame(() => m.classList.add("open"));
    ($(".modal-x", m) || m).focus?.();
  };
  const closeModal = (m) => {
    if (m.hidden) return;
    m.classList.remove("open");
    unlockBodyScroll();
    setTimeout(() => (m.hidden = true), 200);
    lastFocus?.focus?.({ preventScroll: true });
  };
  $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target.closest("[data-close-modal]")) closeModal(m); }));
  const headerH = () => $(".header").offsetHeight;
  const scrollToEl = (el, extra = 12) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - headerH() - extra, behavior: "smooth" });

  /* ---------- Galeria ---------- */
  const track = $("[data-gallery-track]");
  const thumbs = $("[data-gallery-thumbs]");
  const counter = $("[data-gallery-counter]");
  const imgs = S.product.images;
  track.innerHTML = imgs.map((im, i) =>
    `<img src="${im.src}" alt="${esc(im.alt)}" width="800" height="800" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} data-index="${i}">`).join("");
  thumbs.innerHTML = imgs.map((im, i) =>
    `<button aria-label="Ver foto ${i + 1}" data-thumb="${i}"><img src="${im.src}" alt="" loading="lazy"></button>`).join("");
  let current = 0;
  const goTo = (i) => { current = (i + imgs.length) % imgs.length; track.scrollTo({ left: track.clientWidth * current, behavior: "smooth" }); };
  const syncUI = () => {
    counter.textContent = `${current + 1} / ${imgs.length}`;
    $$("[data-thumb]").forEach((b, i) => b.classList.toggle("active", i === current));
    const active = $(`[data-thumb="${current}"]`);
    if (active) thumbs.scrollTo({ left: active.offsetLeft - thumbs.clientWidth / 2 + 32, behavior: "smooth" });
  };
  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== current) { current = i; syncUI(); }
  }, { passive: true });
  $("[data-gallery-prev]").onclick = () => goTo(current - 1);
  $("[data-gallery-next]").onclick = () => goTo(current + 1);
  thumbs.addEventListener("click", (e) => { const b = e.target.closest("[data-thumb]"); if (b) goTo(+b.dataset.thumb); });
  syncUI();

  /* ---------- Lightbox com navegação ---------- */
  const lb = $("[data-lightbox]");
  const lbImg = $("img", lb);
  let lbList = [], lbIndex = 0;
  const lbShow = () => {
    const im = lbList[lbIndex];
    lbImg.src = im.src; lbImg.alt = im.alt || "";
    $("[data-lb-counter]").textContent = `${lbIndex + 1} / ${lbList.length}`;
    $$("[data-lb-prev],[data-lb-next],[data-lb-counter]", lb).forEach((b) => (b.hidden = lbList.length < 2));
  };
  const lbOpen = (list, i) => {
    lbList = list; lbIndex = i; lbShow();
    lb.classList.add("open");
    document.documentElement.classList.add("lb-open");
    document.body.classList.add("lb-open");
  };
  const lbClose = () => {
    lb.classList.remove("open");
    document.documentElement.classList.remove("lb-open");
    document.body.classList.remove("lb-open");
  };
  const lbStep = (d) => { lbIndex = (lbIndex + d + lbList.length) % lbList.length; lbShow(); };
  let trackMoved = false, trackStartX = 0, trackStartY = 0;
  track.addEventListener("touchstart", (e) => { if (e.touches.length === 1) { trackStartX = e.touches[0].clientX; trackStartY = e.touches[0].clientY; trackMoved = false; } }, { passive: true });
  track.addEventListener("touchmove", (e) => { if (e.touches.length === 1 && (Math.abs(e.touches[0].clientX - trackStartX) > 7 || Math.abs(e.touches[0].clientY - trackStartY) > 7)) trackMoved = true; }, { passive: true });
  track.addEventListener("click", (e) => {
    if (trackMoved || pageTouchMoved) return;
    const im = e.target.closest("img"); if (im) lbOpen(imgs, +im.dataset.index);
  });
  const descImgs = $$("#descricao .desc-img");
  descImgs.forEach((im, i) => {
    im.tabIndex = 0; im.setAttribute("role", "button"); im.title = "Clique para ampliar";
    const open = () => { if (!pageTouchMoved) lbOpen(descImgs.map((d) => ({ src: d.currentSrc || d.src, alt: d.alt })), i); };
    im.addEventListener("click", open);
    im.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
  });
  $("[data-lb-prev]").onclick = (e) => { e.stopPropagation(); lbStep(-1); };
  $("[data-lb-next]").onclick = (e) => { e.stopPropagation(); lbStep(1); };
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-close-lightbox]")) { e.preventDefault(); lbClose(); } });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
  });

  /* ---------- Seletor de veículo (mesma base e regras do site atual) ---------- */
  const veh = { type: "", brand: "", model: "", cab: "", seat: "", year: "", obs: "" };
  const vEl = $("[data-vehicle]");
  const selBrand = $("[data-v-brand]"), selModel = $("[data-v-model]"), selCab = $("[data-v-cab]"), selSeat = $("[data-v-seat]"), selYear = $("[data-v-year]");
  const opts = (list, empty) => `<option value="">${esc(empty)}</option>` + list.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  const cabOptions = () => (veh.type === "Caminhonete" && veh.model ? V.cabs[veh.model] || [] : []);
  const seatOptions = () => (veh.type === "SUV" && veh.model ? V.seats[veh.model] || [] : []);
  const needCab = () => cabOptions().length > 0;
  const needSeat = () => seatOptions().length > 1;
  const modelDone = () => veh.model && (!needCab() || veh.cab) && (!needSeat() || veh.seat);
  const vehicleOk = () => !!(veh.type && veh.brand && modelDone() && veh.year);
  const vehicleLabel = () => vehicleOk()
    ? `${veh.brand} ${veh.model}${veh.cab ? ` (${veh.cab})` : ""}${veh.seat ? ` (${veh.seat})` : ""} ${veh.year}` : "";

  $("[data-v-types]").innerHTML = V.types.map((t) => `<button type="button" role="radio" aria-checked="false" data-v-type="${esc(t)}">${esc(t)}</button>`).join("");
  const renderVehicle = () => {
    $$("[data-v-type]").forEach((b) => { const on = b.dataset.vType === veh.type; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    const brands = veh.type ? Object.keys(V.years).filter((b) => Object.keys(V.years[b]).some((m) => V.typeOf(m).includes(veh.type))).sort() : [];
    selBrand.innerHTML = opts(brands, veh.type ? "Selecione a marca" : "Selecione o tipo primeiro");
    selBrand.disabled = !veh.type; selBrand.value = veh.brand;
    const models = veh.brand ? Object.keys(V.years[veh.brand]).filter((m) => V.typeOf(m).includes(veh.type)).sort() : [];
    selModel.innerHTML = opts(models, veh.brand ? "Selecione o modelo" : "Selecione a marca primeiro");
    selModel.disabled = !veh.brand; selModel.value = veh.model;
    $("[data-v-cab-wrap]").hidden = !needCab();
    selCab.innerHTML = opts(cabOptions(), "Selecione a cabine"); selCab.value = veh.cab;
    $("[data-v-seat-wrap]").hidden = !needSeat();
    selSeat.innerHTML = opts(seatOptions(), "Selecione os lugares"); selSeat.value = veh.seat;
    const years = modelDone() ? (V.years[veh.brand][veh.model] || []).slice().sort((a, b) => b - a) : [];
    selYear.innerHTML = opts(years, !veh.model ? "Selecione o modelo primeiro" : needCab() && !veh.cab ? "Selecione a cabine primeiro" : needSeat() && !veh.seat ? "Selecione os lugares primeiro" : "Selecione o ano");
    selYear.disabled = !years.length; selYear.value = veh.year;
    const steps = [!!veh.type, !!veh.brand, !!modelDone(), !!veh.year];
    const firstOpen = steps.indexOf(false);
    $$("[data-vstep]").forEach((s, i) => { s.classList.toggle("done", steps[i]); s.classList.toggle("on", i === firstOpen); });
    const ok = vehicleOk();
    $("[data-v-result]").classList.toggle("ok", ok);
    setAll("[data-v-label]", ok ? vehicleLabel() : "Selecione seu veículo acima");
    if (ok) $("[data-v-warn]").hidden = true;
  };
  $("[data-v-types]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v-type]"); if (!b) return;
    Object.assign(veh, { type: b.dataset.vType, brand: "", model: "", cab: "", seat: "", year: "" });
    renderVehicle(); renderOffers(); selectOffer(currentOffer.id);
  });
  selBrand.addEventListener("change", () => { Object.assign(veh, { brand: selBrand.value, model: "", cab: "", seat: "", year: "" }); renderVehicle(); updateSelection(); });
  selModel.addEventListener("change", () => {
    Object.assign(veh, { model: selModel.value, cab: "", seat: "", year: "" });
    const s = seatOptions(); if (s.length === 1) veh.seat = ""; // 1 só configuração: não pergunta (igual ao site atual)
    renderVehicle(); updateSelection();
  });
  selCab.addEventListener("change", () => { veh.cab = selCab.value; veh.year = ""; renderVehicle(); updateSelection(); });
  selSeat.addEventListener("change", () => { veh.seat = selSeat.value; veh.year = ""; renderVehicle(); updateSelection(); });
  selYear.addEventListener("change", () => {
    veh.year = selYear.value; renderVehicle(); updateSelection();
    if (vehicleOk()) S.textures.forEach((t) => { const im = new Image(); im.src = t.image; }); // pré-carrega texturas
  });
  $("[data-v-obs]").addEventListener("input", (e) => (veh.obs = e.target.value.trim()));
  const askVehicle = () => {
    $("[data-v-warn]").hidden = false;
    scrollToEl(vEl);
    vEl.classList.remove("attention"); void vEl.offsetWidth; vEl.classList.add("attention");
  };

  /* ---------- Ofertas e preço ---------- */
  const offerView = (o) => ({ ...o, ...((o.variants && o.variants[veh.type]) || {}) });
  const offerById = (id) => S.offers.find((o) => o.id === id);
  const instText = (cents) => `${S.installmentsNoInterest}x de ${brl(Math.round(cents / S.installmentsNoInterest))} sem juros`;
  const offersEl = $("[data-offers]");
  const renderOffers = () => {
    offersEl.innerHTML = S.offers.map((o0) => {
      const o = offerView(o0);
      return `
      <button class="offer" type="button" role="radio" data-offer="${o.id}">
        ${o.badge ? `<span class="o-badge">${esc(o.badge)}</span>` : ""}
        <span class="radio"></span>
        <img class="o-img" src="${esc(o.image)}" alt="" loading="lazy">
        <span class="o-main"><strong>${esc(o.label)} <em class="o-off">-${o.off}%</em></strong><small>${esc(o.detail)}</small>
          <small class="o-save">Economize ${brl(o.save)}</small></span>
        <span class="o-price"><s>${brl(o.compareAt)}</s>${brl(o.price)}<small class="o-unit">${brl(Math.round(o.price / o.pieces))} por peça</small></span>
        <ul class="o-feats">${o.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      </button>`;
    }).join("");
  };
  let currentOffer = offerById(S.defaultOffer) || S.offers[0];
  const updateSelection = () => {
    const o = offerView(currentOffer);
    const car = vehicleLabel();
    $("[data-selection]").innerHTML = `<span class="sel-thumb"><img src="${esc(o.image)}" alt=""></span>
      <span class="sel-info">
        <small>Sua seleção</small>
        <b class="sel-title">${esc(o.label)}</b>
        <span class="sel-car">${car ? `Sob medida para <b style="display:inline;color:inherit">${esc(car)}</b>` : "Escolha seu carro acima para o encaixe perfeito"}</span>
        <div class="sel-pricing"><span class="sel-price">${brl(o.price)}</span><span class="sel-save-tag">${icon("tag")} Economia de <b>${brl(o.save)}</b></span></div>
      </span>
      <span class="sel-check" aria-label="Seleção confirmada">${icon("check")}</span>`;
  };
  const selectOffer = (id, announce) => {
    currentOffer = offerById(id) || S.offers[0];
    const o = offerView(currentOffer);
    $$("[data-offer]").forEach((b) => { const on = b.dataset.offer === o.id; b.classList.toggle("selected", on); b.setAttribute("aria-checked", on); });
    setAll("[data-price]", brl(o.price));
    setAll("[data-sticky-price]", brl(o.price));
    setAll("[data-sticky-title]", o.label);
    $$("[data-sticky-img]").forEach((im) => (im.src = o.image));
    setAll("[data-compare]", brl(o.compareAt));
    setAll("[data-off]", `-${o.off}%`);
    setAll("[data-save]", brl(o.save));
    setAll("[data-inst-n]", S.installmentsNoInterest);
    setAll("[data-inst]", brl(Math.round(o.price / S.installmentsNoInterest)));
    setAll("[data-inst-max]", S.installmentsMax);
    updateSelection();
    renderBox();
    if (announce) {
      const sel = $("[data-selection]");
      sel.classList.remove("pop"); void sel.offsetWidth; sel.classList.add("pop");
      $(".buybox [data-buy]").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  offersEl.addEventListener("click", (e) => { const b = e.target.closest("[data-offer]"); if (b) selectOffer(b.dataset.offer, true); });

  /* ---------- O que vem na caixa (destaca o kit escolhido) ---------- */
  const renderBox = () => {
    $("[data-box]").innerHTML = S.offers.map((o0) => {
      const o = offerView(o0);
      return `<div class="box-group${o.id === currentOffer.id ? " on" : ""}"><h4>${icon("box")} ${esc(o.label)}${o.id === currentOffer.id ? "<small>Selecionado</small>" : ""}</h4>
        <ul>${o.features.map((f) => `<li>${icon("check")}${esc(f)}</li>`).join("")}</ul></div>`;
    }).join("");
  };

  renderOffers(); renderVehicle(); selectOffer(currentOffer.id);

  /* ---------- Calcular prazo (CEP) ---------- */
  const cepIn = $("[data-cep]"), cepOut = $("[data-cep-out]");
  cepIn.addEventListener("input", () => {
    const d = cepIn.value.replace(/\D/g, "").slice(0, 8);
    cepIn.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  });
  $("[data-cep-form]").addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = cepIn.value.replace(/\D/g, "");
    if (d.length !== 8) { cepOut.innerHTML = `<p class="err">Digite um CEP válido com 8 dígitos</p>`; return; }
    cepOut.innerHTML = `<p class="muted">Consultando…</p>`;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`).then((x) => x.json());
      if (r.erro) { cepOut.innerHTML = `<p class="err">CEP não encontrado</p>`; return; }
      cepOut.innerHTML = `<div class="ok"><span>${esc([r.localidade, r.uf].filter(Boolean).join(" - "))}<br><small class="muted">Frete Grátis · ${esc(S.shippingEstimate)}</small></span><b>Grátis</b></div>`;
    } catch { cepOut.innerHTML = `<p class="err">Erro ao consultar CEP. Tente novamente.</p>`; }
  });

  /* ---------- Popup "Confirmar pedido": veículo, textura e adicional ---------- */
  const orderModal = $("[data-order-modal]");
  const U = S.upgrade;
  let texture = "", upgrade = false;
  $("[data-textures]").innerHTML = S.textures.map((t) =>
    `<button type="button" role="radio" aria-checked="false" data-texture="${t.id}"><img src="${esc(t.image)}" alt="${esc(t.label)}" loading="lazy"><span>${esc(t.label)}</span></button>`).join("");
  const finalOffer = () => (upgrade && currentOffer.id === U.from ? offerById(U.to) : currentOffer);

  // Leva os parâmetros da URL atual (UTMs etc.) para o checkout, sem duplicar chaves
  const checkoutFor = (o) => {
    let url = o.checkoutUrl;
    if (!url) return "#";
    try {
      const u = new URL(url);
      new URLSearchParams(location.search).forEach((v, k) => { if (!u.searchParams.has(k)) u.searchParams.append(k, v); });
      url = u.toString();
    } catch {}
    return url;
  };
  const renderOrder = () => {
    const base = offerView(currentOffer);
    const fin = offerView(finalOffer());
    setAll("[data-order-offer]", fin.label);
    $$("[data-order-img]").forEach((im) => (im.src = fin.image));
    setAll("[data-order-car]", vehicleLabel());
    const tex = S.textures.find((t) => t.id === texture);
    setAll("[data-order-tex]", tex ? tex.label : "—");
    $("[data-order-obs-row]").hidden = !veh.obs;
    setAll("[data-order-obs]", veh.obs);
    $$("[data-texture]").forEach((b) => { const on = b.dataset.texture === texture; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    // Adicional: só aparece no Kit Interno
    const showBump = base.id === U.from;
    $("[data-order-bumps]").hidden = !showBump;
    if (showBump) {
      const to = offerView(offerById(U.to));
      const cam = veh.type === "Caminhonete";
      $("[data-order-addons]").innerHTML = `
        <button type="button" class="ob-item${upgrade ? " on" : ""}" data-upgrade aria-pressed="${upgrade}">
          <img src="${esc(to.image)}" alt="" loading="lazy">
          <span class="ob-info"><b>${esc(cam ? U.titleCaminhonete : U.title)}</b><small>${esc(cam ? U.detailCaminhonete : U.detail)}</small>
            <span class="ob-price"><s>${brl(to.compareAt - base.compareAt)}</s><b>+ ${brl(to.price - base.price)}</b></span></span>
          <span class="ob-check" aria-hidden="true">${icon("check")}</span>
        </button>`;
    }
    setAll("[data-order-total]", brl(fin.price));
    setAll("[data-order-compare]", brl(fin.compareAt));
    setAll("[data-order-inst]", instText(fin.price));
    const finish = $("[data-order-finish]");
    finish.href = checkoutFor(fin);
    finish.setAttribute("aria-disabled", texture ? "false" : "true");
  };
  $("[data-textures]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-texture]"); if (!b) return;
    texture = b.dataset.texture; $("[data-tex-warn]").hidden = true; renderOrder();
  });
  $("[data-order-addons]").addEventListener("click", (e) => { if (e.target.closest("[data-upgrade]")) { upgrade = !upgrade; renderOrder(); } });
  $$("[data-buy]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    if (!vehicleOk()) { askVehicle(); return; }
    texture = ""; upgrade = false; $("[data-tex-warn]").hidden = true;
    renderOrder();
    openModal(orderModal);
  }));
  $("[data-order-change]").addEventListener("click", () => { closeModal(orderModal); setTimeout(() => scrollToEl(vEl), 220); });
  $("[data-order-finish]").addEventListener("click", (e) => {
    e.preventDefault();
    if (!texture) { $("[data-tex-warn]").hidden = false; $("[data-textures]").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const url = e.currentTarget.href;
    trackInitiateCheckout();
    // pequena espera para o evento do Pixel sair antes de trocar de página
    if (url && !url.endsWith("#")) setTimeout(() => (window.location.href = url), 220);
  });

  /* Meta Pixel: InitiateCheckout no botão que leva ao checkout (mesmo evento,
     sem parâmetros, e mesma trava de 800ms do "Confirmar ✓" do site atual) */
  let lastCheckoutFired = 0;
  function trackInitiateCheckout() {
    const now = Date.now();
    if (now - lastCheckoutFired < 800) return;
    lastCheckoutFired = now;
    try { if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout"); } catch (_) {}
  }

  /* ---------- Listas ---------- */
  $("[data-highlights]").innerHTML = S.highlights.map((h) => `<li>${icon("check")}<span>${esc(h)}</span></li>`).join("");
  $("[data-benefits]").innerHTML = S.benefits.map((b) => `
    <div class="why-item"><img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy">
      <div><h3>${icon(b.icon)} ${esc(b.title)}</h3><p>${esc(b.text)}</p><ul>${b.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></div>`).join("");
  $("[data-specs]").innerHTML = "<tbody>" + S.specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("") + "</tbody>";
  $("[data-faq]").innerHTML = S.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

  /* ---------- Popup "Compra segura" ---------- */
  const secModal = $("[data-security-modal]");
  setAll("[data-sec-intro]", S.security.intro);
  $("[data-sec-list]").innerHTML = S.security.items.map((it) =>
    `<li><span class="sec-ic">${icon(it.icon)}</span><div><b>${esc(it.title)}</b><p>${esc(it.text)}</p></div></li>`).join("");
  const renderSecStatus = () => {
    // Verificação real do navegador: protocolo desta página
    const https = location.protocol === "https:";
    $("[data-sec-status]").innerHTML = `
      <div class="${https ? "ok" : "warn"}">${icon(https ? "lock" : "scan")}
        <span><b>${https ? "Conexão segura verificada" : "Ambiente de teste local"}</b>
        <small>${esc(location.hostname || "este site")} · ${https ? "HTTPS ativo · certificado válido" : "o HTTPS é ativado na publicação"}</small></span></div>`;
  };
  $$("[data-open-security]").forEach((b) => b.addEventListener("click", () => { renderSecStatus(); openModal(secModal); }));

  /* ---------- Avaliações ---------- */
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const fmtDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} de ${months[m - 1]}. de ${y}`; };
  const starStr = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
  const PAGE = 6;
  const reviews = S.reviews.map((r, i) => ({ ...r, _order: i }));
  let shown = PAGE, filterStars = null;
  const renderSummary = () => {
    const R = reviews;
    $("[data-rating-bars]").innerHTML = `<p class="bars-label">Filtrar as ${R.length} avaliações abaixo por nota</p>` + [5, 4, 3, 2, 1].map((n) => {
      const c = R.filter((r) => r.stars === n).length;
      return `<button type="button" class="row${filterStars === n ? " active" : ""}" data-filter-stars="${n}" aria-label="Filtrar avaliações de ${n} estrelas">
        <span>${n}★</span><span class="bar"><i style="width:${R.length ? (c / R.length) * 100 : 0}%"></i></span><span class="muted">${c}</span></button>`;
    }).join("");
  };
  const reviewCard = (r) => {
    const offer = r.offer && offerById(r.offer);
    const tag = r.mine ? `<span class="tag">Sua avaliação</span>` : `<span class="tag ok">${icon("badge")}Compra verificada</span>`;
    const avatar = r.avatar ? `<img src="${esc(r.avatar)}" alt="" loading="lazy">` : esc((r.name.trim()[0] || "?").toUpperCase());
    return `
    <article class="review${r.mine ? " mine" : ""}">
      <div class="review-head">
        <span class="avatar">${avatar}</span>
        <div><b>${esc(r.name)}</b><small>${esc([r.city, r.car].filter(Boolean).join(" · "))}</small></div>
        ${tag}
      </div>
      <div class="stars" aria-label="${r.stars} de 5 estrelas">${starStr(r.stars)}</div>
      <p>"${esc(r.text)}"</p>
      ${r.photo ? `<button type="button" class="review-photo photo-fit" style="--img:url('${esc(new URL(r.photo, location.href).href)}')" data-review-photo="${esc(r.photo)}" aria-label="Ampliar foto de ${esc(r.name)}"><img src="${esc(r.photo)}" alt="Foto enviada por ${esc(r.name)}" loading="lazy"></button>` : ""}
      <div class="review-foot">${offer ? `<span class="chip">${esc(offerView(offer).label)}</span>` : r.photo ? `<span class="chip">Foto enviada pelo cliente</span>` : "<span></span>"}<small class="muted">${r.date ? fmtDate(r.date) : ""}</small></div>
    </article>`;
  };
  const renderReviews = () => {
    const q = ($("[data-review-search]").value || "").trim().toLocaleLowerCase("pt-BR");
    const sort = $("[data-review-sort]").value;
    const list = reviews.filter((r) => (!filterStars || r.stars === filterStars) &&
      (!q || `${r.name} ${r.city} ${r.car || ""} ${r.text}`.toLocaleLowerCase("pt-BR").includes(q)));
    const byDate = (a, b) => (b.mine - a.mine) || (b.date || "").localeCompare(a.date || "") || a._order - b._order;
    list.sort(sort === "high" ? (a, b) => b.stars - a.stars || byDate(a, b)
      : sort === "low" ? (a, b) => a.stars - b.stars || byDate(a, b)
      : sort === "photo" ? (a, b) => (!!b.photo - !!a.photo) || byDate(a, b)
      : byDate);
    $("[data-reviews]").innerHTML = list.slice(0, shown).map(reviewCard).join("");
    $("[data-reviews-empty]").hidden = list.length > 0;
    $("[data-reviews-more]").hidden = list.length <= shown;
    $("[data-review-filter]").hidden = !filterStars;
    setAll("[data-filter-label]", `${filterStars} estrela${filterStars > 1 ? "s" : ""}`);
  };
  $("[data-rating-bars]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter-stars]"); if (!b) return;
    const n = +b.dataset.filterStars;
    filterStars = filterStars === n ? null : n; shown = PAGE;
    renderSummary(); renderReviews();
  });
  $("[data-clear-filter]").onclick = () => { filterStars = null; renderSummary(); renderReviews(); };
  $("[data-review-search]").addEventListener("input", () => { shown = PAGE; renderReviews(); });
  $("[data-review-sort]").addEventListener("change", renderReviews);
  $("[data-reviews-more]").onclick = () => { shown += PAGE; renderReviews(); };
  $("[data-reviews]").addEventListener("click", (e) => {
    if (pageTouchMoved) return;
    const b = e.target.closest("[data-review-photo]"); if (!b) return;
    e.preventDefault();
    lbOpen([{ src: b.dataset.reviewPhoto, alt: "Foto do cliente" }], 0);
  });
  renderSummary(); renderReviews();

  // Formulário: publica só nesta página (site estático, nada é salvo — some ao atualizar)
  const form = $("[data-review-form]");
  let rfStars = 0, rfPhoto = null;
  $("[data-rf-offer]").innerHTML = S.offers.map((o) => `<option value="${o.id}">${esc(o.label)}</option>`).join("");
  const paintStars = (n) => $$("[data-star]").forEach((b) => b.classList.toggle("on", +b.dataset.star <= n));
  $("[data-rf-stars]").addEventListener("click", (e) => { const b = e.target.closest("[data-star]"); if (b) { rfStars = +b.dataset.star; paintStars(rfStars); } });
  $("[data-rf-stars]").addEventListener("mouseover", (e) => { const b = e.target.closest("[data-star]"); if (b) paintStars(+b.dataset.star); });
  $("[data-rf-stars]").addEventListener("mouseleave", () => paintStars(rfStars));
  $("[data-rf-photo]").addEventListener("change", (e) => {
    const f = e.target.files[0];
    const prev = $("[data-rf-preview]");
    if (rfPhoto) URL.revokeObjectURL(rfPhoto);
    rfPhoto = f && f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
    prev.hidden = !rfPhoto; if (rfPhoto) prev.src = rfPhoto;
    setAll("[data-rf-file-label]", f ? f.name : "Adicionar foto do produto (opcional)");
  });
  const resetForm = () => {
    form.reset(); rfStars = 0; rfPhoto = null; paintStars(0);
    $("[data-rf-preview]").hidden = true; setAll("[data-rf-file-label]", "Adicionar foto do produto (opcional)");
    $("[data-review-form-wrap]").open = false;
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const val = (k) => String(d.get(k) || "").trim();
    const errEl = $("[data-rf-error]");
    const state = val("state"), city = val("city");
    const err = val("name").length < 2 ? "Informe seu nome."
      : !state ? "Selecione o seu estado (UF)."
      : !rfStars ? "Escolha sua nota de 1 a 5 estrelas."
      : val("text").length < 10 ? "Escreva pelo menos 10 caracteres na avaliação." : "";
    errEl.textContent = err; errEl.hidden = !err;
    if (err) return;
    reviews.unshift({ name: val("name"), city: city ? `${city}, ${state}` : state, car: val("car"), stars: rfStars, text: val("text"),
      offer: val("offer"), photo: rfPhoto, date: new Date().toISOString().slice(0, 10), mine: true, _order: -1 });
    resetForm();
    filterStars = null; $("[data-review-search]").value = ""; $("[data-review-sort]").value = "recent";
    renderSummary(); renderReviews();
    const ok = $("[data-rf-success]");
    $("span", ok).textContent = "Avaliação publicada com sucesso. Obrigado!"; ok.hidden = false;
    ok.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (ok.hidden = true), 9000);
  });

  /* ---------- Depoimentos em vídeo ---------- */
  if (S.videos && S.videos.length) {
    $("[data-videos]").hidden = false;
    $("[data-video-track]").innerHTML = S.videos.map((v) => `
      <figure class="video-card">
        <video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ""} playsinline controls preload="none"></video>
        <figcaption><b>${esc(v.name)}</b><span class="stars">★★★★★</span><small>Cliente verificado</small></figcaption>
      </figure>`).join("");
    // toca um por vez
    $("[data-video-track]").addEventListener("play", (e) => $$("[data-video-track] video").forEach((v) => v !== e.target && v.pause()), true);
  }

  /* ---------- Fotos reais ---------- */
  const RP = S.realPhotos || [];
  if (RP.length) {
    $("[data-real-photos]").innerHTML = RP.map((p, i) =>
      `<button type="button" class="photo-fit" style="--img:url('${esc(new URL(p.src, location.href).href)}')" data-rp="${i}" aria-label="Ampliar foto ${i + 1}">
        <img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"></button>`).join("");
    setAll("[data-rp-count]", `${RP.length} fotos`);
    $("[data-real-photos]").addEventListener("click", (e) => {
      if (pageTouchMoved) return;
      const b = e.target.closest("[data-rp]"); if (b) lbOpen(RP, +b.dataset.rp);
    });
  } else $("[data-real-photos-wrap]").hidden = true;

  /* ---------- Vídeos-GIF: tocam só quando aparecem na tela ---------- */
  const gifs = $$("video[data-gif]");
  gifs.forEach((v) => { v.muted = true; v.defaultMuted = true; v.playsInline = true; });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) gifs.forEach((v) => (v.controls = true));
  else if ("IntersectionObserver" in window) {
    const gio = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) v.play().catch(() => (v.controls = true)); else v.pause();
    }), { threshold: 0.35 });
    gifs.forEach((v) => gio.observe(v));
  }

  /* ---------- Antes e depois ---------- */
  $$("[data-ba]").forEach((ba) => {
    const r = $("input[type=range]", ba);
    const set = (v) => ba.style.setProperty("--pos", v + "%");
    r.addEventListener("input", () => set(r.value));
    // mostra que dá para arrastar quando aparece na tela (igual ao site atual)
    if ("IntersectionObserver" in window) {
      let touched = false;
      r.addEventListener("pointerdown", () => (touched = true));
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        [[85, 300], [15, 1400], [50, 2500]].forEach(([v, t]) => setTimeout(() => { if (!touched) { r.value = v; set(v); } }, t));
      }, { threshold: 0.4 });
      io.observe(ba);
    }
  });

  /* ---------- Contagem regressiva ---------- */
  const end = new Date(S.offerEndsAt).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const boxes = $$("[data-countdown]");
  boxes.forEach((b) => (b.innerHTML = ["Dias", "Horas", "Min", "Seg"].map((l) => `<div><b>00</b><small>${l}</small></div>`).join("")));
  const tick = () => {
    const ms = Math.max(0, end - Date.now());
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    setAll("[data-countdown-inline]", `${pad(d)}d ${pad(h)}:${pad(m)}:${pad(s)}`);
    boxes.forEach((b) => $$("b", b).forEach((el, i) => (el.textContent = pad([d, h, m, s][i]))));
  };
  tick(); setInterval(tick, 1000);

  /* ---------- Menu lateral ---------- */
  const drawer = $("[data-drawer]");
  const toggleDrawer = (open) => {
    if (drawer.classList.contains("open") === open) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", !open);
    if (open) lockBodyScroll(); else unlockBodyScroll();
  };
  $$("[data-open-drawer]").forEach((b) => (b.onclick = () => toggleDrawer(true)));
  $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", () => toggleDrawer(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { toggleDrawer(false); lbClose(); $$(".modal.open").forEach(closeModal); }
    if (lb.classList.contains("open") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) lbStep(e.key === "ArrowRight" ? 1 : -1);
  });

  /* ---------- Barra fixa de compra (leva até as ofertas) ---------- */
  const sticky = $("[data-sticky]");
  const ofertas = $("#ofertas");
  const mainBuy = $(".buybox [data-buy]");
  let ofertasVisible = true, buyVisible = true;
  const syncSticky = () => sticky.classList.toggle("show", !ofertasVisible && !buyVisible && ofertas.getBoundingClientRect().top < 0);
  new IntersectionObserver(([e]) => { ofertasVisible = e.isIntersecting; syncSticky(); }).observe(ofertas);
  new IntersectionObserver(([e]) => { buyVisible = e.isIntersecting; syncSticky(); }).observe(mainBuy);
  $$("[data-goto-buy]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToEl(vehicleOk() ? $("[data-offers]") : ofertas);
    mainBuy.classList.remove("attention"); void mainBuy.offsetWidth; mainBuy.classList.add("attention");
  }));

  /* ---------- Animação de entrada ao rolar ---------- */
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const els = $$("main > .section, #descricao > .bnr, #descricao > .bnr-specs, #descricao > .desc-img, .trust > div");
    els.forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) el.classList.add("reveal"); });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }
})();
