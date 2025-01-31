
FROM node:18-alpine

WORKDIR /app

COPY planner-frontend/package*.json ./

RUN npm install 

COPY planner-frontend/ . 

EXPOSE 3000

CMD ["npm", "start"]