## Pre-requisites
1. NodeJS 14.x
2. Github Auth Token
3. Your project list
4. MyAnimelist, sync the website with your anime feeds

### Docker
        docker pull ghcr.io/sinkaroid/sinkaroid:latest
        docker run -it -p 8080:80 --rm ghcr.io/sinkaroid/sinkaroid

### Manual
**1. Use or fork this template**  
**2. Adjust with your own**  

        $ npm install
        $ mv auth.js config.js
        $ mv .env.schema .env  
then fill the `.env` values        

**3. Generate the whole info about you, This cases You need to fill:**
- [getAnime.js](/mock/getAnime.js)
  - should generate `_anime` object
- [getManga.js](/mock/getManga.js)
  - should generate `_manga` object
- [getRepository.js](/mock/getRepository.js) 
  - should generate `_data` object

..You ready to go

**4. Generate your repository and myanimelist data**

        $ node mock/getRepository.js ghp_xxx_your_GH_TOKEN
        $ npm run fetch:mal

**5. The final**

- For development

        $ npm run serve

- For production

        $ npm run build

## Deployment
[Vuejs deployment guide](https://cli.vuejs.org/guide/deployment.html)

- [Github pages](https://cli.vuejs.org/guide/deployment.html#github-pages)
- [Netlify](https://cli.vuejs.org/guide/deployment.html#netlify)
- [Vercel](https://cli.vuejs.org/guide/deployment.html#vercel)
- [Firebase](https://cli.vuejs.org/guide/deployment.html#firebase)