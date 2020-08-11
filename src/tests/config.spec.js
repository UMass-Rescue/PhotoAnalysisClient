const puppeteer = require('puppeteer');
const path = require('path');
const rimraf = require("rimraf");
const fs = require('fs');
jest.setTimeout(10000);


var CONFIG = {
  headless:false,
  slowMo: 0,
};

var browser = null;
var page = null;

beforeAll(async ()=> {
  try {
    resetTesters();
  } catch(err){
    //pass
  }

  browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });
  page = await browser.newPage();

  page.emulate({
    viewport: {
      width: 1700,
      height: 1000
    },
    userAgent: ''
  });

});

afterAll(async ()=> {
  try {
    browser.close();
  }
  catch(err) {
    //pass
  }
  resetTesters();
})


const getBrowser = () => { return browser };
const getPage    = () => { return page    };



describe('puppeteer', () => {
  test('is correctly installed', async () => {
    expect(browser).not.toBe(null);
    expect(page).not.toBe(null);
  });
});


/********** USEFUL FUNCTIONS  ****************/

var usernamePath = path.join(require('os').homedir(),'.opskit','users','uname');
var reportsPath = path.join(usernamePath,'reports');
var exportsPath = path.join(usernamePath, 'exports');
var customPath = path.join(usernamePath, 'custom');

const sleep = (s) => {
  return new Promise(resolve => setTimeout(resolve, s*1000));
}

const signin = async (page) => {
  try {
    await page.focus('#username');
    await page.keyboard.type('uname');
    await page.click('#signin-button');
  }
  catch(err){
    // user probably already signed in
  }
};

const MaterialSelect = async (page, newSelectedValue, cssSelector) => {
    await page.evaluate((newSelectedValue, cssSelector) => {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent("mousedown", true, true);
        var selectNode = document.querySelector(cssSelector);
        selectNode.dispatchEvent(clickEvent);
        [...document.querySelectorAll('li')].filter(el => el.innerText == newSelectedValue)[0].click();
    }, newSelectedValue, cssSelector);
}


const resetTesters = () => {

  var folders = fs.readdirSync(reportsPath);

  folders.forEach(function (folder, index) {
    if (folder.split("_")[0]==='Tester'){
      rimraf.sync(path.join(reportsPath, folder))
    }
  });

  var filesExport = fs.readdirSync(exportsPath);

  filesExport.forEach(function (file, index) {
    if (file.split("_")[0]==='Tester'){
      fs.unlinkSync(path.join(exportsPath, file))
    }
  });
}

const resetCustom = () => {
  var filesCustom = fs.readdirSync(customPath);

  filesCustom.forEach(function (file, index) {
    if (file.split("_")[0]==='Tester'){
      fs.unlinkSync(path.join(customPath, file))
    }
  });
}

const checkFileNotEmpty = (type, name) => {
  var fpath = "";
  if (type === 'custom'){
    fpath = customPath;
  }
  else if (type === 'exports'){
    fpath = exportsPath;
  }
  else {
    fpath = reportsPath;
  }

  try {
    var final_path = path.join(fpath, name);
    var stats = fs.statSync(final_path);
    var fileSizeInBytes = stats["size"];
    return fileSizeInBytes > 0;
  } catch(err){
    return false;
  }

}





var resourceInputs = path.join(__dirname, '..','..','backend','resources','test_input')

module.exports = {
  CONFIG,
  getBrowser,
  getPage,
  sleep,
  signin,
  MaterialSelect,
  resourceInputs,
  checkFileNotEmpty,
  resetCustom
}
