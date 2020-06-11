#!/bin/bash
echo Lighthouse test on $INPUT_TARGET_ADDRESS
cd /usr/src/app
node command.js --addr $INPUT_TARGET_ADDRESS \
                --exportTo $INPUT_EXPORT_TO \
                --minPerformance $INPUT_MIN_PERFORMANCE \
                --minAccessibility $INPUT_MIN_ACCESSIBILITY \
                --minBestPractices $INPUT_MIN_BEST_PRACTICES \
                --minSEO $INPUT_MIN_SEO \
                --minPWA $INPUT_MIN_PWA
if [ -r report.json ]; then
    cp report.json ./lighthouse-report
fi
if [ -r report.html ]; then
    cp report.html ./lighthouse-report
fi

if [ $INPUT_WILL_EXIT_ON_FAIL == "yes" ]; then
    read passOrFail < passOrFail.txt
    echo $passOrFail
    if [ $passOrFail == "fail" ]; then 
        exit 1
    fi
fi
