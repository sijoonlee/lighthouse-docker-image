# when you use this image at local machine(ubuntu)

### nginx server up
sudo docker build -t mock-server /your/docker/file/directory  
sudo docker container run --rm -d -p 11111:80 -v /your/local/directory/to/deploy:/your/entry/directory/in/nginx/image mock-server 

- for example
sudo docker build -t mock-server /home/sijoonlee/RateHub/front-end/packages/web-server/docker/static
sudo docker container run --rm -d -p 11111:80 -v /home/sijoonlee/RateHub/front-end/packages/web-server/out/:/usr/share/nginx/html mock-server

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
- use command "source set_env.sh"

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

### please refer if you are curious of the reason I am using --network="host"
https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach


# Env explained
|Env|Description|Example Value|
|------------------------|---------------------------------|----------------------|
|INPUT_TARGET_ADDRESS    |The http address to be tested    |http://localhost:11111|
|INPUT_EXPORT_TO=html    |The test result will be exported |html / json / both    |
|INPUT_MIN_PERFORMANCE   |Minimum performance score        |0 ~ 1                 |
|INPUT_MIN_ACCESSIBILITY |Minimum accessibility score      |0 ~ 1                 |
|INPUT_MIN_BEST_PRACTICES|Minimum best practices score     |0 ~ 1                 |
|INPUT_MIN_SEO           |Minimum SEO score                |0 ~ 1                 |
|INPUT_MIN_PWA           |Minimum progressive web app score|0 ~ 1                 |
|INPUT_WILL_EXIT_ON_FAIL |If web fails one of them,        |yes / no              |
|                        |Github action will exit 1        |                      |
