import {
  ADMIN_NEWSLETTER_SUBSCRIBERS,
  DEFAULT_RECIPIENT_ID,
  isBannerFileAllowed,
  RECIPIENT_OPTIONS,
} from '../adminNewsletterData';

describe('adminNewsletterData', () => {
  it('exposes Figma subscriber rows and recipient options', () => {
    expect(ADMIN_NEWSLETTER_SUBSCRIBERS).toHaveLength(17);
    expect(ADMIN_NEWSLETTER_SUBSCRIBERS[0].email).toBe('john.anderson@company.com');
    expect(RECIPIENT_OPTIONS).toHaveLength(3);
    expect(DEFAULT_RECIPIENT_ID).toBe('everyone');
  });

  it('validates banner upload constraints', () => {
    expect(
      isBannerFileAllowed({ name: 'banner.png', type: 'image/png', size: 1024 }),
    ).toBe(true);
    expect(
      isBannerFileAllowed({ name: 'banner.gif', type: 'image/gif', size: 1024 }),
    ).toBe(false);
    expect(
      isBannerFileAllowed({ name: 'banner.jpg', type: 'image/jpeg', size: 5 * 1024 * 1024 }),
    ).toBe(false);
  });
});
