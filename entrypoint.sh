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
if [ -r passOrFail.txt ]; then
    cp passOrFail.txt ./lighthouse-report
fi
if [ -r report.json ]; then
    cp report.json ./lighthouse-report
fi
if [ -r report.html ]; then
    cp report.html ./lighthouse-report
fi