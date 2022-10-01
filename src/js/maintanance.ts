import * as nodeClass from "./nodeClass"
import { Nodes, Edges, Paths } from "v-network-graph";


export function buildPaths(nodes: Nodes, edges: Edges, paths: Paths) {
    var pathsSets = []

    for (var p in paths) {
        var nodesList: any[] = []
        for (var e in paths[p].edges) {
            console.log(nodesList, nodesList.length == 0, e, "XXX", edges[paths[p].edges[e]])

            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].source)) { // 
                nodesList.push(nodes[edges[paths[p].edges[e]].source])
            }
            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].target)) { // 
                nodesList.push(nodes[edges[paths[p].edges[e]].target])
            }
        }
        var newPath = new nodeClass.Path(
            paths[p].id,
            createNaiveStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length),
            nodesList)
        console.log(nodesList)
        newPath.root = createNaiveStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length)

        pathsSets.push(newPath)
    }
    console.log('pathSets == ', pathsSets)
    return pathsSets
}
//pathEdges edges from concretePath
//newPath link actual nodes
function createNaiveStruct(nodes: Nodes, edges: Edges, pathsEdges: string[], newPath: any[], createNaive: boolean, left: number, right: number): nodeClass.NaivePartition | null {
    if (left == right) {
        console.log("lnode:!!!", newPath[left])
        return newPath[left]
    }
    var middle = Math.floor((right + left) / 2)
    var node = null
    if (createNaive) { // if false, create SizePartition
        node = new nodeClass.NaivePartition({ name: pathsEdges[middle], bhead: newPath[left], btail: newPath[right] })
    } else {
        node = null //TODO
    }

    /*if (left + 1 == right) {
        node.bleft = newPath[left]
        node.bright = newPath[right]
        return node
    }*/
    var lnode = createNaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, left, middle)
    if (lnode != null && lnode.name != null) {
        lnode.bparent = node

    }
    var rnode = createNaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, middle + 1, right)
    if (rnode != null && rnode.name != null) {
        rnode.bparent = node
    }
    if (node != null) {
        node.bleft = lnode
        node.bright = rnode
    }
    return node
}
