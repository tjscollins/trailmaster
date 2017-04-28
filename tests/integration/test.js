const expect = require('expect');
const {describe, it, before, after, afterEach} = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const {By, until, Key} = webdriver;
const firefox = require('selenium-webdriver/firefox');
let browser;
const mochaTimeOut = 30000;
const URL = 'http://localhost:3000';

before(function() {
  this.timeout(mochaTimeOut);
  let profile = new firefox.Profile('/home/tjscollins/.mozilla/firefox/iy86r53n.Selenium');
  let options = new firefox
    .Options()
    .setProfile(profile);
  browser = new webdriver
    .Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
  browser.get(URL);
  // wait for page to finish loading React-App and Mapbox-gl map
  browser.wait(until.elementLocated(By.id('done-loading')), 20000, 'Page took longer than 20 seconds to load');
});

afterEach(function() {
  browser
    .manage()
    .deleteAllCookies();
});

after(function() {
  // browser.quit();
});

describe('load and view Trailmaster site', function() {
  this.timeout(mochaTimeOut);

  // John has heard about this awesome new site for sharing GPS data of mountain
  // biking trails, so he decides to go check it out
  it('should have the right title', () => {
    browser
      .getTitle()
      .then((title) => {
        expect(title).toEqual('Trailmaster - Share Trail Running and Mountain Biking Trails');
      });
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
  it('should toggle the FAQ modal', (done) => {
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
        browser.wait(until.elementLocated(By.className('modal fade in')), 1500, 'FAQ modal was not toggled').then(() => {
          browser
            .findElement(By.id('faq-modal-close'))
            .click()
            .then(() => {
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      });
  });

  // Satisfied, he looks over at the control frames and sees accordion panels for
  // points of interest, routes, trails, and tools
  it('should display an accordion with POIs, Routes, Trails, and Tools panels', (done) => {
    const accordion = browser
      .findElement(By.className('controls'))
      .findElement(By.id('accordion'));

    accordion
      .findElement(By.id('poi-controls'))
      .getText()
      .then((text) => {
        expect(text).toBe('  Points of Interest');
      });

    accordion
      .findElement(By.id('routes-controls'))
      .getText()
      .then((text) => {
        expect(text).toBe('  Routes');
      });

    accordion
      .findElement(By.id('trails-controls'))
      .getText()
      .then((text) => {
        expect(text).toBe('  Your Trails');
      });

    accordion
      .findElement(By.id('tools-controls'))
      .getText()
      .then((text) => {
        expect(text).toBe('  Tools');
      });

    setTimeout(done, 500);
  });

  // John notices that he can minimize and expand the UI, so he clicks the arrow
  // minimize the ui
  it('should hide control panels when #hide-arrow is clicked', (done) => {
    browser
      .findElement(By.id('hide-arrow'))
      .click()
      .then(() => {
        browser
          .findElement(By.id('hide-arrow'))
          .getAttribute('class')
          .then((cls) => {
            expect(cls).toBe('hidecontrols fa fa-2x fa-arrow-right');
          })
          .catch(done);
      });
    setTimeout(done, 500);
  });

  // John re-expands the UI by clicking on the expand arrow
  it('should expand control panels when .navbar-brand is clicked', (done) => {
    browser
      .findElement(By.className('navbar-brand'))
      .click()
      .then(() => {
        browser
          .findElement(By.id('hide-arrow'))
          .getAttribute('class')
          .then((cls) => {
            expect(cls).toBe('hidecontrols fa fa-2x fa-arrow-left');
          })
          .catch(done);
      });
    setTimeout(done, 500);
  });
  // Finish user story and test expect(false).toBe(true);
});
