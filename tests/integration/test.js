const expect = require('expect');
const {describe, it, before, after, afterEach} = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const {By, until, Key} = webdriver;
let browser;

const URL = 'http://localhost:3000';
const mochaTimeOut = 30000;

before(function() {
  this.timeout(mochaTimeOut);
  browser = new webdriver
    .Builder()
    .forBrowser('firefox')
    .build();
});

afterEach(function() {
  browser
    .manage()
    .deleteAllCookies();
});

after(function() {
  browser.quit();
});

describe('load Trailmaster site', function() {
  this.timeout(mochaTimeOut);

  // John has heard about this awesome new site for sharing GPS data of mountain
  // biking trails, so he decides to go check it out
  it('should have the right title', () => {
    browser.get(URL);
    browser
      .getTitle()
      .then((title) => {
        expect(title).toEqual('Trailmaster - Share Trail Running and Mountain Biking Trails');
      });
    // wait for page to finish loading
    browser.wait(until.elementLocated(By.id('done-loading')), 5000, 'Page took longer than 5seconds to load');
  });

  // John sees a header bar with controls to create an account, login, change
  // settings, and see the sites FAQ
  it('should display a header bar with important links', () => {
    browser
      .findElement(By.id('faq-link'))
      .getText()
      .then((text) => {
        expect(text).toBe('FAQ');
      });
    browser
      .findElement(By.id('settings-link'))
      .getText()
      .then((text) => {
        expect(text).toBe('Settings');
      });
    browser
      .findElement(By.id('create-account-link'))
      .getText()
      .then((text) => {
        expect(text).toBe('Create Account');
      });
    browser
      .findElement(By.id('login-link'))
      .getText()
      .then((text) => {
        expect(text).toBe('Sign-in');
      });
  });

  // Wondering how the site works, John decides to view the FAQ and clicks on the
  // link
  it('should toggle the FAQ modal', () => {
    browser
      .findElement(By.id('faq-modal'))
      .getAttribute('class')
      .then((cls) => {
        expect(cls).toBe('modal fade');
      });

    browser
      .findElement(By.id('faq-link'))
      .click()
      .then(() => {
        browser
          .wait(until.elementLocated(By.className('modal fade in')), 1000, 'FAQ modal was not toggled');
      });
  });

  // Finish user story and test
  expect(false).toBe(true);
});
