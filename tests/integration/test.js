const expect = require('expect');
const sinon = require('sinon');
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

describe('load and view Trailmaster site:\n', function() {
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

  // John sees that he can search for POIs by text and tries searching for 'Rabbit Hole'
  it('should filter listed POIs by POISearchText', () => {
    const poiSearchBox = browser.findElement(By.id('poi-searchText'));
    poiSearchBox.sendKeys('Rabbit Hole');

    browser
      .findElements(By.className('point-of-interest'))
      .then((list)=> {
        let once = true;
        list.forEach((el) => {
          el.isDisplayed().then((disp) => {
            if(disp) {
              el.getText().then((text) => {
                expect(once).toBe(true);
                once = false;
                expect(text.slice(0, 11)).toBe('Rabbit Hole');
              });
            }
          });
        });
      });
  });

  // John notices that he can click on POIs to display them on the map
  it('should make pois/routes visible when clicked', (done) => {
    const rabbitHolePOI = browser.findElement(By.className('point-of-interest'));
    rabbitHolePOI.click();
    rabbitHolePOI.getAttribute('style')
      .then((style) => {
        expect(style).toBe('font-weight: bold; cursor: pointer;');
        browser.findElement(By.id('poi-searchText')).sendKeys(Key.chord(Key.CONTROL, 'a'));
        browser.findElement(By.id('poi-searchText')).sendKeys(Key.BACK_SPACE);
      });

    browser.findElement(By.id('routes-controls')).click().then(() => {
      setTimeout(() => {
        const routesSearchBox = browser.findElement(By.id('routes-searchText'));
        routesSearchBox.sendKeys('Chalan kiya to');

        const ckToKt = browser.findElement(By.className('routes'));
        ckToKt.click();
        ckToKt.getAttribute('style')
        .then((style) => {
          expect(style).toBe('font-weight: bold; cursor: pointer;');
          browser.findElement(By.id('routes-searchText')).sendKeys(Key.chord(Key.CONTROL, 'a'));
          browser.findElement(By.id('routes-searchText')).sendKeys(Key.BACK_SPACE);
          done();
        });
      }, 500);
    });
  });

  // John goes to the Your Trails panel and sees the items he previously selected
  it('should show selected pois/routes in Your Trails/Currently Selected Trail display', (done) => {
    browser.findElement(By.id('trails-controls')).click().then(() => {
      browser.findElements(By.className('point-of-interest'))
        .then((selectedFeatures) => {
          selectedFeatures.forEach((feature) => {
            feature.getText().then((text) => {
              // Either text is empty, or matches one of the two elements that
              // should be displayed.
              expect(text.length > 0
                && !(text.match(/Rabbit/i)
                    || text.match(/Chalan kiya to kannat/i))).toBe(false);
            });
            feature.getTagName().then((tag) => {
              expect(tag).toEqual('tr');
            });
          });
        });
    });
    setTimeout(done, 500);
  });

  // John tries to save his trail, but fails, because he does not have an account.
  // He is prompted to sign-in or create an account.
  it('should fail to save new trails for unauthenticated users and prompt them to login or create an account.', () => {
    browser
      .findElement(By.id('save-current-trail-btn'))
      .click()
      .then(() => {
        browser.wait(until.alertIsPresent(), 1000, 'Page did not alert user to their unauthenticated status');
      });
  });
});
