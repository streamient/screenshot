# syntax=docker/dockerfile:1

# DEBIAN TRIXIE with Node.js LTS — Screenshot service with Puppeteer + Chromium
FROM node:lts-trixie-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

# Install Chromium dependencies required by Puppeteer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgbm1 \
    libnss3 \
    libxkbcommon0 \
    libxshmfence1 \
    tini \
    ca-certificates && \
    npm i -g pnpm@10 && \
    rm -rf /var/lib/apt/lists/*

COPY --link package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY --link app.js capture.js ./

ENTRYPOINT ["tini", "--"]
CMD ["node", "app.js"]
