# when you use this image at local machine

### use environment variable
- type below on terminal
```
export INPUT_TARGET_ADDRESS=https://ratehub.ca
export INPUT_EXPORT_TO=html
export INPUT_WILL_CHECK_PASS=yes
export INPUT_MIN_PERFORMANCE=0.5
export INPUT_MIN_ACCESSIBILITY=0.5
export INPUT_MIN_BEST_PRACTICES=0.5
export INPUT_MIN_SEO=0.5
export INPUT_MIN_PWA=0.5
```
- or "source set_env.sh"

### docker run with env
sudo docker container run --rm \
-e INPUT_TARGET_ADDRESS=$INPUT_TARGET_ADDRESS \
-e INPUT_EXPORT_TO=$INPUT_EXPORT_TO \
-e INPUT_WILL_CHECK_PASS=$INPUT_WILL_CHECK_PASS \
-e INPUT_MIN_PERFORMANCE=$INPUT_MIN_PERFORMANCE \
-e INPUT_MIN_ACCESSIBILITY=$INPUT_MIN_ACCESSIBILITY \
-e INPUT_MIN_BEST_PRACTICES=$INPUT_MIN_BEST_PRACTICES \
-e INPUT_MIN_SEO=$INPUT_MIN_SEO \
-e INPUT_MIN_PWA=$INPUT_MIN_PWA \
lighthouse-for-github-action

