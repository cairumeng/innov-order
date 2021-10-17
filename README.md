
## Description
Les fonctionnalités de cette app sont suivantes :
- [x] permettre l'inscription d'un utilisateur via login / password
- [x] permettre l'authentification d'un utilisateur via login / password
- [x] sur une route authentifiée, permettre la recherche d'un produit par son code barre sur l'API de OpenFoodFacts
- [x] Permettre la mise à jour de l'utilisateur
- [x] Système de caching des appels à OpenFoodFacts
- [x] Dockerisation
- [ ] Manifest Kubernetes pour déploiement


## Installation && Running the app

```bash
$ docker-compose up --build
```

## Test

```bash
# unit tests
$ docker exec -it innov_nestjs sh

# e2e tests
$ npm run test:e2e

```

## License

Nest is [MIT licensed](LICENSE).
