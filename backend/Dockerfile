FROM node:16-alpine
WORKDIR /app
COPY db.json /app/
RUN npm install -g json-server
EXPOSE 3001
CMD [ "json-server", "--watch", "db.json",  "--port", "3001", "--host", "0.0.0.0"]