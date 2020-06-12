const { writeFile, createReadStream } = require('fs');
const { promisify } = require('util');
const pWriteFile = promisify(writeFile);
const readline = require('readline');
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const {URL} = require('url');
const CHROME_OPTIONS = require('./chromeOption')

// assuming listFile looks like below
// a.html
// b.html
// c.html
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js/32599033#32599033
const extractArrayFromFile = async (listFile) => {
  const fileStream = createReadStream(listFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let array = []
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    array.push(line)
  }
  return array
}

const generateFileListUnderSingleAddress = (address, fileArray) => {
  if(!address.endsWith("/"))
    address += "/";

  fileArray.push(""); // to test address itself
  
  let index = fileArray.indexOf("index.html")
  if(index >= 0) { // -1 means not found
    fileArray.splice(i, 1); // delete index.html in the list
}

}

const iterateTestOverArray = async (address = 'https://ratehub.ca', 
                          fileArray = [], 
                          exportTo = 'none', 
                          minPerformance = 0.5,
                          minAccessibility = 0.5,
                          minBestPractices = 0.5,
                          minSEO = 0.5,
                          minPWA = 0.5 
  ) => {


    for(let i = 0; i < fileArray.length ; i++ ){
      await runTest(address+fileArray[i])
    }

}

const launchChromeAndRunLighthouse = (address, opts = CHROME_OPTIONS, config = null) => {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(address, opts, config).then(results => {
      // use results.lhr for the JS-consumable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results)
    });
  });
}

const runTest = async (address = 'https://ratehub.ca', 
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

  const { report, lhr } = await launchChromeAndRunLighthouse(address, CHROME_OPTIONS)

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
  run: runTest
}

const a = async () => {
  const array = await extractArrayFromFile("/home/sijoonlee/Document_2/github-action-study/lighthouse-image/files.txt")
  console.log(array)
}
a();

runTest();