FROM node:22-bookworm
WORKDIR /app
RUN mkdir src dist
COPY src src
COPY tsconfig.json .
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
ENTRYPOINT ["node", "dist/index.js"]
