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

describe('search return', () => {
  test.each([
    ['Tester_Discord', 'Discord', path.join(CONFIG.resourceInputs, 'discord','servers'), 'discord'],
    ['Tester_Axiom_CSV', 'Axiom CSV', path.join(CONFIG.resourceInputs, 'axiom','csv'), 'axiom_csv'],
    ['Tester_Axiom_XML', 'Axiom XML', path.join(CONFIG.resourceInputs, 'axiom','xml'), 'axiom_xml'],
    ['Tester_Facebook', 'Facebook', path.join(CONFIG.resourceInputs, 'facebook'), 'facebook'],
    ['Tester_Instagram', 'Instagram', path.join(CONFIG.resourceInputs, 'instagram'), 'instagram']
  ])('import %s', async (name, platform, filepath, output) => {
    await CONFIG.signin(page);
    await CONFIG.MaterialSelect(page, 'Search Return, Forensic Extract, or Other Content','#import-type-select')

    await page.focus('#report_name');
    await page.keyboard.type(name);
    await page.focus('#account_name');
    await page.keyboard.type(name);

    await CONFIG.MaterialSelect(page, platform,'#platform-select')

    await page.focus('#filepath');
    await page.keyboard.type(filepath);

    await page.click('#import-button');

    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Successful Import")'
    );

    expect(CONFIG.checkFileNotEmpty('reports',path.join(name, name, output+"_messages.csv"))).toBe(true);


  });
});
