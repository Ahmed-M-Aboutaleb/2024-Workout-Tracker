# Base stage: install dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies for production and development
RUN npm install

# Development stage
FROM base AS development
ENV NODE_ENV=development

# Copy the rest of the code
COPY . .

# Install dev dependencies
RUN npm install --only=development

# Command to run the app in development mode with live reload
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy the source code and build the app
COPY . .
RUN npm run build

# Remove unnecessary dev dependencies
RUN npm prune --production

# Command to run the app in production mode
CMD ["npm", "run", "start:prod"]
