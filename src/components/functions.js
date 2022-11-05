
let categorySetX = [
    {
        name: "Všetky",
        category: "all"
    }, {
        name: "Operacie na cestach",
        category: "pathOP"
    },
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
    /* {
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
     },*/
    /*{
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
     },*/
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