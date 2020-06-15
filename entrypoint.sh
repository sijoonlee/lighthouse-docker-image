#!/bin/bash
cd /usr/src/app
node command.js --addr $INPUT_TARGET_ADDRESS \
                --listOfFiles $INPUT_LIST_OF_FILES \
                --exportTo $INPUT_EXPORT_TO \
                --minPerformance $INPUT_MIN_PERFORMANCE \
                --minAccessibility $INPUT_MIN_ACCESSIBILITY \
                --minBestPractices $INPUT_MIN_BEST_PRACTICES \
                --minSEO $INPUT_MIN_SEO \
                --minPWA $INPUT_MIN_PWA