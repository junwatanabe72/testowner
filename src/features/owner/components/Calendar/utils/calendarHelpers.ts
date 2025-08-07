export function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export function getCalendarWeeks(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // 月の最初の週の空白を埋める
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevDate = new Date(year, month, 1 - (firstDayOfWeek - i));
    currentWeek.push(prevDate);
  }

  // 月の日付を追加
  for (let d = 1; d <= lastDay.getDate(); d++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(year, month, d));
  }

  // 最後の週の空白を埋める
  if (currentWeek.length > 0) {
    const remainingDays = 7 - currentWeek.length;
    for (let i = 1; i <= remainingDays; i++) {
      currentWeek.push(new Date(year, month + 1, i));
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateJapanese(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

export function formatTime(time: string): string {
  return time;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

export function getMonthName(month: number): string {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  return monthNames[month];
}

export function getDayOfWeekName(dayIndex: number): string {
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  return dayNames[dayIndex];
}