
let categorySetX = [
    {
        name: "Všetky",
        category: "all"
    }, {
        name: "Polovica",
        category: "bb"
    }, {
        name: "Druha",
        category: "cc"
    }, {
        name: "Operations on paths",
        category: "pathOP"
    }]

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
    {
        name: "funkcia1",
        description: {
            args: "Cesta p, Cesta s, Hodnota a",
            description: "Funckia zoberie hodnoty p, s spoji ich do jednej cesty a hrana medzi nimi bude mat hodnotu a"
        },
        category: "bb",
        nodes: 0,
        nodesInPath: 0,
        paths: 2,
        values: 1,
        code: 42,
    },
    {
        name: "funkcia2",
        description: {
            args: "Uzol x, Cesta p, Hodnota a, Hodnota b",
            description: "Funckia zoberie hodnoty p, s spoji ich do jednej cesty a hrana medzi nimi bude mat hodnotu a pre DRUHU"
        },
        category: "bb",
        nodes: 1,
        nodesInPath: 0,
        paths: 1,
        values: 2,
        code: 77,
    },
    {
        name: "funkcia3",
        description: {
            args: "Uzol x, Uzol y, Uzol z, Uzol v, Cesta p, Hodnota a, Hodnota b, Hodnota c",
            description: "Funckia zoberie hodnoty p, s spoji ich do jednej cesty a hrana medzi nimi bude mat hodnotu a pre DRUHU"
        },
        category: "cc",
        nodes: 4,
        nodesInPath: 0,
        paths: 1,
        values: 3,
        code: 3,
    },


    //category - pathOP.

    {
        name: "path",
        description: {
            args: "Vertex x",
            description: "Returns the path containing x"
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
            args: "Path p",
            description: "Returns the first vertex of path p"
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
            args: "Path p",
            description: "Return the last vertex from path p"
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
            args: "Vertex x",
            description: "Return vertex y before vertex x on path(x). If x is head of path(x), return null"
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
            args: "Vertex x",
            description: "Return vertex y after vertex x on path(x). If x is tail of path(x), return null"
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
            args: "Vertex x",
            description: "Return the cost of the edge (v, after(v)). Assuming v is not tail of path(x)"
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
            args: "path p",
            description: "Returns the vertex x closest to tail(p) such that (x, after(x)) has minimum cost among edges on p"
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
            args: "path p, real x",
            description: "Add x to the cost of every edge on p"
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
            args: "path p",
            description: "Reverse the direction of p, making the head the tail and vice versa"
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
            args: "path p, path q, real x",
            description: "Combine paths p, q. Adding edge (tail(p), head(q)) with value x. Returns combine path"
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
            args: "vertex x",
            description: "Reverse the direction of p, making the head the tail and vice versa"
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
            args: "path p",
            description: "Reverse the direction of p, making the head the tail and vice versa"
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
            args: "vertex x",
            description: "Reverse the direction of p, making the head the tail and vice versa"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 1,
        paths: 0,
        values: 0,
        code: 113,
    },

]



export default {
    functionSetX,
    categorySetX,
}