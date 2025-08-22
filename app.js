// Theme toggle logic. Change icons or theme class names here if you want a different theme system.
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

themeToggle.onclick = () => {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
};

//User Configuration Calculator

// Input, error, and output field references. Only use fields that exist in the HTML.
const inputFields = [
  document.getElementById('input1'), // Line Rate (number)
  document.getElementById('input2'), // Number of Lanes (number)
  document.getElementById('input3'), // Number of Gear (fixed)
  document.getElementById('input4'), // Data Type (select)
  document.getElementById('input5'), // Pixel per Clock (number)

];
const errorFields = [
  document.getElementById('error1'), //Line Rate
  document.getElementById('error2'), //Num of Lanes
  document.getElementById('error3'), //Num of gear
  document.getElementById('error4'), //Data Type
  document.getElementById('error5'), //Pixel per Clock
];
const outputFields = [
  document.getElementById('output1'),
  document.getElementById('output2'),
  document.getElementById('output3'),
  document.getElementById('output4'),
];

const outputsSection = document.getElementById('outputs-section');
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');
const container = document.querySelector('.container');
const verticalSeparator = document.getElementById('vertical-separator');

outputsSection.style.display = 'none';
outputsSection.classList.remove('visible');

// Helper: get bits per clock based on data type and pixel per clock
function getBitsPerClock(datatype, pixelPerClock) {
  // datatype values as specified
  const map = {
    RAW8: 8,
    RAW10: 10,
    RAW12: 12,
    RAW14: 14,
    RAW16: 16,
    YUV_420_8: 8,
    YUV_420_10: 10,
    YUV_422_8: 8,
    YUV_422_10: 10,
    RGB888: 24,
  };
  return (map[datatype] || 0) * pixelPerClock;
}

// Validate all fields. Adjust validation logic here if you change field ranges or requirements.
function validateFields() {
  let valid = true;
  let firstErrorInput = null;

  // 2. Line Rate (dynamic min/max, integer)
  let val2 = inputFields[0].value.trim();
  let numVal2 = Number(val2); // Convert to number once
  // Get dynamic min/max from input attributes
  let min2 = Number(inputFields[0].min) || 160;
  let max2 = Number(inputFields[0].max) || 861;
  if (!val2 || isNaN(numVal2) || numVal2 < min2 || numVal2 > max2 || !Number.isInteger(numVal2)) {
    inputFields[0].classList.add('error');
    errorFields[0].textContent = `Enter a whole number according to hinted range (${min2}-${max2})`;
    errorFields[0].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[0];
    valid = false;
  } else {
    inputFields[0].classList.remove('error');
    errorFields[0].textContent = '';
    errorFields[0].classList.remove('active');
  }

  // 3. Number of Lanes (1-12, integer)
  let val3 = inputFields[1].value.trim();
  let numVal3 = Number(val3); // Convert to number once
  if (!val3 || isNaN(numVal3) || numVal3 < 1 || numVal3 > 12 || !Number.isInteger(numVal3)) {
    inputFields[1].classList.add('error');
    errorFields[1].textContent = 'Enter a whole number between 1 and 12';
    errorFields[1].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[2];
    valid = false;
  } else {
    inputFields[1].classList.remove('error');
    errorFields[1].textContent = '';
    errorFields[1].classList.remove('active');
  }

  // 4. Number of Gear (fixed at 8, always valid)
  inputFields[2].classList.remove('error');
  errorFields[2].textContent = '';
  errorFields[2].classList.remove('active');

  

  // 6. Data Type (dropdown, always valid)
  inputFields[3].classList.remove('error');
  errorFields[3].textContent = '';
  errorFields[3].classList.remove('active');

  // 7. Pixel per Clock (1-10, integer)
  let val7 = inputFields[4].value.trim();
  if (!val7 || isNaN(val7) || !Number.isInteger(Number(val7)) || Number(val7) < 1 || Number(val7) > 10) {
    inputFields[4].classList.add('error');
    errorFields[4].textContent = 'Enter a whole number between 1 and 10';
    errorFields[4].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[6];
    valid = false;
  } else {
    inputFields[4].classList.remove('error');
    errorFields[4].textContent = '';
    errorFields[4].classList.remove('active');
  }

  // Scroll to first error field and highlight
  if (firstErrorInput) {
    setTimeout(() => {
      firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorInput.focus();
      firstErrorInput.classList.add('highlight');
      setTimeout(() => {
        firstErrorInput.classList.remove('highlight');
      }, 700);
    }, 50);
  }
  return valid;
}


// Calculate button logic. Change output calculations here if you change the formula.
calculateBtn.onclick = () => {
  if (!validateFields()) {
    outputsSection.style.display = 'none';
    outputsSection.classList.remove('visible', 'hiding');
    if (verticalSeparator) verticalSeparator.classList.remove('visible');
    container.classList.add('center-fields');
    return;
  }

  // get values
  const lineRate = Number(inputFields[0].value);
  const numLanes = Number(inputFields[1].value);
  const numGear = Number(inputFields[2].value);
  const datatype = inputFields[3].value;
  const pixelPerClock = Number(inputFields[4].value);

  // Output 1: Number of Bits/Clock
  const bitsPerClock = getBitsPerClock(datatype, pixelPerClock);
  outputFields[0].textContent = bitsPerClock;

  // Output 2: D_PHY Clock (MHz)
  outputFields[1].textContent = (lineRate / 2).toFixed(3);

  // Output 3: Pixel Clock Frequency (MHz)
  let pixClk = bitsPerClock ? (lineRate * numLanes / bitsPerClock) : 0;
  outputFields[2].textContent = pixClk ? pixClk.toFixed(3) : '';

  // Output 4: Byte Clock Frequency
  outputFields[3].textContent = (lineRate / numGear).toFixed(3);

  outputsSection.style.display = '';
  setTimeout(() => {
    outputsSection.classList.remove('hiding');
    outputsSection.classList.add('visible');
    if (verticalSeparator) verticalSeparator.classList.add('visible');
    container.classList.remove('center-fields');
    outputsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 10);
};

// Clear button logic. Resets all fields and outputs.
clearBtn.onclick = () => {
  inputFields.forEach((input, idx) => {
    if (input.tagName === 'SELECT') {
      input.selectedIndex = 0;
    } else if (input.id === 'input3') {
      input.value = 8;
    } else {
      input.value = '';
    }
    input.classList.remove('error');
    errorFields[idx].textContent = '';
    errorFields[idx].classList.remove('active');
  });
  outputFields.forEach(output => output.textContent = '');

  outputsSection.classList.remove('visible');
  outputsSection.classList.add('hiding');
  if (verticalSeparator) verticalSeparator.classList.remove('visible');
  container.classList.add('center-fields');
  setTimeout(() => {
    outputsSection.style.display = 'none';
    outputsSection.classList.remove('hiding');
  }, 350);
};

// Live validation for each input field. Adjust/add logic for new fields here.
inputFields.forEach((input, idx) => {
  input.addEventListener('input', () => {
    if (input.tagName === 'SELECT' || input.id === 'input3') {
      input.classList.remove('error');
      errorFields[idx].textContent = '';
      errorFields[idx].classList.remove('active');
      return;
    }
    let val = input.value.trim();
    let valid = true;
    if (input.id === 'input1') {
      // Use dynamic min/max for validation
      let min = Number(input.min) || 160;
      let max = Number(input.max) || 861;
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= min && Number(val) <= max;
    } else if (input.id === 'input2') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 12;
    } else if (input.id === 'input5') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 10;
    }
    if (valid) {
      input.classList.remove('error');
      errorFields[idx].textContent = '';
      errorFields[idx].classList.remove('active');
    }
  });
});

// Scroll to top button logic. Change threshold or animation here.
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});
scrollTopBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};