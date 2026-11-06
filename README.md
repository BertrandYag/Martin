# BalaBala Connect

Application de gestion de cuisine professionnelle **pilotée à la voix**, pensée par un chef pour les brigades.
Point de départ : l'étiquetage HACCP, une vraie corvée en cuisine pro. L'appli s'étend ensuite à toute l'organisation de la brigade.

> Ce dépôt rassemble le travail produit côté produit/cuisine (Martin) pour que Bertrand l'intègre dans l'appli.

## Contenu du dépôt

| Dossier | Quoi | Statut |
|---|---|---|
| [`fiches-techniques/`](fiches-techniques/) | **Dernier travail (nov. 2026)** : le livre de fiches techniques interactif (Recette / Mise en place / Commandes), son modèle de données et une première fiche réelle | Fonctionnel, à intégrer |
| [`prototype/`](prototype/) | Maquettes HTML cliquables de BalaBala Connect (v7, puis v8 = la plus récente) | Maquette, pas de backend |

Tout s'ouvre directement dans un navigateur (double-clic sur le `.html`), sans build.

## Les 7 modules de BalaBala Connect

Écrans présents dans le prototype v8 (`screen-*`) :

1. **Planning** : planning de la brigade, dicté à la voix
2. **Recettes** : bibliothèque de fiches techniques
3. **Mise en place** : ce qui est prêt, bas ou à faire pour le service
4. **Commandes** : listes de commandes générées depuis les recettes
5. **Contacts** : fournisseurs et équipe
6. **Étiquetage** : étiquettes HACCP (le cœur historique du produit)
7. **Factures** : saisie des factures et food cost

Le prototype contient aussi un écran **Tâches** (listes partagées).

## Fonctionnalités spécifiées

1. **Planning vocal** : créer et modifier le planning en parlant
2. **Listes de tâches partagées** pour la brigade
3. **Bibliothèque de recettes techniques** (voir `fiches-techniques/`)
4. **Fiches de dressage** (ordre de montage de l'assiette, de bas en haut)
5. **Interface photo + ingrédients**
6. **Génération de recette à la voix en temps réel** : le chef dicte, la fiche se remplit
7. **Capture de factures** par OCR (IA), avec calcul automatique du food cost

## Règles métier à respecter

Ces règles viennent de l'usage réel en cuisine. Elles sont déjà appliquées dans les fiches techniques :

- **Listes de commandes triées par catégorie fournisseur** : Boucherie, Poissonnerie, Fruits et légumes, Crèmerie, Épicerie sèche, Boissons, Autre. But : en fin de journée, le cuisinier voit d'un coup d'œil ce qu'il reste à faire et à commander, pour réduire sa charge mentale.
- **💰 à côté des produits chers**, pour commander au plus juste.
- **Méthodes de recette entièrement détaillées**, étape par étape, jamais résumées.
- **Fournisseurs épicerie sèche** habituels : EpiSaveurs, Transgourmet.
- **Les équipes n'ont pas de compte** : tout document envoyé à un cuisinier doit être lisible sans connexion (version imprimable ou lien public en lecture seule).
- **Mise en place à 3 états** : OK / Bas / À faire. Tout ce qui est « Bas » ou « À faire » remonte automatiquement dans « Pour demain », avec la consigne de relance de la fiche.

## Charte graphique

| Élément | Valeur |
|---|---|
| Vert principal | `#254329` (secondaire `#3c6248`, pâle `#e7ecdd`) |
| Rouille | `#834023` (secondaire `#a8552f`, pâle `#f0dfd2`) |
| Crème / fond | `#f6f1e5` |
| Accent (fiches techniques) | `#E9A47F` |
| Polices prototype | League Gothic (titres), Work Sans (texte) |
| Polices fiches techniques | Archivo (titres), Figtree (texte), JetBrains Mono (étiquettes) |
| Logo | Micro + toque (SVG inline dans `fiches-techniques/app/fiches-techniques.html`, constante `LOGO`) |

L'ancien slogan « Parlez, c'est étiqueté » a été retiré de la plupart des supports.

## Modèle commercial (impacte la facturation dans l'appli)

- Abonnement SaaS : **9,99 €/mois pour les 50 premiers clients**, puis **14,99 €/mois**
- **Engagement minimum de 2 ans**
- Autres revenus prévus : vente ou location d'imprimantes, rouleaux d'étiquettes, abonnement BalaBala Conseil, missions de conseil
- Lancement : octobre 2026, objectif 100+ cuisines clientes

## Autres livrables existants (hors dépôt pour l'instant)

Ils ont été produits mais ne sont pas encore ici. Martin peut les ajouter sur demande :
modèle financier sur 24 mois (Excel), pitch commercial (PDF), landing page, guide d'installation, calendrier des produits de saison (417 produits, 6 familles, en JSON, réutilisable dans l'appli), modèle vidéo Remotion.
