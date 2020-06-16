# when you use this image at local machine(ubuntu)

### nginx server up
```
sudo docker build -t mock-server /your/docker/file/directory  
sudo docker container run --rm -d -p 11111:80 -v /your/local/directory/to/deploy:/your/entry/directory/in/nginx/image mock-server 
```

- for example   
```
sudo docker build -t mock-server /home/sijoonlee/RateHub/front-end/packages/web-server/docker/static
sudo docker container run --rm -d -p 11111:80 -v /home/sijoonlee/RateHub/front-end/packages/web-server/out/:/usr/share/nginx/html mock-server
```

### use environment variable
- type below on terminal
```
export INPUT_TARGET_ADDRESS=http://localhost:11111
export INPUT_EXPORT_TO=html
export INPUT_LIST_OF_FILES=/usr/src/app/lighthouse-report/files.txt
export INPUT_MIN_PERFORMANCE=0.5
export INPUT_MIN_ACCESSIBILITY=0.5
export INPUT_MIN_BEST_PRACTICES=0.5
export INPUT_MIN_SEO=0.5
export INPUT_MIN_PWA=0.5
```

- **Note that you can use below option for single address test**
    ```
    export INPUT_LIST_OF_FILES=null
    ```
- **INPUT_LIST_OF_FILES**
    - INPUT_LIST_OF_FILES is to list html files under static web server
        - for example, assuming that we have  
            http://localhost/index.html  
            http://localhost/404.html
        - the content of INPUT_LIST_OF_FILES should be like
            ```
            404.html
            index.html
            ```
- **Bash command to produce the file**  
    - please refer  
    https://stackoverflow.com/questions/2437452/how-to-get-the-list-of-files-in-a-directory-in-a-shell-script
        ```
        find . -maxdepth 1 -type f -name '*.html' -not -path '*/\.*' | sed 's/^\.\///g' | sort > files.txt
        ```
### docker run with env to test localhost:11111
```
sudo docker container run --network="host" --rm \
-v $(pwd):/usr/src/app/lighthouse-report \
-e INPUT_TARGET_ADDRESS=$INPUT_TARGET_ADDRESS \
-e INPUT_LIST_OF_FILES=$INPUT_LIST_OF_FILES \
-e INPUT_EXPORT_TO=$INPUT_EXPORT_TO \
-e INPUT_MIN_PERFORMANCE=$INPUT_MIN_PERFORMANCE \
-e INPUT_MIN_ACCESSIBILITY=$INPUT_MIN_ACCESSIBILITY \
-e INPUT_MIN_BEST_PRACTICES=$INPUT_MIN_BEST_PRACTICES \
-e INPUT_MIN_SEO=$INPUT_MIN_SEO \
-e INPUT_MIN_PWA=$INPUT_MIN_PWA \
sijoonlee/lighthouse-v2:latest
```

### please refer if you are curious of the reason I am using --network="host"
https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach


# Env explained
|Env|Description|Example Value|
|------------------------|---------------------------------|----------------------|
|INPUT_TARGET_ADDRESS    |The http address to be tested    |http://localhost:11111|
|INPUT_LIST_OF_FILES     |The list of html files           |path or 'null'        |
|INPUT_EXPORT_TO=html    |The test result will be exported |html / json / both    |
|INPUT_MIN_PERFORMANCE   |Minimum performance score        |0 ~ 1                 |
|INPUT_MIN_ACCESSIBILITY |Minimum accessibility score      |0 ~ 1                 |
|INPUT_MIN_BEST_PRACTICES|Minimum best practices score     |0 ~ 1                 |
|INPUT_MIN_SEO           |Minimum SEO score                |0 ~ 1                 |
|INPUT_MIN_PWA           |Minimum progressive web app score|0 ~ 1                 |

# Github workflow example  
https://github.com/sijoonlee/github-action-playground
