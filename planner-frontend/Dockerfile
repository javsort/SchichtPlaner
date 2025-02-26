# Use Node.js 20 for compatibility
FROM node:20

WORKDIR /app

# Ensure clean npm cache to prevent corrupted installs
RUN npm cache clean --force

# Update npm properly
RUN npm install -g npm@latest

# Copy package.json and package-lock.json before running npm install
COPY planner-frontend/package*.json ./

# Ensure a completely fresh dependency install
RUN rm -rf node_modules package-lock.json && npm install --force --legacy-peer-deps

# Ensure ajv dependencies are installed explicitly
RUN npm install ajv-keywords ajv --save-dev

# Copy all frontend source code
COPY planner-frontend/ . 

# Build the frontend
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run in development mode
# CMD ["npm", "start"]

# Run in production mode
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
