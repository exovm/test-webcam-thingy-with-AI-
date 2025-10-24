const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Create Pose instance
const pose = new Pose.Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(results => {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.poseLandmarks) {
    // Draw keypoints
    ctx.fillStyle = "#ff0000";
    results.poseLandmarks.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw skeleton
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 2;
    Pose.POSE_CONNECTIONS.forEach(([a,b]) => {
      const p1 = results.poseLandmarks[a];
      const p2 = results.poseLandmarks[b];
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    });
  }
  ctx.restore();
});

// Start camera
const camera = new CameraUtils.Camera(video, {
  onFrame: async () => { await pose.send({image: video}); },
  width: 640,
  height: 480
});
camera.start();
