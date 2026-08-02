import { generateMetadata, generateStructuredData, updateMetaTags } from '../seo';

describe('generateMetadata', () => {
  it('formats the title as "Page | SiteName" when title is provided', () => {
    const meta = generateMetadata({ title: 'About Us', description: 'Learn about us' });
    // Default site name from SEO_CONFIG (Gairewele)
    expect(meta.title).toMatch(/About Us \|/);
  });

  it('returns only the site name when no title is provided', () => {
    const meta = generateMetadata({ description: 'No title' });
    expect(meta.title).not.toContain('|');
  });

  it('joins keywords array into a comma-separated string', () => {
    const meta = generateMetadata({
      title: 'Test',
      description: 'Test',
      keywords: ['react', 'jest', 'testing'],
    });
    expect(meta.keywords).toBe('react, jest, testing');
  });

  it('returns empty keywords string when none are provided', () => {
    const meta = generateMetadata({ title: 'Test', description: 'Test' });
    expect(meta.keywords).toBe('');
  });

  it('populates openGraph fields', () => {
    const meta = generateMetadata({ title: 'Home', description: 'Homepage' });
    expect(meta.openGraph.title).toBe('Home');
    expect(meta.openGraph.description).toBe('Homepage');
    expect(meta.openGraph.type).toBe('website');
  });

  it('populates twitter card fields', () => {
    const meta = generateMetadata({ title: 'Home', description: 'Homepage' });
    expect(meta.twitter.card).toBe('summary_large_image');
    expect(meta.twitter.title).toBe('Home');
  });

  it('includes og:image when image URL is provided', () => {
    const meta = generateMetadata({
      title: 'Test',
      description: 'Test',
      image: 'https://example.com/image.png',
    });
    expect(meta.openGraph.images).toHaveLength(1);
    expect(meta.openGraph.images[0].url).toBe('https://example.com/image.png');
  });
});

describe('generateStructuredData', () => {
  it('returns a valid JSON string', () => {
    const result = generateStructuredData('Organization', { name: 'Acme Corp' });
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes the schema.org @context', () => {
    const parsed = JSON.parse(generateStructuredData('Organization', {}));
    expect(parsed['@context']).toBe('https://schema.org');
  });

  it('sets the correct @type', () => {
    const parsed = JSON.parse(generateStructuredData('WebPage', {}));
    expect(parsed['@type']).toBe('WebPage');
  });

  it('merges extra data fields', () => {
    const parsed = JSON.parse(
      generateStructuredData('Product', { name: 'Widget', price: 9.99 }),
    );
    expect(parsed.name).toBe('Widget');
    expect(parsed.price).toBe(9.99);
  });
});

describe('updateMetaTags', () => {
  it('sets document.title', () => {
    const meta = generateMetadata({ title: 'SEO Test', description: 'Test desc' });
    updateMetaTags(meta);
    expect(document.title).toMatch(/SEO Test/);
  });
});
