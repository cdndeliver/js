window.addEventListener('load', function(){
(function(){
  // 1. Cleanup existing instance (Defensive)
  var existing = document.getElementById('customLightbox');
  if(existing) existing.remove();

  var images = [];
  var currentIndex = 0;
  var THUMB_W = 53;

  // 2. Reusable core parser function for initial load and lazy loads
  function processCommentNode(c){
    var matches = c.innerText.match(/https?:\/\/\S+\.(?:png|jpg|jpeg)/gi);
    if(matches) images = images.concat(matches);
    
    c.innerHTML = c.innerHTML.replace(
      /(?<!href="|src=")(https?:\/\/\S+\.(?:png|jpg|jpeg))/gi,
      '<a href="$1" class="comment-img-link">$1</a>'
    );
  }

  // 3. Initial DOM scan
  document.querySelectorAll('.comment-body').forEach(processCommentNode);
  if(!images.length) return;

  // 4. Build Lightbox DOM (Using position: fixed to prevent layout shifts)
  var lbx = document.createElement('div');
  lbx.id = 'customLightbox';
  lbx.className = 'CSS_LIGHTBOX';
  lbx.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;';
  lbx.innerHTML =
    '<div class="CSS_LIGHTBOX_BG_MASK CSS_LIGHTBOX_BG_MASK_TRANSPARENT"></div>' +
    '<div class="CSS_LIGHTBOX_SCALED_IMAGE" style="position:absolute;top:0;left:0;right:0;bottom:59px;display:flex;align-items:center;justify-content:center">' +
      '<img id="lbxImg" class="CSS_LIGHTBOX_SCALED_IMAGE_IMG" src="" style="max-width:100%;max-height:calc(100vh - 59px);object-fit:contain;"/>' +
    '</div>' +
    '<div class="CSS_LIGHTBOX_BTN_CLOSE CSS_LIGHTBOX_BTN_CLOSE_POS" id="lbxClose"></div>' +
    '<div class="CSS_LIGHTBOX_PHOTO_BROWSE_VIEW" style="position:absolute;bottom:59px;width:100%;text-align:center">' +
      '<div class="CSS_LIGHTBOX_INDEX_INFO"><b id="lbxCurrent">1</b> of <b id="lbxTotal">0</b></div>' +
    '</div>' +
    '<div class="CSS_LIGHTBOX_FILMSTRIP" id="lbxFilmstrip" style="position:absolute;bottom:0;left:0;width:100%;height:59px;background-color:#000;line-height:0;overflow:hidden">' +
      '<div class="CSS_LIGHTBOX_FILMSTRIP_CONTROLS" id="lbxControls" style="position:absolute;top:0;width:124px;pointer-events:none;">' +
        '<div class="CSS_LIGHTBOX_FILMSTRIP_CONTROLS_FRAME"></div>' +
      '</div>' +
      '<div class="CSS_LIGHTBOX_FILMSTRIP_THUMBNAILS_CONTAINER" id="lbxThumbs" style="position:absolute;top:0;white-space:nowrap;padding-top:5px;height:54px;transition:left 0.2s ease;">' +
      '</div>' +
    '</div>';
  document.body.appendChild(lbx);

  // 5. Cache DOM Elements (Massive performance boost for resizing)
  var lbxThumbs = document.getElementById('lbxThumbs');
  var lbxControls = document.getElementById('lbxControls');
  var lbxFilmstrip = document.getElementById('lbxFilmstrip');
  var lbxImg = document.getElementById('lbxImg');
  var lbxCurrent = document.getElementById('lbxCurrent');
  var lbxTotal = document.getElementById('lbxTotal');

  // 6. UI Update Logic
  function buildFilmstrip(){
    return images.map(function(url, i){
      return '<div class="goog-inline-block CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL_MARGIN" style="display:inline-block">' +
        '<div class="CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL" data-index="'+i+'" style="cursor:pointer;">' +
          '<img class="CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL_IMG" src="'+url+'" style="opacity:'+(i===0?'1':'0.5')+';width:50px;height:50px;object-fit:cover"/>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function updateFilmstrip(){
    var filmW = lbxFilmstrip.offsetWidth;
    var centerLeft = (filmW / 2) - (currentIndex * THUMB_W) - (THUMB_W / 2);
    lbxThumbs.style.left = centerLeft + 'px';
    var controlsLeft = (filmW / 2) - 62;
    lbxControls.style.left = controlsLeft + 'px';
    
    var thumbImgs = lbxThumbs.querySelectorAll('.CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL_IMG');
    thumbImgs.forEach(function(img, i){
      img.style.opacity = i === currentIndex ? '1' : '0.5';
    });
  }

  function showImage(index){
    if(index < 0 || index >= images.length) return;
    currentIndex = index;
    lbxImg.src = images[currentIndex];
    lbxCurrent.textContent = currentIndex + 1;
    updateFilmstrip();
  }

  function closeLightbox(){
    lbx.style.display = 'none';
    lbxImg.src = '';
    document.documentElement.style.overflow = '';
  }

  // Populate initial filmstrip
  lbxThumbs.innerHTML = buildFilmstrip();
  lbxTotal.textContent = images.length;

  // 7. Event Delegation (Handles ALL clicks without loops or re-binding)
  document.addEventListener('click', function(e){
    // Text Link Click
    var link = e.target.closest('.comment-img-link');
    if(link){
      e.preventDefault();
      lbx.style.display = 'block';
      document.documentElement.style.overflow = 'hidden';
      var targetIndex = images.indexOf(link.getAttribute('href'));
      if(targetIndex !== -1) showImage(targetIndex);
      return;
    }

    // Thumbnail Click
    var thumb = e.target.closest('.CSS_LIGHTBOX_FILMSTRIP_THUMBNAIL');
    if(thumb){
      showImage(parseInt(thumb.dataset.index, 10));
      return;
    }

    // Close Button or Background Click
    if(e.target.id === 'lbxClose' || e.target.classList.contains('CSS_LIGHTBOX_BG_MASK')){
      closeLightbox();
    }
  });

  // 8. Global Listeners (Checked against display state to prevent memory leak bugs)
  document.addEventListener('keydown', function(e){
    if(lbx.style.display !== 'block') return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if(e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  window.addEventListener('resize', function(){
    if(lbx.style.display === 'block') updateFilmstrip();
  });

  // 9. MutationObserver for Lazy Loading / Load More Comments
  var commentsContainer = document.querySelector('.comments') || document.body;
  new MutationObserver(function(mutations){
    var addedNewImages = false;

    mutations.forEach(function(mutation){
      mutation.addedNodes.forEach(function(node){
        if(node.nodeType !== 1) return;
        
        var newComments = node.classList.contains('comment-body')
          ? [node]
          : Array.from(node.querySelectorAll('.comment-body'));
          
        if(newComments.length){
          newComments.forEach(processCommentNode);
          addedNewImages = true;
        }
      });
    });

    // Only force a DOM repaint if we actually appended new URLs
    if(addedNewImages){
      lbxThumbs.innerHTML = buildFilmstrip();
      lbxTotal.textContent = images.length;
    }
  }).observe(commentsContainer, { childList: true, subtree: true });

})();
});
