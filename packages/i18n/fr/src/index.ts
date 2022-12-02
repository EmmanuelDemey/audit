import {AuditResult} from "@audit/model";

export type Dictionary = {
    rules: {
        [key: string]: (result?: any) => string
    }
}
export const fr: Dictionary = {
    rules: {
        "check-if-ci": () => "Afin d'assurer une qualité optimale pour votre projet, nous vous recommendons de mettre en place une solution d'intégration continue",
        "check-if-button-inside-a-link": () => "Sémantiquement, il est interdit d'avoir un lien dans un bouton",
        "check-if-button-inside-link": () => "Sémantiquement, il est interdit d'avoir un bouton dans un lien",
        "check-if-button-without-type": () => "Pour éviter des éventuels problèmes pour vos utilisateurs, nous vous conseillons de toujours définir l'attribut type pour un bouton",
        "check-if-cypress-axe-dependency": () => "Il semblerait que vous utilisez Cypress pour vos tests d'interface. Vous pourriez installer également Cypress Axe afin de vérifier le niveau d'accessibilité de vos page.",
        "check-if-html-tag-has-lang-attribute": () => "La balise HTML doit absolument définir l'attribut lang afin de configurer la langue par défaut de votre contenu",
        "check-if-image-without-alt": () => "Pour des raisons d'accessibilité, vous ne pouvez avoir d'images sant attributs alt'",
        "check-if-landmarks": (_: unknown) => {
            return "Vous devez avoir une valise <header>, <nav>, <main> et <footer> dans votre page";
        },
        "check-if-lighthouse-c-i": () => "Afin de s'assurer que votre projet reste de qualité (performance et accessibilité), nous vous conseillons de mettre en place Lighthouse CI dans votre CI",
        "check-if-link-inside-a-button": () => "Sémantiquement, il est interdit d'avoir un lien dans un bouton",
        "check-if-link-inside-label": () => "Pour des raisons d'accessibilité, vous ne pouvez avoir de liens dans un label de formulaire",
        "check-if-main-lang": () => "Vous devez avoir l'attribut lang présent sur la balise html",
        "check-moment-dependency": () => "Il semblerait que vous utilisez la librairie Moment.js. Celle-ci n'est plus maintenue. Nous vous recommendons d'utiliser des librairies plus légères comme Day.js ou Date-fns",
        "check-eslint-dependency": () => "Nous vous conseillons d'installer et utiliser ESLint afin d'assurer à minima la qualité du code de votre application",
        "check-husky-dependency": () => "Husky est un module NPM permettant d'exécuter des scripts avant un commit GIT. Le meilleur moyen de s'assurer qu'aucune régression n'a été insérée dans votre application.",
        "check-if-multiple-nav-without-label": () => "Vous devez définir des libelles explicites pour vos balises nav",
        "check-if-readme": () => "Dans le but de rendre votre project facilement utilisable, veuillez créer un fichier README.md.",
        "check-if-table-caption": () => "Vous devez avoir une balise caption inside a table",
        "check-if-title": () => "Vous devez avoir un titre principal pour votre page",
        "check-if-less-three-domains": (_: AuditResult) => "Vous devez utiliser moins de trois domaines",
        "check-if-count-instead-of-exist": () => `
            Si une requete SQL utilisant COUNT() peut etre remplacer par un EXIST, il est préférable, pour des raisons de performance, de choisir la deuxième solution. 
        `,
        "check-if-no-duplicate-page-title": () => "Vous devez vous assurer que chaque page a un titre unique",
        "check-if-typescript-const-enum": () => "Pour des raisons de performance, il est préférable d'utiliser des const enums en TypeScript",
        "check-if-img-role-for-svg-image": () => "Pour des raisons de compatibilité des synthétiseur vocaux (VoiceOver sur Safari), il est recommandé de mettre le role=img sur les images au format SVG.",
        "check-if-multiple-font": () => "Afin de limiter le nombre de requetes HTTP, nous sommes limité à une seule police de caractères",
        "check-if-facil-it-domains": () => "Si vous souhaitez avoir une application accessible, vous ne devez pas dire que c'est le cas juste parce que vous utilisé FacilIT."
    }
}
