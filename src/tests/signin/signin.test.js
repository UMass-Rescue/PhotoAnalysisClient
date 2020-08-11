const puppeteer = require('puppeteer');
const CONFIG = require('./../config.spec.js')

var browser = null;
var page = null;

beforeEach(async ()=> {
  browser = CONFIG.getBrowser();
  page = CONFIG.getPage();

  await page.goto('http://localhost:3000/');
});



describe('signin page', () => {
  test('loads', async () => {
    // pass
  });
  test('says bad username', async () => {
    await page.focus('#username');
    await page.keyboard.type('badman');
    await page.focus('#password');
    await page.keyboard.type('badman');
    await page.click('#signin-button');

    await page.waitForXPath('//*[contains(text(), "Invalid")]',30000)
  });

  test('blocks bad username', async () => {
    await page.goto('http://localhost:3000/import');
    expect(page.url()).toBe('http://localhost:3000/signin');
    await page.goto('http://localhost:3000/review');
    expect(page.url()).toBe('http://localhost:3000/signin');
    await page.goto('http://localhost:3000/settings');
    expect(page.url()).toBe('http://localhost:3000/signin');
    await page.goto('http://localhost:3000/custom-import');
    expect(page.url()).toBe('http://localhost:3000/signin');

    await page.goto('http://localhost:3000/tester');
    expect(page.url()).toBe('http://localhost:3000/signin');
  });

  test('allows good username', async () => {
    await page.focus('#username');
    await page.keyboard.type('uname');
    await page.click('#signin-button');
    await CONFIG.sleep(1);
    expect(page.url()).toBe('http://localhost:3000/import');
  });

  test('allows signout', async() => {
    await CONFIG.signin(page);
    await page.goto('http://localhost:3000/signout')
    expect(page.url()).toBe('http://localhost:3000/signin');

  });



});
