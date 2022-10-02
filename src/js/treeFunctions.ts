import * as nodeClass from "./nodeClass"
import { Nodes, Edges, Paths, Edge } from "v-network-graph";


//nodeBasic používam pri výpise štruktúry vpravo

export function initializeTree(nodes: Nodes, edges: Edges, paths: Paths, callParams: any): nodeClass.Node[] {
    var nodeList: nodeClass.Node[] = []
    var returns = []; // parent, children, values
    for (var x in nodes) {
        returns = travelEdges(edges, x)
        let nodeBasic = new nodeClass.StructBasic(nodes[x].name, returns[0], returns[1], returns[2], null)
        let nodeNaive = null
        let nodeSize = null
        let node = new nodeClass.Node(nodeBasic, nodeNaive, nodeSize)
        nodeList.push(node)
    }
    return nodeList
}

function travelEdges(edges: Edges, node: string): [string | null, string[], number] {
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

export function addNode(treeDataStructure: any, name: string) {
    console.log('update', treeDataStructure)
    let nodeBasic = new nodeClass.StructBasic(name, null, [], null, null)
    let nodeNaive = null
    let nodeSize = null
    treeDataStructure.push(new nodeClass.Node(nodeBasic, nodeNaive, nodeSize))
    return treeDataStructure
}

export function removeNode(treeDataStructure: nodeClass.Node[], name: string) {
    return treeDataStructure.filter(x => x.StructBasic.name != name)
}

export function addEdge(treeDataStructure: nodeClass.Node[], edges: Edges, edgeID: string) {
    console.log("~", edges[edgeID])
    treeDataStructure.forEach((node) => {
        if (node.StructBasic.name == edges[edgeID].source) {
            node.StructBasic.children.push(edges[edgeID].target)
        } else if (node.StructBasic.name == edges[edgeID].target) {
            node.StructBasic.value = edges[edgeID].label
            node.StructBasic.parent == edges[edgeID].source
        }
    })
    return treeDataStructure
}

export function removeEdge(treeDataStructure: nodeClass.Node[], edgeToRemove: Edge) {
    treeDataStructure.forEach((node) => {
        if (node.StructBasic.name == edgeToRemove.source) {
            node.StructBasic.children.filter(nodeName => nodeName != edgeToRemove.target)
        } else if (node.StructBasic.name == edgeToRemove.target) {
            node.StructBasic.parent = null
            node.StructBasic.value = null
        }
    })
    return treeDataStructure

}