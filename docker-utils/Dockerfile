FROM ubuntu:14.04

RUN \
  apt-get update && \
  apt-get upgrade -y --force-yes && \
  apt-get install -y --force-yes vim git wget bzip2 curl supervisor && \
  apt-get autoremove -y --force-yes && \
  apt-get clean all


RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y --force-yes nodejs


RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y --force-yes fonts-liberation gconf-service libappindicator1 libgtk2.0-0 libxtst6 libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgconf-2-4 libnspr4 libnss3 libx11-xcb1 libxss1 xdg-utils xvfb
RUN dpkg -i google-chrome-stable_current_amd64.deb

EXPOSE 9222
COPY ./supervisord/*.conf /etc/supervisor/conf.d/
COPY ./startGc.sh /usr/src/app/startGc.sh
WORKDIR /usr/src/app
COPY ./nodejs/package*.json ./
RUN npm install
COPY ./nodejs/src/ ./
#CMD node index.js
CMD ["sh", "-c", "./startGc.sh"]

