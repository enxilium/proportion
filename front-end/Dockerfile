FROM node:20-alpine

WORKDIR /home/node/app
RUN mkdir -p /home/node/app && chown node:node /home/node/app
USER node

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY .next ./.next
COPY public ./public

# store secrets in secrets manager on aws
ENV AUTH0_DOMAIN='dev-6gyvmkq6u7zm466e.us.auth0.com'
ENV AUTH0_CLIENT_ID='6Lv7WYOfijtF4Y8Rx3ctQCRsoqxdt89c'

EXPOSE 3000

CMD ["npm", "start"]