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

describe('gps return', () => {
  test.each([
    ['Tester_GPS_File', path.join(CONFIG.resourceInputs, 'gps','csv','gps.mini.csv')],
  //  ['Tester_GPS_Folder', path.join(CONFIG.resourceInputs, 'gps','multi_test')] NOT WORKING
  ])('import', async (name, filepath) => {
    await CONFIG.signin(page);
    await CONFIG.MaterialSelect(page, 'GPS Addresses Only','#import-type-select')

    await page.focus('#report_name');
    await page.keyboard.type(name);
    await page.focus('#account_name');
    await page.keyboard.type(name);

    if (name==='Tester_GPS_Folder'){
      await page.click('#multi_yes');
    }

    await page.focus('#filepath');
    await page.keyboard.type(filepath);

    await page.click('#cols-button');
    await CONFIG.sleep(.1);

    await CONFIG.MaterialSelect(page, '1st Tower LAT','#lat-col-select')
    await CONFIG.sleep(.7);

    await CONFIG.MaterialSelect(page, '1st Tower LONG','#long-col-select')
    await CONFIG.sleep(.7);

    await CONFIG.MaterialSelect(page, 'Time','#tm-col-select')
    await CONFIG.sleep(.7);

    await page.click('#import-button');

    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Successful Import")'
    );

    expect(CONFIG.checkFileNotEmpty('reports',path.join(name, "gps.csv"))).toBe(true);


  });
});
