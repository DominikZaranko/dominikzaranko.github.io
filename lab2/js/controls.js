
function zoom(amount) {
  let cameraElem = document.getElementById("camera")
  let fov = cameraElem.getAttribute("camera").fov;
  let newFov = Math.max(10, Math.min(110, fov-amount));
  cameraElem.setAttribute("camera", "fov", newFov);
}

function moveCamera(x, y, z) {
  const rig = document.getElementById("camera-rig");
  const pos = rig.getAttribute("position");

  rig.setAttribute("position", {
    x: pos.x + x,
    y: pos.y + y,
    z: pos.z + z
  });
}

function rotateCamera(pitch, yaw) {
  const camera = document.getElementById("camera");
  const rot = camera.getAttribute("rotation");

  let newPitch = rot.x + pitch;
  let newYaw = rot.y + yaw;

  newPitch = Math.max(-89, Math.min(89, newPitch));

  camera.setAttribute("rotation", {
    x: newPitch,
    y: newYaw,
    z: rot.z
  });
}
