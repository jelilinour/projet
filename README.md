```
git clone https://github.com/arnaudmolo/data-cours
cd data-cours
npm install
npm start
```

Lancer un scrapping Facebook ? Rien de plus facile.
installer les nouvelles librairies nécessaires au scrapping
``npm install``

Placer votre dossier (fb-data) extrait de l'archive envoyer par facebook dans le dossier public

lancer le serveur de développement : ``npm start``
Dans une autre fenètre d'invité de commande lancer la commande ``node scrapper``

Article de Mike Bostock sur la génération de viz en ligne de commande : https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c


Pour changer de branche :
```
git checkout nom-de-la-branche
```

Pour pousser votre branche la première foi :
```
git push origin -u nom-de-la-branche
```

Pour commiter vos changements :
```
git commit -am "Description de votre commit"
```

Les pousser sur votre branche :
```
git push
```
Evitez de commit des fichiers trop gros (>30mega) type shapefile ou fichier GeoJSON. Un GeoJSON trop gros peut etre minimisé en suivant le tuto de Mike Bostock linké plus haut dans ce fichier.
