const puppeteer = require('puppeteer');
const path = require('path');
const CONFIG = require(path.join('..','config.spec.js'))
const Auth = require(path.join('./','..','..','api','authentication.js'))

var browser = null;
var page = null;

beforeEach(async ()=> {
  browser = CONFIG.getBrowser();
  page = CONFIG.getPage();

  await page.goto('http://localhost:3000/');
});

var name = 'Tester_';
var platform = 'Discord';
var filepath = path.join(CONFIG.resourceInputs, 'discord','servers');


describe('custom return', () => {
  test('create', async () => {
    await CONFIG.signin(page);
    await page.goto('http://localhost:3000/custom-import');

    await page.focus('#import_name');
    await page.keyboard.type(name);

    await page.focus('#platform_name');
    await page.keyboard.type(platform);

    await page.focus('#filepath');
    await page.keyboard.type(filepath);

    await page.click('#cols-button');
    await CONFIG.sleep(1);

    await CONFIG.MaterialSelect(page, 'ID','#id-col-select')
    await CONFIG.sleep(.5);

    await CONFIG.MaterialSelect(page, 'Username','#user-col-select')
    await CONFIG.sleep(.5);

    await CONFIG.MaterialSelect(page, 'Contents','#message-col-select')
    await CONFIG.sleep(.5);

    await CONFIG.MaterialSelect(page, 'Timestamp','#tm-col-select')
    await CONFIG.sleep(.5);

    await CONFIG.MaterialSelect(page, 'Attachments','#attachments-col-select')
    await CONFIG.sleep(.5);

    await CONFIG.MaterialSelect(page, 'Channel ID','#conversation-col-select')
    await CONFIG.sleep(.5);

    await CONFIG.MaterialSelect(page, 'Author ID','#sender-col-select')
    await CONFIG.sleep(.5);

    await page.click('#import-button');

    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Successful Import")'
    );

  });
  test('import', async () => {
    await CONFIG.signin(page);
    await page.goto('http://localhost:3000/import');

    await CONFIG.MaterialSelect(page, 'Search Return, Forensic Extract, or Other Content','#import-type-select')

    await page.focus('#report_name');
    await page.keyboard.type(name);
    await page.focus('#account_name');
    await page.keyboard.type(name);

    await page.click('#custom-yes');

    await CONFIG.MaterialSelect(page, name,'#platform-select')

    await page.focus('#filepath');
    await page.keyboard.type(filepath);

    await page.click('#import-button');

    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Successful Import")'
    );

    expect(CONFIG.checkFileNotEmpty('reports',path.join(name, name, name+"_messages.csv"))).toBe(true);

    CONFIG.resetCustom();

  });
});
