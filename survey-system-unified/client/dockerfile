# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV REACT_APP_API_HOST=https://backend-surveysys-96818552136.us-central1.run.app
ENV REACT_APP_SELF_URL=https://frontend-surveysys-96818552136.us-central1.run.app
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]