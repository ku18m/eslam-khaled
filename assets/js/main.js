/* Eslam | Khaled: language toggle (Arabic default, English) + small delights.
   Arabic lives in the HTML; English lives here. No dependencies. */
(function () {
  "use strict";

  var EN = {
    "services": "Hair · Beard · Skin",
    "greeting": "Looking sharp.",
    "pay.title": "Pay",
    "pay.vf": "Vodafone Cash",
    "pay.vf.hint": "From your wallet",
    "pay.ip": "InstaPay",
    "pay.ip.hint": "Instant transfer",
    "contact.title": "Contact",
    "contact.save": "Save contact",
    "contact.call": "Call",
    "contact.wa": "WhatsApp",
    "follow.title": "Follow us",
    "follow.fb": "Facebook",
    "follow.fb.hint": "Shop photos & news",
    "follow.tt": "TikTok",
    "follow.tt.hint": "Videos from the chair",
    "lang.label": "Language",
    "title": "Eslam | Khaled — Hair · Beard · Skin"
  };

  var root = document.documentElement;
  var textNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var ariaNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-aria]"));
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".lang [data-lang]"));
  var swapEl = document.querySelector(".swap");
  var greeting = document.querySelector(".greeting");
  var mark = document.querySelector(".mark");
  var STORE_KEY = "ek-lang";

  // Capture the Arabic copy straight from the markup.
  var AR = { "title": document.title };
  textNodes.forEach(function (n) { AR[n.getAttribute("data-i18n")] = n.textContent; });
  ariaNodes.forEach(function (n) { AR[n.getAttribute("data-i18n-aria")] = n.getAttribute("aria-label"); });

  var store = {
    get: function () { try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set: function (v) { try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* private mode */ } }
  };

  function isLang(l) { return l === "ar" || l === "en"; }

  var current = "ar";

  function apply(lang) {
    var dict = lang === "en" ? EN : AR;
    textNodes.forEach(function (n) {
      var v = dict[n.getAttribute("data-i18n")];
      if (v != null) n.textContent = v;
    });
    ariaNodes.forEach(function (n) {
      var v = dict[n.getAttribute("data-i18n-aria")];
      if (v != null) n.setAttribute("aria-label", v);
    });
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = dict.title;
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    current = lang;
  }

  function restart(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    el.style.animation = "none";
    void el.offsetWidth; // reflow so the animation starts over
    el.style.animation = "";
    el.classList.add(cls);
  }

  function syncUrl(lang) {
    try {
      var url = new URL(window.location.href);
      if (!url.searchParams.has("lang")) return;
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url);
    } catch (e) { /* old browser */ }
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  function switchTo(lang) {
    if (!isLang(lang) || lang === current) return;
    store.set(lang);
    syncUrl(lang);

    if (reduceMotion && reduceMotion.matches) {
      apply(lang);
      return;
    }

    if (document.startViewTransition) {
      document.startViewTransition(function () {
        apply(lang);
        restart(greeting, "is-rewriting");
      });
      return;
    }

    // Fallback: quick blur-fade out, swap, fade back in.
    swapEl.classList.add("is-swapping");
    window.setTimeout(function () {
      apply(lang);
      restart(greeting, "is-rewriting");
      swapEl.classList.remove("is-swapping");
    }, 170);
  }

  // Initial language: ?lang= wins, then the visitor's last choice, then Arabic.
  var fromUrl = null;
  try { fromUrl = new URLSearchParams(window.location.search).get("lang"); } catch (e) { /* ignore */ }
  var initial = isLang(fromUrl) ? fromUrl : (isLang(store.get()) ? store.get() : "ar");
  if (initial !== "ar") apply(initial);

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { switchTo(b.getAttribute("data-lang")); });
  });

  // Tap the logo: the gold light passes over it again.
  if (mark) {
    mark.addEventListener("click", function () {
      if (reduceMotion && reduceMotion.matches) return;
      var glint = mark.querySelector(".mark__glint");
      // restart the pseudo-element animation by re-inserting its host
      var clone = glint.cloneNode(true);
      glint.parentNode.replaceChild(clone, glint);
      mark.classList.add("is-glinting");
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
