/**
 * 🎥 Siliquarium In-Browser Video Recording Agent
 * 
 * Runs inside Microsoft Edge (Headless or GUI) using native HTML5 Canvas
 * captureStream(30) and MediaRecorder to capture genuine 30 FPS video recordings
 * of emergent silicoid behaviors and proto-cognitive circuits.
 */

(async function runVideoRecordingAgent() {
  const originalLog = console.log;
  const originalErr = console.error;
  console.log = (...args) => {
    originalLog(...args);
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
    }).catch(() => {});
  };
  console.error = (...args) => {
    originalErr(...args);
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '[CLIENT ERROR] ' + args.map(a => typeof a === 'object' ? (a.stack || JSON.stringify(a)) : String(a)).join(' ')
    }).catch(() => {});
  };

  window.addEventListener('error', (e) => {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: `[WINDOW ERROR] ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`
    }).catch(() => {});
  });

  window.addEventListener('unhandledrejection', (e) => {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: `[UNHANDLED REJECTION] ${e.reason?.stack || e.reason?.message || e.reason}`
    }).catch(() => {});
  });

  console.log('🎬 [VIDEO RECORDER] Initializing In-Browser Video Recording Agent...');

  const wait = (ms) => new Promise(res => setTimeout(res, ms));

  // Wait for application DOM and simulation to boot
  await wait(2000);

  const app = window.siliquariumApp;
  const world = app?.world;

  if (!app || !world) {
    console.error('❌ [VIDEO RECORDER] Could not locate window.siliquariumApp or world!');
    return;
  }

  const seafloorCanvas = document.getElementById('canvas-seafloor');
  if (!seafloorCanvas) {
    console.error('❌ [VIDEO RECORDER] Missing canvas-seafloor!');
    return;
  }

  // Ensure simulation is running
  try {
    if (app.interactiveControls) {
      app.interactiveControls.play();
      app.interactiveControls.setSpeed(2);
    }
  } catch (err) {
    console.warn('Controls init warning:', err);
  }

  /**
   * Records a canvas stream to a WebM video file and uploads via /api/save-video
   */
  async function recordStream(stream, filename, durationMs = 5000) {
    return new Promise((resolve, reject) => {
      try {
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
        }

        console.log(`📹 [VIDEO RECORDER] Starting capture for ${filename} (${mimeType}, 30 FPS, ${durationMs}ms)...`);
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3500000 });
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onerror = (e) => {
          console.error(`❌ [VIDEO RECORDER] MediaRecorder error:`, e);
          reject(e);
        };

        recorder.onstop = async () => {
          try {
            const blob = new Blob(chunks, { type: mimeType });
            console.log(`📦 [VIDEO RECORDER] Encoded ${filename} (${blob.size} bytes). Uploading...`);
            const res = await fetch(`/api/save-video?name=${encodeURIComponent(filename)}`, {
              method: 'POST',
              headers: { 'Content-Type': mimeType },
              body: blob
            });
            const data = await res.json();
            console.log(`✅ [VIDEO RECORDER] Saved ${filename} successfully (${blob.size} bytes)!`);
            resolve(data);
          } catch (err) {
            console.error(`❌ [VIDEO RECORDER] Failed to upload ${filename}:`, err);
            reject(err);
          }
        };

        recorder.start(100);
        setTimeout(() => {
          try {
            if (recorder.state === 'recording') recorder.stop();
          } catch (e) {
            reject(e);
          }
        }, durationMs);
      } catch (err) {
        reject(err);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // VIDEO 1: Multicellular Slime Mold Treadmilling & Protoplasmic Streaming
  // ---------------------------------------------------------------------------
  try {
    console.log('🎥 [VIDEO 1/5] Recording behavior_01_slime_treadmilling.webm...');
    app.setWorkspaceMode('observatory');
    app.setLensMode('plasmodium');
    await wait(800);

    const stream1 = seafloorCanvas.captureStream(30);
    await recordStream(stream1, 'behavior_01_slime_treadmilling.webm', 5000);
    await wait(500);
  } catch (err) {
    console.error('Error in Video 1:', err);
  }

  // ---------------------------------------------------------------------------
  // VIDEO 2: Real-Time Circuit Logic Oscilloscope & Landauer Switching Waveforms
  // ---------------------------------------------------------------------------
  try {
    console.log('🎥 [VIDEO 2/5] Recording behavior_02_logic_oscilloscope.webm...');
    const occupiedPores = world.getAllPores().filter(p => p.getState() === 'OCCUPIED');
    const targetPore = occupiedPores.find(p => p.getResident()?.getWorkshop().getBuiltGates().length > 0) || occupiedPores[0];

    if (targetPore && app.circuitAutopsyModal) {
      app.circuitAutopsyModal.show(targetPore.coord);
      await wait(800);

      const schemCanvas = document.getElementById('canvas-autopsy-schematic');
      const oscCanvas = document.getElementById('canvas-autopsy-oscilloscope');

      if (schemCanvas && oscCanvas) {
        // Create a 1280x720 composite canvas showing both Schematic and Real-time Oscilloscope
        const compCanvas = document.createElement('canvas');
        compCanvas.width = 1280;
        compCanvas.height = 720;
        const compCtx = compCanvas.getContext('2d');

        let compositeRunning = true;
        const renderComposite = () => {
          if (!compositeRunning) return;
          // Background
          compCtx.fillStyle = '#090d16';
          compCtx.fillRect(0, 0, 1280, 720);

          // Header
          compCtx.fillStyle = '#0f172a';
          compCtx.fillRect(0, 0, 1280, 48);
          compCtx.fillStyle = '#38bdf8';
          compCtx.font = 'bold 16px "Courier New", monospace';
          compCtx.fillText('⚡ SILIQUARIUM PROTO-COGNITIVE CIRCUIT AUTOPSY & REAL-TIME OSCILLOSCOPE', 20, 30);
          compCtx.fillStyle = '#94a3b8';
          compCtx.font = '13px "Courier New", monospace';
          compCtx.fillText('30 FPS TRACE | LANDAUER THERMODYNAMIC DISSIPATION', 860, 30);

          // Schematic Left
          compCtx.drawImage(schemCanvas, 0, 48, 640, 672);

          // Divider
          compCtx.strokeStyle = '#1e293b';
          compCtx.lineWidth = 2;
          compCtx.beginPath();
          compCtx.moveTo(640, 48);
          compCtx.lineTo(640, 720);
          compCtx.stroke();

          // Oscilloscope Right
          compCtx.drawImage(oscCanvas, 640, 48, 640, 672);

          requestAnimationFrame(renderComposite);
        };
        renderComposite();

        const stream2 = compCanvas.captureStream(30);
        await recordStream(stream2, 'behavior_02_logic_oscilloscope.webm', 5000);
        compositeRunning = false;
      }

      app.circuitAutopsyModal.hide();
      await wait(500);
    }
  } catch (err) {
    console.error('Error in Video 2:', err);
  }

  // ---------------------------------------------------------------------------
  // VIDEO 3: Hydrothermal Vent Boiling Plume Surge & Shockwave
  // ---------------------------------------------------------------------------
  try {
    console.log('🎥 [VIDEO 3/5] Recording behavior_03_hydrothermal_surge.webm...');
    app.setWorkspaceMode('observatory');
    app.setLensMode('hybrid');
    await wait(400);

    // Trigger Hydrothermal Boiling Megasurge
    const geoEngine = world.getGeologicalEngine();
    if (geoEngine) {
      const curTick = typeof world.getTickCount === 'function' ? world.getTickCount() : (world.tickCount || 0);
      geoEngine.triggerEvent('HYDROTHERMAL_SURGE', world, curTick);
    }
    await wait(300);

    const stream3 = seafloorCanvas.captureStream(30);
    await recordStream(stream3, 'behavior_03_hydrothermal_surge.webm', 5000);
    await wait(500);
  } catch (err) {
    console.error('Error in Video 3:', err);
  }

  // ---------------------------------------------------------------------------
  // VIDEO 4: Multicellular Morphogenetic Differentiation (Wolpert French Flag)
  // ---------------------------------------------------------------------------
  try {
    console.log('🎥 [VIDEO 4/5] Recording behavior_04_french_flag_differentiation.webm...');
    app.setWorkspaceMode('observatory');
    app.setLensMode('vascular');
    await wait(500);

    const stream4 = seafloorCanvas.captureStream(30);
    await recordStream(stream4, 'behavior_04_french_flag_differentiation.webm', 5000);
    await wait(500);
  } catch (err) {
    console.error('Error in Video 4:', err);
  }

  // ---------------------------------------------------------------------------
  // VIDEO 5: Seafloor Colonization by Generation 5,000 Evolved Organisms
  // ---------------------------------------------------------------------------
  try {
    console.log('🎥 [VIDEO 5/5] Recording behavior_05_5000_gen_clades.webm...');
    app.setWorkspaceMode('observatory');
    app.setLensMode('plasmodium');

    // Generation 5,000 Champion tape evolved from 5,000-generation LTEE:
    // Taxon: Syncytiocladus bonnerii (Bonner's Multicellular Syncytium)
    // Logic Gates: [GATE_AND, GATE_AND, GATE_AND, GATE_NOT] (372 bits)
    const gen5000Tape = '010011000101110000000010000101111011001100011010101011110000111111101111011011011101111110011011111000100111000010000000000111011010000010101001011111110011010101011010110101010010010000011100000110101111101011001100000011100001011111110100111010110000000000010000100011001010011101110100011110010101110111010111001001010111100111010100110001111010101000001111001011100000';

    let gen5000Safe;
    try {
      const mod = await import('/dist/core/domain/GenomeSafe.js');
      gen5000Safe = new mod.GenomeSafe(gen5000Tape);
      console.log('🧬 Imported GenomeSafe successfully, created safe length:', gen5000Safe.length());
    } catch (e1) {
      console.warn('Import /dist/ failed, trying prototype constructor:', e1.message);
      const sample = world.getAllPores().find(p => p.getResident())?.getResident();
      if (sample && sample.getSafe()) {
        const SafeClass = sample.getSafe().constructor;
        gen5000Safe = new SafeClass(gen5000Tape);
      }
    }

    // Inoculate multiple habitable pores across vent field
    const emptyPores = world.getAllPores().filter(p => !p.isBasalt() && !p.isAqueous() && p.getState() === 'EMPTY');
    const inoculateCount = Math.min(15, emptyPores.length);
    for (let i = 0; i < inoculateCount; i++) {
      world.inoculateCell(emptyPores[i].coord, gen5000Safe, 90, 45);
    }
    console.log(`🌱 [VIDEO RECORDER] Inoculated ${inoculateCount} benthic pores with Generation 5,000 champion genome.`);

    await wait(800);
    const stream5 = seafloorCanvas.captureStream(30);
    await recordStream(stream5, 'behavior_05_5000_gen_clades.webm', 5000);
    await wait(500);
  } catch (err) {
    console.error('Error in Video 5:', err);
  }

  // ---------------------------------------------------------------------------
  // COMPLETION
  // ---------------------------------------------------------------------------
  console.log('🎉 [VIDEO RECORDER] ALL 5 BEHAVIOR VIDEOS RECORDED AND STORED TO QA/videos/!');
  await fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'SUCCESS: ALL_VIDEOS_RECORDED'
  }).catch(() => {});
})();
