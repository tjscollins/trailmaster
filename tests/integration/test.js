const expect = require('expect');

const URL = 'http://localhost:3000';

describe('load Trailmaster site', function() {
  // John has heard about this awesome new site for sharing GPS data of mountain
  // biking trails, so he decides to go check it out
  it('should have the right title', () => {
    browser.url(URL);
    const title = browser.getTitle();
    expect(title).toEqual('Trailmaster - Share Trail Running and Mountain Biking Trails');
  });

  // John sees a header bar with controls to create an account, login, change settings,
  // and see the sites FAQ
  it('should display a header bar with important links', () => {
    expect(browser.getText('=Create Account')).toBe('Create Account');
    expect(browser.getText('=Sign-in')).toBe('Sign-in');
    expect(browser.getText('=Settings')).toBe('Settings');
    expect(browser.getText('=FAQ')).toBe('FAQ');
  });
});
