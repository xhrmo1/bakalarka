
let categorySetX = [
    {
        name: "Všetky",
        category: "all"
    }, {
        name: "Operacie na cestach",
        category: "pathOP"
    }, {
        name: "Operácie na stromoch",
        category: "treeOP"
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

    {
        name: "test",
        description: {
            args: "Vertex x",
            description: "Returns the path containing x"
        },
        category: "pathOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 0,
        values: 0,
        code: -1,
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
    //treeoperations
    {
        name: "parent",
        description: {
            args: "vertex x",
            description: "Return the parent of x. Returns null if x is root of a tree"
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
            args: "vertex x",
            description: "Return root of the tree containing x"
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
            args: "vertex x",
            description: "Return the cost of the edge (parent(x),x), assuming x is not a tree root"
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
            args: "vertex x",
            description: "Return minimum edge cost closest to root(x), assuming x is not a tree root"
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
            args: "vertex x, real y",
            description: "Add y to all edges cost on path from x to root(x)"
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
            args: "vertex x, vertex y, real z",
            description: "Same as ADD EDGE. Combines the trees containing x and y by adding edge(y,x) with cost z. Assuming y and x are in different trees and y is a root of tree"
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
            args: "vertex x",
            description: "Same as REMOVE EDGE. Divide the tree containing vertex x into two tree by deleting edge (parent(x),x) returns cost of this edge. Assuming that x is not a tree root"
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
            args: "vertex x",
            description: "Modify the tree containing vertex x by making x the root"
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
            args: "cesta p",
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
            args: "uzol x",
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
            args: "cesta p",
            description: "Predpokladá že na ceste p sa nachádza light hrana. Hranu prekonvertuje na dashed a tým cestu rozdelí na dve cesty"
        },
        category: "treeOP",
        nodes: 0,
        nodesInPath: 0,
        paths: 1,
        values: 0,
        code: 303,
    },
    {
        name: "conceal",
        description: {
            args: "cesta p",
            description: "Na ceste p opraví všetky hrany na dashed"
        },
        category: "treeOP",
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