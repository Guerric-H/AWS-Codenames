# **Rapport 17/03/2022 Groupe 6**
# **Sommaire**

1.Introduction
2.Concept du projet
3.Rôles
4.Planning
5.Travail effectué
6.Rythme de travail

---

## Introduction

Le web moderne est rapidement devenu une plateforme viable non seulement pour créer des jeux. La gamme de jeux qui peuvent être créés est comparable à celle des jeux de bureau et des jeux sur système d'exploitation natif. Avec les technologies Web modernes et un navigateur récent, il est posible créer des jeux pour le Web. Et nous ne parlons pas de simples jeux de cartes ou de jeux sociaux multi-joueurs qui, autrefois, étaient réalisés à l'aide de Flash. Nous parlons de jeux de tir en 3D, de jeux de rôle et bien plus encore. Grâce aux améliorations massives des performances de la technologie de compilation juste-à-temps JavaScript et aux nouvelles API, on  peut créer des jeux qui s'exécutent dans le navigateur (ou sur des appareils fonctionnant en HTML5 comme ceux basés sur Firefox OS) sans faire de compromis. 
Dans ce contexte, nous souhaitons implémenter un jeu de plateau intéractif entre plusieurs joueurs en ligne.

---
## Concept du projet 

    Le projet se base sur le jeu de plateau Codenames. 
    Celui-ci se compose de deux équipes adverses qui elles-mêmes se divisent en :
        - un espion
        - un/des agents

    Objectif du jeu :
    L'objectif est pour chaque équipe de deviner l'ensemble des mots qui leur sont assignés le plus rapidement possible.
    Une partie est représentée par un plateau de 5*5 cartes ayant chacune un mot assigné. Chaque carte possède aussi une valeur associée :
        - neutre 
        - equipe1
        - equipe2
        -éliminatoire

    Seuls les espions ont connaissance de la valeur des cartes, et doivent faire deviner les cartes de leur équipe tout en évitant celles des adversaires et la carte éliminatoire.
    Chaque tour, un espion va choisir un mot et un nombre ; le mot est lié aux cartes que l'espion souhaite faire deviner aux agents, et le nombre correspond à la quantité de cartes qu'il essaye de faire deviner à la fois.
    
    Les agents de toutes les équipes prennent connaissance de ce que l'espion a choisi, et l'équipe de l'espion essaye de deviner les cartes associées sur le plateau. Les tentatives de faire deviner les cartes des équipes respectives continuent jusqu'à ce qu'une équipe aie deviné l'ensemble de leurs cartes, qui est la condition de victoire.
    
    Cas particuliers lors d'un tour :
    - Si les agents d'une équipe sélectionnent la carte éliminatoire, la partie se termine par la défaite de 
    l'équipe, et par conséquent la victoire des adversaires. 
    - Si des agents sélectionnent une carte de l'équipe adverse, elle revient aux adversaires et les fait progresser. 
    - Dès lors qu'un choix est mauvais (neutre, adverse, ou éliminatoire) le tour s'arrête et l'équipe adverse prend la main. 
    
---
#
#
| Rôles       | Etudiant            |
| ----------- | ------------------- |
| Responsable | HERVE Guerric       |
| Chercheur   | GARMA Talel         |
| Codeuse     | Varenne-Paquet Julie|
| Codeur      | CHAKAROUN Kassem    |
#
---

## Planning : 

### Première réunion lundi 14/03 :
    Par vocal sur discord nous avons rappelé l'objectif du projet, et nous avons réfléchi à la segmentation de ce dernier sur les points suivants :
        -Stockage des données de l'application 
        -Interaction clients (joueurs) serveur (lobby)
        -Génération des données de départ côté serveur
        -Apparence du projet (frontend) 
        -Ajout de clients dans une partie (invitation)

---

## Travail effectué : 
 
    - Guerric : 
    1. Présentation powerpoint du projet pour le TD de jeudi 17/03
    2. Organisation de réunion lundi 14/03 
    3. Réflexion sur l'apparence du projet (frontend)
    4. Rédaction du rapport avec Talel

    - Talel : 
    1. Rédaction du rapport
    2. Recherche de framework à utiliser pour le projet
    3. Réflexion sur l'intéraction client serveur

    - Julie :
    1. Plan technique des pages web (éléments nécessaires, boutons, tables)
    2. Apprentissage des concepts HTML et schéma récaptiulatif de la page

    - Kassem : 
    1. Apprentissage des concepts HTML et schéma récaptiulatif de la page
    2. Apprentissage du JavaScript pour la partie backend
#
---

## Rythme de travail : 

    Pour la première semaine, le rythme de travail était au ralenti, notament dû aux emplois du temps conflictuels pour organiser la première réunion. Nous allons fixer au moins 2 créneaux par semaine, qui nous permettrons de mettre en commun nos recherches et d'avoir des retours sur ces dernières. Cela nous permettra d'être plus productif pour le reste du projet, et travailler en groupe. 
    De plus, il semble judicieux de regrouper les codeurs pendant les semaines de travail ; et le chercheur avec le responsable afin d'utiliser les réunions pour être au complet.