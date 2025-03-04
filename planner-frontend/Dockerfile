# Use Node.js 20 for compatibility
FROM node:20 AS build

WORKDIR /app

# Clean npm cache
RUN npm cache clean --force

# Copy package.json and package-lock.json before running npm install
COPY planner-frontend/package*.json ./

# Ensure fresh dependency install
RUN rm -rf node_modules package-lock.json && npm install --force --legacy-peer-deps

# Ensure ajv dependencies are installed explicitly
RUN npm install ajv-keywords ajv --save-dev

# Copy the full frontend project
COPY planner-frontend/ . 

# Build the frontend
RUN npm run build

# Serve the frontend in a lightweight container
FROM node:20 AS production

WORKDIR /app

# Copy build artifacts from the previous step
COPY --from=build /app/build ./build

# Install production dependencies only
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Run in development mode
# CMD ["npm", "start"]

# Serve the frontend
CMD ["serve", "-s", "build", "-l", "3000"]
