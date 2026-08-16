# Multi-stage image for the self-hosted deploy stack.
# - "builder" clones the site repo at runtime, builds it, and serves rebuild
#   requests from the webhook service (content lives in git, not the image).
# - "webhook" verifies GitHub's push signature and triggers the builder.
# nginx (the "web" service) uses the stock nginx:alpine image directly in
# docker-compose.yml — no custom build needed for it.

FROM node:22-alpine AS base
RUN apk add --no-cache git
WORKDIR /app

FROM base AS builder
COPY deploy/builder/entrypoint.sh /entrypoint.sh
COPY deploy/builder/rebuild.sh /rebuild.sh
COPY deploy/builder/build-agent.mjs /build-agent.mjs
RUN chmod +x /entrypoint.sh /rebuild.sh
EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]

FROM node:22-alpine AS webhook
WORKDIR /app
COPY deploy/webhook/server.mjs /server.mjs
EXPOSE 9000
CMD ["node", "/server.mjs"]
