//Currently unused from deprioritizing
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

themeToggle.onclick = () => {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
};

// Input, output, and button references
const inputFields = {
  PLL_CLKF: document.getElementById('PLL_CLKF'),
  PLL_CLKR: document.getElementById('PLL_CLKR'),
  PLL_CLKV: document.getElementById('PLL_CLKV'),
  PLL_BWADJ: document.getElementById('PLL_BWADJ'),
  PLL_CLKOD0: document.getElementById('PLL_CLKOD0'),
  PLL_CLKOD1: document.getElementById('PLL_CLKOD1'),
  PLL_CLKOD2: document.getElementById('PLL_CLKOD2'),
  PLL_CLKOD3: document.getElementById('PLL_CLKOD3'),
  PLL_CLKOD4: document.getElementById('PLL_CLKOD4'),
  CLK0_PHI: document.getElementById('CLK0_PHI'),
  CLK1_PHI: document.getElementById('CLK1_PHI'),
  CLK2_PHI: document.getElementById('CLK2_PHI'),
  CLK3_PHI: document.getElementById('CLK3_PHI'),
  CLK4_PHI: document.getElementById('CLK4_PHI'),
  CLK5_PHI: document.getElementById('CLK5_PHI'),
  CLK0_DEL: document.getElementById('CLK0_DEL'),
  CLK1_DEL: document.getElementById('CLK1_DEL'),
  CLK2_DEL: document.getElementById('CLK2_DEL'),
  CLK3_DEL: document.getElementById('CLK3_DEL'),
  CLK4_DEL: document.getElementById('CLK4_DEL'),
};
const outputFields = [
  document.getElementById('output1'),
  document.getElementById('output2'),
  document.getElementById('output3'),
  document.getElementById('output4'),
  document.getElementById('output5'),
  document.getElementById('output6'),
  document.getElementById('output7'),
  document.getElementById('output8'),
  document.getElementById('output9'),
];
const outputsSection = document.getElementById('outputs-section');
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');

function bitAnd(a, b) { return a & b; }
function bitOr(a, b) { return a | b; }
function bitXor(a, b) { return a ^ b; }
function bitNot(a) { return ~a; }
function bitLShift(a, b) { return a << b; }
function bitRShift(a, b) { return a >>> b; }

function toHex(val) {
  let num = Number(val);
  if (isNaN(num)) return '';
  return '0x' + num.toString(16).toUpperCase().padStart(8, '0');
}

function calculateRegisters() {
  // Parse all input values as integers (default to 0 if empty)
  const B = {};
  Object.keys(inputFields).forEach(key => {
    B[key] = parseInt(inputFields[key].value, 10) || 0;
  });
  // Map B16-B35 for formula compatibility
  const B16 = B.CLK0_PHI, B17 = B.CLK1_PHI, B18 = B.CLK2_PHI, B19 = B.CLK3_PHI, B20 = B.CLK4_PHI;
  const B21 = B.CLK5_PHI, B22 = B.CLK0_DEL, B23 = B.CLK1_DEL, B24 = B.CLK2_DEL, B25 = B.CLK3_DEL, B26 = B.CLK4_DEL;
  const B27 = B.PLL_CLKR, B28 = B.PLL_CLKF, B29 = B.PLL_CLKV, B30 = B.PLL_BWADJ;
  // Dummy B31-B35 for DEL/PHI high bytes (not in input, set to 0)
  const B31 = 0, B32 = 0, B33 = 0, B34 = 0, B35 = 0;

  // PLL_REG01
  outputFields[0].textContent = toHex(bitLShift(bitAnd(B28, 1023), 10) + B27);
  // PLL_REG02
  outputFields[1].textContent = toHex(bitAnd(bitRShift(B28, 10), Math.pow(2, 16) - 1));
  // PLL_REG03
  outputFields[2].textContent = toHex(bitLShift(bitAnd(B29, 15), 4) + B30);
  // PLL_REG0C
  outputFields[3].textContent = toHex(
    bitAnd(bitLShift(B21 - 1, 14), 49152) +
    bitAnd(bitLShift(B20 - 1, 11), 14336) +
    bitAnd(bitLShift(B19 - 1, 8), 1792) +
    bitAnd(bitLShift(B18 - 1, 5), 224) +
    bitAnd(bitLShift(B17 - 1, 2), 28) +
    bitAnd(B16 - 1, 3)
  );
  // PLL_REG11
  outputFields[4].textContent = toHex(bitAnd(bitLShift(B22 - 1, 8), 65280) + bitAnd(B31, 255));
  // PLL_REG12
  outputFields[5].textContent = toHex(bitAnd(bitLShift(B23 - 1, 8), 65280) + bitAnd(B32, 255));
  // PLL_REG13
  outputFields[6].textContent = toHex(bitAnd(bitLShift(B24 - 1, 8), 65280) + bitAnd(B33, 255));
  // PLL_REG14
  outputFields[7].textContent = toHex(bitAnd(bitLShift(B25 - 1, 8), 65280) + bitAnd(B34, 255));
  // PLL_REG15
  outputFields[8].textContent = toHex(bitAnd(bitLShift(B26 - 1, 8), 65280) + bitAnd(B35, 255));
}

calculateBtn.onclick = () => {
  calculateRegisters();
  outputsSection.style.display = '';
  setTimeout(() => {
    outputsSection.classList.add('visible');
  }, 10);
};

clearBtn.onclick = () => {
  Object.values(inputFields).forEach(input => input.value = '');
  outputFields.forEach(output => output.textContent = '');
  outputsSection.classList.remove('visible');
  setTimeout(() => {
    outputsSection.style.display = 'none';
  }, 350);
};

// Scroll to top button logic
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
