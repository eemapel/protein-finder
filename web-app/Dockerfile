from node

WORKDIR /usr/src/app

# Copy all files
COPY . .

RUN npm install --production

EXPOSE 3000
EXPOSE 8000-8079

CMD [ "npm", "start" ]
