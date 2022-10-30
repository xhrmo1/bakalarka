import * as nodeClass from "./nodeClass"
import { Nodes, Edges, Paths, Edge } from "v-network-graph";
import * as naiveOP from "./naivePartition"


//nodeBasic používam pri výpise štruktúry vpravo
// todo pridat zoznam vsetkych uzlov
export function initializeTree(nodes: Nodes, edges: Edges, paths: Paths, callParams: any): nodeClass.StructBasic[] {
    var roots: nodeClass.StructBasic[] = []
    for (var n in nodes) {
        if (nodeIsRoot(edges, n)) {
            console.log("--thisNode is root", n)
            var root: nodeClass.StructBasic = new nodeClass.StructBasic(nodes[n].name ?? "Uzol nema meno")
            root.children = getChildren(edges, root)
            roots.push(root)
        }
    }
    console.log("all Nodes: ", roots)
    return roots
}

function getChildren(edges: Edges, node: nodeClass.StructBasic): nodeClass.EdgeDetail[] {
    let children: nodeClass.EdgeDetail[] = []
    for (var e in edges) {
        if (edges[e].source == node.name) {
            let child: nodeClass.StructBasic = new nodeClass.StructBasic(edges[e].target, new nodeClass.EdgeDetail(node, e), +edges[e].label,)
            child.children = getChildren(edges, child)
            children.push(new nodeClass.EdgeDetail(child, e))
        }
    }
    return children
}

function nodeIsRoot(edges: Edges, nodeName: string): boolean {
    for (var e in edges) {
        if (edges[e].target == nodeName) {
            return false
        }
    }
    return true
}

export function addNode(treeDataStructure: nodeClass.TreeDataStructures, name: string) {
    console.log('-AddingNode-', treeDataStructure)
    let newNode: nodeClass.StructBasic = new nodeClass.StructBasic(name)
    newNode.pathPointer = new nodeClass.Path(naiveOP.getNextNumberForPath(treeDataStructure), [newNode], null, null)
    treeDataStructure.basicRoots.push(newNode)
    treeDataStructure.pathRoots.push(newNode.pathPointer)

    return treeDataStructure
}

export function findNodeArray(nodeArray: nodeClass.StructBasic[], name: string): nodeClass.StructBasic | null {
    let node: nodeClass.StructBasic | null;
    for (let i = 0; i < nodeArray.length; i++) {
        node = findNode(nodeArray[i], name)
        if (node != null) {
            return node
        }
    }
    return null
}

export function findNode(node: nodeClass.StructBasic, name: string): nodeClass.StructBasic | null {
    let nodeX: nodeClass.StructBasic | null;
    if (node.name == name) {
        return node
    }
    if (node.children != null) {
        for (let x of node.children) {
            nodeX = findNode(x.target, name)
            if (nodeX != null) {
                return nodeX
            }
        }

    }
    return null
}

export function removeNode(treeDataStructure: nodeClass.TreeDataStructures, name: string, nodes: Nodes, edges: Edges, paths: Paths) {
    let node = findNodeArray(treeDataStructure.basicRoots, name)
    if (node == null) {
        console.error("Removing node, node not found")
        return
    }
    naiveOP.split(node, paths, nodes, edges, treeDataStructure)
    if (node.pathPointer != null) {
        let index = treeDataStructure.pathRoots.indexOf(node.pathPointer, 0)
        if (index != -1) {
            treeDataStructure.pathRoots.splice(index, 1)
        }
    }

    if (node.parent != null) {
        if (node.parent.target.children != null) { // treba kvoli typu
            for (let i = 0; i < node.parent.target.children?.length; i++) {
                if (node.parent.target.children[i].edgeID == node.parent.edgeID) {
                    delete node.parent.target.children[i]
                    break
                }
            }
        } else {
            console.error("--zle nastavene--, removeNode 1", node)
        }
    }

    if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].target.parent?.target.name != node.name) {
                console.error("--zle nastavene--, removeNode 2", node)
            }
            treeDataStructure.basicRoots.push(node.children[i].target)
            node.children[i].target.parent = null

        }
    }


}

export function addEdge(treeDataStructure: nodeClass.TreeDataStructures, edges: Edges, edgeID: string) {
    console.log("Adding Edge", edges[edgeID])
    var nodeSource = findNodeArray(treeDataStructure.basicRoots, edges[edgeID].source)
    if (nodeSource == null) {
        console.error("--addEdge, node not found")
        return
    }
    var nodeTarget = findNodeArray(treeDataStructure.basicRoots, edges[edgeID].target)
    if (nodeTarget == null) {
        console.error("--error while adding edge, node not found", treeDataStructure, edges, edgeID)
        return
    }
    if (nodeSource.children == null) {
        nodeSource.children = []
    }
    nodeSource.children.push(new nodeClass.EdgeDetail(nodeTarget, edgeID))

    nodeTarget.value = edges[edgeID].label
    nodeTarget.parent = new nodeClass.EdgeDetail(nodeSource, edgeID)

    let index = treeDataStructure.basicRoots.indexOf(nodeTarget, 0)
    if (index != -1) {
        treeDataStructure.basicRoots.splice(index, 1)
    }
}


export function removeEdge(treeDataStructure: nodeClass.TreeDataStructures, edgeToRemove: Edge) {
    console.log(" -- edgeToRemove -- ", edgeToRemove)
    var source = findNodeArray(treeDataStructure.basicRoots, edgeToRemove.source)
    if (source == null) {
        console.error("--removeEdge error, target node was not found")
        return
    }
    if (source.children == null) {
        console.error("--removeEdge error, target node has not children")
        return
    }
    if (source.name == null) {
        console.error("--removeEdge error, target has no name")
        return
    }
    var name = source.name
    source.children.filter(e => e.target.name != name)


    var target = findNodeArray(treeDataStructure.basicRoots, edgeToRemove.target)
    if (target == null) {
        console.error("--removeEdge error, source node was not found")
        return
    }
    target.parent = null
    treeDataStructure.basicRoots.push(target)
}

export function findPath(pathRoots: nodeClass.Path[], name: string): nodeClass.Path | undefined {
    var p = pathRoots.find((path) => {
        return path.pathID == name
    })
    return p
}