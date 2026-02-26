# syntax=docker/dockerfile:1.7-labs
FROM node:20.18.1-slim as builder

RUN apt-get update && apt-get install -y build-essential python3

WORKDIR /usr/src/app

# Install yarn and lerna
RUN npm install -g yarn@1.22.22 lerna@7.4.2 --force

# Copy package files
COPY package.json yarn.lock preinstall.js lerna.json ./
# Copy workspaces package files to leverage cache
COPY --parents ./addOns/package.json ./addOns/*/*/package.json ./extensions/*/package.json ./modes/*/package.json ./platform/*/package.json ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the files
COPY --link --exclude=yarn.lock --exclude=package.json --exclude=Dockerfile . .

# Build settings
ENV QUICK_BUILD true
ENV NODE_OPTIONS="--max_old_space_size=4096"
ARG APP_CONFIG=config/default.js
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}

# Patch mini-css-extract-plugin: skip gracefully in child compilations (InjectManifest/workbox)
# The InjectManifest plugin creates a child webpack compilation for sw.js that doesn't register
# MiniCssExtractPlugin, causing it to throw. We patch it to return early in child compilations.
RUN node -e "\
    const fs = require('fs');\
    const f = '/usr/src/app/node_modules/mini-css-extract-plugin/dist/loader.js';\
    let c = fs.readFileSync(f, 'utf8');\
    c = c.replace(\
    \"throw new Error(\\\`You forgot to add 'mini-css-extract-plugin' plugin\",\
    \"if(this._compilation&&this._compilation.compiler&&this._compilation.compiler.isChild()){return;}throw new Error(\\\`You forgot to add 'mini-css-extract-plugin' plugin\"\
    );\
    fs.writeFileSync(f, c);\
    console.log('mini-css-extract-plugin patched for child compilation support');\
    "

# Run build
RUN yarn run build

# Precompress files
RUN chmod u+x .docker/compressDist.sh
RUN ./.docker/compressDist.sh

# Final stage
FROM nginxinc/nginx-unprivileged:1.27-alpine as final
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}
ARG PORT=80
ENV PORT=${PORT}

USER root
RUN rm /etc/nginx/conf.d/default.conf
USER nginx
COPY --chown=nginx:nginx .docker/Viewer-v3.x /usr/src
RUN chmod 777 /usr/src/entrypoint.sh

COPY --from=builder /usr/src/app/platform/app/dist /usr/share/nginx/html${PUBLIC_URL}
COPY --from=builder /usr/src/app/platform/app/dist/dicom-microscopy-viewer /usr/share/nginx/html/dicom-microscopy-viewer

USER root
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 777 /usr/share/nginx/html
USER nginx

ENTRYPOINT ["/usr/src/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
