import { Edges, Nodes, Paths } from "v-network-graph"
import * as naiveOP from "./naivePartition"
import * as nodeclass from "./nodeClass"

//treeOperations
export function parent(vertex: nodeclass.StructBasic): nodeclass.StructBasic | null {
    return vertex.parent?.target ?? null
}

export function root(v: nodeclass.StructBasic, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): nodeclass.StructBasic | null {
    let x = naiveOP.expose(v, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (x === undefined) {
        return null
    }
    return naiveOP.tail(x)
}

export function cost(vertex: nodeclass.StructBasic) {
    return vertex.value
}

export function mincost(v: nodeclass.StructBasic, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    let x = naiveOP.expose(v, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (x === undefined) {
        return null
    }
    return naiveOP.pmincost(x)
}

export function update(v: nodeclass.StructBasic, r: number, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    let x = naiveOP.expose(v, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (x === undefined) {
        return null
    }
    return naiveOP.pupdate(x, r, edges)
}

export function link(x: nodeclass.StructBasic, y: nodeclass.StructBasic, r: number, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    let p = naiveOP.path(x)
    if (p == null) {
        console.error("link path(x) is null")
        return
    }
    let e = naiveOP.expose(y, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (e === undefined) {
        console.error("link expose(y) is null")
        return
    }
    naiveOP.concatenate(p, e, r, sizeStruct, nodes, edges, paths, treeDataStructure)
}

export function cut(v: nodeclass.StructBasic, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): number {
    let e = naiveOP.expose(v, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (e === undefined) {
        return 0
    }
    let [a, b, c, d] = naiveOP.split(v, sizeStruct, paths, nodes, edges, treeDataStructure)
    return d
}
function findSolidEdge(vertex: nodeclass.StructBasic, edges: Edges): number {
    if (vertex.children == null) {
        return -1
    }
    return vertex.children.findIndex((c) => {
        return edges[c.edgeID].dashed == false
    })
}
function flipParentChild(vertex: nodeclass.StructBasic, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    let beforeVertex: nodeclass.StructBasic | null = vertex
    treeDataStructure.basicRoots.push(vertex)
    while (beforeVertex != null) {
        if (beforeVertex.children == null) {
            beforeVertex.children = []
        }
        let solidIndex = findSolidEdge(beforeVertex, edges)
        let solidChildren = solidIndex != -1 ? beforeVertex.children[solidIndex] : null
        if (solidIndex == -1) {
            beforeVertex.value = 0
        } else {
            beforeVertex.value = edges[beforeVertex.children[solidIndex].edgeID].label
        }
        if (beforeVertex.parent != null) {
            edges[beforeVertex.parent.edgeID].target = [edges[beforeVertex.parent.edgeID].source, edges[beforeVertex.parent.edgeID].source = edges[beforeVertex.parent.edgeID].target][0]
        }

        if (solidIndex != -1) {
            beforeVertex.children.splice(solidIndex, 1)
        }
        solidChildren = [beforeVertex.parent, beforeVertex.parent = solidChildren][0];
        if (solidChildren != null) {
            beforeVertex.children.push(solidChildren)
        }
        beforeVertex = naiveOP.before(beforeVertex)
    }
}
export function evert(vertex: nodeclass.StructBasic, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    naiveOP.expose(vertex, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (vertex.pathPointer == undefined) {
        return
    }
    naiveOP.reverse(vertex.pathPointer)
    paths[vertex.pathPointer.pathID].edges = paths[vertex.pathPointer.pathID].edges.reverse()
    flipParentChild(vertex, edges, treeDataStructure)
}