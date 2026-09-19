/**
 * EDGERUNNER FREIGHT // NIGHT CITY LOGISTICS
 * Main Application Logic: Tracking System, Smart Quote Engine & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatsCounters();
  initTrackingSystem();
  initQuoteCalculator();
  initModalAndBooking();
  initAudioToggle();
  initSmoothScroll();
});

/* ==========================================================================
   1. REAL-TIME STATS COUNTER ANIMATION
   ========================================================================== */
function initLiveStatsCounters() {
  const statElements = document.querySelectorAll('.telemetry-value[data-target]');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        
        let current = 0;
        const duration = 1800;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()}${suffix}`;
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. SHIPMENT TRACKING ENGINE (HUD) - EDGERUNNERS NIGHT CITY EDITION
   ========================================================================== */
const sampleShipments = {
  'SANDEV-2077-NC': {
    id: 'SANDEV-2077-NC',
    client: 'David Martinez // Edgerunner Crew',
    cargo: 'Unidades Sandevistan Militar Militech v4',
    type: 'Cyberware Clase Militar',
    mode: 'Tránsito Sandevistan Overdrive // Quadra Turbo Cargo',
    origin: 'Santo Domingo // Arroyo, Night City',
    destination: 'City Center // Corpo Plaza Arasaka Tower',
    currentLocation: 'Corredor Autopista Heywood 101 Norte',
    gpsCoords: '32.7157° N, 117.1611° W (NC Grid #401)',
    speed: '168 km/h (Sandevistan Overdrive Activo)',
    temperature: '18.0°C (Estabilidad Neural 99.8%)',
    securitySeal: 'EDGERUNNER-HASH-2077-VERIFIED',
    eta: 'En 18 Minutos (Despacho Hiperrápido)',
    activeStep: 3,
    steps: [
      { name: 'Extracción en Arroyo', date: '05 Sep 11:10', completed: true },
      { name: 'Cifrado Neural ICE', date: '05 Sep 11:22', completed: true },
      { name: 'Cruzando Heywood', date: '05 Sep 11:38', completed: true, current: true },
      { name: 'Ingreso Anillo Corpo Plaza', date: '05 Sep 11:50 (Est)', completed: false },
      { name: 'Entrega en Bóveda Arasaka', date: '05 Sep 11:56 (Est)', completed: false }
    ]
  },
  'LUCY-CYBER-88': {
    id: 'LUCY-CYBER-88',
    client: 'Kushinada Deep-Net Logistics',
    cargo: 'Servidores Neurales Crio-Sumergidos & ICE Breakers',
    type: 'Cadena de Frío Estricta Trauma-Spec',
    mode: 'Aerodino Suborbital AV-4 // Vuelo Nocturno NC-808',
    origin: 'Watson // Kabuki Market, Night City',
    destination: 'Arasaka Waterfront // Deep Vault',
    currentLocation: 'Corredor Aéreo Suborbital Bahía Watson',
    gpsCoords: '32.7300° N, 117.1850° W (Altitud: 1,200m)',
    speed: '440 km/h (Vector AV Estable)',
    temperature: '-78.2°C (Crio-Inmersión Óptima)',
    securitySeal: 'DEEP-NET-SEAL-8891',
    eta: 'En 25 Minutos',
    activeStep: 2,
    steps: [
      { name: 'Inmersión Crio-Protectora', date: '05 Sep 10:45', completed: true },
      { name: 'Despegue Helipuerto Kabuki', date: '05 Sep 11:15', completed: true },
      { name: 'Tránsito Vector Aéreo AV-4', date: '05 Sep En Vuelo', completed: true, current: true },
      { name: 'Escaneo Aduana Arasaka', date: '05 Sep 11:55 (Est)', completed: false },
      { name: 'Suministro a Deep-Net Core', date: '05 Sep 12:10 (Est)', completed: false }
    ]
  },
  'MAINE-TITAN-01': {
    id: 'MAINE-TITAN-01',
    client: 'Maine Tactical Armored Transport',
    cargo: 'Blindajes de Titanio y Chasis de Cyberware Pesado',
    type: 'Carga Blindada & Alta Potencia',
    mode: 'Convoy Blindado Mackinaw Tier 6 // Escolta Doble',
    origin: 'Badlands // Campamento Nomad Solar',
    destination: 'Westbrook // Japantown Luxury Port',
    currentLocation: 'Carretera Libre Badlands Km 34',
    gpsCoords: '32.6500° N, 117.0800° W (Frontera Badlands)',
    speed: '95 km/h (Modo Acorazado Nivel 6)',
    temperature: '22.0°C (Sistemas de Combate en Espera)',
    securitySeal: 'ARASAKA-BYPASS-TIER6',
    eta: 'Hoy a las 13:40 hrs',
    activeStep: 2,
    steps: [
      { name: 'Carga en Campamento Nomad', date: '05 Sep 09:00', completed: true },
      { name: 'Activación de Blindaje N6', date: '05 Sep 10:15', completed: true },
      { name: 'Cruce del Anillo Periférico', date: '05 Sep En Ruta', completed: true, current: true },
      { name: 'Punto de Control Westbrook', date: '05 Sep 13:00 (Est)', completed: false },
      { name: 'Descarga en Almacén Japantown', date: '05 Sep 13:40 (Est)', completed: false }
    ]
  }
};

function initTrackingSystem() {
  const trackBtn = document.getElementById('btn-track-submit');
  const trackInput = document.getElementById('tracking-code-input');
  const resultsCard = document.getElementById('tracking-results-card');
  const samplePills = document.querySelectorAll('.sample-code-pill');

  if (!trackBtn || !trackInput) return;

  function performTrack(code) {
    const cleanCode = (code || trackInput.value).trim().toUpperCase();
    if (!cleanCode) {
      showToast('⚠️ Ingresa una guía de rastreo Night City.');
      trackInput.focus();
      return;
    }

    window.cyberSound.playScan();

    // Show loading state on button
    const origBtnText = trackBtn.innerHTML;
    trackBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>
      <span>SINCRONIZANDO ICE...</span>
    `;

    setTimeout(() => {
      trackBtn.innerHTML = origBtnText;
      window.cyberSound.playConfirm();

      // Retrieve data or generate dynamic record
      let data = sampleShipments[cleanCode];
      if (!data) {
        data = {
          id: cleanCode,
          client: 'Despacho Comercial Independiente // Night City Fixer',
          cargo: 'Contenedor Sellado de Componentes Cyberpunk',
          type: 'Carga Especial Blindada',
          mode: 'Flota Rápida Edgerunner // Unidad EDG-99',
          origin: 'Watson // Distrito Kabuki',
          destination: 'Heywood // The Glen Terminal',
          currentLocation: 'Viaducto Elevado City Center',
          gpsCoords: '32.7200° N, 117.1500° W',
          speed: '110 km/h (Corredor Rápido)',
          temperature: '21.0°C (Estable)',
          securitySeal: `SANDY-HASH-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
          eta: 'En 45 Minutos',
          activeStep: 2,
          steps: [
            { name: 'Recepción en Taller', date: '05 Sep 10:00', completed: true },
            { name: 'Cifrado ICE & Sello', date: '05 Sep 10:45', completed: true },
            { name: 'En Tránsito Inter-Distrital', date: '05 Sep En Camino', completed: true, current: true },
            { name: 'Llegada a Checkpoint', date: '05 Sep 12:15 (Est)', completed: false },
            { name: 'Entrega al Destinatario', date: '05 Sep 12:45 (Est)', completed: false }
          ]
        };
      }

      renderTrackingView(data);
      resultsCard.style.display = 'block';
      resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast(`⚡ Carga ${data.id} sincronizada con Sandevistan.`);
    }, 400);
  }

  trackBtn.addEventListener('click', () => performTrack());
  trackInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performTrack();
  });

  samplePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const code = pill.getAttribute('data-code');
      trackInput.value = code;
      window.cyberSound.playClick();
      performTrack(code);
    });
  });
}

function renderTrackingView(data) {
  // Populate Header
  document.getElementById('track-view-id').textContent = data.id;
  document.getElementById('track-view-cargo').textContent = `${data.cargo} • ${data.client}`;
  document.getElementById('track-view-eta').textContent = data.eta;
  document.getElementById('track-view-origin').textContent = data.origin.split('//')[0].trim();
  document.getElementById('track-view-dest').textContent = data.destination.split('//')[0].trim();

  // Populate Telemetry chips
  document.getElementById('track-chip-location').textContent = data.currentLocation;
  document.getElementById('track-chip-speed').textContent = data.speed;
  document.getElementById('track-chip-temp').textContent = data.temperature;
  document.getElementById('track-chip-seal').textContent = data.securitySeal;

  // Populate Timeline Steps
  const timelineContainer = document.getElementById('track-timeline-container');
  timelineContainer.innerHTML = '';

  data.steps.forEach((step, idx) => {
    const isCompleted = step.completed;
    const isCurrent = step.current;
    
    const stepEl = document.createElement('div');
    stepEl.className = `timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`;
    
    let iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
    if (!isCompleted && !isCurrent) {
      iconSvg = `<span>${idx + 1}</span>`;
    }

    stepEl.innerHTML = `
      <div class="step-node">${iconSvg}</div>
      <div class="step-title">${step.name}</div>
      <div class="step-date">${step.date}</div>
    `;
    timelineContainer.appendChild(stepEl);
  });
}

/* ==========================================================================
   3. SMART QUOTE CALCULATOR ENGINE - MXN / USD CURRENCY SWITCHER
   ========================================================================== */
const USD_TO_MXN_RATE = 19.80; // 1 USD = $19.80 MXN
let activeCurrency = 'MXN'; // Default to Pesos Mexicanos as requested

function initQuoteCalculator() {
  const originSelect = document.getElementById('calc-origin');
  const destSelect = document.getElementById('calc-destination');
  const modeSelect = document.getElementById('calc-mode');
  const weightSlider = document.getElementById('calc-weight');
  const weightVal = document.getElementById('calc-weight-val');
  const volumeInput = document.getElementById('calc-volume');
  const cargoOptions = document.querySelectorAll('.cargo-option-btn');
  const checkInsurance = document.getElementById('calc-extra-insurance');
  const checkExpress = document.getElementById('calc-extra-express');

  // Currency buttons
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const currencyLegend = document.getElementById('currency-legend-label');
  const btnBookingText = document.getElementById('btn-booking-text');

  // Summary outputs
  const outBase = document.getElementById('quote-out-base');
  const outFreight = document.getElementById('quote-out-freight');
  const outExtras = document.getElementById('quote-out-extras');
  const outTotal = document.getElementById('quote-out-total');
  const outEta = document.getElementById('quote-out-eta');
  const outDistance = document.getElementById('quote-out-distance');

  let selectedCargoType = 'general';
  let cargoMultipliers = {
    'general': 1.0,
    'cold': 1.45,
    'hightech': 1.65,
    'heavy': 1.4
  };

  const distances = {
    'watson-santo': 28,
    'watson-corpo': 12,
    'watson-westbrook': 16,
    'watson-badlands': 58,
    'corpo-santo': 18,
    'corpo-westbrook': 10,
    'corpo-pacifica': 22,
    'corpo-badlands': 62,
    'santo-badlands': 42,
    'westbrook-badlands': 52,
    'pacifica-badlands': 70,
    'default': 25
  };

  function formatMoney(amountInUSD) {
    if (activeCurrency === 'MXN') {
      const amountInMXN = amountInUSD * USD_TO_MXN_RATE;
      return `$${amountInMXN.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
    } else {
      return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
  }

  function updateCalculation() {
    const origin = originSelect ? originSelect.value : 'watson';
    const destination = destSelect ? destSelect.value : 'corpo';
    const mode = modeSelect ? modeSelect.value : 'sandy';
    const weightKg = weightSlider ? parseFloat(weightSlider.value) : 1500;
    const volumeM3 = volumeInput ? parseFloat(volumeInput.value) || 6 : 6;
    const hasInsurance = checkInsurance ? checkInsurance.checked : true;
    const hasExpress = checkExpress ? checkExpress.checked : false;

    if (weightVal) {
      weightVal.textContent = `${weightKg.toLocaleString()} kg`;
    }

    const pair1 = `${origin}-${destination}`;
    const pair2 = `${destination}-${origin}`;
    let km = distances[pair1] || distances[pair2] || (origin === destination ? 8 : distances.default);

    // Base rates calculated in standard USD baseline, then formatted dynamically to MXN or USD
    let ratePerKm = 18; 
    let baseDispatch = 260;
    let speedMinutesMultiplier = 1;

    if (mode === 'av') {
      // Aerodine AV-4
      ratePerKm = 32;
      baseDispatch = 550;
      speedMinutesMultiplier = 0.3;
    } else if (mode === 'armored') {
      // Heavy Armored Convoy
      ratePerKm = 24;
      baseDispatch = 400;
      speedMinutesMultiplier = 1.4;
    } else {
      // Sandevistan Overdrive Ground
      ratePerKm = 18;
      baseDispatch = 260;
      speedMinutesMultiplier = 0.55;
    }

    const cargoMult = cargoMultipliers[selectedCargoType] || 1.0;
    const chargeableWeight = Math.max(weightKg, volumeM3 * 220);
    const weightCost = (chargeableWeight / 1000) * (km * 1.8);

    const freightSubtotal = (km * ratePerKm) + weightCost;
    const adjustedFreight = freightSubtotal * cargoMult;

    let extrasCost = 0;
    if (hasInsurance) extrasCost += (adjustedFreight * 0.12) + 120;
    if (hasExpress) extrasCost += (adjustedFreight * 0.3) + 250;

    const totalEstimateUSD = baseDispatch + adjustedFreight + extrasCost;

    // Transit Time calculation
    let transitMinutes = Math.max(Math.round(km * 2.2 * speedMinutesMultiplier), 10);
    if (hasExpress) transitMinutes = Math.max(Math.round(transitMinutes * 0.65), 8);
    
    let transitDisplay = `${transitMinutes} Minutos (Sandevistan)`;
    if (transitMinutes > 60) {
      const hours = (transitMinutes / 60).toFixed(1);
      transitDisplay = `${hours} Horas (${transitMinutes} min)`;
    }

    // Update Formatted Output
    if (outBase) outBase.textContent = formatMoney(baseDispatch);
    if (outFreight) outFreight.textContent = formatMoney(adjustedFreight);
    if (outExtras) outExtras.textContent = formatMoney(extrasCost);
    if (outTotal) outTotal.textContent = formatMoney(totalEstimateUSD);
    if (outEta) outEta.textContent = transitDisplay;
    if (outDistance) outDistance.textContent = `${km} km entre distritos`;

    if (currencyLegend) {
      currencyLegend.textContent = activeCurrency === 'MXN' ? 'En Pesos Mexicanos (IVA incluido)' : 'En Dólares Americanos (USD Net)';
    }

    if (btnBookingText) {
      btnBookingText.textContent = activeCurrency === 'MXN' ? 'Confirmar Despacho en Pesos ($ MXN)' : 'Confirmar Despacho en Dólares ($ USD)';
    }

    window._lastCalculatedTotal = formatMoney(totalEstimateUSD);
  }

  // Currency Switcher Handlers
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCurr = btn.getAttribute('data-currency');
      if (selectedCurr === activeCurrency) return;

      activeCurrency = selectedCurr;

      // Sync all currency toggle buttons
      currencyBtns.forEach(b => {
        if (b.getAttribute('data-currency') === activeCurrency) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      window.cyberSound.playClick();
      updateCalculation();
      showToast(activeCurrency === 'MXN' ? '🇲🇽 Moneda cambiada a Pesos Mexicanos (MXN)' : '🇺🇸 Moneda cambiada a Dólares Americanos (USD)');
    });
  });

  cargoOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      cargoOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCargoType = btn.getAttribute('data-type');
      window.cyberSound.playClick();
      updateCalculation();
    });
  });

  [originSelect, destSelect, modeSelect, volumeInput].forEach(el => {
    if (el) el.addEventListener('change', () => {
      window.cyberSound.playClick();
      updateCalculation();
    });
  });

  if (weightSlider) {
    weightSlider.addEventListener('input', () => {
      updateCalculation();
    });
  }

  if (checkInsurance) checkInsurance.addEventListener('change', updateCalculation);
  if (checkExpress) checkExpress.addEventListener('change', updateCalculation);

  updateCalculation();
}

/* ==========================================================================
   4. MODAL & INSTANT BOOKING DISPATCH
   ========================================================================== */
function initModalAndBooking() {
  const modalOverlay = document.getElementById('booking-modal-overlay');
  const closeBtn = document.getElementById('btn-close-modal');
  const openModalBtns = document.querySelectorAll('.btn-trigger-booking');
  const bookingForm = document.getElementById('booking-dispatch-form');
  const modalSuccessView = document.getElementById('modal-success-view');
  const modalFormView = document.getElementById('modal-form-view');

  if (!modalOverlay) return;

  function openModal() {
    modalFormView.style.display = 'block';
    modalSuccessView.style.display = 'none';
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    window.cyberSound.playConfirm();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    window.cyberSound.playClick();
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('book-name').value;
      const clientCompany = document.getElementById('book-company').value;
      const randomTicketId = `NIGHTCITY-${Math.floor(100000 + Math.random() * 900000)}`;

      window.cyberSound.playScan();

      setTimeout(() => {
        window.cyberSound.playConfirm();
        modalFormView.style.display = 'none';
        modalSuccessView.style.display = 'block';

        document.getElementById('success-ticket-id').textContent = randomTicketId;
        document.getElementById('success-client-info').textContent = `${clientName} • ${clientCompany || 'Edgerunner Solo'}`;
        
        const successTotalEl = document.getElementById('success-total-val');
        if (successTotalEl && window._lastCalculatedTotal) {
          successTotalEl.textContent = window._lastCalculatedTotal;
        }

        showToast(`⚡ Despacho ${randomTicketId} confirmado en Night City.`);
      }, 500);
    });
  }

  const printBtn = document.getElementById('btn-print-voucher');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   5. AUDIO FEEDBACK TOGGLE
   ========================================================================== */
function initAudioToggle() {
  const audioBtn = document.getElementById('btn-toggle-sound');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    const isNowActive = window.cyberSound.toggle();
    if (isNowActive) {
      audioBtn.classList.add('active');
      audioBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      `;
      showToast('⚡ Audio Cyberpunk Edgerunners Activado');
    } else {
      audioBtn.classList.remove('active');
      audioBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      `;
      showToast('🔇 Audio Silenciado');
    }
  });
}

/* ==========================================================================
   6. SMOOTH SCROLL & TOAST SYSTEM
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.cyberSound.playClick();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function showToast(msg) {
  let toast = document.getElementById('cyber-live-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-live-toast';
    toast.className = 'cyber-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="pulse-dot"></span>
    <span style="font-size: 0.9rem; font-weight: 600; color: #fff;">${msg}</span>
  `;
  toast.classList.add('show');

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
