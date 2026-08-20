(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const closeLabel = document.documentElement.lang === "uk" ? "Закрити" : "Close";
  const appleEase = "cubic-bezier(0.22, 1, 0.36, 1)";
  const appleOut = "cubic-bezier(0.4, 0, 1, 1)";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const scrollToHashOrTop = () => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ block: "start" });
      return;
    }
    window.scrollTo(0, 0);
  };

  scrollToHashOrTop();

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const nav = document.querySelector(".nav-links");
  if (nav) {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const byId = new Map(
      links
        .map((link) => [link.hash.slice(1), link])
        .filter(([id]) => id)
    );
    if (byId.size && "IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const current = byId.get(visible.target.id);
          if (!current) return;
          links.forEach((link) => {
            if (link === current) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        },
        { rootMargin: "-38% 0px -52% 0px", threshold: [0, 0.2, 0.5] }
      );
      byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
      });
    }
  }

  document.querySelectorAll(".lang-switch a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!location.hash) return;
      const url = new URL(link.href, location.href);
      url.hash = location.hash;
      link.href = url.href;
    });
  });

  const isUk = document.documentElement.lang === "uk";
  const prevLabel = isUk ? "Попередній знімок" : "Previous screenshot";
  const nextLabel = isUk ? "Наступний знімок" : "Next screenshot";
  const chevronLeft =
    '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M10.2 2.3 4.5 8l5.7 5.7 1.1-1.1L6.7 8l4.6-4.6z"/></svg>';
  const chevronRight =
    '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M5.8 2.3 4.7 3.4 9.3 8l-4.6 4.6 1.1 1.1L11.5 8z"/></svg>';

  let sheet = null;
  let sheetApi = null;
  let lastImg = null;
  let lastFocus = null;
  let photoGen = 0;

  const lockPage = (on) => {
    document.documentElement.classList.toggle("is-sheet-open", on);
    document.body.classList.toggle("is-sheet-open", on);
  };

  const centerDelta = (from, to) => {
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = from.width / Math.max(to.width, 1);
    return { dx, dy, s };
  };

  const applyPhoto = (photo, img) => {
    photo.src = img.currentSrc || img.src;
    photo.alt = img.alt || "";
  };

  const updateSheetCount = () => {
    const count = sheet?.querySelector(".shot-sheet-count");
    if (!count || !sheetApi) return;
    count.textContent = `${sheetApi.getIndex() + 1} / ${sheetApi.count}`;
  };

  const preloadNeighbors = () => {
    if (!sheetApi || sheetApi.count < 2) return;
    [-1, 1].forEach((delta) => {
      const img = sheetApi.imgAt(sheetApi.getIndex() + delta);
      if (!img) return;
      const probe = new Image();
      probe.src = img.currentSrc || img.src;
    });
  };

  const setSheetPhoto = (img, direction) => {
    const photo = sheet?.querySelector(".shot-sheet-phone img");
    if (!photo || !img) return;
    lastImg = img;
    updateSheetCount();
    preloadNeighbors();
    const gen = ++photoGen;
    if (reduce || typeof photo.animate !== "function" || !direction) {
      applyPhoto(photo, img);
      return;
    }
    photo.getAnimations().forEach((anim) => anim.cancel());
    const out = direction < 0 ? 32 : -32;
    const anim = photo.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateX(${out}px)` },
      ],
      { duration: 180, easing: appleOut, fill: "forwards" }
    );
    anim.finished
      .then(() => {
        if (gen !== photoGen || !sheet) return;
        applyPhoto(photo, img);
        photo.animate(
          [
            { opacity: 0, transform: `translateX(${-out}px)` },
            { opacity: 1, transform: "none" },
          ],
          { duration: 280, easing: appleEase }
        );
      })
      .catch(() => {
        if (gen !== photoGen || !sheet) return;
        applyPhoto(photo, img);
      });
  };

  const sheetStep = (delta) => {
    if (!sheet || !sheetApi || sheetApi.count < 2) return;
    const img = sheetApi.go(sheetApi.getIndex() + delta);
    setSheetPhoto(img, delta);
  };

  const closeSheet = () => {
    if (!sheet) return;
    const node = sheet;
    const phone = node.querySelector(".shot-sheet-phone");
    sheet = null;
    sheetApi = null;
    lockPage(false);
    node.classList.remove("is-open");

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      node.remove();
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus({ preventScroll: true });
      }
    };

    if (reduce) {
      finish();
      return;
    }

    if (lastImg && phone && typeof phone.animate === "function") {
      const src = lastImg.getBoundingClientRect();
      const now = phone.getBoundingClientRect();
      const { dx, dy, s } = centerDelta(src, now);
      const anim = phone.animate(
        [
          { transform: "none" },
          { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
        ],
        { duration: 420, easing: appleOut, fill: "forwards" }
      );
      anim.finished.then(finish).catch(finish);
    } else {
      node.addEventListener("transitionend", finish, { once: true });
    }
    window.setTimeout(finish, 500);
  };

  const openSheet = (img, api) => {
    closeSheet();
    sheetApi = api;
    lastImg = img;
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    sheet = document.createElement("div");
    sheet.className = "shot-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "shot-sheet-close";
    closeBtn.setAttribute("aria-label", closeLabel);
    closeBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M14 1.4 12.6 0 7 5.6 1.4 0 0 1.4 5.6 7 0 12.6 1.4 14 7 8.4 12.6 14 14 12.6 8.4 7z"/></svg>';

    const figure = document.createElement("figure");
    figure.className = "shot-sheet-phone";
    const photo = document.createElement("img");
    applyPhoto(photo, img);
    figure.append(photo);

    sheet.append(closeBtn, figure);

    if (api && api.count > 1) {
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "shot-sheet-nav is-prev";
      prevBtn.setAttribute("aria-label", prevLabel);
      prevBtn.innerHTML = chevronLeft;
      prevBtn.addEventListener("click", () => sheetStep(-1));

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "shot-sheet-nav is-next";
      nextBtn.setAttribute("aria-label", nextLabel);
      nextBtn.innerHTML = chevronRight;
      nextBtn.addEventListener("click", () => sheetStep(1));

      const count = document.createElement("p");
      count.className = "shot-sheet-count";
      count.setAttribute("aria-live", "polite");

      sheet.append(prevBtn, nextBtn, count);
    }

    document.body.append(sheet);
    lockPage(true);
    updateSheetCount();
    preloadNeighbors();
    closeBtn.addEventListener("click", closeSheet);
    sheet.addEventListener("click", (event) => {
      if (event.target === sheet) closeSheet();
    });

    let start = null;
    let swiped = false;
    figure.addEventListener("pointerdown", (event) => {
      start = { x: event.clientX, y: event.clientY };
      swiped = false;
    });
    figure.addEventListener("pointerup", (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.hypot(dx, dy) > 12) swiped = true;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      sheetStep(dx < 0 ? 1 : -1);
    });
    figure.addEventListener("pointercancel", () => {
      start = null;
    });
    figure.addEventListener("click", (event) => {
      if (swiped) event.preventDefault();
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!sheet) return;
        sheet.classList.add("is-open");
        if (reduce || typeof figure.animate !== "function") return;
        const first = img.getBoundingClientRect();
        const last = figure.getBoundingClientRect();
        const { dx, dy, s } = centerDelta(first, last);
        figure.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
            { transform: "none" },
          ],
          { duration: 560, easing: appleEase }
        );
      });
    });
    closeBtn.focus({ preventScroll: true });
  };

  document.addEventListener("keydown", (event) => {
    if (!sheet) return;
    if (event.key === "Escape") closeSheet();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      sheetStep(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      sheetStep(1);
    }
  });

  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const slides = [...root.querySelectorAll(".shot-slide")];
    const dotsWrap = root.querySelector(".shot-dots");
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const frame = root.querySelector(".shot-frame");
    if (!slides.length || !dotsWrap) return;

    let index = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains("is-active"))
    );
    let swiped = false;

    const dots = slides.map((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shot-dot";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `${i + 1} / ${slides.length}`);
      btn.addEventListener("click", () => go(i));
      dotsWrap.append(btn);
      return btn;
    });

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => {
        const on = n === index;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach((dot, n) => {
        dot.setAttribute("aria-selected", n === index ? "true" : "false");
      });
      return slides[index].querySelector("img");
    };

    const api = {
      getIndex: () => index,
      count: slides.length,
      go,
      imgAt: (i) => slides[(i + slides.length) % slides.length].querySelector("img"),
    };

    go(index);
    root.classList.add("is-ready");
    prev?.addEventListener("click", () => go(index - 1));
    next?.addEventListener("click", () => go(index + 1));

    root.addEventListener("keydown", (event) => {
      if (sheet) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    });

    if (frame) {
      let start = null;
      frame.addEventListener("pointerdown", (event) => {
        start = { x: event.clientX, y: event.clientY };
        swiped = false;
      });
      frame.addEventListener("pointerup", (event) => {
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        start = null;
        if (Math.hypot(dx, dy) > 12) swiped = true;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        if (reduce) return;
        go(index + (dx < 0 ? 1 : -1));
      });
      frame.addEventListener("pointercancel", () => {
        start = null;
      });
      frame.addEventListener("click", (event) => {
        if (swiped) return;
        const img = event.target.closest("img");
        if (!img) return;
        openSheet(img, api);
      });
    }
  });

  scrollToHashOrTop();
  requestAnimationFrame(() => {
    scrollToHashOrTop();
    const enableSmooth = () => {
      scrollToHashOrTop();
      requestAnimationFrame(() => {
        document.documentElement.classList.add("is-scroll-ready");
      });
    };
    if (document.readyState === "complete") enableSmooth();
    else window.addEventListener("load", enableSmooth, { once: true });
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) scrollToHashOrTop();
  });

  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((el) => io.observe(el));
})();
