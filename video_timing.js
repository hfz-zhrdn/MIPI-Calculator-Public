//List for Bits per Pixel (BPP)
// Mapping of color format to Bits per pixel, now includes RAW formats
const bitsPerPixelMap = {
  "RGB666": 18,
  "RGB888": 24,
  "RGB101010": 30,
  "RGB121212": 36,
  "RGB161616": 48,
  "YCbCr444_8": 24,
  "YCbCr444_10": 30,
  "YCbCr444_12": 36,
  "YCbCr444_16": 48,
  "YCbCr422_8": 16,
  "YCbCr422_10": 20,
  "YCbCr422_12": 24,
  "YCbCr422_16": 32,
  "YCbCr420_8": 12,
  "YCbCr420_10": 15,
  "YCbCr420_12": 18,
  "YCbCr420_16": 24,
  "RAW8": 8,
  "RAW10": 10,
  "RAW12": 12,
  "RAW14": 14,
  "RAW16": 16
};

const colorFormatSelect = document.getElementById('colorFormat');
const bitsPerPixelInput = document.getElementById('bitsPerPixel');

// Updated function for Bits per Pixel, including RAW formats
function updateBitsPerPixel() {
  const colorFormat = colorFormatSelect.value;
  if (bitsPerPixelMap[colorFormat] !== undefined) {
    bitsPerPixelInput.value = bitsPerPixelMap[colorFormat];
  } else {
    bitsPerPixelInput.value = ''; // Clear the field if the format is not found
  }
}

// Add event listener for color format change
colorFormatSelect.addEventListener('change', updateBitsPerPixel);

// Call once on page load to initialize
updateBitsPerPixel();


//Limitation range for Link Rate per Lane 
//Not used in the current version, but kept for future reference
// Link rate should be between 0.08 and 2.5 Gbps
/*const linkRateInput = document.getElementById('linkRate');
if (linkRateInput) {
  linkRateInput.addEventListener('input', function () {
    let val = parseFloat(this.value);
    if (val < 0.08) this.value = 0.08;
    if (val > 2.5) this.value = 2.5;
  });
}*/

// --- Output Calculation Logic ---

// Helper to get numeric value from input
function getNum(id) {
  const el = document.getElementById(id);
  // For read-only fields, treat empty string as 0, but for text fields, parse as float if possible
  if (!el) return 0;
  const val = el.value;
  // If the field is read-only and empty, return 0
  if (el.hasAttribute('readonly') && val === '') return 0;
  // If the value is not a number, return 0
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

// Main calculation function
function calculateOutputs() {
  // Input values
  // Horizontal Blanking Components
  const hSync = getNum('hSync');
  const hBackPorch = getNum('hBackPorch');
  const hFrontPorch = getNum('hFrontPorch');
  const TotalhBlank = hSync + hBackPorch + hFrontPorch;
  const hBlankField = document.getElementById('TotalhBlank');
  //To make sure Total Horizontal Blanking field is blank 
  if (hSync || hBackPorch || hFrontPorch) {
    hBlankField.value = TotalhBlank;
  } else {
    hBlankField.value = '';
  }

  // Vertical Blanking Components
  const vSync = getNum('vSync');
  const vBackPorch = getNum('vBackPorch');
  const vFrontPorch = getNum('vFrontPorch');
  const TotalvBlank = vSync + vBackPorch + vFrontPorch;
  const vBlankField = document.getElementById('TotalvBlank');
  if (vSync || vBackPorch || vFrontPorch) {
    vBlankField.value = TotalvBlank;
  } else {
    vBlankField.value = '';
  }




  // Continue with other input values
  const hPixels = getNum('hPixels');
  const vLines = getNum('vLines');
  const refreshRate = getNum('refreshRate');
  const pixelPerClock = getNum('pixelPerClock');
  const linkRate = getNum('linkRate');
  const numStreams = 1 //set default to 1 stream
  //const numLanes = getNum('numLanes'); //Not used in the current version, but kept for future reference
  const bitsPerPixel = getNum('bitsPerPixel');

 // Horizontal Total Pixel and Vertical Total Lines
  const hTotal = TotalhBlank + hPixels;
  const vTotal = TotalvBlank + vLines;

   if (document.getElementById('outHTotal')) {
    document.getElementById('outHTotal').textContent = hTotal || '-';
  }
  if (document.getElementById('outVTotal')) {
    document.getElementById('outVTotal').textContent = vTotal || '-';
  }

   // Total Pixel per Frame per Sec
  let totalPixelPerSec = '';
  if (hTotal && vTotal && refreshRate) {
    totalPixelPerSec = hTotal * vTotal * refreshRate;
  }

  if (document.getElementById('outTotalPixelPerSec')) {
    document.getElementById('outTotalPixelPerSec').textContent = totalPixelPerSec || '-';
  }

  // Pixel Clock (MHz) = Total Pixel per Frame per Sec / (Pixel Per Clock * 1,000,000)
  let pixelClockMHz = '';
  if (totalPixelPerSec && pixelPerClock) {
    pixelClockMHz = totalPixelPerSec / (pixelPerClock * 1e6);
    pixelClockMHz = pixelClockMHz.toFixed(4);
  }

  if (document.getElementById('outPixelClock')) {
    document.getElementById('outPixelClock').textContent = pixelClockMHz || '-';
  }
 

  // Total Link Bandwidth Used calculation
  let linkBandwidthUsed = '';
  if (hTotal && vTotal && refreshRate && bitsPerPixel) {
    linkBandwidthUsed = (hTotal * vTotal * refreshRate * bitsPerPixel * numStreams * 100 / 96.71) / 1e9;
    linkBandwidthUsed = linkBandwidthUsed.toFixed(4);
  }

  // Output Link Bandwidth Used if you have an output field
  if (document.getElementById('outLinkBandwidthUsed')) {
    document.getElementById('outLinkBandwidthUsed').textContent = linkBandwidthUsed || '-';
  }


 
}


// Hide output section by default
document.addEventListener('DOMContentLoaded', function() {
  const outputSection = document.getElementById('outputSection');
  if (outputSection) {
    outputSection.classList.remove('visible');
  }
  
  // Hide container expansion by default
  const container = document.querySelector('.video-timing-bg-container .container.center-fields');
  if (container) container.classList.remove('expanded');
  
  const bgContainer = document.querySelector('.video-timing-bg-container');
  if (bgContainer) bgContainer.classList.remove('expanded');
});


// Show output when Calculate is clicked
const calculateButton = document.getElementById('calculateButton');
if (calculateButton) {
  calculateButton.addEventListener('click', function() {
    const outputSection = document.getElementById('outputSection');
    if (outputSection) {
      outputSection.style.display = 'block';
      outputSection.classList.add('visible');
    }
    
    // Expand container when output is shown
    const container = document.querySelector('.video-timing-bg-container .container.center-fields');
    if (container) container.classList.add('expanded');
    
    const bgContainer = document.querySelector('.video-timing-bg-container');
    if (bgContainer) bgContainer.classList.add('expanded');
    
    calculateOutputs(); // <-- Call calculateOutputs here
  });
}

// Auto-update TotalhBlank and TotalvBlank when any component changes
function setupAutoBlankingCalc() {
  ['hSync','hBackPorch','hFrontPorch','vSync','vBackPorch','vFrontPorch'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        // Always update the blanking fields immediately on input
        calculateOutputs();
      });
    }
  });
  // Also run once on load to initialize blanking fields
  calculateOutputs();
}

document.addEventListener('DOMContentLoaded', setupAutoBlankingCalc);


// Clear all fields when Clear is clicked
const clearButton = document.getElementById('clearButton');
if (clearButton) {
  clearButton.addEventListener('click', function() {
    document.getElementById('customResoForm').reset();
    updateBitsPerPixel(); // <-- Add this line
    calculateOutputs();
    const outputSection = document.getElementById('outputSection');
    if (outputSection) {
      outputSection.classList.remove('visible');
      // Hide the element after animation completes
      setTimeout(() => {
        if (!outputSection.classList.contains('visible')) {
          outputSection.style.display = 'none';
        }
      }, 300);
    }
    
    // Shrink container when output is hidden
    const container = document.querySelector('.video-timing-bg-container .container.center-fields');
    if (container) container.classList.remove('expanded');
    
    const bgContainer = document.querySelector('.video-timing-bg-container');
    if (bgContainer) bgContainer.classList.remove('expanded');
  });
}

// Preset resolutions logic
const presetResolutions = {
  CTA_1280_720_60: {
    hSync: 40, hBackPorch: 220, hFrontPorch: 110, hPixels: 1280,
    vSync: 5, vBackPorch: 20, vFrontPorch: 5, vLines: 720,
    refreshRate: 60
  },
  CTA_1920_1080_60: {
    hSync: 44, hBackPorch: 148, hFrontPorch: 88, hPixels: 1920,
    vSync: 5, vBackPorch: 36, vFrontPorch: 4, vLines: 1080,
    refreshRate: 60
  },
  VESA_3840_2160_30: {
    hSync: 88, hBackPorch: 296, hFrontPorch: 176, hPixels: 3840,
    vSync: 10, vBackPorch: 72, vFrontPorch: 8, vLines: 2160,
    refreshRate: 30
  },
  VESA_3840_2160_60: {
    hSync: 88, hBackPorch: 296, hFrontPorch: 176, hPixels: 3840,
    vSync: 10, vBackPorch: 72, vFrontPorch: 8, vLines: 2160,
    refreshRate: 60
  }
};

const presetSelect = document.getElementById('presetResolution');
const presetFieldIds = [
  'hSync', 'hBackPorch', 'hFrontPorch', 'hPixels',
  'vSync', 'vBackPorch', 'vFrontPorch', 'vLines', 'refreshRate'
];
if (presetSelect) {
  presetSelect.addEventListener('change', function () {
    const val = this.value;
    if (presetResolutions[val]) {
      const preset = presetResolutions[val];
      presetFieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = preset[id];
          el.readOnly = true;
          el.style.background = '#f5f5f5';
          el.style.color = '#888';
          el.style.cursor = 'not-allowed';
        }
      });
      calculateOutputs();
    } else {
      // If 'Custom' or blank is selected, make fields editable
      presetFieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.readOnly = false;
          el.style.background = '';
          el.style.color = '';
          el.style.cursor = '';
        }
      });
    }
  });
}
