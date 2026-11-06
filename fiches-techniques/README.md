# Fiches techniques BalaBala

Dernier travail en date (novembre 2026) : un **livre de fiches techniques** utilisable en service, sur téléphone ou tablette.
Une couverture avec sommaire, puis une page par fiche qu'on tourne (swipe). Chaque fiche a trois onglets :

- **Recette** : préparations détaillées étape par étape, avec une étiquette de timing (« 6 h + froid · la veille », « se garde »…), puis la partie **Envoi** (gestes au moment du service) et le **dressage de bas en haut**
- **Mise en place** : chaque élément à cocher **OK / Bas / À faire**. Les éléments Bas ou À faire remontent dans **« Pour demain »** avec leur consigne de relance, et on peut ajouter des notes libres pour demain
- **Commandes** : la liste des produits de la recette, **triée par catégorie fournisseur**, à cocher, avec 💰 sur les produits chers

Boutons : « Modifier la fiche » (éditeur complet), « Nouveau service » (remet la journée à zéro).

## Fichiers

| Fichier | Rôle |
|---|---|
| `app/fiches-techniques.html` | L'appli telle que publiée sur claude.ai (elle utilise la base de données Claude, donc ne charge pas les fiches hors de claude.ai) |
| `app/fiches-techniques-demo-local.html` | **À ouvrir en premier** : même appli, autonome, avec la fiche réelle préchargée et une sauvegarde dans le navigateur. Pour repartir de zéro : `BALABALA_RESET()` dans la console |
| `app/local-db.js` | La couche qui remplace la base Claude par `localStorage`. C'est le contrat d'API que le backend doit reproduire |
| `data/recipes/tempura-langue.json` | Première fiche réelle : tempura de langue de bœuf, teriyaki, shiso, pickles de gingembre (Panaille) |

## Modèle de données

Deux collections, au format Firestore.

### `recipes/{id}`

```jsonc
{
  "name": "Tempura de langue de bœuf, teriyaki, shiso et pickles de gingembre",
  "cat": "Entrée",                      // catégorie de carte
  "portion": "1 palet / couvert",
  "chips": ["Lancer la langue la veille", "Friture 180 °C"],  // repères courts affichés en tête
  "order": 1,                           // optionnel, ordre dans le sommaire
  "preps": [                            // préparations de l'onglet Recette
    { "id": "p1", "title": "Langue de bœuf", "time": "6 h + froid · la veille", "steps": ["…", "…"] }
  ],
  "envoi": ["Plonger le palet dans la pâte à tempura.", "Frire à 180 °C.", "…"],
  "dressage": ["Pickles de gingembre", "½ feuille de shiso", "…"],      // de bas en haut
  "mep": [                              // onglet Mise en place
    { "id": "palets", "name": "Palets de langue taillés",
      "detail": "Bac au froid, 1 par couvert",             // repère visuel
      "relance": "Langue de bœuf : 6 h de cuisson + froid, à lancer en premier" }  // affiché dans « Pour demain » si Bas ou À faire
  ],
  "commandes": [                        // onglet Commandes
    { "id": "c7", "name": "Shiso", "cat": "Fruits et légumes", "note": "", "cher": true }  // cher : optionnel, affiche 💰
  ],
  "photo": { "id": "<asset id>" },      // optionnel
  "updatedAt": 1793991900000
}
```

Catégories de commandes (dans cet ordre) : `Boucherie`, `Poissonnerie`, `Fruits et légumes`, `Crèmerie`, `Épicerie sèche`, `Boissons`, `Autre`.

### `daily/{recipeId}`

État du service en cours pour une fiche, remis à zéro par « Nouveau service » (le document est supprimé).

```jsonc
{
  "st": { "palets": "ok", "boudin": "bas", "teriyaki": "faire" },  // statut de mise en place par id d'élément
  "ck": { "c1": true },                                            // commandes cochées
  "demain": [ { "id": "i3k2…", "text": "Rappeler le boucher", "done": false } ]  // notes libres
}
```

## API utilisée par l'appli

Seulement ces appels, à brancher sur le backend BalaBala :

```js
db.collection('recipes').onSnapshot(cb)   // temps réel : toute la brigade voit la même chose
db.collection('daily').onSnapshot(cb)
db.doc('recipes/' + id).set(recipe) / .update({...}) / .delete()
db.doc('daily/' + id).set(state) / .delete()
assets.upload(file)                       // photo de la fiche (non géré dans la démo locale)
```

Le temps réel compte : la mise en place cochée par un commis doit apparaître tout de suite chez le chef.

## Pistes d'intégration

- Ce module correspond à **Recettes + Mise en place + Commandes** de BalaBala Connect.
- La **dictée vocale** (spec n° 6) doit pouvoir remplir l'éditeur de fiche.
- Agréger les onglets Commandes de toutes les fiches du jour en **une seule liste de commandes par catégorie** pour le module Commandes.
- Prévoir une **vue lecture seule sans compte** (lien ou impression) : les cuisiniers n'ont pas forcément de compte.
