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
  document.getElementById('input1'), // RD Mode (select)
  document.getElementById('input2'), // Line Rate (number)
  document.getElementById('input3'), // Number of Lanes (number)
  document.getElementById('input4'), // Number of Gear (fixed)
  document.getElementById('input5'), // Clock Mode (select)
  document.getElementById('input6'), // Data Type (select)
  document.getElementById('input7'), // Pixel per Clock (number)
  document.getElementById('input8'), // Reference Clock Frequency (number)
];
const errorFields = [
  document.getElementById('error1'),
  document.getElementById('error2'),
  document.getElementById('error3'),
  document.getElementById('error4'),
  document.getElementById('error5'),
  document.getElementById('error6'),
  document.getElementById('error7'),
  document.getElementById('error8'),
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

  // 1. RD Mode (dropdown, always valid)
  inputFields[0].classList.remove('error');
  errorFields[0].textContent = '';
  errorFields[0].classList.remove('active');

  // 2. Line Rate (160-800, integer)
  let val2 = inputFields[1].value.trim();
  if (!val2 || isNaN(val2) || !Number.isInteger(Number(val2)) || Number(val2) < 160 || Number(val2) > 800) {
    inputFields[1].classList.add('error');
    errorFields[1].textContent = 'Enter a whole number between 160 and 800';
    errorFields[1].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[1];
    valid = false;
  } else {
    inputFields[1].classList.remove('error');
    errorFields[1].textContent = '';
    errorFields[1].classList.remove('active');
  }

  // 3. Number of Lanes (1-12, integer)
  let val3 = inputFields[2].value.trim();
  if (!val3 || isNaN(val3) || !Number.isInteger(Number(val3)) || Number(val3) < 1 || Number(val3) > 12) {
    inputFields[2].classList.add('error');
    errorFields[2].textContent = 'Enter a whole number between 1 and 12';
    errorFields[2].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[2];
    valid = false;
  } else {
    inputFields[2].classList.remove('error');
    errorFields[2].textContent = '';
    errorFields[2].classList.remove('active');
  }

  // 4. Number of Gear (fixed at 8, always valid)
  inputFields[3].classList.remove('error');
  errorFields[3].textContent = '';
  errorFields[3].classList.remove('active');

  // 5. Clock Mode (dropdown, always valid)
  inputFields[4].classList.remove('error');
  errorFields[4].textContent = '';
  errorFields[4].classList.remove('active');

  // 6. Data Type (dropdown, always valid)
  inputFields[5].classList.remove('error');
  errorFields[5].textContent = '';
  errorFields[5].classList.remove('active');

  // 7. Pixel per Clock (1-10, integer)
  let val7 = inputFields[6].value.trim();
  if (!val7 || isNaN(val7) || !Number.isInteger(Number(val7)) || Number(val7) < 1 || Number(val7) > 10) {
    inputFields[6].classList.add('error');
    errorFields[6].textContent = 'Enter a whole number between 1 and 10';
    errorFields[6].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[6];
    valid = false;
  } else {
    inputFields[6].classList.remove('error');
    errorFields[6].textContent = '';
    errorFields[6].classList.remove('active');
  }

  // 8. Reference Clock Frequency (must be integer and not empty)
  let val8 = inputFields[7].value.trim();
  if (!val8 || isNaN(val8) || !Number.isInteger(Number(val8)) || Number(val8) < 1) {
    inputFields[7].classList.add('error');
    errorFields[7].textContent = 'Enter a whole number';
    errorFields[7].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[7];
    valid = false;
  } else {
    inputFields[7].classList.remove('error');
    errorFields[7].textContent = '';
    errorFields[7].classList.remove('active');
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
  const lineRate = Number(inputFields[1].value);
  const numLanes = Number(inputFields[2].value);
  const numGear = Number(inputFields[3].value);
  const datatype = inputFields[5].value;
  const pixelPerClock = Number(inputFields[6].value);

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
    } else if (input.id === 'input4') {
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
    if (input.tagName === 'SELECT' || input.id === 'input4') {
      input.classList.remove('error');
      errorFields[idx].textContent = '';
      errorFields[idx].classList.remove('active');
      return;
    }
    let val = input.value.trim();
    let valid = true;
    if (input.id === 'input2') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 160 && Number(val) <= 800;
    } else if (input.id === 'input3') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 12;
    } else if (input.id === 'input7') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 10;
    } else if (input.id === 'input8') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1;
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