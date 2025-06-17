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

// Calculation logic for DPHY Timing
const dphyClockInput = document.getElementById('dphy-clock');
const calcBtn = document.getElementById('calc-dphy-btn');
const resetBtn = document.querySelector('#dphy-form button[type="reset"]');
const bitRateInput = document.getElementById('bit-rate');

const outClockPerMin = document.getElementById('out-clock-per-min');
const outClockPerMax = document.getElementById('out-clock-per-max');
const outClockPerChoice = document.getElementById('out-clock-per-choice');
const outByteFreqMin = document.getElementById('out-byte-freq-min');
const outByteFreqMax = document.getElementById('out-byte-freq-max');
const outByteFreqChoice = document.getElementById('out-byte-freq-choice');
const outBytePerMin = document.getElementById('out-byte-per-min');
const outBytePerMax = document.getElementById('out-byte-per-max');
const outBytePerChoice = document.getElementById('out-byte-per-choice');
const outLPXMin = document.getElementById('out-lpx-min');
const outLPXMax = document.getElementById('out-lpx-max');
const outLPXChoice = document.getElementById('out-lpx-choice');
const outHSPrepareMin = document.getElementById('out-hs-prepare-min');
const outHSPrepareMax = document.getElementById('out-hs-prepare-max');
const outHSPrepareChoice = document.getElementById('out-hs-prepare-choice');
const outTclkHSZeroMin = document.getElementById('out-tclk-hszero-min');
const outTclkHSZeroMax = document.getElementById('out-tclk-hszero-max');
const outTclkHSZeroChoice = document.getElementById('out-tclk-hszero-choice');
const outHSTrailMin = document.getElementById('out-hs-trail-min');
const outHSTrailMax = document.getElementById('out-hs-trail-max');
const outHSTrailChoice = document.getElementById('out-hs-trail-choice');
const outHSExitMin = document.getElementById('out-hs-exit-min');
const outHSExitMax = document.getElementById('out-hs-exit-max');
const outHSExitChoice = document.getElementById('out-hs-exit-choice');
const outClkPrepareMin = document.getElementById('out-clk-prepare-min');
const outClkPrepareMax = document.getElementById('out-clk-prepare-max');
const outClkPrepareChoice = document.getElementById('out-clk-prepare-choice');
const outClkZeroMin = document.getElementById('out-clk-zero-min');
const outClkZeroMax = document.getElementById('out-clk-zero-max');
const outClkZeroChoice = document.getElementById('out-clk-zero-choice');
const outClkPreMin = document.getElementById('out-clk-pre-min');
const outClkPreMax = document.getElementById('out-clk-pre-max');
const outClkPreChoice = document.getElementById('out-clk-pre-choice');
const outClkPostMin = document.getElementById('out-clk-post-min');
const outClkPostMax = document.getElementById('out-clk-post-max');
const outClkPostChoice = document.getElementById('out-clk-post-choice');
const outClkTrailMin = document.getElementById('out-clk-trail-min');
const outClkTrailMax = document.getElementById('out-clk-trail-max');
const outClkTrailChoice = document.getElementById('out-clk-trail-choice');
const outClkExitMin = document.getElementById('out-clk-exit-min');
const outClkExitMax = document.getElementById('out-clk-exit-max');
const outClkExitChoice = document.getElementById('out-clk-exit-choice');
const outUIps = document.getElementById('out-ui-ps');
const outByteClockPeriod = document.getElementById('out-byte-clock-period');
const outDataSettleMin = document.getElementById('out-data-settle-min');
const outDataSettleMax = document.getElementById('out-data-settle-max');
const outDataSettleChoice = document.getElementById('out-data-settle-choice');

function ceilMath(val) { return Math.ceil(val); }
function floorMath(val) { return Math.floor(val); }

function clearDPHYTable() {
  [
    outClockPerMin, outClockPerMax, outClockPerChoice,
    outByteFreqMin, outByteFreqMax, outByteFreqChoice,
    outBytePerMin, outBytePerMax, outBytePerChoice,
    outLPXMin, outLPXMax, outLPXChoice,
    outHSPrepareMin, outHSPrepareMax, outHSPrepareChoice,
    outTclkHSZeroMin, outTclkHSZeroMax, outTclkHSZeroChoice,
    outHSTrailMin, outHSTrailMax, outHSTrailChoice,
    outHSExitMin, outHSExitMax, outHSExitChoice,
    outClkPrepareMin, outClkPrepareMax, outClkPrepareChoice,
    outClkZeroMin, outClkZeroMax, outClkZeroChoice,
    outClkPreMin, outClkPreMax, outClkPreChoice,
    outClkPostMin, outClkPostMax, outClkPostChoice,
    outClkTrailMin, outClkTrailMax, outClkTrailChoice,
    outClkExitMin, outClkExitMax, outClkExitChoice,
    outUIps, outByteClockPeriod, outDataSettleMin, outDataSettleMax, outDataSettleChoice
  ].forEach(cell => cell.textContent = '');
}

function calcDPHY() {
  const bitRate = parseFloat(bitRateInput.value);
  if (isNaN(bitRate) || bitRate < 160 || bitRate > 800) {
    clearDPHYTable();
    return;
  }
  // UI (ps) and Byte Clock Period
  const uiPs = 1000000 / bitRate; // UI (ps)
  const byteClockPeriod = 8000000 / bitRate; // Byte Clock Period
  if (outUIps) outUIps.textContent = uiPs.toFixed(3);
  if (outByteClockPeriod) outByteClockPeriod.textContent = byteClockPeriod.toFixed(3);

  // Data_Settle calculations
  // min = FLOOR.MATH((85000 + 10 * UI(ps)) / Byte Clock Period - 3)
  // max = FLOOR.MATH((145000 + 10 * UI(ps)) / Byte Clock Period - 4)
  // choice = if min < 0 then 0 else FLOOR.MATH((min + max) / 2)
  const min = Math.floor((85000 + 10 * uiPs) / byteClockPeriod - 3);
  const max = Math.floor((145000 + 10 * uiPs) / byteClockPeriod - 4);
  let choice;
  if (min < 0) {
    choice = 0;
  } else {
    choice = Math.floor((min + max) / 2);
  }
  if (outDataSettleMin) outDataSettleMin.textContent = min;
  if (outDataSettleMax) outDataSettleMax.textContent = max;
  if (outDataSettleChoice) outDataSettleChoice.textContent = choice.toFixed(2);

  const B1 = parseFloat(dphyClockInput.value);
  if (isNaN(B1) || B1 <= 0) {
    clearDPHYTable();
    return;
  }
  // B2 = DPHY Clock per (ns)
  const B2 = 1000 / B1;
  // B3 = Byte Clock Frequency (MHz)
  const B3 = B1 / 8;
  // B4 = Byte Clock per (ns)
  const B4 = 1000 / B3;

  // 1. DPHY Clock per (ns)
  outClockPerMin.textContent = B2.toFixed(3);
  outClockPerMax.textContent = 'N/A';
  outClockPerChoice.textContent = B2.toFixed(3);
  // 2. Byte Clock Frequency (MHz)
  outByteFreqMin.textContent = B3.toFixed(3);
  outByteFreqMax.textContent = 'N/A';
  outByteFreqChoice.textContent = B3.toFixed(3);
  // 3. Byte Clock per (ns)
  outBytePerMin.textContent = B4.toFixed(3);
  outBytePerMax.textContent = 'N/A';
  outBytePerChoice.textContent = B4.toFixed(3);

  // 4. t_LPX min=CEILING.MATH(50/B4), max= N/A, choice=min
  const t_LPX_min = ceilMath(50 / B4);
  outLPXMin.textContent = t_LPX_min;
  outLPXMax.textContent = 'N/A';
  outLPXChoice.textContent = t_LPX_min;

  // 5. t_HS-PREPARE min=CEILING.MATH((40+4*B2/2)/B4), max=FLOOR.MATH((85+6*B2/2)/B4), choice=min
  const t_HS_PREPARE_min = ceilMath((40 + 4 * (B2 / 2)) / B4);
  const t_HS_PREPARE_max = floorMath((85 + 6 * (B2 / 2)) / B4);
  outHSPrepareMin.textContent = t_HS_PREPARE_min;
  outHSPrepareMax.textContent = t_HS_PREPARE_max;
  outHSPrepareChoice.textContent = t_HS_PREPARE_min;

  // 6. TX_TCLK_HSZERO min=CEILING.MATH((145+10*B2/2)/B4)-D7, max=N/A, choice=min(t_HS-PREPARE)
  const t_TCLK_HSZERO_min = ceilMath((145 + 10 * (B2 / 2)) / B4) - t_HS_PREPARE_min;
  outTclkHSZeroMin.textContent = t_TCLK_HSZERO_min;
  outTclkHSZeroMax.textContent = 'N/A';
  outTclkHSZeroChoice.textContent = t_HS_PREPARE_min;

  // 7. t_HS_TRAIL min=CEILING.MATH((60+4*B2/2)/B4), max=N/A, choice=min
  const t_HS_TRAIL_min = ceilMath((60 + 4 * (B2 / 2)) / B4);
  outHSTrailMin.textContent = t_HS_TRAIL_min;
  outHSTrailMax.textContent = 'N/A';
  outHSTrailChoice.textContent = t_HS_TRAIL_min;

  // 8. t_HS_EXIT min=CEILING.MATH(100/B4), max=n/a, choice=min
  const t_HS_EXIT_min = ceilMath(100 / B4);
  outHSExitMin.textContent = t_HS_EXIT_min;
  outHSExitMax.textContent = 'N/A';
  outHSExitChoice.textContent = t_HS_EXIT_min;

  // 9. t_CLK-Prepare min=CEILING.MATH(38/B4), max=FLOOR.MATH(95/B4), choice=(min+max)/2
  const t_CLK_PREPARE_min = ceilMath(38 / B4);
  const t_CLK_PREPARE_max = floorMath(95 / B4);
  const t_CLK_PREPARE_choice = ((t_CLK_PREPARE_min + t_CLK_PREPARE_max) / 2).toFixed(3);
  outClkPrepareMin.textContent = t_CLK_PREPARE_min;
  outClkPrepareMax.textContent = t_CLK_PREPARE_max;
  outClkPrepareChoice.textContent = t_CLK_PREPARE_choice;

  // 10. t_CLK-ZERO min=CEILING.MATH(300/B4)-D11, max=n/a, choice=min
  const t_CLK_ZERO_min = ceilMath(300 / B4) - Number(t_CLK_PREPARE_choice);
  outClkZeroMin.textContent = t_CLK_ZERO_min;
  outClkZeroMax.textContent = 'N/A';
  outClkZeroChoice.textContent = t_CLK_ZERO_min;

  // 11. t_CLK-PRE min=CEILING.MATH((8*B2/2)/B4), max=n/a, choice=min
  const t_CLK_PRE_min = ceilMath((8 * (B2 / 2)) / B4);
  outClkPreMin.textContent = t_CLK_PRE_min;
  outClkPreMax.textContent = 'N/A';
  outClkPreChoice.textContent = t_CLK_PRE_min;

  // 12. t_CLK-POST min=CEILING.MATH((60+52*B2/2)/B4), max=n/a, choice=min
  const t_CLK_POST_min = ceilMath((60 + 52 * (B2 / 2)) / B4);
  outClkPostMin.textContent = t_CLK_POST_min;
  outClkPostMax.textContent = 'N/A';
  outClkPostChoice.textContent = t_CLK_POST_min;

  // 13. t_CLK-TRAIL min=CEILING.MATH(60/B4), max=na, choice=min
  const t_CLK_TRAIL_min = ceilMath(60 / B4);
  outClkTrailMin.textContent = t_CLK_TRAIL_min;
  outClkTrailMax.textContent = 'N/A';
  outClkTrailChoice.textContent = t_CLK_TRAIL_min;

  // 14. t_CLK-EXIT min=CEILING.MATH(100/B4), max=na, choice=min
  const t_CLK_EXIT_min = ceilMath(100 / B4);
  outClkExitMin.textContent = t_CLK_EXIT_min;
  outClkExitMax.textContent = 'N/A';
  outClkExitChoice.textContent = t_CLK_EXIT_min;
}

calcBtn.onclick = calcDPHY;
resetBtn.onclick = clearDPHYTable;
