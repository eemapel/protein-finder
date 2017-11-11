from node

WORKDIR /usr/src/app

# Copy all files
COPY . .

RUN npm install --production

EXPOSE 3000
CMD [ "npm", "start" ]
