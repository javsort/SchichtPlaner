
FROM node:18

WORKDIR /app

RUN npm install -g npm@10.8.2

COPY planner-frontend/package*.json ./

RUN npm install

COPY planner-frontend/ . 

EXPOSE 3000

# Run in development mode
CMD ["npm", "start"]

# Run in production mode
# CMD ["npx", "serve", "-s", "build", "-l", "3000"]
