(() => {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.querySelectorAll(".lang-switch a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!location.hash) return;
      const url = new URL(link.href, location.href);
      url.hash = location.hash;
      link.href = url.href;
    });
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        slide.classList.toggle("is-active", n === index);
      });
      dots.forEach((dot, n) => {
        dot.setAttribute("aria-selected", n === index ? "true" : "false");
      });
    };

    go(index);
    root.classList.add("is-ready");
    prev?.addEventListener("click", () => go(index - 1));
    next?.addEventListener("click", () => go(index + 1));

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    });

    if (frame && !reduce) {
      let start = null;
      frame.addEventListener("pointerdown", (event) => {
        start = { x: event.clientX, y: event.clientY };
      });
      frame.addEventListener("pointerup", (event) => {
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        start = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        go(index + (dx < 0 ? 1 : -1));
      });
      frame.addEventListener("pointercancel", () => {
        start = null;
      });
    }
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
