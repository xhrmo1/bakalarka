import * as nodeClass from "./nodeClass"
import { Nodes, Edges, Paths } from "v-network-graph";
import { findNodeArray } from "./treeFunctions";


export function buildPaths(nodes: Nodes, edges: Edges, paths: Paths, structBasic: nodeClass.StructBasic[]) {
    var pathsSets = []

    for (var p in paths) {
        var nodesList: any[] = []
        for (var e in paths[p].edges) {
            console.log(nodesList, nodesList.length == 0, e, "XXX", edges[paths[p].edges[e]])

            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].source)) { // 
                let name = nodes[edges[paths[p].edges[e]].source].name
                nodesList.push(findNodeArray(structBasic, name != null ? name : ""))
            }
            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].target)) { // 
                let name = nodes[edges[paths[p].edges[e]].target].name
                nodesList.push(findNodeArray(structBasic, name != null ? name : ""))
            }
        }
        var newPath = new nodeClass.Path(
            paths[p].id,
            nodesList,
            createNaiveStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length),
            null)
        console.log(nodesList)
        //newPath.root = createNaiveStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length)
        if (newPath.rootNaive != null) {
            newPath.rootNaive.root = newPath
            setNetCostMin(newPath.rootNaive)
        }
        pathsSets.push(newPath)
    }
    console.log('pathSets == ', pathsSets)
    return pathsSets
}
//pathEdges edges from concretePath
//newPath link actual nodes
function createNaiveStruct(nodes: Nodes, edges: Edges, pathsEdges: string[], newPath: any[], createNaive: boolean, left: number, right: number): nodeClass.NaivePartition | null {
    if (left == right) {
        return newPath[left]
    }
    var middle = Math.floor((right + left) / 2)
    var node = null
    if (createNaive) { // if false, create SizePartition
        console.log("toto ma teary", +edges[pathsEdges[middle]].label)
        node = new nodeClass.NaivePartition(pathsEdges[middle], newPath[right], newPath[left], +edges[pathsEdges[middle]].label, true)
    } else {
        node = null //TODO
    }
    var lnode: any
    if (left == middle) {
        lnode = newPath[left]
    } else {
        lnode = createNaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, left, middle)
    }
    if (lnode != null && lnode.name != null) {
        lnode.bparent = node

    }
    let rnode
    if (rnode == middle) {
        rnode = newPath[middle]
    } else {
        rnode = createNaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, middle + 1, right)

    }
    if (rnode != null && rnode.name != null) {
        rnode.bparent = node
    }
    if (node != null) {
        node.bleft = lnode
        node.bright = rnode
    }
    return node
}

function setNetCostMin(naiveStruct: nodeClass.NaivePartition) {
    naiveStruct.netmin = netMin(naiveStruct)
    naiveStruct.netcost = netCost(naiveStruct)
    if (naiveStruct.bleft != null && !(naiveStruct.bleft instanceof nodeClass.StructBasic)) {
        setNetCostMin(naiveStruct.bleft)
    }
    if (naiveStruct.bright != null && !(naiveStruct.bright instanceof nodeClass.StructBasic)) {
        setNetCostMin(naiveStruct.bright)
    }
}

function grossMin(naiveStruct: nodeClass.NaivePartition): number {
    var minArray = [+naiveStruct.value]
    if (naiveStruct.bleft != null && !(naiveStruct.bleft instanceof nodeClass.StructBasic)) {
        minArray.push(grossMin(naiveStruct.bleft))
    }
    if (naiveStruct.bright != null && !(naiveStruct.bright instanceof nodeClass.StructBasic)) {
        minArray.push(grossMin(naiveStruct.bright))
    }
    return Math.min(...minArray)
}

function netCost(naiveStruct: nodeClass.NaivePartition): number {
    return naiveStruct.value - grossMin(naiveStruct)
}

function netMin(naiveStruct: nodeClass.NaivePartition): number {
    if (naiveStruct.bparent == null) {
        return grossMin(naiveStruct)
    } else {
        return grossMin(naiveStruct) - grossMin(naiveStruct.bparent)
    }
}
