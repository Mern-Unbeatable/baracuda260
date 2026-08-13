import {
  getMyArtworkDetailById,
  isCompetitionArtwork,
} from '@/portals/member/data/myArtworkDetailData';

describe('myArtworkDetailData', () => {
  it('treats only active entries as competition artwork', () => {
    expect(isCompetitionArtwork({ footerState: 'active' })).toBe(true);
    expect(isCompetitionArtwork({ footerState: 'profileOnly' })).toBe(false);
    expect(isCompetitionArtwork({ footerState: 'ended' })).toBe(false);
  });

  it('hides global rankings for profile-only gallery artwork', () => {
    const detail = getMyArtworkDetailById('artwork-six-profile');

    expect(detail.footerState).toBe('profileOnly');
    expect(detail.showRankings).toBe(false);
    expect(detail.inCompetition).toBe(false);
    expect(detail.usesVotesViews).toBe(false);
    expect(detail.rankings).toEqual([]);
  });

  it('shows global rankings only for live competition artwork', () => {
    const detail = getMyArtworkDetailById('artwork-beetle');

    expect(detail.footerState).toBe('active');
    expect(detail.showRankings).toBe(true);
    expect(detail.rankings.length).toBeGreaterThan(0);
  });

  it('uses gallery stats for ended competition artwork', () => {
    const detail = getMyArtworkDetailById('artwork-six-ended');

    expect(detail.footerState).toBe('ended');
    expect(detail.showRankings).toBe(false);
    expect(detail.usesVotesViews).toBe(false);
  });
});
