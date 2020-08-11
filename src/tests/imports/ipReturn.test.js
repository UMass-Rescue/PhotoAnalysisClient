const puppeteer = require('puppeteer');
const path = require('path');
const CONFIG = require(path.join('..','config.spec.js'))

var browser = null;
var page = null;

beforeEach(async ()=> {
  browser = CONFIG.getBrowser();
  page = CONFIG.getPage();

  await page.goto('http://localhost:3000/');
});

var name = 'Tester_IP'
var filepath = path.join(CONFIG.resourceInputs, 'ip','ip.mini.csv')

describe('ip return', () => {
  test('import', async () => {
    await CONFIG.signin(page);
    await CONFIG.MaterialSelect(page, 'IP Addresses Only','#import-type-select')

    await page.focus('#report_name');
    await page.keyboard.type(name);
    await page.focus('#account_name');
    await page.keyboard.type(name);

    await page.focus('#filepath');
    await page.keyboard.type(filepath);

    await page.click('#cols-button');
    await CONFIG.sleep(.1);

    await CONFIG.MaterialSelect(page, 'IP','#ip-col-select')
    await CONFIG.sleep(1);
    await CONFIG.MaterialSelect(page, 'Timestamp','#tm-col-select')
    await CONFIG.sleep(1);

    await page.click('#import-button');

    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Successful Import")'
    );

    expect(CONFIG.checkFileNotEmpty('reports',path.join(name, name, "_ip.csv"))).toBe(true);


  });
});
