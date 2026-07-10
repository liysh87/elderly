export function formatMoney(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toFixed(2) + '万';
  }
  return n.toFixed(2);
}

export function formatMoneyFull(n: number): string {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPercent(n: number): string {
  return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function animateNumber(
  el: HTMLElement,
  from: number,
  to: number,
  duration: number = 1000,
  formatter: (n: number) => string = (n) => n.toFixed(2)
) {
  const start = performance.now();
  const diff = to - from;
  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatter(from + diff * eased);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}