
FROM node:18

WORKDIR /app

RUN npm install -g npm@latest || true

COPY planner-frontend/package*.json ./
# Only this container -> COPY ./package*.json ./

RUN npm install --legacy-peer-deps || true

COPY planner-frontend/ . 
# Only this container -> COPY . . 

RUN npm run build

EXPOSE 3000

# Run in development mode
# CMD ["npm", "start"]

# Run in production mode
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
