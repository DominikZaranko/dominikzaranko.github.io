/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict'; 

const filterSelect = document.querySelector('select#filter');

// Put variables in global scope to make them available to the browser console.
const video = window.video = document.querySelector('video');
const filterCanvas = document.querySelector('canvas#filterView');
const snapshotButton = document.querySelector('button#snapshot');
const snapshotCanvas = document.querySelector('canvas#snapshotView');

const cannySliders = document.querySelector('#cannySliderContainer');
const cannyThres1 = document.querySelector('input#cannyThres1');
const cannyThres2 = document.querySelector('input#cannyThres2');

let src = null;
let gray = null;
let dst = null;

filterCanvas.width = 480;
filterCanvas.height = 360;
snapshotCanvas.width = 480;
snapshotCanvas.height = 360;

snapshotButton.onclick = function() {
  const ctx = snapshotCanvas.getContext('2d');
  ctx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

  snapshotCanvas.className = filterSelect.value
  if (filterSelect.value === 'canny') {
    applyCanny(snapshotCanvas);
  }
};

filterSelect.onchange = () => {
  video.className = filterSelect.value;
  if (filterSelect.value === 'canny') {
    filterCanvas.style.display = 'block';
    cannySliders.style.display = 'block';
    if (!src) initCannyMats();
    video.classList.add('hidden-video');
    startFilterLoop();
  } else {
    filterCanvas.style.display = 'none';
    cannySliders.style.display = 'none';
    video.classList.remove('hidden-video');
  }
};

cannyThres1.addEventListener('input', () => cannyVal1.textContent = cannyThres1.value);
cannyThres2.addEventListener('input', () => cannyVal2.textContent = cannyThres2.value);
window.addEventListener('load', () => {
  filterSelect.value = 'none';
  filterSelect.onchange();
  cannyVal1.textContent = cannyThres1.value;
  cannyVal2.textContent = cannyThres2.value;
});

function initCannyMats() {
  src = new cv.Mat(filterCanvas.height, filterCanvas.width, cv.CV_8UC4);
  gray = new cv.Mat(filterCanvas.height, filterCanvas.width, cv.CV_8UC1);
  dst = new cv.Mat(filterCanvas.height, filterCanvas.width, cv.CV_8UC1);
}

function applyCanny(canvasElement) {
  const ctx = canvasElement.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  src.data.set(imageData.data);

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.Canny(gray, dst, Number(cannyThres1.value), Number(cannyThres2.value), 3, false);
  cv.cvtColor(dst, src, cv.COLOR_GRAY2RGBA);

  imageData.data.set(src.data);
  ctx.putImageData(imageData, 0, 0);
}

function startFilterLoop() {
  function processFrame() {
    if (filterSelect.value !== 'canny') return;
    try {
      const ctx = filterCanvas.getContext('2d');
      ctx.drawImage(video, 0, 0, filterCanvas.width, filterCanvas.height);
      applyCanny(filterCanvas);
    } catch (err) {
      console.warn('Canny error:', err);
    }
    requestAnimationFrame(processFrame);
  }
  requestAnimationFrame(processFrame);
}


const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
