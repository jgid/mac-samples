import { displayUrl, hostOf, resolveInput, SEARCH_ENGINES, TEST_PAGE_URL } from '../../src/core/url';

describe('resolveInput', () => {
  const r = (s: string) => resolveInput(s, 'duckduckgo');
  it('handles empty input and the test page', () => {
    expect(r('')).toBeNull();
    expect(r('   ')).toBeNull();
    expect(r('deskview://test')).toBe(TEST_PAGE_URL);
    expect(r(' Deskview://Test ')).toBe(TEST_PAGE_URL);
  });
  it('passes through full URLs', () => {
    expect(r('https://example.com/a?b=1')).toBe('https://example.com/a?b=1');
    expect(r('http://example.com')).toBe('http://example.com');
    expect(r('  https://example.com  ')).toBe('https://example.com');
    expect(r('about:blank')).toBe('about:blank');
    expect(r('data:text/html,hi')).toBe('data:text/html,hi');
  });
  it('turns domains into https URLs', () => {
    expect(r('example.com')).toBe('https://example.com');
    expect(r('www.example.co.uk/path?q=1#x')).toBe('https://www.example.co.uk/path?q=1#x');
    expect(r('sub.example.de:8443')).toBe('https://sub.example.de:8443');
    expect(r('münchen.de')).toBe('https://münchen.de');
  });
  it('uses http for local hosts', () => {
    expect(r('localhost')).toBe('http://localhost');
    expect(r('localhost:3000')).toBe('http://localhost:3000');
    expect(r('localhost:3000/app')).toBe('http://localhost:3000/app');
    expect(r('192.168.178.1')).toBe('http://192.168.178.1');
    expect(r('10.0.0.5:8080/admin')).toBe('http://10.0.0.5:8080/admin');
    expect(r('fritz.box')).toBe('http://fritz.box');
    expect(r('nas.local')).toBe('http://nas.local');
    expect(r('router.lan/setup')).toBe('http://router.lan/setup');
    expect(r('nas:5000')).toBe('http://nas:5000');
  });
  it('searches everything else', () => {
    expect(r('wie spät ist es')).toBe('https://duckduckgo.com/?q=wie%20sp%C3%A4t%20ist%20es');
    expect(r('hello')).toBe('https://duckduckgo.com/?q=hello');
    expect(r('3.14')).toBe('https://duckduckgo.com/?q=3.14');
    expect(r('999.1.1.1')).toMatch(/^https:\/\/duckduckgo\.com\/\?q=/);
    expect(r('example.com is great')).toMatch(/^https:\/\/duckduckgo\.com/);
    expect(r('localhost:99999')).toMatch(/^https:\/\/duckduckgo\.com/);
    expect(resolveInput('a&b', 'google')).toBe('https://www.google.com/search?q=a%26b');
    expect(resolveInput('x', 'bing')).toBe('https://www.bing.com/search?q=x');
    expect(resolveInput('x', 'ecosia')).toBe('https://www.ecosia.org/search?q=x');
  });
  it('lists the search engines', () => {
    expect(SEARCH_ENGINES.map((e) => e.id)).toEqual(['duckduckgo', 'google', 'bing', 'ecosia']);
  });
});

describe('hostOf / displayUrl', () => {
  it('extracts hosts', () => {
    expect(hostOf('https://www.Example.com/a')).toBe('www.example.com');
    expect(hostOf('http://localhost:3000/x')).toBe('localhost');
    expect(hostOf('https://user:pw@shop.example.com:8443/')).toBe('shop.example.com');
    expect(hostOf(TEST_PAGE_URL)).toBeNull();
    expect(hostOf('about:blank')).toBeNull();
    expect(hostOf('not a url')).toBeNull();
    expect(hostOf('')).toBeNull();
  });
  it('shortens URLs for display', () => {
    expect(displayUrl('https://www.example.com/')).toBe('example.com');
    expect(displayUrl('http://example.com/a/b/')).toBe('example.com/a/b');
    expect(displayUrl('https://example.com/a?b=1')).toBe('example.com/a?b=1');
    expect(displayUrl(TEST_PAGE_URL)).toBe('Testseite');
    expect(displayUrl('about:blank')).toBe('about:blank');
  });
});
