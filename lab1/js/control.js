const video = document.getElementById("video");
let hls = null;

function loadVideo(url) {
  if (hls) {
    hls.destroy();
    hls = null;
  }

  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  }
}

document.getElementById("playBtn").onclick = function () {
  video.play();
};

document.getElementById("pauseBtn").onclick = function () {
  video.pause();
};

document.getElementById("stopBtn").onclick = function () {
  video.pause();
  video.currentTime = 0;
};

document.getElementById("forwardBtn").onclick = function () {
  video.currentTime = Math.min(
    video.currentTime + 5,
    video.duration || video.currentTime + 5,
  );
};

document.getElementById("backwardBtn").onclick = function () {
  video.currentTime = Math.max(video.currentTime - 5, 0);
};

document.getElementById("load1Btn").onclick = function () {
  loadVideo(document.getElementById("url1").value);
};

document.getElementById("load2Btn").onclick = function () {
  loadVideo(document.getElementById("url2").value);
};

document.getElementById("shuffleBtn").onclick = function () {
  const urls = [
    document.getElementById("url1").value,
    document.getElementById("url2").value,
  ];

  const randomUrl = urls[Math.floor(Math.random() * urls.length)];
  loadVideo(randomUrl);
};

loadVideo(
  "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
);
