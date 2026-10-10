document.addEventListener("DOMContentLoaded", () => {
  initialiseAnalytics();
  initialiseSkipLink();
  initialiseNavigation();
  initialiseScrollbarTrack();
  initialiseCurrentYear();
  initialiseLastUpdated();
  initialiseContactForm();
  initialiseGallery();
  initialiseYouTubeFacades();
  initialiseTrackAudio();
  initialiseInfoToggles();
});

function initialiseAnalytics() {
  let loaded = false;

  function loadAnalytics() {
    if (loaded) {
      return;
    }

    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-DZEP97F05S");

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-DZEP97F05S";
    script.dataset.cookieyes = "cookieyes-analytics";
    document.head.appendChild(script);
  }

  function consentAllowsAnalytics(detail) {
    return (
      detail?.categories?.analytics === true ||
      detail?.accepted?.includes("analytics")
    );
  }

  function checkStoredConsent() {
    if (typeof window.getCkyConsent !== "function") {
      return;
    }

    try {
      if (consentAllowsAnalytics(window.getCkyConsent())) {
        loadAnalytics();
      }
    } catch {}
  }

  document.addEventListener("cookieyes_banner_load", (event) => {
    if (consentAllowsAnalytics(event.detail)) {
      loadAnalytics();
    }
  });
  document.addEventListener("cookieyes_banner_loaded", checkStoredConsent);
  document.addEventListener("cookieyes_consent_update", (event) => {
    if (consentAllowsAnalytics(event.detail)) {
      loadAnalytics();
    }
  });
  checkStoredConsent();
}

function initialiseSkipLink() {
  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.getElementById("main-content");

  if (!skipLink || !mainContent) {
    return;
  }

  mainContent.setAttribute("tabindex", "-1");
  skipLink.addEventListener("click", () => {
    window.requestAnimationFrame(() => mainContent.focus());
  });
}

function initialiseNavigation() {
  const header = document.querySelector(".site-header");
  const navbar = document.querySelector(".navbar");
  const navbarInner = document.querySelector(".navbar-inner");
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  const moreToggle = document.querySelector(".more-toggle");
  const moreMenu = document.querySelector(".more-menu");
  const desktopQuery = window.matchMedia("(min-width: 1025px)");
  const compactHeaderOffset = 24;
  const menuRowSelector = ".nav-links > li:not(.nav-more), .mobile-more-label, .more-menu > li, .contact-nav";
  let fitFrame = null;
  let compactFrame = null;

  if (!header || !navbar || !navbarInner || !navToggle || !navPanel || !moreToggle || !moreMenu) {
    return;
  }

  const priorityItems = Array.from(navPanel.querySelectorAll("[data-nav-item]"))
    .map((item) => ({
      item,
      copy: moreMenu.querySelector(`[data-nav-copy="${item.dataset.navItem}"]`),
    }))
    .filter((pair) => pair.copy);

  function showInBar(pair, inBar) {
    const shown = inBar ? pair.item : pair.copy;
    const concealed = inBar ? pair.copy : pair.item;
    const currentLink = concealed.querySelector("a[aria-current]");

    shown.hidden = false;
    shown.removeAttribute("aria-hidden");
    concealed.hidden = true;
    concealed.setAttribute("aria-hidden", "true");

    if (currentLink) {
      shown.querySelector("a")?.setAttribute("aria-current", currentLink.getAttribute("aria-current"));
      currentLink.removeAttribute("aria-current");
    }
  }

  function navigationOverflows() {
    return navbarInner.scrollWidth > navbarInner.clientWidth + 1;
  }

  function fitNavigation() {
    fitFrame = null;
    navbar.classList.add("nav-measured");
    priorityItems.forEach((pair) => showInBar(pair, true));

    if (desktopQuery.matches) {
      for (let index = priorityItems.length - 1; index >= 0 && navigationOverflows(); index -= 1) {
        showInBar(priorityItems[index], false);
      }
    }

    moreToggle.classList.toggle(
      "current",
      Boolean(moreMenu.querySelector("li:not([hidden]) > a[aria-current]")),
    );
  }

  function requestNavigationFit() {
    if (fitFrame === null) {
      fitFrame = window.requestAnimationFrame(fitNavigation);
    }
  }

  // Below the desktop breakpoint, shrink the header to a corner menu button once the page leaves the top.
  function updateCompactHeader() {
    compactFrame = null;
    const compact = !desktopQuery.matches && window.scrollY > compactHeaderOffset;

    if (compact) {
      header.classList.add("site-header--animated");
    }
    header.classList.toggle("site-header--compact", compact);
  }

  function requestCompactHeaderUpdate() {
    if (compactFrame === null) {
      compactFrame = window.requestAnimationFrame(updateCompactHeader);
    }
  }

  // Number the visible mobile menu rows so the CSS can slide them in one after another, and out in reverse.
  function numberMenuRows() {
    const rows = Array.from(navPanel.querySelectorAll(menuRowSelector))
      .filter((row) => row.getClientRects().length > 0);

    rows.forEach((row, index) => {
      row.classList.add("nav-row");
      row.style.setProperty("--nav-row", String(index));
    });
    navPanel.style.setProperty("--nav-rows", String(rows.length));
  }

  // Hide the mobile menu once its closing animation has finished.
  function finishClosingMenu() {
    if (navPanel.classList.contains("nav-panel--closing")) {
      navPanel.classList.remove("nav-panel--closing");
      navPanel.hidden = true;
    }
  }

  function setNavState(open, animate = true) {
    const closing = !open && animate && !navPanel.hidden;

    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    header.classList.toggle("site-header--menu-open", open);
    navPanel.classList.toggle("nav-panel--open", open);
    navPanel.classList.toggle("nav-panel--closing", closing);

    // Without the closing animation (reduced motion), hide the menu straight away.
    if (closing && window.getComputedStyle(navPanel).animationName === "nav-panel-out") {
      return;
    }

    navPanel.classList.remove("nav-panel--closing");
    navPanel.hidden = !open;

    if (open) {
      numberMenuRows();
    }
  }

  function setMoreState(open) {
    moreToggle.setAttribute("aria-expanded", String(open));
    moreMenu.hidden = !open;
  }

  function syncNavigation() {
    if (desktopQuery.matches) {
      navPanel.classList.remove("nav-panel--closing");
      header.classList.remove("site-header--menu-open");
      navPanel.hidden = false;
      setMoreState(false);
    } else {
      setNavState(false, false);
      moreMenu.hidden = false;
    }
  }

  navToggle.addEventListener("click", () => {
    setNavState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  moreToggle.addEventListener("click", () => {
    setMoreState(moreToggle.getAttribute("aria-expanded") !== "true");
  });

  navPanel.addEventListener("animationend", (event) => {
    if (event.target === navPanel && event.animationName === "nav-panel-out") {
      finishClosingMenu();
    }
  });

  navPanel.addEventListener("animationcancel", (event) => {
    if (event.target === navPanel && event.animationName === "nav-panel-out") {
      finishClosingMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (desktopQuery.matches && !event.target.closest(".nav-more")) {
      setMoreState(false);
    } else if (
      !desktopQuery.matches &&
      navToggle.getAttribute("aria-expanded") === "true" &&
      !event.target.closest(".nav-panel, .nav-toggle")
    ) {
      setNavState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (
      desktopQuery.matches &&
      moreToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMoreState(false);
      moreToggle.focus();
    } else if (
      !desktopQuery.matches &&
      navToggle.getAttribute("aria-expanded") === "true"
    ) {
      setNavState(false);
      navToggle.focus();
    }
  });

  navPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!desktopQuery.matches) {
        setNavState(false);
      }
    });
  });

  desktopQuery.addEventListener("change", syncNavigation);
  desktopQuery.addEventListener("change", updateCompactHeader);
  syncNavigation();
  fitNavigation();
  updateCompactHeader();
  window.addEventListener("scroll", requestCompactHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestNavigationFit);
  window.addEventListener("load", requestNavigationFit, { once: true });
  document.fonts?.ready.then(requestNavigationFit);
}

function initialiseScrollbarTrack() {
  const root = document.documentElement;
  const scrollbar = document.createElement("div");
  const track = document.createElement("div");
  const thumb = document.createElement("div");
  const scrollUpButton = document.createElement("button");
  const scrollDownButton = document.createElement("button");
  const buttonSize = 14;
  const minimumThumbSize = 44;
  const lineScrollDistance = 48;
  let updateFrame = null;
  let draggedPointer = null;
  let dragStartY = 0;
  let dragStartScrollY = 0;
  let dragMetrics = null;

  scrollbar.className = "site-scrollbar";
  scrollbar.setAttribute("role", "region");
  scrollbar.setAttribute("aria-label", "Page scrolling controls");
  track.className = "site-scrollbar-track";
  thumb.className = "site-scrollbar-thumb";
  thumb.setAttribute("role", "scrollbar");
  thumb.setAttribute("aria-label", "Page scroll position");
  thumb.setAttribute("aria-controls", "main-content");
  thumb.setAttribute("aria-orientation", "vertical");
  thumb.setAttribute("aria-valuemin", "0");
  thumb.tabIndex = 0;

  scrollUpButton.type = "button";
  scrollUpButton.className = "site-scrollbar-button site-scrollbar-button-up";
  scrollUpButton.setAttribute("aria-label", "Scroll up");
  scrollDownButton.type = "button";
  scrollDownButton.className = "site-scrollbar-button site-scrollbar-button-down";
  scrollDownButton.setAttribute("aria-label", "Scroll down");

  track.append(thumb);
  scrollbar.append(scrollUpButton, track, scrollDownButton);
  document.body.append(scrollbar);

  function getScrollMetrics() {
    const viewportHeight = Math.max(1, window.innerHeight);
    const scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
    const maximumScroll = Math.max(0, scrollHeight - viewportHeight);
    const trackHeight = Math.max(0, viewportHeight - buttonSize * 2);
    const proportionalThumbSize = trackHeight * (viewportHeight / scrollHeight);
    const thumbHeight = Math.min(trackHeight, Math.max(minimumThumbSize, proportionalThumbSize));
    const maximumThumbOffset = Math.max(0, trackHeight - thumbHeight);

    return {
      maximumScroll,
      maximumThumbOffset,
      thumbHeight,
      trackHeight,
    };
  }

  function scrollToPosition(top) {
    const originalScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top, behavior: "auto" });
    root.style.scrollBehavior = originalScrollBehavior;
  }

  function updateScrollbar() {
    updateFrame = null;
    const metrics = getScrollMetrics();
    const thumbOffset = metrics.maximumScroll
      ? (window.scrollY / metrics.maximumScroll) * metrics.maximumThumbOffset
      : 0;

    scrollbar.hidden = metrics.maximumScroll === 0;
    thumb.style.height = `${metrics.thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbOffset}px)`;
    thumb.setAttribute("aria-valuemax", String(Math.round(metrics.maximumScroll)));
    thumb.setAttribute("aria-valuenow", String(Math.round(window.scrollY)));
    thumb.setAttribute(
      "aria-valuetext",
      metrics.maximumScroll
        ? `${Math.round((window.scrollY / metrics.maximumScroll) * 100)}%`
        : "0%",
    );
  }

  function requestScrollbarUpdate() {
    if (updateFrame === null) {
      updateFrame = window.requestAnimationFrame(updateScrollbar);
    }
  }

  function scrollByDistance(distance) {
    scrollToPosition(window.scrollY + distance);
  }

  scrollUpButton.addEventListener("click", () => scrollByDistance(-lineScrollDistance));
  scrollDownButton.addEventListener("click", () => scrollByDistance(lineScrollDistance));

  track.addEventListener("pointerdown", (event) => {
    if (event.target === thumb) {
      return;
    }

    const thumbRectangle = thumb.getBoundingClientRect();
    const pageDistance = window.innerHeight * 0.9;
    scrollByDistance(event.clientY < thumbRectangle.top ? -pageDistance : pageDistance);
  });

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    draggedPointer = event.pointerId;
    dragStartY = event.clientY;
    dragStartScrollY = window.scrollY;
    dragMetrics = getScrollMetrics();
    thumb.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  thumb.addEventListener("pointermove", (event) => {
    if (event.pointerId !== draggedPointer || !dragMetrics?.maximumThumbOffset) {
      return;
    }

    const pointerDistance = event.clientY - dragStartY;
    const scrollDistance =
      (pointerDistance / dragMetrics.maximumThumbOffset) * dragMetrics.maximumScroll;
    scrollToPosition(dragStartScrollY + scrollDistance);
  });

  function stopDragging(event) {
    if (event.pointerId !== draggedPointer) {
      return;
    }

    draggedPointer = null;
    dragMetrics = null;
  }

  thumb.addEventListener("pointerup", stopDragging);
  thumb.addEventListener("pointercancel", stopDragging);
  thumb.addEventListener("lostpointercapture", stopDragging);

  thumb.addEventListener("keydown", (event) => {
    const pageDistance = window.innerHeight * 0.9;
    const keyboardActions = {
      ArrowDown: () => scrollByDistance(lineScrollDistance),
      ArrowUp: () => scrollByDistance(-lineScrollDistance),
      End: () => scrollToPosition(getScrollMetrics().maximumScroll),
      Home: () => scrollToPosition(0),
      PageDown: () => scrollByDistance(pageDistance),
      PageUp: () => scrollByDistance(-pageDistance),
    };
    const keyboardAction = keyboardActions[event.key];

    if (keyboardAction) {
      event.preventDefault();
      keyboardAction();
    }
  });

  window.addEventListener("scroll", requestScrollbarUpdate, { passive: true });
  window.addEventListener("resize", requestScrollbarUpdate);
  window.addEventListener("load", requestScrollbarUpdate, { once: true });
  root.classList.add("site-scrollbar-active");
  requestScrollbarUpdate();
}

function initialiseCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function initialiseLastUpdated() {
  const dateElements = document.querySelectorAll("[data-last-updated]");

  if (dateElements.length === 0) {
    return;
  }

  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }

    if (day % 10 === 1) {
      return "st";
    }

    if (day % 10 === 2) {
      return "nd";
    }

    if (day % 10 === 3) {
      return "rd";
    }

    return "th";
  }

  function getPublishedDate() {
    const parts = document.lastModified.match(
      /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
    );

    if (!parts) {
      return null;
    }

    const [, month, dayOfMonth, year, hours, minutes, seconds] = parts.map(Number);
    const publishedDate = new Date(year, month - 1, dayOfMonth, hours, minutes, seconds);
    const elapsedSincePublished = Date.now() - publishedDate.getTime();
    const browserSubstitutedNow = elapsedSincePublished >= 0 && elapsedSincePublished < 2000;

    return browserSubstitutedNow ? null : publishedDate;
  }

  const publishedDate = getPublishedDate();

  if (!publishedDate) {
    dateElements.forEach((element) => {
      element.textContent = "unknown";
    });

    return;
  }

  const day = publishedDate.getUTCDate();
  const monthName = publishedDate.toLocaleDateString("en-GB", {
    month: "long",
    timeZone: "UTC",
  });
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${monthName} ${publishedDate.getUTCFullYear()}`;
  const machineReadableDate = publishedDate.toISOString().slice(0, 10);

  dateElements.forEach((element) => {
    const publishedTime = document.createElement("time");

    publishedTime.dateTime = machineReadableDate;
    publishedTime.textContent = formattedDate;
    element.replaceChildren(publishedTime);
  });
}

function initialiseContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const formStatus = document.getElementById("formStatus");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const spamBlockedMessage = document.getElementById("spamBlockedMessage");
  const sendAnotherButton = document.getElementById("sendAnotherBtn");
  const tryAgainButton = document.getElementById("tryAgainBtn");

  function resetButton() {
    if (!submitButton) {
      return;
    }

    submitButton.textContent = "Send message";
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }

  function showStatus(message, type) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.hidden = false;
    formStatus.focus();
  }

  function checkSpam(email, subject) {
    if (email.trim().toLowerCase() === "sales@thomaswhite.me") {
      return {
        blocked: true,
        reason: "That email address is a known automated spam source.",
        fixes: [
          "Use your own personal or business email address.",
          "If you do not want to provide an email, you can use test@gmail.com, but I will not be able to reply.",
        ],
      };
    }

    if (subject && /^\d{6,}$/.test(subject.trim())) {
      return {
        blocked: true,
        reason:
          "The subject contains only a long number, which matches a common spam pattern.",
        fixes: [
          "Write a short description of why you are getting in touch.",
          "Alternatively, use your name as the subject.",
        ],
      };
    }

    return { blocked: false };
  }

  function showSpamBlocked(result) {
    const reason = document.getElementById("spamReason");
    const fixes = document.getElementById("spamFixes");

    if (!spamBlockedMessage || !reason || !fixes) {
      return;
    }

    reason.textContent = result.reason;
    fixes.replaceChildren();
    result.fixes.forEach((fix) => {
      const item = document.createElement("li");
      item.textContent = fix;
      fixes.appendChild(item);
    });

    form.hidden = true;
    spamBlockedMessage.hidden = false;
    spamBlockedMessage.focus();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const subject = document.getElementById("subject")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      showStatus("Please fill in all required fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    const spamResult = checkSpam(email, subject);
    if (spamResult.blocked) {
      showSpamBlocked(spamResult);
      return;
    }

    if (submitButton) {
      submitButton.textContent = "Sending…";
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.hidden = true;
      thankYouMessage.hidden = false;
      thankYouMessage.focus();
    } catch (error) {
      showStatus(
        "Sorry, there was a problem sending your message. Please try again and make sure the CAPTCHA is complete.",
        "error",
      );
      resetButton();
    }
  });

  sendAnotherButton?.addEventListener("click", () => {
    thankYouMessage.hidden = true;
    form.hidden = false;
    form.reset();
    resetButton();
    formStatus.hidden = true;
    document.getElementById("name")?.focus();
  });

  tryAgainButton?.addEventListener("click", () => {
    spamBlockedMessage.hidden = true;
    form.hidden = false;
    resetButton();
    formStatus.hidden = true;
    document.getElementById("subject")?.focus();
  });

  form.addEventListener("reset", () => {
    resetButton();
    formStatus.hidden = true;
  });
}

function initialiseGallery() {
  const dialog = document.getElementById("galleryDialog");
  const buttons = Array.from(document.querySelectorAll(".gallery-open"));

  if (!dialog || buttons.length === 0) {
    return;
  }

  const image = document.getElementById("dialogImage");
  const caption = document.getElementById("dialogCaption");
  const closeButton = document.getElementById("dialogClose");
  const previousButton = document.getElementById("dialogPrevious");
  const nextButton = document.getElementById("dialogNext");
  let currentIndex = 0;
  let trigger = null;

  function showImage(index) {
    currentIndex = (index + buttons.length) % buttons.length;
    const button = buttons[currentIndex];
    const thumbnail = button.querySelector("img");

    image.src = button.dataset.fullSrc || thumbnail.currentSrc || thumbnail.src;
    image.alt = thumbnail.alt;
    caption.textContent = button.dataset.caption || "";
  }

  function openDialog(index, sourceButton) {
    trigger = sourceButton;
    showImage(index);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    closeButton.focus();
  }

  function closeDialog() {
    dialog.close();
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => openDialog(index, button));
  });

  previousButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));
  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentIndex + 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    trigger?.focus();
  });
}

function initialiseYouTubeFacades() {
  document
    .querySelectorAll(".youtube-facade[data-videoid]")
    .forEach((facade) => {
      facade.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.className = "youtube-embed";
        iframe.src = `https://www.youtube.com/embed/${facade.dataset.videoid}?autoplay=1`;
        iframe.title = facade.dataset.videoTitle || "YouTube video";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        facade.replaceWith(iframe);
      });
    });
}

function initialiseTrackAudio() {
  const tracks = Array.from(document.querySelectorAll(".track-audio"));
  const toast = document.getElementById("playback-toast");

  tracks.forEach((track) => {
    track.addEventListener("ratechange", () => {
      if (track.playbackRate !== 1) {
        track.playbackRate = 1;
        if (toast) {
          toast.classList.add("show");
          window.setTimeout(() => toast.classList.remove("show"), 2200);
        }
      }
    });

    track.addEventListener("play", () => {
      tracks
        .filter((otherTrack) => otherTrack !== track)
        .forEach((otherTrack) => otherTrack.pause());
    });
  });
}

function initialiseInfoToggles() {
  document.querySelectorAll("[data-info-toggle]").forEach((toggle) => {
    const target = document.getElementById(
      toggle.getAttribute("aria-controls"),
    );

    if (!target) {
      return;
    }

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      target.hidden = !open;
    }

    setOpen(toggle.dataset.infoToggle === "open");
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
  });
}
