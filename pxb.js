// Unused, migrated into index.html
// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(mode) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(mode);
  localStorage.setItem('theme', mode);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  setTheme(prefersDark ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.onclick = () => {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  };
}

// Input to P2B Calculator
const calcP2BBtn = document.getElementById('calc-p2b-btn');
const bandwidthOutput = document.getElementById('bandwidth-output');
const bandwidthForm = document.getElementById('bandwidth-form');

if (calcP2BBtn && bandwidthOutput && bandwidthForm) {
  calcP2BBtn.addEventListener('click', function () {
    const pixelClock = parseFloat(document.getElementById('pixel-clock').value);
    const ppc = parseFloat(document.getElementById('ppc').value);
    const bpc = parseFloat(document.getElementById('bpc').value);
    if (isNaN(pixelClock) || isNaN(ppc) || isNaN(bpc)) {
      bandwidthOutput.textContent = 'Please enter valid numbers.';
      return;
    }
    const bandwidth = pixelClock * ppc * bpc;
    bandwidthOutput.textContent = bandwidth.toLocaleString() + ' Mbps';
  });
  bandwidthForm.addEventListener('reset', function () {
    bandwidthOutput.textContent = '';
  });
}

// Output to B2P Calculator
const byteClockInput = document.getElementById('byte-clock');
const numLanesInput = document.getElementById('num-lanes');
const gearInput = document.getElementById('gear');
const calcB2PBtn = document.getElementById('calc-b2p-btn');
const b2pBandwidthOutput = document.getElementById('b2p-bandwidth-output');
const b2pForm = document.getElementById('b2p-form');

if (byteClockInput && numLanesInput && gearInput && calcB2PBtn && b2pBandwidthOutput && b2pForm) {
  calcB2PBtn.addEventListener('click', function () {
    const byteClock = parseFloat(byteClockInput.value);
    const numLanes = parseFloat(numLanesInput.value);
    const gear = parseFloat(gearInput.value);
    if (
      isNaN(byteClock) || byteClock < 0 ||
      isNaN(numLanes) || numLanes < 1 ||
      isNaN(gear) || gear < 1
    ) {
      b2pBandwidthOutput.textContent = 'Please enter valid values for all fields.';
      return;
    }
    const bandwidth = byteClock * numLanes * gear;
    b2pBandwidthOutput.textContent = bandwidth + ' Mbps';
  });
  b2pForm.addEventListener('reset', function () {
    b2pBandwidthOutput.textContent = '';
  });
}
