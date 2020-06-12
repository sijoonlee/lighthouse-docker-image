const CHROME_OPTIONS = {
    chromeFlags: [
      '--disable-dev-shm-usage',
      '--headless',
      '--no-sandbox',
      '--ignore-certificate-errors'
    ],
    output: 'html'
};

module.exports = {
  CHROME_OPTIONS
}