/**
 * EDGERUNNER FREIGHT // NIGHT CITY LOGISTICS
 * Canvas Visualizers: Lucy's Cyan/Magenta Particles & Night City Route Hubs
 */

// 1. Ambient Background Particle Canvas (Lucy's Cyan, Magenta & Lavender Particles)
(function initAmbientNetwork() {
  const canvas = document.getElementById('canvas-network');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.7 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.3;
      const rand = Math.random();
      if (rand > 0.5) {
        this.color = 'rgba(0, 240, 255,'; // Lucy Cyan
        this.glow = '#00f0ff';
      } else if (rand > 0.25) {
        this.color = 'rgba(255, 0, 127,'; // Lucy Hot Magenta
        this.glow = '#ff007f';
      } else {
        this.color = 'rgba(168, 85, 247,'; // Lucy Lavender / Violet
        this.glow = '#a855f7';
      }
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.glow;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 22), 55);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting neural lines in Lucy's cyan
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }
  render();
})();

// 2. Interactive Night City Route Matrix Visualizer
(function initNightCityRouteMap() {
  const mapCanvas = document.getElementById('map-network-canvas');
  if (!mapCanvas) return;
  const ctx = mapCanvas.getContext('2d');
  let width, height;

  function resizeMap() {
    const rect = mapCanvas.parentElement.getBoundingClientRect();
    width = mapCanvas.width = rect.width;
    height = mapCanvas.height = rect.height;
  }

  window.addEventListener('resize', resizeMap);
  resizeMap();

  // Night City Districts
  const hubs = [
    { id: 'watson', name: 'Watson // Kabuki Hub', x: 0.32, y: 0.32, type: 'Cyberware & Tech Depot', activeUnits: 840, status: 'NETRUNNER ONLINE' },
    { id: 'corpo', name: 'City Center // Corpo Plaza', x: 0.46, y: 0.42, type: 'Arasaka Tier 1 Vault', activeUnits: 1450, status: 'MÁXIMA CUSTODIA' },
    { id: 'westbrook', name: 'Westbrook // Japantown', x: 0.58, y: 0.35, type: 'Luxury High-Speed Terminal', activeUnits: 620, status: 'EN RUTA' },
    { id: 'santo', name: 'Santo Domingo // Arroyo', x: 0.56, y: 0.60, type: 'Heavy Haulers Yard', activeUnits: 1890, status: 'DESPACHO ACTIVO' },
    { id: 'heywood', name: 'Heywood // The Glen', x: 0.38, y: 0.54, type: 'Inter-District Crossroads', activeUnits: 980, status: 'VIGILANCIA COMPLETA' },
    { id: 'pacifica', name: 'Pacifica // Coastview', x: 0.36, y: 0.74, type: 'Covert Deep Harbor', activeUnits: 430, status: 'SUBTERRÁNEO' },
    { id: 'badlands', name: 'Badlands // Nomad Outpost', x: 0.82, y: 0.68, type: 'Armored Convoy Gate', activeUnits: 1120, status: 'CORREDOR LIBRE' },
    { id: 'waterfront', name: 'Arasaka Waterfront Terminal', x: 0.22, y: 0.44, type: 'Deep Sea Heavy Intermodal', activeUnits: 2150, status: 'BLINDADO N6' },
    { id: 'orbital', name: 'Night City Orbital Spaceport', x: 0.75, y: 0.26, type: 'Suborbital AV-4 Launchpad', activeUnits: 510, status: 'OPERATIVO 100%' },
    { id: 'northside', name: 'Northside Industrial District', x: 0.35, y: 0.20, type: 'Mega Fabrication Yard', activeUnits: 1320, status: 'ROBOTIZADO' }
  ];

  const routes = [
    { from: 0, to: 1, mode: 'cyan' },
    { from: 1, to: 2, mode: 'cyan' },
    { from: 1, to: 4, mode: 'ground' },
    { from: 4, to: 3, mode: 'ground' },
    { from: 3, to: 6, mode: 'armored' },
    { from: 4, to: 5, mode: 'ground' },
    { from: 0, to: 7, mode: 'armored' },
    { from: 7, to: 4, mode: 'ground' },
    { from: 2, to: 8, mode: 'av' },
    { from: 1, to: 8, mode: 'av' },
    { from: 0, to: 9, mode: 'ground' },
    { from: 9, to: 2, mode: 'cyan' },
    { from: 3, to: 2, mode: 'ground' },
    { from: 6, to: 8, mode: 'av' }
  ];

  const packets = [];
  for (let i = 0; i < 28; i++) {
    const routeIndex = Math.floor(Math.random() * routes.length);
    const randColor = Math.random();
    packets.push({
      routeIndex: routeIndex,
      progress: Math.random(),
      speed: Math.random() * 0.005 + 0.004,
      reverse: Math.random() > 0.5,
      color: randColor > 0.5 ? '#00f0ff' : (randColor > 0.25 ? '#ff007f' : '#a855f7')
    });
  }

  let hoveredHub = null;

  mapCanvas.addEventListener('mousemove', (e) => {
    const rect = mapCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    hoveredHub = null;
    hubs.forEach(hub => {
      const hx = hub.x * width;
      const hy = hub.y * height;
      const dist = Math.hypot(mouseX - hx, mouseY - hy);
      if (dist < 20) {
        hoveredHub = hub;
      }
    });
  });

  mapCanvas.addEventListener('mouseleave', () => {
    hoveredHub = null;
  });

  function drawRouteMap() {
    ctx.clearRect(0, 0, width, height);

    // Night City Radar Rings in Lucy's Cyan
    const cx = width * 0.46;
    const cy = height * 0.48;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let r = 80; r < Math.max(width, height); r += 90) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid coordinates lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Route Lines
    routes.forEach(route => {
      const h1 = hubs[route.from];
      const h2 = hubs[route.to];
      const x1 = h1.x * width;
      const y1 = h1.y * height;
      const x2 = h2.x * width;
      const y2 = h2.y * height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - 20;
      ctx.quadraticCurveTo(mx, my, x2, y2);

      if (route.mode === 'cyan') {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.setLineDash([6, 3]);
        ctx.lineWidth = 1.8;
      } else if (route.mode === 'av') {
        ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.4;
      } else if (route.mode === 'armored') {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([]);
        ctx.lineWidth = 1.2;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Moving High-Speed Data/Cargo Packets
    packets.forEach(pkt => {
      pkt.progress += pkt.speed;
      if (pkt.progress >= 1) {
        pkt.progress = 0;
        pkt.routeIndex = Math.floor(Math.random() * routes.length);
      }

      const route = routes[pkt.routeIndex];
      const h1 = hubs[pkt.reverse ? route.to : route.from];
      const h2 = hubs[pkt.reverse ? route.from : route.to];
      const x1 = h1.x * width;
      const y1 = h1.y * height;
      const x2 = h2.x * width;
      const y2 = h2.y * height;

      const t = pkt.progress;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - 20;
      const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
      const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;

      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = pkt.color;
      ctx.shadowColor = pkt.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Hub Nodes in Lucy's Cyan & Violet
    const now = Date.now() * 0.0035;
    hubs.forEach(hub => {
      const hx = hub.x * width;
      const hy = hub.y * height;
      const isHovered = hoveredHub === hub;

      const ringRadius = 8 + Math.sin(now + hub.x * 8) * 4.5;
      ctx.beginPath();
      ctx.arc(hx, hy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? 'rgba(0, 240, 255, 0.95)' : 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(hx, hy, isHovered ? 6.5 : 4.2, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#ffffff' : '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = isHovered ? 18 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '10px "SF Mono", monospace';
      ctx.fillStyle = isHovered ? '#00f0ff' : 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(hub.name.split('//')[0].trim(), hx, hy - 12);
    });

    // Draw Tooltip on Hover
    if (hoveredHub) {
      const hx = hoveredHub.x * width;
      const hy = hoveredHub.y * height;

      const tooltipWidth = 210;
      const tooltipHeight = 78;
      let tx = hx + 15;
      let ty = hy - 45;

      if (tx + tooltipWidth > width) tx = hx - tooltipWidth - 15;
      if (ty < 10) ty = 10;

      ctx.fillStyle = 'rgba(10, 14, 24, 0.96)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(tx, ty, tooltipWidth, tooltipHeight, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hoveredHub.name, tx + 12, ty + 20);

      ctx.font = '10px "SF Mono", monospace';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`● Función: ${hoveredHub.type}`, tx + 12, ty + 38);

      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillStyle = '#9aa8bc';
      ctx.fillText(`Unidades Activas: ${hoveredHub.activeUnits.toLocaleString()}`, tx + 12, ty + 54);

      ctx.fillStyle = '#ff007f';
      ctx.fillText(`ICE Status: ${hoveredHub.status}`, tx + 12, ty + 69);
    }

    requestAnimationFrame(drawRouteMap);
  }

  drawRouteMap();
})();
