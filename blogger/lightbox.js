function fixLightboxHeight() {
  var h = window.innerHeight + "px";
  var els = document.querySelectorAll(
    ".CSS_LIGHTBOX_BG, .CSS_LIGHTBOX, .CSS_LIGHTBOX_SCALED_IMAGE"
  );
  for (var i = 0; i < els.length; i++) {
    els[i].style.setProperty("height", h, "important");
  }
}

function observeLightbox() {
  var body = document.body;
  var obs = new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      if (m.addedNodes.length) {
        fixLightboxHeight();
      }
    });
  });
  obs.observe(body, { childList: true, subtree: true });
}

window.addEventListener("resize", fixLightboxHeight);
window.addEventListener("orientationchange", fixLightboxHeight);
window.addEventListener("load", function() {
  observeLightbox();
  fixLightboxHeight();
});
