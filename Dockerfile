FROM node:20

RUN mkdir /app
COPY . /app
WORKDIR /app/workload-chart

RUN npm install
RUN npm run build


EXPOSE 3000
CMD ["npm", "start"]
