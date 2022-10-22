import { AssignCustomizer } from "lodash"
import { Edges, Nodes, Path, Paths } from "v-network-graph"
import { version } from "vue"
import * as nodeclass from "./nodeClass"
import { findPath } from "./treeFunctions"
import * as maintanance from "./maintanance"



//naiveVersion: boolean - means we are requesting naive; otherwise size version is requested

export function path(vertex: nodeclass.StructBasic): nodeclass.Path | null {
    return vertex.pathPointer
}

export function head(p: nodeclass.Path) {
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.btail
    }
    return p.pathRoot?.bhead

}

export function tail(p: nodeclass.Path) {
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.bhead
    }
    return p.pathRoot?.btail

}

function goingRightDown(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.pright instanceof nodeclass.StructBasic) {
        return vertex.pright
    }
    if (vertex.pright != null) {
        return goingRightDown(vertex.pright)
    }
    return vertex.pleft instanceof nodeclass.StructBasic ? vertex.pleft : null
}


function goingUpLeft(vertex: nodeclass.PathStructure, previousNode: any): nodeclass.StructBasic | null {
    // z laveho uzlu sme prišli
    if (vertex.pleft == previousNode) {
        if (vertex.pParent == null) {
            return null
        }
        return goingUpLeft(vertex.pParent, vertex)
    }
    // prišli sme z praveho uzlu
    if (vertex.pleft == null) {
        console.log("Error - goingUpLeft - left node does not exists")
        return null
    }
    if (vertex.pleft instanceof nodeclass.StructBasic) {
        return vertex.pleft
    }
    return goingRightDown(vertex.pleft)
}


export function before(vertex: nodeclass.StructBasic): nodeclass.StructBasic | null {
    if (vertex.pParent != null) {
        if (vertex.pParent.pleft instanceof nodeclass.StructBasic && vertex.pParent.pleft != vertex) {
            return vertex.pParent.pleft
        }
        return goingUpLeft(vertex.pParent, vertex)
    }
    console.log("Error - before - pParent == null")
    return null
}

function goingLeftDown(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.pleft instanceof nodeclass.StructBasic) {
        return vertex.pleft
    }
    if (vertex.pleft != null) {
        return goingLeftDown(vertex.pleft)
    }
    return null
}

function goingUpRight(vertex: nodeclass.PathStructure, previousNode: any): nodeclass.StructBasic | null {

    if (vertex.pright == previousNode) { // z praveho uzlu sme prišli
        if (vertex.pParent == null) {
            return null
        }
        return goingUpRight(vertex.pParent, vertex)
    }
    // prišli sme z praveho laveho uzlu
    if (vertex.pright == null) {
        console.log("Error - goingUpRight - left node does not exists")
        return null
    }
    if (vertex.pright instanceof nodeclass.StructBasic) {
        return vertex.pright
    }
    return goingLeftDown(vertex.pright)
}

export function after(vertex: nodeclass.StructBasic) {
    if (vertex.pParent != null) {
        if (vertex.pParent.pright instanceof nodeclass.StructBasic && vertex.pParent.pright != vertex) {
            return vertex.pParent.pright
        }
        return goingUpRight(vertex.pParent, vertex)
    }
    console.log("Error - after - pParent == null")
    return null
}

// null is returned node is tail of path
function pcostInside(vertex: nodeclass.PathStructure, previousNode: any): number | null {
    if (vertex.pleft == previousNode) {
        return vertex.value
    }
    if (vertex.pParent == null) {
        return null // node is tail of path
    }
    return pcostInside(vertex.pParent, vertex)
}

export function pcost(vertex: nodeclass.StructBasic): number | null {
    if (vertex.pParent != null) {
        return pcostInside(vertex.pParent, vertex)
    }
    console.log("Error - after - pParent == null")
    return null
}

function pmincostInside(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.netcost == 0 && vertex.netmin == 0) {
        if (vertex.pleft instanceof nodeclass.StructBasic) {
            return vertex.pleft
        }
        if (vertex.pleft == null) {
            console.log("Error - pmincostInside - vertex.pleft == null")
            return null
        }
        return goingRightDown(vertex.pleft)
    }
    let left = vertex.pleft instanceof nodeclass.PathStructure && vertex.pleft.netcost != null ? vertex.pleft.netcost : Infinity
    let right = vertex.pright instanceof nodeclass.PathStructure && vertex.pright.netcost != null ? vertex.pright.netcost : Infinity
    if (right <= left) {
        if (vertex.pright == null || vertex.pright instanceof nodeclass.StructBasic) {
            console.log("Error - pmincostInside - vertex.pright == null")
            return null
        }
        return pmincostInside(vertex.pright)
    } else {
        if (vertex.pleft == null || vertex.pleft instanceof nodeclass.StructBasic) {
            console.log("Error - pmincostInside - vertex.pleft2 == null")
            return null
        }
        return pmincostInside(vertex.pleft)
    }
}
//neskontrolovane - kvoli neprehladnemu vypisu - treba dokontrolovat
export function pmincost(p: nodeclass.Path) {
    if (p.pathRoot != null) {
        return pmincostInside(p.pathRoot)
    }
    console.log("Error - after - pParent == null")
    return null
}

function pupdateVertex(vertex: nodeclass.PathStructure, x: number) {
    vertex.value += x
    if (vertex.pleft instanceof nodeclass.PathStructure) {
        pupdateVertex(vertex.pleft, x)
    }
    if (vertex.pright instanceof nodeclass.PathStructure) {
        pupdateVertex(vertex.pright, x)
    }
}

// robim to pre obe štruktury naive/size
export function pupdate(p: nodeclass.Path, x: number, edges: Edges) {
    var tailVertex = tail(p)
    var currentNode = head(p)

    //uprava naive
    if (p.pathRoot == null) {
        console.error("p.pathRoot is null")
        return
    }
    p.pathRoot.netmin += x
    if (currentNode instanceof nodeclass.StructBasic) {
        while (currentNode != tailVertex && currentNode != undefined) {
            if (currentNode.parent?.edgeID != null) {
                edges[currentNode.parent?.edgeID].label = +edges[currentNode.parent?.edgeID].label + x
            }
            currentNode = currentNode.parent?.target
        }
    }
    pupdateVertex(p.pathRoot, x)
    console.log("Edges: ", edges, p)
}

// robim to pre obe štruktury naive/size
function reverseInside(vertex: nodeclass.PathStructure) {
    vertex.reversed = !vertex.reversed
    if (vertex.pleft instanceof nodeclass.PathStructure) {
        reverseInside(vertex.pleft)
    }
    if (vertex.pright instanceof nodeclass.PathStructure) {
        reverseInside(vertex.pright)
    }
}

export function reverse(p: nodeclass.Path) {
    if (p.pathRoot == null) {
        console.error("p.pathRoot is null")
        return
    }
    reverseInside(p.pathRoot)
}
// vyhodim chybu ak p priradim rodiča aj keď existuje už rodič a operáciu zruším

export function getLastElementFromMap(map: any, whatType: string): string {
    let lastMapName: string = ""
    for (let i in map) {
        lastMapName = i
    }
    lastMapName = String(Number(lastMapName.replace(whatType, "")) + 2)
    return lastMapName
}

export function concatenate(p: nodeclass.Path, q: nodeclass.Path, x: number, edges: Edges, paths: Paths, treeDataStructure: nodeclass.TreeDataStructures): [string, nodeclass.StructBasic[]] {

    let headVertex = head(q)
    if (!(headVertex instanceof nodeclass.StructBasic)) {
        console.error("Output of head is not StructBasic 1")
        return ["", []]
    }

    let tailVertex = tail(p)
    if (!(tailVertex instanceof nodeclass.StructBasic)) {
        console.error("Output of tail is not StructBasic 1")
        return ["", []]
    }
    /*if (tailVertex.parent != null && tailVertex.parent.target != headVertex) {
        console.log("Error - tailVertex " + tailVertex + " has parent ---")
        return ["", []]
    }*/
    var edgeID = ""
    if (tailVertex.parent == null) {
        edgeID = "edge" + getLastElementFromMap(edges, "edge")
        edges[edgeID] = {
            source: headVertex.name != null ? headVertex.name : "",
            target: tailVertex.name != null ? tailVertex.name : "",
            label: x,
            dashed: false
        }
        headVertex.children?.push(new nodeclass.EdgeDetail(tailVertex, edgeID))
        tailVertex.parent = new nodeclass.EdgeDetail(headVertex, edgeID)
    } else {
        edgeID = tailVertex.parent.edgeID
        edges[edgeID].dashed = false
    }

    // tu budeme rebuild cesty
    let pathDominant = path(headVertex)
    let pathSubmisive = path(tailVertex)
    console.log("--Paths", pathDominant, pathSubmisive, edgeID)
    if (pathDominant == null || pathSubmisive == null) {
        console.error("pathDominant or pathSubmisive is null", pathDominant, pathSubmisive)
        return ["", []]
    }

    pathDominant.allNodes?.concat(pathSubmisive.allNodes != null ? pathSubmisive.allNodes : []) // spojenie poli
    let idFinal, colorFInal: any
    var edgesFinal: string[]
    edgesFinal = []
    var submisiveID = pathSubmisive.pathID != null ? pathSubmisive.pathID : ""
    idFinal = pathDominant.pathID != null ? pathDominant.pathID : "" // nikdy by to nemalo byt ""
    if (paths[idFinal] != null) {
        edgesFinal = edgesFinal.concat(paths[idFinal].edges)
        console.log("XXXXXX", edgesFinal)
    }
    edgesFinal.push(edgeID)
    console.log("edges + idFinal: ", edgesFinal, paths[idFinal].edges)
    if (paths[submisiveID] != null) {
        edgesFinal = edgesFinal.concat(paths[submisiveID].edges)
        delete paths[submisiveID]
        treeDataStructure.pathRoots = treeDataStructure.pathRoots.filter(p => p.pathID != submisiveID)
    }
    //
    console.log("edges: XXXXXXXXX", edgesFinal, submisiveID)
    console.log("edges: ", edgesFinal, idFinal)
    paths[idFinal] = {
        id: idFinal,
        edges: edgesFinal,
        color: "#d55040cc", // todo doeditovat
        canSee: true,
        mouseOver: false,
        width: 45,
    };
    var allNodes: nodeclass.StructBasic[] = []
    if (pathDominant.allNodes != null && pathSubmisive.allNodes != null) {
        allNodes = pathSubmisive.allNodes.concat(pathDominant.allNodes)
    }
    console.log(allNodes)
    return [idFinal, allNodes]
}

//funguje iba na path operaciach, cize vrati rodica iba v pripade ze rodic existuje na rovnakej path
export function split(vertex: nodeclass.StructBasic, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    var p, q, x, y, vertexIndex
    if (vertex.pParent == null) {
        console.error("this edge has no pParent", vertex)
        return
    }
    let beforeVertex = before(vertex)
    let afterVertex = after(vertex)
    console.log(beforeVertex, afterVertex)
    let parentVertexID = vertex.parent?.edgeID != null ? vertex.parent?.edgeID : ""
    if (beforeVertex == null || afterVertex == null || vertex.pathPointer == null || vertex.pathPointer.pathID == null || vertex.children == null) {
        console.error("Error split , edge has no ancestor or successors")
        return
    }
    let newPathID = "path" + getLastElementFromMap(paths, "path")
    console.log(newPathID)
    //u paths orezat edges
    // do before
    for (var i of vertex.children) {
        if (i.target.pathPointer == vertex.pathPointer) {
            y = edges[i.edgeID].label
            delete edges[i.edgeID]
        }
    }
    x = edges[vertex.parent?.edgeID != null ? vertex.parent.edgeID : ""].label
    delete edges[vertex.parent?.edgeID != null ? vertex.parent.edgeID : ""] // do after
    //dole

    paths[newPathID] = {
        id: newPathID,
        edges: paths[vertex.pathPointer.pathID].edges.slice(paths[vertex.pathPointer.pathID].edges.indexOf(parentVertexID) + 2),
        color: "#d55040cc", // todo doeditovat
        canSee: true,
        mouseOver: false,
        width: 45,
    }
    //hore
    paths[vertex.pathPointer.pathID].edges = paths[vertex.pathPointer.pathID].edges.slice(0, paths[vertex.pathPointer.pathID].edges.indexOf(parentVertexID))
    var xxxx = vertex.pathPointer.pathID
    var allNodesBefore = vertex.pathPointer.allNodes?.slice(0, vertex.pathPointer.allNodes.indexOf(beforeVertex) + 1)
    var allNodesAfter = vertex.pathPointer.allNodes?.slice(vertex.pathPointer.allNodes.indexOf(afterVertex))
    if (allNodesAfter === undefined || allNodesBefore === undefined) {
        return
    }
    console.log("><", vertex.pathPointer.allNodes?.indexOf(beforeVertex), vertex.pathPointer.allNodes?.indexOf(afterVertex))
    console.log("<><>", allNodesBefore, allNodesAfter)
    console.log(paths[xxxx].edges)
    console.log(paths[newPathID].edges)
    //prebuildovat rootPaths
    treeDataStructure.pathRoots.map((p) => {
        if (p.pathID == xxxx) {
            p.allNodes = allNodesAfter == undefined ? [] : allNodesAfter
            p.pathRoot = maintanance.createPathStruct(nodes, edges, paths[xxxx].edges, allNodesAfter == undefined ? [] : allNodesAfter, true, 0, paths[xxxx].edges.length)
        }
    })
    console.log("---")
    treeDataStructure.pathRoots.push(new nodeclass.Path(newPathID, allNodesBefore, maintanance.createPathStruct(nodes, edges, paths[newPathID].edges, allNodesBefore, true, 0, paths[newPathID].edges.length), newPathID))

    console.log("||||", vertex.pathPointer.pathID, newPathID, x, y) // toto vratim
    return [vertex.pathPointer.pathID, newPathID, x, y]
}



export function splice(p: nodeclass.Path) {

}

export function expose(p: nodeclass.Path) {

}