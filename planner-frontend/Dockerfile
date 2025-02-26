
FROM node:20

WORKDIR /app

# Ensure clean npm cache to prevent corrupted installs
RUN npm cache clean --force

RUN npm install -g npm@latest

COPY planner-frontend/package*.json ./
# Only this container -> COPY ./package*.json ./

RUN npm install --force --legacy-peer-deps

# Ensure ajv dependencies are installed
RUN npm i ajv-keywords ajv -D

COPY planner-frontend/ .

RUN npm run build

EXPOSE 3000

# Run in development mode
# CMD ["npm", "start"]

# Run in production mode
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
