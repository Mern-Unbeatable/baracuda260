import {
  DEFAULT_ALBUM_FORMAT,
  DEFAULT_MONTH_ID,
  formatCount,
  getMonthOption,
  getPodiumWinners,
  getRankDisplay,
  getRankMedalSrc,
  getWinnersForFormat,
  isMedalRank,
} from '@/portals/admin/data/adminWinnersData';

describe('adminWinnersData helpers', () => {
  it('returns six-photo winners by default', () => {
    const winners = getWinnersForFormat(DEFAULT_ALBUM_FORMAT);
    expect(winners).toHaveLength(6);
    expect(winners[0].id).toBe('anna-kowalska');
    expect(winners[0].votes).toBe(4821);
  });

  it('returns different standings for other formats', () => {
    const six = getWinnersForFormat('six');
    const single = getWinnersForFormat('single');
    expect(single[0].votes).not.toBe(six[0].votes);
  });

  it('builds podium in second / first / third order helpers', () => {
    const winners = getWinnersForFormat('six');
    const podium = getPodiumWinners(winners);
    expect(podium.first.id).toBe('anna-kowalska');
    expect(podium.second.id).toBe('piotr-mazur');
    expect(podium.third.id).toBe('marta-wisniewska');
  });

  it('formats counts and rank medals', () => {
    expect(formatCount(4821, 'en')).toBe('4,821');
    expect(getRankMedalSrc(1)).toContain('medal-gold.png');
    expect(getRankMedalSrc(2)).toContain('medal-silver.png');
    expect(getRankMedalSrc(3)).toContain('medal-bronze.png');
    expect(getRankDisplay(4)).toBe('4');
    expect(isMedalRank(1)).toBe(true);
    expect(isMedalRank(4)).toBe(false);
  });

  it('resolves the default July month option', () => {
    const month = getMonthOption(DEFAULT_MONTH_ID);
    expect(month.year).toBe(2026);
    expect(month.monthKey).toBe('adminWinners.months.july');
  });
});
