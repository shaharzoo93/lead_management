FROM node:16.14.2-alpine3.15

WORKDIR /service


COPY . .

RUN rm -rf node_modules
RUN npm install -g typescript
RUN npm install
RUN npm run build
# RUN npm test
# remove markdown files from working directory
RUN find . -name "*.md" -type f -delete

CMD npm run start