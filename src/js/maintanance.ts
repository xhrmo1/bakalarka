import * as nodeClass from "./nodeClass"
import { Nodes, Edges, Paths } from "v-network-graph";
import { findNodeArray } from "./treeFunctions";
import * as naiveOP from "./naivePartition"



export function buildPaths(nodes: Nodes, edges: Edges, paths: Paths, structBasic: nodeClass.StructBasic[]) {
    var pathsSets = []
    var usedNodes: any[] = []
    for (var p in paths) {
        var nodesList: any[] = []
        for (var e in paths[p].edges) {
            console.log(nodesList, nodesList.length == 0, e, "XXX", edges[paths[p].edges[e]])

            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].source)) { // 
                let name = nodes[edges[paths[p].edges[e]].source].name
                usedNodes.push(name)
                nodesList.push(findNodeArray(structBasic, name != null ? name : ""))
            }
            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].target)) { // 
                let name = nodes[edges[paths[p].edges[e]].target].name
                usedNodes.push(name)
                nodesList.push(findNodeArray(structBasic, name != null ? name : ""))
            }
        }

        console.log("-- pouzite nodes --", usedNodes)
        nodesList = nodesList.reverse() // nodeList ide od korena od listy, path je definovany ze hlava je list a tail je koreň - toto mi prišlo ako najjednoduchší fix problému
        var newPath = new nodeClass.Path(
            paths[p].id,
            nodesList,
            createPathStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length),
            p)
        nodesList.forEach(element => {
            element.pathPointer = newPath
        });
        console.log(nodesList)
        //newPath.root = createPathStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length)
        if (newPath.pathRoot != null) {
            newPath.pathRoot.root = newPath
            setNetCostMin(newPath.pathRoot)
        }
        pathsSets.push(newPath)
    }
    console.log('pathSets == ', pathsSets)
    //create paths where are nod edges
    for (var n in nodes) {
        if (!usedNodes.includes(nodes[n].name)) {
            let x = nodes[n].name
            if (x === undefined) { x = "" }
            let aloneNode = findNodeArray(structBasic, x)
            if (aloneNode != null) {
                let pathID = naiveOP.getLastElementFromMap(paths, "path")
                let oneNodePath: nodeClass.Path = new nodeClass.Path(
                    "path" + pathID,
                    [aloneNode],
                    null,
                    "path" + pathID)
                pathsSets.push(oneNodePath)
                aloneNode.pathPointer = oneNodePath
            }
        }
    }

    return pathsSets
}
//pathEdges edges from concretePath
//newPath link actual nodes
export function createPathStruct(nodes: Nodes, edges: Edges, pathsEdges: string[], newPath: any[], createNaive: boolean, left: number, right: number): nodeClass.PathStructure | null {
    if (left == right) {
        return newPath[left]
    }
    var middle = Math.floor((right + left) / 2)
    var node = null
    if (createNaive) { // if false, create SizePartition
        console.log("toto ma teary", +edges[pathsEdges[middle]].label)
        node = new nodeClass.PathStructure(pathsEdges[middle], newPath[right], newPath[left], +edges[pathsEdges[middle]].label, true)
    } else {
        node = null //TODO
    }
    var lnode: any
    if (left == middle) {
        lnode = newPath[left]
    } else {
        lnode = createPathStruct(nodes, edges, pathsEdges, newPath, createNaive, left, middle)
    }
    if (lnode != null && lnode.name != null) {
        lnode.pParent = node

    }
    let rnode
    if (rnode == middle) {
        rnode = newPath[middle]
    } else {
        rnode = createPathStruct(nodes, edges, pathsEdges, newPath, createNaive, middle + 1, right)

    }
    if (rnode != null && rnode.name != null) {
        rnode.pParent = node
    }
    if (node != null) {
        node.pleft = lnode
        node.pright = rnode
    }
    return node
}

function setNetCostMin(pathStruct: nodeClass.PathStructure) {
    pathStruct.netmin = netMin(pathStruct)
    pathStruct.netcost = netCost(pathStruct)
    if (pathStruct.pleft != null && !(pathStruct.pleft instanceof nodeClass.StructBasic)) {
        setNetCostMin(pathStruct.pleft)
    }
    if (pathStruct.pright != null && !(pathStruct.pright instanceof nodeClass.StructBasic)) {
        setNetCostMin(pathStruct.pright)
    }
}

function grossMin(pathStruct: nodeClass.PathStructure): number {
    var minArray = [+pathStruct.value]
    if (pathStruct.pleft != null && !(pathStruct.pleft instanceof nodeClass.StructBasic)) {
        minArray.push(grossMin(pathStruct.pleft))
    }
    if (pathStruct.pright != null && !(pathStruct.pright instanceof nodeClass.StructBasic)) {
        minArray.push(grossMin(pathStruct.pright))
    }
    return Math.min(...minArray)
}

function netCost(pathStruct: nodeClass.PathStructure): number {
    return pathStruct.value - grossMin(pathStruct)
}

function netMin(pathStruct: nodeClass.PathStructure): number {
    if (pathStruct.pParent == null) {
        return grossMin(pathStruct)
    } else {
        return grossMin(pathStruct) - grossMin(pathStruct.pParent)
    }
}
