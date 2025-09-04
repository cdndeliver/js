document.addEventListener("DOMContentLoaded", function() {
  var vids = document.querySelectorAll("iframe.BLOG_video_class");
  vids.forEach(function(orig) {
    var id = orig.getAttribute("youtube-src-id");
    if(!id) return;

    // create wrapper
    var wrap = document.createElement("div");
    wrap.className = "yt-wrap";

    // create clickable box
    var box = document.createElement("div");
    box.className = "yt-box";
    box.setAttribute("role","button");
    box.setAttribute("aria-label","Play video");
    box.onclick = function() {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      iframe.frameBorder = 0;
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowFullscreen = true;
      iframe.style.width = "100%";
      iframe.style.height = "360px"; // adjust as needed
      box.parentNode.replaceChild(iframe, box);
    };

    // thumbnail image
    var img = document.createElement("img");
    img.className = "yt-thumb";
    img.src = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
    img.alt = id;
    box.appendChild(img);

    wrap.appendChild(box);

    // replace original iframe
    orig.parentNode.replaceChild(wrap, orig);
  });
});
