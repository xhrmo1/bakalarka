import * as nodeClass from "./nodeClass"
import { Nodes, Edges, Paths } from "v-network-graph";
import { findNodeArray, findAncestor, findSuccessor } from "./treeFunctions";
import * as naiveOP from "./naivePartition"
import { flatMap } from "lodash";



export function buildPaths(nodes: Nodes, edges: Edges, paths: Paths, structBasic: nodeClass.StructBasic[], sizeStruct: boolean) {
    var pathsSets = []
    var usedNodes: any[] = []
    for (var p in paths) {
        var nodesList: any[] = []
        for (var e in paths[p].edges) {
            console.log(nodesList, nodesList.length == 0, e, "XXX", edges[paths[p].edges[e]])
            //v all nodes je to od hlavy po tail, preto najprv pridavame target lebo to je head
            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].target)) { // 
                let name = nodes[edges[paths[p].edges[e]].target].name
                usedNodes.push(name)
                nodesList.push(findNodeArray(structBasic, name != null ? name : ""))
            }
            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].source)) { // 
                let name = nodes[edges[paths[p].edges[e]].source].name
                usedNodes.push(name)
                nodesList.push(findNodeArray(structBasic, name != null ? name : ""))
            }
        }

        console.log("-- pouzite nodes --", usedNodes)
        //nodesList = nodesList.reverse() // nodeList ide od korena od listy, path je definovany ze hlava je list a tail je koreň - toto mi prišlo ako najjednoduchší fix problému
        //paths[p].edges = paths[p].edges.reverse()
        var newPath = new nodeClass.Path(
            paths[p].id ?? "",
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
        }
        pathsSets.push(newPath)
    }
    //create paths where are no edges
    for (var n in nodes) {
        if (!usedNodes.includes(nodes[n].name)) {
            let x = nodes[n].name
            if (x === undefined) { x = "" }
            let aloneNode = findNodeArray(structBasic, x)
            if (aloneNode != null) {
                let pathID = getNextNumberForPat2(pathsSets)
                let oneNodePath: nodeClass.Path = new nodeClass.Path(
                    pathID,
                    [aloneNode],
                    null,
                    pathID)
                pathsSets.push(oneNodePath)
                aloneNode.pathPointer = oneNodePath
            }
        }
    }
    for (let p of pathsSets) {
        setPropertiesForPath(p, sizeStruct)
    }
    return pathsSets
}

export function setPropertiesForPath(path: nodeClass.Path | null, sizeStruct: boolean) {
    if (path != null && path.pathRoot != null) {
        setNetCostMin(path.pathRoot)
        setUpWeightsPath(path)
        setUpWeightInsideNodes(path.pathRoot)
        if (sizeStruct) {
            netMinSize(path.pathRoot, path.allNodes != null ? path.allNodes : [])
        }
    }
}

function sumLeftTilt(node: nodeClass.StructBasic, allNodes: nodeClass.StructBasic[]): number {
    let index = allNodes.indexOf(node)
    let sum = 0
    for (let i = 0; i <= index; i++) {
        sum = sum + allNodes[i].weight
    }
    console.log("lefttilt", node, sum, allNodes)
    return sum - allNodes[index + 1].weight
}

function sumRightTilt(node: nodeClass.StructBasic, allNodes: nodeClass.StructBasic[]): number {
    let index = allNodes.indexOf(node)
    let sum = 0
    for (let i = allNodes.length - 1; i >= index; i--) {
        sum = sum + allNodes[i].weight
    }
    return sum - allNodes[index - 1].weight
}

function netMinSize(pathVertex: nodeClass.PathStructure, allNodes: nodeClass.StructBasic[]) {
    netMinSizeTilt(pathVertex, allNodes)
}

function netMinSizeTilt(pathVertex: nodeClass.PathStructure, allNodes: nodeClass.StructBasic[]): [number, number] {
    console.log("-", pathVertex)
    var llm: number, lrm: number, rlm: number, rrm: number // child - left/right - min
    llm = lrm = rlm = rrm = Math.pow(10, 1000)


    pathVertex.lefttilt = sumLeftTilt(findAncestor(pathVertex), allNodes)
    pathVertex.righttilt = sumRightTilt(findSuccessor(pathVertex), allNodes)
    console.log("netleftmin", pathVertex.name, pathVertex.lefttilt, pathVertex.righttilt)
    if (pathVertex.pleft instanceof nodeClass.PathStructure) {
        [llm, lrm] = netMinSizeTilt(pathVertex.pleft, allNodes)
    }

    if (pathVertex.pright instanceof nodeClass.PathStructure) {
        [rlm, rrm] = netMinSizeTilt(pathVertex.pright, allNodes)
    }

    pathVertex.netleftmin = Math.min(llm, rlm, pathVertex.lefttilt)
    pathVertex.netrightmin = Math.min(lrm, rrm, pathVertex.righttilt)

    return [pathVertex.netleftmin, pathVertex.netrightmin]


}

function setUpWeightInsideNodes(path: nodeClass.PathStructure): number {
    let sum = 0
    if (path.pleft instanceof nodeClass.StructBasic) {
        sum = sum + path.pleft.weight
    } else if (path.pleft instanceof nodeClass.PathStructure) {
        sum = sum + setUpWeightInsideNodes(path.pleft)
    }

    if (path.pright instanceof nodeClass.StructBasic) {
        sum = sum + path.pright.weight
    } else if (path.pright instanceof nodeClass.PathStructure) {
        sum = sum + setUpWeightInsideNodes(path.pright)
    }
    path.weight = sum
    return sum
}

export function setUpWeightsPath(path: nodeClass.Path) {
    if (path.pathRoot != null) {
        let previouseVertex = path.pathRoot.bhead
        console.log("previouseVertex", previouseVertex)

        let vertex = naiveOP.after(previouseVertex)
        while (vertex != null) {
            vertex.weight = vertex.size - previouseVertex.size
            previouseVertex = vertex
            vertex = naiveOP.after(previouseVertex)
        }
    }
}

function getNextNumberForPat2(pathsRoots: nodeClass.Path[]): string {
    if (pathsRoots.length == 0) {
        return "path" + 1
    }
    var xx = pathsRoots[pathsRoots.length - 1].pathID?.replace("path", "")
    if (xx != undefined) {
        xx = "path" + (Number(xx) + 2)
    } else {
        xx = "path1"
    }
    return xx
}
//pathEdges edges from concretePath
//newPath link actual nodes
export function createPathStruct(nodes: Nodes, edges: Edges, pathsEdges: string[], newPath: any[], createNaive: boolean, left: number, right: number): nodeClass.PathStructure | null {
    if (left == right) {
        return newPath[left]
    }
    var middle = Math.floor((right + left) / 2)
    var node = null
    console.log("toto ma teary", pathsEdges)
    if (createNaive) { // if false, create SizePartition
        console.log(edges[pathsEdges[middle]])
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
