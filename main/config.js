const path = require('path');

const DEBUG="debug";
const DEV="development";
const PYTHON_APP_NAME = 'main'

const PYTHON_ENTRY= path.join(__dirname, '..','backend', PYTHON_APP_NAME + '.py')

PROD_ENTRY=""
if (process.platform === 'win32') {
  PROD_ENTRY = path.join(__dirname, '..','backend_dist',PYTHON_APP_NAME + '.exe')
}
else {
  PROD_ENTRY = path.join(__dirname, '..','backend_dist',PYTHON_APP_NAME)
}


const REACT_ENTRY=path.join(__dirname, '..','build', 'index.html')

const WIN_WIDTH=800;
const WIN_HEIGHT=600;

module.exports = {
  DEBUG,
  DEV,
  PYTHON_ENTRY,
  PROD_ENTRY,
  REACT_ENTRY,
  WIN_WIDTH,
  WIN_HEIGHT
}
