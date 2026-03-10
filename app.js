const byId = (id) => document.getElementById(id);

function readNumber(id) {
  return Number(byId(id).value || 0);
}

function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function addMinutesToTime(timeString, minutes) {
  const [h, m] = timeString.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor(normalized % 60)
    .toString()
    .padStart(2, "0");
  return `${hour}:${minute}`;
}

function calculateKpi() {
  const predictedBowls = readNumber("predictedBowls");
  const currentTofuPieces = readNumber("currentTofuPieces");
  const currentBeefKg = readNumber("currentBeefKg");
  const currentBrothPots = readNumber("currentBrothPots");

  const tofuPerBowl = readNumber("tofuPerBowl");
  const tofuPiecesPerBlock = readNumber("tofuPiecesPerBlock");
  const tofuBlocksPerBatch = readNumber("tofuBlocksPerBatch");
  const tofuBatchMinutes = readNumber("tofuBatchMinutes");

  const beefGramsPerBowl = readNumber("beefGramsPerBowl");
  const beefKgPerBatch = readNumber("beefKgPerBatch");
  const beefBatchMinutes = readNumber("beefBatchMinutes");

  const kitchenStartTime = byId("kitchenStartTime").value;

  const tofuNeededPieces = predictedBowls * tofuPerBowl;
  const tofuNeedToPreparePieces = Math.max(0, tofuNeededPieces - currentTofuPieces);
  const tofuBlocksToFry = tofuNeedToPreparePieces / tofuPiecesPerBlock;
  const tofuBatches = tofuBlocksToFry / tofuBlocksPerBatch;
  const tofuMinutes = tofuBatches * tofuBatchMinutes;

  const beefNeededKg = (predictedBowls * beefGramsPerBowl) / 1000;
  const beefNeedToPrepareKg = Math.max(0, beefNeededKg - currentBeefKg);
  const beefBatches = beefNeedToPrepareKg / beefKgPerBatch;
  const beefMinutes = beefBatches * beefBatchMinutes;

  const totalMinutes = tofuMinutes + beefMinutes;
  const finishTime = addMinutesToTime(kitchenStartTime, Math.ceil(totalMinutes));

  const result = byId("result");
  const content = byId("resultContent");

  content.innerHTML = `
    <p><strong>Dự báo bán:</strong> ${formatNumber(predictedBowls, 0)} bát bún đầy đủ.</p>
    <ul>
      <li>
        <strong>Đậu:</strong> Cần tổng ${formatNumber(tofuNeededPieces, 1)} miếng, đang có ${formatNumber(currentTofuPieces, 1)} miếng,
        cần chuẩn bị thêm <strong>${formatNumber(tofuNeedToPreparePieces, 1)} miếng</strong>.
      </li>
      <li>
        Quy đổi ra <strong>${formatNumber(tofuBlocksToFry, 2)} bìa đậu</strong>, tương đương
        <strong>${formatNumber(tofuBatches, 2)} mẻ chiên</strong>.
      </li>
      <li>
        Thời gian chiên đậu dự kiến: <strong>${formatNumber(tofuMinutes, 1)} phút</strong>.
      </li>
    </ul>

    <ul>
      <li>
        <strong>Bò:</strong> Cần tổng ${formatNumber(beefNeededKg, 2)} kg, đang có ${formatNumber(currentBeefKg, 2)} kg,
        cần chế biến thêm <strong>${formatNumber(beefNeedToPrepareKg, 2)} kg</strong>.
      </li>
      <li>
        Tương đương <strong>${formatNumber(beefBatches, 2)} mẻ bò</strong>.
      </li>
      <li>
        Thời gian sơ chế bò dự kiến: <strong>${formatNumber(beefMinutes, 1)} phút</strong>.
      </li>
    </ul>

    <div class="kpi-highlight">
      <p><strong>Tổng thời gian chế biến chính:</strong> ${formatNumber(totalMinutes, 1)} phút (${formatNumber(totalMinutes / 60, 3)} giờ).</p>
      <p><strong>Giờ bắt đầu:</strong> ${kitchenStartTime} → <strong>Mốc cần hoàn thành:</strong> ${finishTime}.</p>
      <p><strong>Thông tin nước dùng hiện có:</strong> ${formatNumber(currentBrothPots, 2)} nồi (để bếp tham chiếu khi lên kế hoạch nấu bổ sung).</p>
    </div>
  `;

  result.hidden = false;
}

byId("calculateButton").addEventListener("click", calculateKpi);
window.addEventListener("DOMContentLoaded", calculateKpi);
