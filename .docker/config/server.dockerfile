ARG NODE_VERSION=18.17.1

FROM node:$NODE_VERSION AS build
WORKDIR /home/app

COPY . .

RUN npm set progress=false && npm config set depth 0 && npm ci

RUN  npm run build

RUN npm prune --production

FROM node:${NODE_VERSION}-slim

USER node
WORKDIR /home/node

COPY --from=build /home/app/node_modules ./node_modules
COPY --from=build /home/app/tsconfig.paths.js /home/app/tsconfig.json /home/app/tsconfig.prod.json /home/app/package.json ./
COPY --from=build /home/app/dist ./dist/

ENV NODE_ENV production
ENV APP_PORT=3000

CMD ["npm", "start"]
