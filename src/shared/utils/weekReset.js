/**
 * Days until the next Sunday midnight (local timezone).
 * Artwork Appreciation awards restart at Sunday 00:00.
 *
 * @param {Date} [now]
 * @returns {number}
 */
export const getDaysUntilNextSundayMidnight = (now = new Date()) => {
  const current = new Date(now);
  const day = current.getDay(); // 0 = Sunday
  let daysToAdd = (7 - day) % 7;

  if (daysToAdd === 0) {
    const pastMidnight =
      current.getHours() > 0 ||
      current.getMinutes() > 0 ||
      current.getSeconds() > 0 ||
      current.getMilliseconds() > 0;
    daysToAdd = pastMidnight ? 7 : 0;
  }

  const target = new Date(current);
  target.setDate(current.getDate() + daysToAdd);
  target.setHours(0, 0, 0, 0);

  const ms = target.getTime() - current.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};
