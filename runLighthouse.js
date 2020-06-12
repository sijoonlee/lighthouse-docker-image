const {writeFile} = require('fs');
const {promisify} = require('util');
const pWriteFile = promisify(writeFile);
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const {URL} = require('url');


function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results)
    });
  });
}

const run = async (addr = 'https://ratehub.ca', 
                  exportTo = 'none', 
                  minPerformance = 0.5,
                  minAccessibility = 0.5,
                  minBestPractices = 0.5,
                  minSEO = 0.5,
                  minPWA = 0.5 ) => {

  const minScores = {
    "performance" : minPerformance,
    "accessibility" : minAccessibility,
    "best-practices" : minBestPractices,
    "seo" : minSEO,
    "pwa" : minPWA
  }

  const opts = {
    chromeFlags: [
      '--disable-dev-shm-usage',
      '--headless',
      '--no-sandbox',
      '--ignore-certificate-errors'
    ],
    output: 'html'
  };


  const { report, lhr } = await launchChromeAndRunLighthouse(addr, opts)

  
  let scoreCollect = {}
  Object.keys(lhr.categories).map( key => { scoreCollect[key] = lhr.categories[key]['score']})
 
  let pass = true;
  for (let [subject , score] of Object.entries(scoreCollect)){
    let passLabel = '';
    if(score < minScores[subject]) {
      passLabel = "fail";
      pass = false; // if any of 5 scores fails, it means the web didn't pass in overall
    } else {
      passLabel = "pass";
    }
    passLabel += ` | minimum ${minScores[subject]}`;
    console.log(subject, score, passLabel)
  }
  
  await pWriteFile("passOrFail.txt", pass ? "pass" : "fail") 
  // to pass the result to bash shell, bash shell can use exit 1, which makes github action mark the action as 'fail'

  if(exportTo === 'html' | exportTo === 'both'){
    await pWriteFile("report.html", report);
  }

  if(exportTo === 'json' | exportTo === 'both'){
    await pWriteFile("report.json", JSON.stringify(lhr),'utf8', (err) => {
      if(err !== null)
        return console.error(err);
    })
  }
  
};

module.exports = {
  run
}
