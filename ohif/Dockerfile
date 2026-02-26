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

# Patch mini-css-extract-plugin: skip gracefully when InjectManifest is compiling the CSS
RUN find /usr/src/app -path "*/mini-css-extract-plugin/dist/loader.js" -exec sed -i 's/if (!optionsFromPlugin) {/if (!optionsFromPlugin) { if(this._compilation\&\&this._compilation.name==="InjectManifest"){return callback(null, "");}/g' {} +
RUN unpatched=$(find /usr/src/app -path "*/mini-css-extract-plugin/dist/loader.js" -exec grep -L "InjectManifest" {} +) && \
    if [ -n "$unpatched" ]; then echo "Failed to patch: $unpatched"; exit 1; else echo "All loaders patched OK"; fi

# Run build with verbose to diagnose any remaining failures
RUN yarn run build --verbose

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
