const byId = (id) => document.getElementById(id);

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
