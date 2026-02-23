FROM node:20-bookworm-slim

# Set working directory
WORKDIR /app

# Install dependencies for Puppeteer (Chromium browser)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    fonts-liberation \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install node modules
COPY package*.json ./
RUN npm install

# Generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy project files and build
COPY . .
RUN npm run build

# Expose port and start
EXPOSE 3001
CMD ["npm", "start"]
