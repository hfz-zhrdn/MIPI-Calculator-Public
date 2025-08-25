// Calculation logic for DPHY Timing

//Global Variable here ====================================
const gearLevel = 8;

//=========================================================

const dphyClockInput = document.getElementById('dphy-clock');
const calcBtn = document.getElementById('calc-dphy-btn');
const resetBtn = document.querySelector('#dphy-form button[type="reset"]');
const bitRateInput = document.getElementById('bit-rate');

const outClockPerMin = document.getElementById('out-clock-per-min');
const outByteFreqMin = document.getElementById('out-byte-freq-min');
const outUIps = document.getElementById('out-ui-ps');
const outByteClockPeriod = document.getElementById('out-byte-clock-period');
const outDataSettleMin = document.getElementById('out-data-settle-min');
const outDataSettleMax = document.getElementById('out-data-settle-max');
const outDataSettleChoice = document.getElementById('out-data-settle-choice');

const outClockPerMinTable = document.getElementById('out-clock-per-min-table');
const outByteFreqMinTable = document.getElementById('out-byte-freq-min-table');

// Add references for all TX timing outputs
const outLpxMin = document.getElementById('out-lpx-min');
const outLpxMax = document.getElementById('out-lpx-max');
const outLpxChoice = document.getElementById('out-lpx-choice');
const outHsPrepareMin = document.getElementById('out-hs-prepare-min');
const outHsPrepareMax = document.getElementById('out-hs-prepare-max');
const outHsPrepareChoice = document.getElementById('out-hs-prepare-choice');
const outTclkHszeroMin = document.getElementById('out-tclk-hszero-min');
const outTclkHszeroMax = document.getElementById('out-tclk-hszero-max');
const outTclkHszeroChoice = document.getElementById('out-tclk-hszero-choice');
const outHsTrailMin = document.getElementById('out-hs-trail-min');
const outHsTrailMax = document.getElementById('out-hs-trail-max');
const outHsTrailChoice = document.getElementById('out-hs-trail-choice');
const outHsExitMin = document.getElementById('out-hs-exit-min');
const outHsExitMax = document.getElementById('out-hs-exit-max');
const outHsExitChoice = document.getElementById('out-hs-exit-choice');
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

function ceilMath(val) { return Math.ceil(val); }
function floorMath(val) { return Math.floor(val); }

function clearDPHYTable() {
  [
    outClockPerMin, outUIps, outByteClockPeriod, outByteFreqMin,
    outClockPerMinTable, outByteFreqMinTable,
    outDataSettleMin, outDataSettleMax, outDataSettleChoice,
    outLpxMin, outLpxMax, outLpxChoice,
    outHsPrepareMin, outHsPrepareMax, outHsPrepareChoice,
    outTclkHszeroMin, outTclkHszeroMax, outTclkHszeroChoice,
    outHsTrailMin, outHsTrailMax, outHsTrailChoice,
    outHsExitMin, outHsExitMax, outHsExitChoice,
    outClkPrepareMin, outClkPrepareMax, outClkPrepareChoice,
    outClkZeroMin, outClkZeroMax, outClkZeroChoice,
    outClkPreMin, outClkPreMax, outClkPreChoice,
    outClkPostMin, outClkPostMax, outClkPostChoice,
    outClkTrailMin, outClkTrailMax, outClkTrailChoice,
    outClkExitMin, outClkExitMax, outClkExitChoice
    // ...other outputs if needed...
  ].forEach(cell => cell && (cell.textContent = ''));
  if (dphyClockInput) dphyClockInput.value = '';
}

function calcDPHY() {
  const bitRate = parseFloat(bitRateInput.value);
  if (isNaN(bitRate) || bitRate < 80 || bitRate > 2500) {
    if (dphyClockInput) dphyClockInput.textContent = '';
    return;
  }
  // D-PHY Clock Frequency (MHz)
  const dphyClock = bitRate / 2;
  if (dphyClockInput) dphyClockInput.textContent = dphyClock.toFixed(3);

  // DPHY CLOCK period (ns)
  const dphyClockPeriod = 1000 / dphyClock;
  if (outClockPerMin) outClockPerMin.textContent = dphyClockPeriod.toFixed(3);
  if (outClockPerMinTable) outClockPerMinTable.textContent = dphyClockPeriod.toFixed(3);

  // Byte Clock Frequency (MHz)
  const byteClockFreq = dphyClock / 8;
  if (outByteFreqMin) outByteFreqMin.textContent = byteClockFreq.toFixed(3);
  if (outByteFreqMinTable) outByteFreqMinTable.textContent = byteClockFreq.toFixed(3);

  // Byte Clock Period (ps)
  const byteClockPeriod_ns = 1000 / byteClockFreq; // Convert MHz to ns
  const byteClockPeriod_ps = 1000 * byteClockPeriod_ns; // Convert ns to ps
  if (outByteClockPeriod) outByteClockPeriod.textContent = byteClockPeriod_ps.toFixed(3);
  if (outByteClockPeriod) outByteClockPeriod.textContent = byteClockPeriod_ns.toFixed(3);

  // UI (ps)
  const uiPs = 1000000 / bitRate;
  if (outUIps) outUIps.textContent = uiPs.toFixed(3);
  if (outByteClockPeriod) outByteClockPeriod.textContent = byteClockPeriod_ps.toFixed(3);

  // t_LPX (uses ns)
  const tLpxMin = Math.floor(50 / byteClockPeriod_ns);
  if (outLpxMin) outLpxMin.textContent = tLpxMin < 0 ? 0 : tLpxMin;
  if (outLpxMax) outLpxMax.textContent = 0;
  if (outLpxChoice) outLpxChoice.textContent = Math.floor(0.05 * byteClockFreq + 1);

  // t_HS-PREPARE (uses ns)
  const tHsPrepareMin = Math.ceil((40 + 4 * (dphyClockPeriod / 2)) / byteClockPeriod_ns);
  const tHsPrepareMax = Math.floor((85 + 6 * (dphyClockPeriod / 2)) / byteClockPeriod_ns);
  const tHsPrepareMinNS = 40 + 4 * (1000/(byteClockFreq*gearLevel));
  const tHsPrepareChoice = Math.ceil(tHsPrepareMinNS / (1000/byteClockFreq));
  if (outHsPrepareMin) outHsPrepareMin.textContent = tHsPrepareMin < 0 ? 0 : tHsPrepareMin;
  if (outHsPrepareMax) outHsPrepareMax.textContent = tHsPrepareMax < 0 ? 0 : tHsPrepareMax;
  if (outHsPrepareChoice) outHsPrepareChoice.textContent = tHsPrepareChoice;

  // TX_TCLK_HSZERO (uses ns)
  const tDatHsPrepMin = 40 + 4 * (1000 / (byteClockFreq * gearLevel));
  const tDatHsZeroMin = 145 + 10 * (1000 / (byteClockFreq * gearLevel)) - tDatHsPrepMin;
  const tDatHsZero = Math.ceil(tDatHsZeroMin / (1000/byteClockFreq));
  const tTclkHszeroMin = Math.ceil((145 + 10 * (dphyClockPeriod / 2)) / byteClockPeriod_ns) - tHsPrepareChoice;
  if (outTclkHszeroMin) outTclkHszeroMin.textContent = tTclkHszeroMin < 0 ? 0 : tTclkHszeroMin;
  if (outTclkHszeroMax) outTclkHszeroMax.textContent = 0;
  if (outTclkHszeroChoice) outTclkHszeroChoice.textContent = tDatHsZero;

  // t_HS_TRAIL (uses ns)
  const tHsTrailMin = Math.ceil((60 + 4 * (dphyClockPeriod / 2)) / byteClockPeriod_ns);
  const tHsTrailChoice = Math.ceil(((80 + 4*(1000.0/(dphyClock))) + (29120/(dphyClock))) / (1000.0/byteClockFreq));
  if (outHsTrailMin) outHsTrailMin.textContent = tHsTrailMin < 0 ? 0 : tHsTrailMin;
  if (outHsTrailMax) outHsTrailMax.textContent = 0;
  if (outHsTrailChoice) outHsTrailChoice.textContent = tHsTrailChoice;

  // t_HS_EXIT (uses ns)
  const tHsExitMin = Math.ceil(100 / byteClockPeriod_ns);
  if (outHsExitMin) outHsExitMin.textContent = tHsExitMin < 0 ? 0 : tHsExitMin;
  if (outHsExitMax) outHsExitMax.textContent = 0;
  if (outHsExitChoice) outHsExitChoice.textContent = 
    Math.floor((0.1*byteClockFreq)+1);

  // t_CLK-Prepare (uses ns)
  const tClkPrepareMin = Math.ceil(38 / byteClockPeriod_ns);
  const tClkPrepareMax = Math.floor(95 / byteClockPeriod_ns);
  const tClkPrepareChoice = Math.ceil(0.038*byteClockFreq);
  if (outClkPrepareMin) outClkPrepareMin.textContent = tClkPrepareMin < 0 ? 0 : tClkPrepareMin;
  if (outClkPrepareMax) outClkPrepareMax.textContent = tClkPrepareMax < 0 ? 0 : tClkPrepareMax;
  if (outClkPrepareChoice) outClkPrepareChoice.textContent = tClkPrepareChoice < 0 ? 0 : tClkPrepareChoice;

  // t_CLK-ZERO (uses ns)
  const tClkZeroMin = Math.ceil(300 / byteClockPeriod_ns) - tClkPrepareChoice; // D11
  const tCLkZeroChoice = Math.ceil(262 / (1000/byteClockFreq));
  if (outClkZeroMin) outClkZeroMin.textContent = tClkZeroMin < 0 ? 0 : tClkZeroMin;
  if (outClkZeroMax) outClkZeroMax.textContent = 0;
  if (outClkZeroChoice) outClkZeroChoice.textContent = tCLkZeroChoice;

  // t_CLK-PRE (uses ns)
  const tClkPreMin = Math.ceil((8 * (dphyClockPeriod / 2)) / byteClockPeriod_ns);
  if (outClkPreMin) outClkPreMin.textContent = tClkPreMin < 0 ? 0 : tClkPreMin;
  if (outClkPreMax) outClkPreMax.textContent = 0;
  if (outClkPreChoice) outClkPreChoice.textContent = 
    Math.ceil(8 / gearLevel + 1);

  // t_CLK-POST (uses ns)
  const tClkPostMin = Math.ceil((60 + 52 * (dphyClockPeriod / 2)) / byteClockPeriod_ns);
  if (outClkPostMin) outClkPostMin.textContent = tClkPostMin < 0 ? 0 : tClkPostMin;
  if (outClkPostMax) outClkPostMax.textContent = 0;
  if (outClkPostChoice) outClkPostChoice.textContent = 
    Math.floor((0.06*byteClockFreq)+(52/gearLevel)+1);

  // t_CLK-TRAIL (uses ns)
  const tClkTrailMin = Math.ceil(60 / byteClockPeriod_ns);
  if (outClkTrailMin) outClkTrailMin.textContent = tClkTrailMin < 0 ? 0 : tClkTrailMin;
  if (outClkTrailMax) outClkTrailMax.textContent = 0;
  if (outClkTrailChoice) outClkTrailChoice.textContent = 
    Math.floor((0.06*byteClockFreq)+2);

  // t_CLK-EXIT (uses ns)
  const tClkExitMin = Math.ceil(100 / byteClockPeriod_ns);
  if (outClkExitMin) outClkExitMin.textContent = tClkExitMin < 0 ? 0 : tClkExitMin;
  if (outClkExitMax) outClkExitMax.textContent = 0;
  if (outClkExitChoice) outClkExitChoice.textContent = 
    Math.floor((0.1*byteClockFreq)+1);

  // Data_Settle calculations (updated)
  const dataSettleMin = Math.floor((85000 + 10 * uiPs) / byteClockPeriod_ps - 3);
  const dataSettleMax = Math.floor((145000 + 10 * uiPs) / byteClockPeriod_ps - 4);
  let dataSettleChoice = 0;
  if (dataSettleMin >= 0 && dataSettleMax >= 0) {
    dataSettleChoice = Math.floor((dataSettleMin + dataSettleMax) / 2);
  }
  if (outDataSettleMin) outDataSettleMin.textContent = dataSettleMin < 0 ? 0 : dataSettleMin;
  if (outDataSettleMax) outDataSettleMax.textContent = dataSettleMax < 0 ? 0 : dataSettleMax;
  if (outDataSettleChoice) outDataSettleChoice.textContent = dataSettleMin < 0 ? 0 : dataSettleChoice;
}

calcBtn.onclick = calcDPHY;
resetBtn.onclick = clearDPHYTable;

// Clamp bit-rate input to 80-2500 on blur
if (bitRateInput) {
  bitRateInput.addEventListener('blur', function () {
    let val = parseFloat(bitRateInput.value);
    if (isNaN(val)) return;
    if (val < 80) bitRateInput.value = 80;
    else if (val > 2500) bitRateInput.value = 2500;
  });
}
