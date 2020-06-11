# when you use this image at local machine(linux)

### use environment variable
- type below on terminal
```
export INPUT_TARGET_ADDRESS=http://localhost:11111
export INPUT_EXPORT_TO=html
export INPUT_MIN_PERFORMANCE=0.5
export INPUT_MIN_ACCESSIBILITY=0.5
export INPUT_MIN_BEST_PRACTICES=0.5
export INPUT_MIN_SEO=0.5
export INPUT_MIN_PWA=0.5
export INPUT_WILL_EXIT_ON_FAIL=yes
```
- or "source set_env.sh"

### docker run with env to test localhost:11111
sudo docker container run --network="host" --rm \
-v $(pwd):/usr/src/app/lighthouse-report \
-e INPUT_TARGET_ADDRESS=$INPUT_TARGET_ADDRESS \
-e INPUT_EXPORT_TO=$INPUT_EXPORT_TO \
-e INPUT_MIN_PERFORMANCE=$INPUT_MIN_PERFORMANCE \
-e INPUT_MIN_ACCESSIBILITY=$INPUT_MIN_ACCESSIBILITY \
-e INPUT_MIN_BEST_PRACTICES=$INPUT_MIN_BEST_PRACTICES \
-e INPUT_MIN_SEO=$INPUT_MIN_SEO \
-e INPUT_MIN_PWA=$INPUT_MIN_PWA \
-e INPUT_WILL_EXIT_ON_FAIL=$INPUT_WILL_EXIT_ON_FAIL \
sijoonlee/lighthouse-v2:latest

### please refer
https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach
