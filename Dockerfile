FROM node:18

WORKDIR /app

COPY package*.json .

COPY . .

ENV DOCKERIZE_VERSION v0.7.0

RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-arm64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate

EXPOSE 3000
EXPOSE 5555
CMD dockerize -wait tcp://db:3306 -timeout 20s && npx prisma migrate deploy && npm run dev