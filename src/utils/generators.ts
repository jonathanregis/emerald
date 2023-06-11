export function generateTransactionReference(length: number = 12): string {
  if (length < 12 || length > 32) {
    length = 12; // Will only support length between 12 and 32 inclusive for now, will later add suport for fewer
  }
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const date = new Date();
  const day = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.toLocaleDateString('en-GB', { year: '2-digit' });
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log({ day, month, year, time });
  let str = day[0] + month[0] + date.getDate() + year + time.replace(':', '');
  while (str.length < length) {
    str += alphabet[Math.floor(Math.random() * 100) % 26];
  }
  return str.toLowerCase();
}
