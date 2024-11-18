# Home Library Service

### Downloading

Clone the project

```
git clone https://github.com/gryzun33/nodejs2024Q3-service.git

```

Switch to branch `part2`

```
git checkout part2
```

### Installing NPM modules

```
npm install
```

### Build images

```
docker-compose build --no-cache
```

### Run application in containers

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
npm run test
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
