const { writeFile, createReadStream } = require('fs');
const { promisify } = require('util');
const pWriteFile = promisify(writeFile);
const readline = require('readline');
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const {URL} = require('url');
const { CHROME_OPTIONS } = require('./chromeOption')

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

// example
// hostAddress: http://localhost:11111
// fileName: 404.html
// will return: http://localhost:11111/404.html
const generateAddress = (hostAddress, fileName) => {
  if(!hostAddress.endsWith("/"))
    hostAddress += "/";
  return hostAddress + fileName
}

const iterateTestOverArray = async (hostAddress = 'https://ratehub.ca', 
                          fileArray = null, 
                          exportTo = 'html', 
                          minPerformance = 0.5,
                          minAccessibility = 0.5,
                          minBestPractices = 0.5,
                          minSEO = 0.5,
                          minPWA = 0.5 
  ) => {

    if(fileArray) {
      for(let i = 0; i < fileArray.length ; i++ ){
        const addr = generateAddress(hostAddress, fileArray[i]);
        const fileNameWithoutExtension = fileArray[i].split(".")[0];
        console.log("Testing on ", addr)
        await runTest(addr, fileNameWithoutExtension, exportTo, minPerformance, minAccessibility, minBestPractices, minSEO, minPWA);  
      };
    } else {
      console.log("Testing on", hostAddress)
      await runTest(hostAddress, "", exportTo, minPerformance, minAccessibility, minBestPractices, minSEO, minPWA);  
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
                  exportFileName = '', 
                  exportTo = 'html',
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

  console.log("Overall -------------------------->", pass ? "PASS" : "FAIL", "\n");

  if(exportTo === 'html' | exportTo === 'both'){
    await pWriteFile(`lighthouse-report/report-${exportFileName}.html`, report);
  }

  if(exportTo === 'json' | exportTo === 'both'){
    await pWriteFile(`lighthouse-report/report-${exportFileName}.json`, JSON.stringify(lhr),'utf8', (err) => {
      if(err !== null)
        return console.error(err);
    })
  }
  
};

const runTestWithFileList = async (
                  hostAddress, 
                  pathToListFile = 'null',
                  exportTo = 'html',
                  minPerformance = 0.5,
                  minAccessibility = 0.5,
                  minBestPractices = 0.5,
                  minSEO = 0.5,
                  minPWA = 0.5
  ) => {

  console.log("Lighthouse test starts ... \n");
  const fileArray = pathToListFile == 'null' ? null : await extractArrayFromFile(pathToListFile);
  
  await iterateTestOverArray(
    hostAddress, 
    fileArray,
    exportTo,
    minPerformance,
    minAccessibility,
    minBestPractices,
    minSEO,
    minPWA
  )

  console.log("Lighthouse test finished ... \n");
}

module.exports = {
  runTestWithFileList
}
