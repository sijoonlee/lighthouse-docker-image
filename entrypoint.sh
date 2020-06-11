#!/bin/bash
echo $INPUT_TARGET_ADDRESS
cd /usr/src/app
node command.js --addr $INPUT_TARGET_ADDRESS \
                --exportTo $INPUT_EXPORT_TO \
                --willCheckPass $INPUT_WILL_CHECK_PASS \
                --minPerformance $INPUT_MIN_PERFORMANCE \
                --minAccessibility $INPUT_MIN_ACCESSIBILITY \
                --minBestPractices $INPUT_MIN_BEST_PRACTICES \
                --minSEO $INPUT_MIN_SEO \
                --minPWA $INPUT_MIN_PWA
cp report.html ./lighthouse-report && echo "report file"