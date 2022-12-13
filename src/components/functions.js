
let categorySetX = [
    {
        name: "Všetky",
        category: "all"
    }, {
        name: "Operácie na cestách",
        category: "pathOP"
    }, {
        name: "Operácie na stromoch",
        category: "treeOP"
    }, {
        name: "Size operácie",
        category: "sizeOP"
    }
]

let functionSetX = [
    {
        name: "",
        category: "aa",
        description: "",
        nodes: 0,
        nodesInPath: 0,
        paths: 0,
        values: 0,
        code: "zatial nepouzivat",
    },
    /*{
        name: "test",
        description: {
            args: "Uzol x",
            description: "Returns the path containing x"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 0,
        values: 0,
        code: -1,
    },*/

    //category - pathOP.
    {
        name: "path",
        description: {
            args: "Uzol x",
            description: "Vráti cestu, do ktorej patrí uzol x"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 101,
    },
    {
        name: "head",
        description: {
            args: "Cesta p",
            description: "Vráti prvý uzol cesty p, označovaný ako head"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 102,
    },
    {
        name: "tail",
        description: {
            args: "Cesta p",
            description: "Vráti posledný uzol cesty p, označovaný ako tail"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 103,
    },
    {
        name: "before",
        description: {
            args: "Uzol x",
            description: "Vráti uzol y, ktorý je potomkom x na rovnakej ceste. Ak je x head cesty, vráti null"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 104,
    },
    {
        name: "after",
        description: {
            args: "Uzol x",
            description: "Vráti uzol y, ktorý je rodičom x na rovnakej ceste. Y je potomkom x. Ak je y tail cesty, vráti null"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 105,
    },
    {
        name: "pcost",
        description: {
            args: "Uzol x",
            description: "Vráti cenu hrany (x, after(x)). Predpokladá že x nieje tail cesty"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 106,
    },
    {
        name: "pmincost",
        description: {
            args: "Cesta p",
            description: "Vráti najmenšiu cenu hrany na ceste p. Cenu hrany zistí zavolaním pcost"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 107,
    },
    {
        name: "pupdate",
        description: {
            args: "Cesta p, Int a",
            description: "Zväčší cenu všetký hrán na ceste p o a"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 1,
        code: 108,
    },
    {
        name: "reverse",
        description: {
            args: "Cesta p",
            description: "Na ceste p otočí všetky hodnoty (rodič-potomok) / (head/tail)... "
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 109,
    },
    {
        name: "concatenate",
        description: {
            args: "Cesta p, Cesta q, Int a",
            description: "Spojí cesty p, q. Vytvorí hranu medzi uzlami: (tail(p), head(q)) s hodnotou a. Vráti skombinovanú cestu"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 2,
        values: 1,
        code: 110,
    },
    {
        name: "split",
        description: {
            args: "Uzol x",
            description: "Rozdelí cestu v ktorej sa x nachádza. Jedna cesta obsahu uzly od head(path(x)) po before(x), druhá obsahuje od after(x) po tail(path(x))"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 111,
    },
    {
        name: "splice",
        description: {
            args: "Cesta p",
            description: "Hrana vychádzajúca z tail(p) "
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 112,
    },
    {
        name: "expose",
        description: {
            args: "Uzol x",
            description: "Vytvorí novú cestu, od x po koreň stromu "
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 113,
    },
    //treeoperations
    {
        name: "parent",
        description: {
            args: "Uzol x",
            description: "Vráti rodiča uzlu x, ak je x koreň stromu, vráti null"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 201,
    },
    {
        name: "root",
        description: {
            args: "Uzol x",
            description: "Vráti koreň stromu"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 202,
    },
    {
        name: "cost",
        description: {
            args: "Uzol x",
            description: "Vráti cenu hrany medzi x a jeho rodičom"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 203,
    },
    {
        name: "mincost",
        description: {
            args: "Uzol x",
            description: "Vráti cenu najmenšej hrany medzi x a koreňom stromu"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 204,
    },
    {
        name: "update",
        description: {
            args: "Uzol x, Int y",
            description: "Zväčší cenu všetkých hrán od x po koreň stromu o y"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 1,
        code: 205,
    },
    {
        name: "link",
        description: {
            args: "Uzol x, Uzol y, Int z",
            description: "Spojí dva uzly x, y. Predpokladá že y je koreňom stromu. Vytvorí hranu s cenou z, tak že x sa stane rodičom pre y"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 2,
        paths: 0,
        values: 1,
        code: 206,
    },
    {
        name: "cut",
        description: {
            args: "Uzol x",
            description: "Predpokladá že x nieje koreňom stromu, odstráni hranu medzi x a rodičom x. Vráti cenu odstránenej hrany"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 207,
    },
    {
        name: "evert",
        description: {
            args: "Uzol x",
            description: "Upraví strom v ktorom sa x nachádza tak, aby sa x stalo koreňom stromu. (Medzi x a koreňom x zmení orientáciu hrán)"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 208,
    },
    {
        name: "light",
        description: {
            args: "Cesta p",
            description: "Na ceste p vráti light hranu najbližšiu ku tail(p) "
        },
        category: "sizeOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 301,
    },
    {
        name: "maxwt",
        description: {
            args: "Uzol x",
            description: "Vráti uzol, ktorý má najväčšiu weight,je synom uzlu x a nepatrí do rovnakej cesty"
        },
        category: "sizeOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 302,
    },
    {
        name: "slice",
        description: {
            args: "Cesta p",
            description: "Predpokladá že na ceste p sa nachádza light hrana. Hranu prekonvertuje na dashed a tým cestu rozdelí na dve cesty"
        },
        category: "sizeOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 303,
    },
    {
        name: "conceal",
        description: {
            args: "Cesta p",
            description: "Na ceste p opraví všetky hrany na dashed"
        },
        category: "sizeOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 304,
    },
]



export default {
    functionSetX,
    categorySetX,
}