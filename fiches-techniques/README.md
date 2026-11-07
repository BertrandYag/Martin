# Fiches techniques et fin de service

Fonctionnalité proposée par Martin pour BalaBala Connect : un livre de fiches techniques partagé avec la brigade. Chaque recette produit sa mise en place et sa liste de commandes, et une page « Toute la carte » réunit tout pour la fin de service.

## Contenu du dossier

| Fichier | Ce que c'est |
| --- | --- |
| `fiche-fonctionnelle.pdf` | La spécification : besoin, écrans, passation entre postes, établissement et bibliothèque, modèle de données, priorités, modèle économique, questions ouvertes. **À lire en premier.** |
| `prototype-fiches-techniques.html` | Le prototype interactif (HTML, CSS et JS dans un seul fichier, sans dépendance). |
| `exemples/*.json` | Les deux recettes réelles de la carte actuelle, au format de données du prototype. |
| `exemple-livre-pdf.pdf` | La version PDF imprimable du livre, pour l'équipe sans compte. |

## À savoir sur le prototype

Le prototype a été construit et tourne sur claude.ai. **Le stockage passe par Claude** : ouvert tel quel dans un navigateur, il affiche la couverture mais ne charge ni ne sauvegarde les fiches.

Pour le brancher sur la base BalaBala, il suffit de remplacer la couche de données. Tout est concentré à quelques endroits du script :

- `claude.use('db')` : à remplacer par le client de la base BalaBala.
- `db.collection('recipes').onSnapshot(...)` et `db.collection('daily').onSnapshot(...)` : abonnements en temps réel aux recettes et à l'état du jour.
- `db.doc('recipes/<id>').set(...)` / `.update(...)` / `.delete()` : écriture d'une recette.
- `db.doc('daily/<id>').set(...)` : écriture de l'état du jour (check, commandes, notes).
- `claude.use('assets')` et `assets.upload(file)` : envoi de la photo de l'assiette.

Le reste (rendu, onglets, page « Toute la carte », fusion des commandes, copie de la liste) ne dépend pas de Claude et se réutilise tel quel.

## Modèle de données

- **`recipes/<id>`** : `name`, `cat`, `portion`, `order`, `chips[]`, `preps[]` (`id`, `title`, `time`, `steps[]`), `envoi[]`, `dressage[]`, `mep[]` (`id`, `name`, `detail`, `relance`), `commandes[]` (`id`, `cat`, `name`, `note`, `cher`), `photo`.
- **`daily/<id>`** (un par recette) : `st` (état de chaque élément de mise en place : `ok`, `bas`, `faire` ou vide), `ck` (produits à commander), `demain[]` (notes : `id`, `text`, `done`).

La page « Toute la carte » ne stocke rien. Elle se calcule à partir des recettes et des états du jour, et fusionne les produits par catégorie et par nom.
