export function formatNumber(value) {
  return (Math.floor(value * 100) / 100).toString();
}

export function formatDuration(seconds) {
  let s = parseInt(seconds);
  let m = 0;
  let h = 0;
  if (s >= 60) {
    m = parseInt(s / 60);
    s = parseInt(s % 60);
    if (m >= 60) {
      h = parseInt(m / 60);
      m = parseInt(m % 60);
    }
  }
  let text = ``;
  if (s > 0) text = `${s} 秒 ${text}`;
  if (m > 0) text = `${m} 分 ${text}`;
  if (h > 0) text = `${h} 小时 ${text}`;
  return text.trim();
}
