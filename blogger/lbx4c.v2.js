window.addEventListener('load', function(){
  setTimeout(function(){
    (function(){

(function(){
  var existing = document.getElementById('customLightbox');
  if(existing) existing.remove();

  var images = [];
  var currentIndex = 0;

  document.querySelectorAll('.comment-body').forEach(function(c){
    var matches = c.innerText.match(/https?:\/\/\S+\.(?:png|jpg|jpeg)/gi);
    if(matches) images = images.concat(matches);
  });

  if(!images.length) return;

  document.querySelectorAll('.comment-body').forEach(function(c){
    c.innerHTML = c.innerHTML.replace(
      /(?<!href="|src=")(https?:\/\/\S+\.(?:png|jpg|jpeg))/gi,
      '<a href="$1" class="comment-img-link">$1</a>'
    );
  });

  function buildFilmstrip(){
    return images.map(function(url, i){
      return '<div class="goog-inline-block CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL_MARGIN" style="display:inline-block">' +
        '<div class="CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL" data-index="'+i+'">' +
          '<img class="CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL_IMG" src="'+url+'" style="opacity:'+(i===0?'1':'0.5')+';width:50px;height:50px;object-fit:cover"/>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  var lbx = document.createElement('div');
  lbx.id = 'customLightbox';
  lbx.className = 'CSS_LIGHTBOX';
  lbx.style.cssText = 'display:none;width:100%;height:100%';
  lbx.innerHTML =
    '<div class="CSS_LIGHTBOX_BG_MASK CSS_LIGHTBOX_BG_MASK_TRANSPARENT"></div>' +
    '<div class="CSS_LIGHTBOX_SCALED_IMAGE" style="position:absolute;top:0;left:0;right:0;bottom:59px;display:flex;align-items:center;justify-content:center">' +
      '<img id="lbxImg" class="CSS_LIGHTBOX_SCALED_IMAGE_IMG" src="" style="max-width:100%;max-height:calc(100vh - 59px);object-fit:contain;"/>' +
    '</div>' +
    '<div class="CSS_LIGHTBOX_BTN_CLOSE CSS_LIGHTBOX_BTN_CLOSE_POS" id="lbxClose"></div>' +
    '<div class="CSS_LIGHTBOX_PHOTO_BROWSE_VIEW" style="position:absolute;bottom:59px;width:100%;text-align:center">' +
      '<div class="CSS_LIGHTBOX_INDEX_INFO"><b id="lbxCurrent">1</b> of <b id="lbxTotal">'+images.length+'</b></div>' +
    '</div>' +
    '<div class="CSS_LIGHTBOX_FILMSTRIP" id="lbxFilmstrip" style="position:fixed;bottom:0;left:0;width:100%;height:59px;background-color:#000;line-height:0;overflow:hidden">' +
      '<div class="CSS_LIGHTBOX_FILMSTRIP_CONTROLS" id="lbxControls" style="position:absolute;top:0;width:124px">' +
        '<div class="CSS_LIGHTBOX_FILMSTRIP_CONTROLS_FRAME"></div>' +
      '</div>' +
      '<div class="CSS_LIGHTBOX_FILMSTRIP_THUMBNAILS_CONTAINER" id="lbxThumbs" style="position:absolute;top:0;white-space:nowrap;padding-top:5px;height:54px">'+
        buildFilmstrip() +
      '</div>' +
    '</div>';
  document.body.appendChild(lbx);

  var THUMB_W = 53;

  function updateFilmstrip(){
    var filmW = document.getElementById('lbxFilmstrip').offsetWidth;
    var centerLeft = (filmW / 2) - (currentIndex * THUMB_W) - (THUMB_W / 2);
    document.getElementById('lbxThumbs').style.left = centerLeft + 'px';
    var controlsLeft = (filmW / 2) - 62;
    document.getElementById('lbxControls').style.left = controlsLeft + 'px';
    document.querySelectorAll('.CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL_IMG').forEach(function(img, i){
      img.style.opacity = i === currentIndex ? '1' : '0.5';
    });
  }

  function showImage(index){
    if(index < 0 || index >= images.length) return;
    currentIndex = index;
    document.getElementById('lbxImg').src = images[currentIndex];
    document.getElementById('lbxCurrent').textContent = currentIndex + 1;
    updateFilmstrip();
  }

  document.querySelectorAll('.comment-img-link').forEach(function(a, i){
    a.addEventListener('click', function(e){
      e.preventDefault();
      document.getElementById('customLightbox').style.display = 'block';
      document.documentElement.style.overflow = 'hidden';
      showImage(i);
    });
  });

  document.querySelectorAll('.CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL').forEach(function(thumb){
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', function(){
      showImage(parseInt(this.dataset.index));
    });
  });

  function closeLightbox(){
    document.getElementById('customLightbox').style.display = 'none';
    document.getElementById('lbxImg').src = '';
    document.documentElement.style.overflow = '';
  }

  document.getElementById('lbxClose').addEventListener('click', closeLightbox);
  document.getElementById('customLightbox').addEventListener('click', function(e){
    if(e.target === this || e.target.classList.contains('CSS_LIGHTBOX_BG_MASK'))
      closeLightbox();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if(e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  window.addEventListener('resize', updateFilmstrip);
})();





    })();
  }, 3000);
});
