# Home Library Service

### Downloading

Clone the project

```
git clone https://github.com/gryzun33/nodejs2024Q3-service.git

```

Go to folder with project

```
cd nodejs2024Q3-service
```

Switch to branch `part3`

```
git checkout part3
```

### Installing NPM modules

```
npm install
```

### Rename file `env.example`  to `.env`


### Run project

```
docker-compose up
```

### To scan images for vulnerabilities

```
npm run scan:app

npm run scan:db
```

### Testing

After application running open new terminal and enter:

```
npm run test:auth

npm run test:refresh
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### How to use

After starting the app you can open in your browser OpenAPI documentation by typing http://localhost:4000/doc/ and try making requests

### Links to images

https://hub.docker.com/repository/docker/volha564/library-app/general

https://hub.docker.com/repository/docker/volha564/library-db/general
