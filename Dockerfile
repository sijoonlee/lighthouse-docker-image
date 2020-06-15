# Inspired by:
# https://github.com/foo-software/lighthouse-check/blob/master/Dockerfile
FROM node:14.4.0-slim
WORKDIR /usr/src/app
# Install deps + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  --no-install-recommends \
  && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update && apt-get install -y \
  google-chrome-stable \
  fontconfig \
  fonts-ipafont-gothic \
  fonts-wqy-zenhei \
  fonts-thai-tlwg \
  fonts-kacst \
  fonts-symbola \
  fonts-noto \
  fonts-freefont-ttf \
  --no-install-recommends \
  && apt-get purge --auto-remove -y curl gnupg \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir lighthouse-report
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
