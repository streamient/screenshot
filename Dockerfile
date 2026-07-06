# syntax=docker/dockerfile:1

# DEBIAN TRIXIE with Node.js LTS — Screenshot service with Puppeteer + Chromium
FROM node:lts-trixie-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

# Chromium is pinned to 149: trixie's chromium 150.0.7871.46 crashes on startup
# with SIGTRAP (Debian bug #1141488). Drop the pin + snapshot source once a
# fixed chromium lands in trixie-security.
ARG CHROMIUM_VERSION=149.0.7827.196-1~deb13u1
ARG SNAPSHOT=20260625T165532Z

# Install Chromium dependencies required by Puppeteer
# (ca-certificates first — the snapshot source is https)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    echo "deb [check-valid-until=no] https://snapshot.debian.org/archive/debian-security/${SNAPSHOT}/ trixie-security main" \
    > /etc/apt/sources.list.d/chromium-snapshot.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    chromium=${CHROMIUM_VERSION} \
    chromium-common=${CHROMIUM_VERSION} \
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
