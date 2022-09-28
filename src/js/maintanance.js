import * as nodeClass from "./nodeClass.js"

export function initializeTree(nodes, edges, paths, callParams) {
    var nodeList = []
    console.l
    var returns = []; // parent, children, values
    for (var x in nodes) {
        returns = travelEdges(edges, x)
        let nodeBasic = new nodeClass.StructBasic(nodes[x].name, returns[0], returns[1], returns[2])
        let nodeNaive = null
        let nodeSize = null
        let node = new nodeClass.Node(nodeBasic, nodeNaive, nodeSize)
        nodeList.push(node)
    }

    return nodeList
}




export function buildPaths(nodes, edges, paths) {
    var pathsSets = []

    for (var p in paths) {
        var newPath = new nodeClass.Path(paths[p].id)
        var nodesList = []
        for (var e in paths[p].edges) {
            console.log(nodesList, nodesList.length == 0, e, "XXX", edges[paths[p].edges[e]])

            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].source)) { // 
                nodesList.push(nodes[edges[paths[p].edges[e]].source])
            }
            if (nodesList.length == 0 || !nodesList.some(node => node.name === edges[paths[p].edges[e]].target)) { // 
                nodesList.push(nodes[edges[paths[p].edges[e]].target])
            }
        }
        newPath.allNodes = nodesList
        console.log(nodesList)
        newPath.root = createnaiveStruct(nodes, edges, paths[p].edges, nodesList, true, 0, paths[p].edges.length)

        pathsSets.push(newPath)
    }
    console.log('pathSets == ', pathsSets)
    return pathsSets
}
//pathEdges edges from concretePath
//newPath link actual nodes
function createnaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, left, right) {
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
    var lnode = createnaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, left, middle)
    if (lnode.name != null) {
        lnode.bparent = node

    }
    var rnode = createnaiveStruct(nodes, edges, pathsEdges, newPath, createNaive, middle + 1, right)
    if (rnode.name != null) {
        rnode.bparent = node
    }
    node.bleft = lnode
    node.bright = rnode
    return node
}


function travelEdges(edges, node) {
    var parent = null, children = [], value = 0
    for (var edge in edges) {
        if (edges[edge].source == node) {
            children.push(edges[edge].target)
        }
        if (edges[edge].target == node) {
            parent = edges[edge].source
            value = edges[edge].label;
        }
    }
    console.log(parent, children, value)

    return [parent, children, value]
}

export function addNode(treeDataStructure, name) {
    console.log('update', treeDataStructure)
    let nodeBasic = new nodeClass.StructBasic(name, null, [], null)
    let nodeNaive = null
    let nodeSize = null
    treeDataStructure.push(new nodeClass.Node(nodeBasic, nodeNaive, nodeSize))
    return treeDataStructure
}

export function removeNode(treeDataStructure, name) {
    return treeDataStructure.filter(x => x.StructBasic.name != name)
}