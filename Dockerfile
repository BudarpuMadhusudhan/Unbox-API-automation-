FROM node:18.12.1
RUN mkdir testunbox
COPY . /testunbox
RUN cd /testunbox/
RUN chmod 655 /testunbox/node_modules/.bin/*
WORKDIR /testunbox
RUN rm -rf node_modules \
    && npm install