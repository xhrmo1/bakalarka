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

export function head(p: nodeclass.Path): nodeclass.StructBasic {
    if (p.pathRoot == null && p.allNodes != null) {
        return p.allNodes[0]
    }
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.btail
    }
    return p.pathRoot?.bhead

}

export function tail(p: nodeclass.Path): nodeclass.StructBasic {
    if (p.pathRoot == null && p.allNodes != null) {
        return p.allNodes[0]
    }
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
        //console.log("Error - goingUpLeft - left node does not exists")
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
    //console.log("Error - before - pParent == null")
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
        //console.log("Error - goingUpRight - left node does not exists")
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
    //console.log("Error - after - pParent == null")
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
    //console.log("Error - after - pParent == null")
    return null
}

function pmincostInside(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.netcost == 0 && vertex.netmin == 0) {
        if (vertex.pleft instanceof nodeclass.StructBasic) {
            return vertex.pleft
        }
        if (vertex.pleft == null) {
            //console.log("Error - pmincostInside - vertex.pleft == null")
            return null
        }
        return goingRightDown(vertex.pleft)
    }
    let left = vertex.pleft instanceof nodeclass.PathStructure && vertex.pleft.netcost != null ? vertex.pleft.netcost : Infinity
    let right = vertex.pright instanceof nodeclass.PathStructure && vertex.pright.netcost != null ? vertex.pright.netcost : Infinity
    if (right <= left) {
        if (vertex.pright == null || vertex.pright instanceof nodeclass.StructBasic) {
            //console.log("Error - pmincostInside - vertex.pright == null")
            return null
        }
        return pmincostInside(vertex.pright)
    } else {
        if (vertex.pleft == null || vertex.pleft instanceof nodeclass.StructBasic) {
            //console.log("Error - pmincostInside - vertex.pleft2 == null")
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
    //console.log("Error - after - pParent == null")
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
                currentNode = currentNode.parent.target
            }
        }
    }
    pupdateVertex(p.pathRoot, x)
    //console.log("Edges: ", edges, p)
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

export function concatenate(p: nodeclass.Path, q: nodeclass.Path, x: number, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeclass.TreeDataStructures): string {
    let headVertex = head(q)
    let tailVertex = tail(p)
    var edgeID = ""
    console.log("--concate ", p, q)
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
        treeDataStructure.basicRoots = treeDataStructure.basicRoots.filter(e => e != tailVertex)
    } else {
        edgeID = tailVertex.parent.edgeID
        edges[edgeID].dashed = false
    }

    // tu budeme rebuild cesty
    let pathDominant = path(headVertex)
    let pathSubmisive = path(tailVertex)
    //console.log("--Paths", pathDominant, pathSubmisive, edgeID, edges[edgeID])
    if (pathDominant == null || pathSubmisive == null) {
        console.error("pathDominant or pathSubmisive is null", q, p, pathDominant, pathSubmisive, headVertex, tailVertex)
        return ""
    }

    pathDominant.allNodes?.concat(pathSubmisive.allNodes != null ? pathSubmisive.allNodes : []) // spojenie poli
    var idFinal: string
    var finalColor: string = "#d55040cc"
    var edgesFinal: string[]
    edgesFinal = []
    var submisiveID = pathSubmisive.pathID != null ? pathSubmisive.pathID : ""
    idFinal = pathDominant.pathID  // nikdy by to nemalo byt ""
    if (paths[idFinal] != null) {
        edgesFinal = edgesFinal.concat(paths[idFinal].edges)
        finalColor = paths[idFinal].color
        delete paths[idFinal]
        //console.log("XXXXXX", edgesFinal)
    }
    treeDataStructure.pathRoots = treeDataStructure.pathRoots.filter(p => p.pathID != idFinal)

    edgesFinal.push(edgeID)
    //console.log("edges + idFinal: ", edgesFinal)
    if (paths[submisiveID] != null) {
        edgesFinal = edgesFinal.concat(paths[submisiveID].edges)
        finalColor = paths[submisiveID].color
        delete paths[submisiveID]
    }
    treeDataStructure.pathRoots = treeDataStructure.pathRoots.filter(p => p.pathID != submisiveID)
    //
    //console.log("edges: XXXXXXXXX", edgesFinal, submisiveID)
    idFinal = getNextNumberForPath(treeDataStructure)
    console.log("edges: ", edgesFinal, idFinal)
    paths[idFinal] = {
        id: idFinal,
        edges: edgesFinal,
        color: finalColor, // todo doeditovat
        canSee: true,
        mouseOver: false,
        width: 45,
    };
    var allNodes: nodeclass.StructBasic[] = []
    if (pathDominant.allNodes != null && pathSubmisive.allNodes != null) {
        allNodes = pathSubmisive.allNodes.concat(pathDominant.allNodes)
    }
    console.log("allNodes", allNodes)
    treeDataStructure.pathRoots.push(new nodeclass.Path(idFinal, allNodes, null, idFinal))
    treeDataStructure.pathRoots.forEach((p) => {
        if (p.pathID == idFinal) {
            console.warn("xx")
            allNodes.map((n) => { n.pathPointer = p })
            p.allNodes = allNodes
            p.pathRoot = maintanance.createPathStruct(nodes, edges, paths[idFinal].edges, allNodes, true, 0, paths[idFinal].edges.length)

        }
    })
    console.log("XXX", treeDataStructure.pathRoots.length)
    return idFinal
}

//funguje iba na path operaciach, cize vrati rodica iba v pripade ze rodic existuje na rovnakej path
export function split(vertex: nodeclass.StructBasic, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): [nodeclass.Path | null, nodeclass.Path | null, number, number] {
    var pIDPath: string, qIDPath: string, x, y, vertexIndex
    pIDPath = ""
    qIDPath = "" // 
    let qPathPointer: nodeclass.Path | null = null
    let pPathPointer: nodeclass.Path | null = null

    let parentVertexID = vertex.parent?.edgeID != null ? vertex.parent?.edgeID : ""
    if (vertex.pathPointer == null || vertex.pathPointer.pathID == null || vertex.children == null) {
        console.error("Error split , edge has no ancestor or successors")
        return [null, null, 0, 0]
    }
    let beforeVertex = before(vertex) // q
    let afterVertex = after(vertex) // p


    if (beforeVertex != null) {
        pIDPath = getNextNumberForPath(treeDataStructure)
        for (var i of vertex.children) { // z before uzla zmazem hranu na rodica - hrana je solid
            if (i.target.pathPointer == vertex.pathPointer) {
                y = edges[i.edgeID].label
                delete edges[i.edgeID]
            }
        }
        paths[pIDPath] = {
            id: pIDPath,
            edges: paths[vertex.pathPointer.pathID].edges.slice(paths[vertex.pathPointer.pathID].edges.indexOf(parentVertexID) + 2),
            color: "#d55040cc", // todo doeditovat
            canSee: true,
            mouseOver: false,
            width: 45,
        }
        var allNodesBefore = vertex.pathPointer.allNodes?.slice(0, vertex.pathPointer.allNodes.indexOf(beforeVertex) + 1) ?? []
        allNodesBefore.forEach(n => {
            n.pathPointer = pPathPointer
        })
        pPathPointer = new nodeclass.Path(pIDPath, allNodesBefore, maintanance.createPathStruct(nodes, edges, paths[pIDPath].edges, allNodesBefore, true, 0, paths[pIDPath].edges.length), pIDPath)
        treeDataStructure.pathRoots.push(pPathPointer)
        treeDataStructure.basicRoots.push(beforeVertex)
        vertex.children = vertex.children.filter(e => e.target != beforeVertex)
        beforeVertex.parent = null
    } else {
        console.log("som tu1")
    }

    if (afterVertex != null) {
        qIDPath = getNextNumberForPath(treeDataStructure)
        paths[qIDPath] = {
            id: qIDPath,
            edges: paths[vertex.pathPointer.pathID].edges.slice(0, paths[vertex.pathPointer.pathID].edges.indexOf(parentVertexID)),
            color: "#d55040cc", // todo doeditovat
            canSee: true,
            mouseOver: false,
            width: 45,
        }
        x = edges[vertex.parent?.edgeID != null ? vertex.parent.edgeID : ""].label
        delete edges[vertex.parent?.edgeID != null ? vertex.parent.edgeID : ""]
        var allNodesAfter = vertex.pathPointer.allNodes?.slice(vertex.pathPointer.allNodes.indexOf(afterVertex)) ?? []
        qPathPointer = new nodeclass.Path(qIDPath, allNodesAfter, maintanance.createPathStruct(nodes, edges, paths[qIDPath].edges, allNodesAfter, true, 0, paths[qIDPath].edges.length), qIDPath)
        treeDataStructure.pathRoots.push(qPathPointer)
        allNodesAfter.forEach(n => {
            n.pathPointer = qPathPointer
        })
        vertex.parent = null
        afterVertex.children = afterVertex.children?.filter(e => e.target != vertex) ?? null
    } else {
        console.log("som tu2")
    }

    delete paths[vertex.pathPointer.pathID]
    vertex.pathPointer.allNodes = [vertex]
    vertex.pParent = null // ak aspon jeden bol

    console.log("SPLIT", treeDataStructure.pathRoots)




    for (var pathID in paths) {
        if (paths[pathID].edges.length == 0) {
            delete paths[pathID]
        }
    }
    treeDataStructure.pathRoots.map(p => {
        if (p.allNodes?.length == 1) {
            p.pathRoot = null
        }
    })
    console.log("XXXXXXXXX", pPathPointer, qPathPointer)
    return [pPathPointer, qPathPointer, x, y]
}

export function getNextNumberForPath(treeDataStructure: nodeclass.TreeDataStructures): string {
    var xx = treeDataStructure.pathRoots[treeDataStructure.pathRoots.length - 1].pathID?.replace("path", "")
    if (xx != undefined) {
        xx = "path" + (Number(xx) + 2)
    } else {
        xx = "path1"
    }
    return xx
}

export function splice(p: nodeclass.Path, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): string | nodeclass.Path {
    var v = tail(p)
    if (v.parent == null) {
        return ""
    }
    v = v.parent.target
    var [qPath, rPath, x, y] = split(v, paths, nodes, edges, treeDataStructure)
    // console.log("splice po splite", qPath, rPath, x, y, paths, edges, v, treeDataStructure)
    console.log(qPath, rPath)
    if (qPath != null) { // spravit z toho novu funkciu
        var qEdgeID = "edge" + getLastElementFromMap(edges, "edge")
        var qTail = tail(qPath)
        edges[qEdgeID] = {
            source: v.name,
            target: qTail.name,
            label: x,
            dashed: true
        }

        qTail.parent = new nodeclass.EdgeDetail(v, qEdgeID)
        qTail.value = x
        if (v.children != null) {
            v.children.push(new nodeclass.EdgeDetail(qTail, qEdgeID))
        } else {
            v.children = [new nodeclass.EdgeDetail(qTail, qEdgeID)]
        }
        console.warn("WAR EDGE", edges[qEdgeID])
    } else {
        //console.log("qpath is none ", qPath)
    }
    let vvv = path(v)
    if (vvv == null) {
        console.error("!!! 1")
        return ""
    }
    let tailPValue = tail(p).value
    if (tailPValue == null) {
        tailPValue = 0
    }

    let pa = concatenate(p, vvv, tailPValue, nodes, edges, paths, treeDataStructure)
    console.log("po concate - pa", pa)
    let paPath = findPath(treeDataStructure.pathRoots, pa)
    if (paPath == undefined) {
        return ""
    }
    console.log("po concate - pathaa", pa)
    if (rPath == null) {
        return paPath
    } else {
        return concatenate(paPath, rPath, y, nodes, edges, paths, treeDataStructure)
    }
}

export function expose(v: nodeclass.StructBasic, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures) {
    var [qPath, rPath, x, y] = split(v, paths, nodes, edges, treeDataStructure)

    if (qPath != null) {
        var qEdgeID = "edge" + getLastElementFromMap(edges, "edge")
        var qTail = tail(qPath)
        edges[qEdgeID] = {
            source: v.name,
            target: qTail.name,
            label: x,
            dashed: true
        }

        qTail.parent = new nodeclass.EdgeDetail(v, qEdgeID)
        qTail.value = x
        if (v.children != null) {
            v.children.push(new nodeclass.EdgeDetail(qTail, qEdgeID))
        } else {
            v.children = [new nodeclass.EdgeDetail(qTail, qEdgeID)]
        }
    }

    let pathV = path(v)
    if (pathV == null) {
        console.warn("mame chybicku")
        return
    }
    console.log(pathV, rPath)
    var p: nodeclass.Path | null
    if (rPath == null) {
        p = pathV
    } else {
        p = findPath(treeDataStructure.pathRoots, concatenate(pathV, rPath, y, nodes, edges, paths, treeDataStructure)) ?? null
    }
    if (p == null) {
        console.warn("mame chybicku")
        return
    }
    console.log("po step 2", p)

    while (tail(p).parent != null) {
        console.log("start loop:", p)
        let xx = splice(p, paths, nodes, edges, treeDataStructure)
        console.warn("vystup z splice 1 ", xx)
        if (xx instanceof nodeclass.Path) {
            p = xx
        } else {
            p = findPath(treeDataStructure.pathRoots, xx) ?? null
            if (p == null) {
                console.warn("error")
                return
            }
        }
        console.warn("vystup z splice 2 ", p)
    }

}