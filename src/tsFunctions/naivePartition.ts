import { Edges, Nodes, Path, Paths } from "v-network-graph"
import * as nodeclass from "./nodeClass"
import * as treeFunctions from "./treeFunctions"
import * as maintanance from "./maintanance"
import data from "../components/data";

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

export function goingRightDown(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.bright instanceof nodeclass.StructBasic) {
        return vertex.bright
    }
    if (vertex.bright != null) {
        return goingRightDown(vertex.bright)
    }
    return vertex.bleft instanceof nodeclass.StructBasic ? vertex.bleft : null
}


function goingUpLeft(vertex: nodeclass.PathStructure, previousNode: any): nodeclass.StructBasic | null {
    // z laveho uzlu sme prišli
    if (vertex.bleft == previousNode) {
        if (vertex.pParent == null) {
            return null
        }
        return goingUpLeft(vertex.pParent, vertex)
    }
    // prišli sme z praveho uzlu
    if (vertex.bleft == null) {
        return null
    }
    if (vertex.bleft instanceof nodeclass.StructBasic) {
        return vertex.bleft
    }
    return goingRightDown(vertex.bleft)
}

export function before(vertex: nodeclass.StructBasic) {
    if (vertex.pParent != null && !vertex.pParent.reversed) {
        return beforeSearch(vertex)
    }
    return afterSearch(vertex)
}


export function beforeSearch(vertex: nodeclass.StructBasic): nodeclass.StructBasic | null {
    if (vertex.pParent != null) {
        if (vertex.pParent.bleft instanceof nodeclass.StructBasic && vertex.pParent.bleft != vertex) {
            return vertex.pParent.bleft
        }
        return goingUpLeft(vertex.pParent, vertex)
    }
    //console.log("Error - before - pParent == null")
    return null
}

export function goingLeftDown(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.bleft instanceof nodeclass.StructBasic) {
        return vertex.bleft
    }
    if (vertex.bleft != null) {
        return goingLeftDown(vertex.bleft)
    }
    return null
}

function goingUpRight(vertex: nodeclass.PathStructure, previousNode: any): nodeclass.StructBasic | null {
    if (vertex.bright == previousNode) {
        if (vertex.pParent == null) {
            return null
        }
        return goingUpRight(vertex.pParent, vertex)
    }
    if (vertex.bright == null) {
        return null
    }
    if (vertex.bright instanceof nodeclass.StructBasic) {
        return vertex.bright
    }
    return goingLeftDown(vertex.bright)
}

export function after(vertex: nodeclass.StructBasic) {
    if (vertex.pParent != null && !vertex.pParent.reversed) {
        return afterSearch(vertex)
    }
    return beforeSearch(vertex)
}

export function afterSearch(vertex: nodeclass.StructBasic) {
    if (vertex.pParent != null) {
        if (vertex.pParent.bright instanceof nodeclass.StructBasic && vertex.pParent.bright != vertex) {
            return vertex.pParent.bright
        }
        return goingUpRight(vertex.pParent, vertex)
    }
    //console.log("Error - after - pParent == null")
    return null
}

// null is returned node is tail of path
function pcostInside(vertex: nodeclass.PathStructure, previousNode: any): number | null {
    if (vertex.bleft == previousNode) {
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
    return null
}

function pmincostInside(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.netcost == 0 && vertex.netmin == 0) {
        if (vertex.bleft instanceof nodeclass.StructBasic) {
            return vertex.bleft
        }
        if (vertex.bleft == null) {
            console.log("Error - pmincostInside - vertex.bleft == null")
            return null
        }
        return goingRightDown(vertex.bleft)
    }
    let left = vertex.bleft instanceof nodeclass.PathStructure && vertex.bleft.netcost != null ? vertex.bleft.netcost : Infinity
    let right = vertex.bright instanceof nodeclass.PathStructure && vertex.bright.netcost != null ? vertex.bright.netcost : Infinity
    if (right <= left) {
        if (vertex.bright == null || vertex.bright instanceof nodeclass.StructBasic) {
            console.log("Error - pmincostInside - vertex.bright == null")
            return null
        }
        return pmincostInside(vertex.bright)
    } else {
        if (vertex.bleft == null || vertex.bleft instanceof nodeclass.StructBasic) {
            console.log("Error - pmincostInside - vertex.pleft2 == null")
            return null
        }
        return pmincostInside(vertex.bleft)
    }
}
export function pmincost(p: nodeclass.Path) {
    if (p.pathRoot != null) {
        return pmincostInside(p.pathRoot)
    }
    return null
}

function pupdateVertex(vertex: nodeclass.PathStructure, x: number) {
    vertex.value += x
    if (vertex.bleft instanceof nodeclass.PathStructure) {
        pupdateVertex(vertex.bleft, x)
    }
    if (vertex.bright instanceof nodeclass.PathStructure) {
        pupdateVertex(vertex.bright, x)
    }
}

export function pupdate(p: nodeclass.Path, x: number, edges: Edges) {
    var tailVertex = tail(p)
    var currentNode = head(p)

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
}

function reverseInside(vertex: nodeclass.PathStructure) {
    vertex.reversed = !vertex.reversed
    if (vertex.bleft instanceof nodeclass.PathStructure) {
        reverseInside(vertex.bleft)
    }
    if (vertex.bright instanceof nodeclass.PathStructure) {
        reverseInside(vertex.bright)
    }
}

export function reverse(p: nodeclass.Path) {
    if (p.pathRoot == null) {
        console.error("p.pathRoot is null")
        return
    }
    if (p.allNodes != null) {
        p.allNodes = p.allNodes.reverse()
    }
    reverseInside(p.pathRoot)
}

export function concatenate(p: nodeclass.Path, q: nodeclass.Path, x: number, sizeStruct: boolean, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeclass.TreeDataStructures): string {
    let tailVertex = tail(p)
    let headVertex = head(q)
    var edgeID = ""
    if (tailVertex.parent == null) {
        edgeID = treeFunctions.addDashedEdge(headVertex, tailVertex, x, edges, treeDataStructure)
        edges[edgeID].dashed = false
    } else {
        edgeID = tailVertex.parent.edgeID
        edges[edgeID].dashed = false
    }

    // tu budeme rebuild cesty
    let pathDominant = path(tailVertex)
    let pathSubmisive = path(headVertex)
    if (pathDominant == null || pathSubmisive == null) {
        console.error("pathDominant or pathSubmisive is null", q, p, pathDominant, pathSubmisive, headVertex, tailVertex)
        return ""
    }

    //pathDominant.allNodes?.concat(pathSubmisive.allNodes != null ? pathSubmisive.allNodes : []) // spojenie poli
    var idFinal: string
    var edgesFinal: string[]
    edgesFinal = []
    var submisiveID = pathSubmisive.pathID != null ? pathSubmisive.pathID : ""
    idFinal = pathDominant.pathID  // nikdy by to nemalo byt ""
    if (paths[idFinal] != null) {
        edgesFinal = edgesFinal.concat(paths[idFinal].edges)
        data.colors.push(paths[idFinal].color)
        delete paths[idFinal]
    }
    treeDataStructure.pathRoots = treeDataStructure.pathRoots.filter(p => p.pathID != idFinal)

    edgesFinal.push(edgeID)
    if (paths[submisiveID] != null) {
        edgesFinal = edgesFinal.concat(paths[submisiveID].edges)
        data.colors.push(paths[submisiveID].color)
        delete paths[submisiveID]
    }
    treeDataStructure.pathRoots = treeDataStructure.pathRoots.filter(p => p.pathID != submisiveID)
    idFinal = getNextNumberForPath(treeDataStructure)
    paths[idFinal] = {
        id: idFinal,
        edges: edgesFinal,
        color: data.colors.pop(),
        canSee: true,
        mouseOver: false,
        width: 45,
    };
    var allNodes: nodeclass.StructBasic[] = []
    if (pathDominant.allNodes != null && pathSubmisive.allNodes != null) {
        allNodes = pathDominant.allNodes.concat(pathSubmisive.allNodes)
    }
    treeDataStructure.pathRoots.push(new nodeclass.Path(idFinal, allNodes, null, idFinal))
    treeDataStructure.pathRoots.forEach((p) => {
        if (p.pathID == idFinal) {
            allNodes.map((n) => { n.pathPointer = p })
            p.allNodes = allNodes
            p.pathRoot = maintanance.createPathStruct(nodes, edges, paths[idFinal].edges, allNodes, true, 0, paths[idFinal].edges.length)
            maintanance.setPropertiesForPath(p, sizeStruct)
        }
    })

    return idFinal
}

//funguje iba na path operaciach, cize vrati rodica iba v pripade ze rodic existuje na rovnakej path
export function split(vertex: nodeclass.StructBasic, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): [nodeclass.Path | null, nodeclass.Path | null, number, number] {
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
        var nodesBefore: string[] = []
        if (parentVertexID != "") {
            let index = paths[vertex.pathPointer.pathID].edges.indexOf(parentVertexID)
            nodesBefore = paths[vertex.pathPointer.pathID].edges.slice(0, index == -1 ? paths[vertex.pathPointer.pathID].edges.length - 1 : index - 1)
        } else {
            nodesBefore = paths[vertex.pathPointer.pathID].edges.slice(0, paths[vertex.pathPointer.pathID].edges.length - 1)
        }
        paths[pIDPath] = {
            id: pIDPath,
            edges: nodesBefore,
            color: data.colors.pop(),
            canSee: true,
            mouseOver: false,
            width: 45,
        }
        var allNodesBefore = vertex.pathPointer.allNodes?.slice(0, vertex.pathPointer.allNodes.indexOf(beforeVertex) + 1) ?? []
        if (allNodesBefore.length == 1) {
            beforeVertex.pParent = null
        }
        pPathPointer = new nodeclass.Path(pIDPath, allNodesBefore, maintanance.createPathStruct(nodes, edges, paths[pIDPath].edges, allNodesBefore, true, 0, paths[pIDPath].edges.length), pIDPath)
        allNodesBefore.forEach(n => {
            n.pathPointer = pPathPointer
        })
        treeDataStructure.pathRoots.push(pPathPointer)
        treeDataStructure.basicRoots.push(beforeVertex)
        vertex.children = vertex.children.filter(e => e.target != beforeVertex)
        beforeVertex.parent = null

        vertex.size = vertex.size - beforeVertex.size
    }

    if (afterVertex != null) {
        qIDPath = getNextNumberForPath(treeDataStructure)
        paths[qIDPath] = {
            id: qIDPath,
            edges: paths[vertex.pathPointer.pathID].edges.slice(paths[vertex.pathPointer.pathID].edges.indexOf(parentVertexID) + 1),
            color: data.colors.pop(),
            canSee: true,
            mouseOver: false,
            width: 45,
        }
        x = edges[vertex.parent?.edgeID != null ? vertex.parent.edgeID : ""].label
        delete edges[vertex.parent?.edgeID != null ? vertex.parent.edgeID : ""]
        var allNodesAfter = vertex.pathPointer.allNodes?.slice(vertex.pathPointer.allNodes.indexOf(afterVertex)) ?? []
        if (allNodesAfter.length == 1) {
            afterVertex.pParent == null
        }
        qPathPointer = new nodeclass.Path(qIDPath, allNodesAfter, maintanance.createPathStruct(nodes, edges, paths[qIDPath].edges, allNodesAfter, true, 0, paths[qIDPath].edges.length), qIDPath)
        treeDataStructure.pathRoots.push(qPathPointer)
        allNodesAfter.forEach(n => {
            n.pathPointer = qPathPointer
        })
        vertex.parent = null
        afterVertex.children = afterVertex.children?.filter(e => e.target != vertex) ?? null
        treeFunctions.substituteSize(afterVertex, vertex.size + (beforeVertex?.size ?? 0))
    }

    if (paths[vertex.pathPointer.pathID] != undefined) {
        data.colors.push(paths[vertex.pathPointer.pathID].color)
    }
    console.log("compare", vertex.pathPointer.pathID, pIDPath)
    delete paths[vertex.pathPointer.pathID]
    vertex.pathPointer.allNodes = [vertex]
    vertex.pParent = null // ak aspon jeden bol
    if (vertex.parent == null) {
        treeDataStructure.basicRoots.push(vertex)
    }
    console.log("SPLIT", treeDataStructure.pathRoots)

    //nastavovanie size
    for (var pathID in paths) {
        if (paths[pathID].edges.length == 0) {
            data.colors.push(paths[pathID].color)
            delete paths[pathID]
        }
    }
    treeDataStructure.pathRoots.map(p => {
        if (p.allNodes?.length == 1) {
            p.pathRoot = null
        }
    })
    maintanance.setPropertiesForPath(pPathPointer, sizeStruct)
    maintanance.setPropertiesForPath(qPathPointer, sizeStruct)
    maintanance.setPropertiesForPath(vertex.pathPointer, sizeStruct)
    return [pPathPointer, qPathPointer, y, x]
}

export function getNextNumberForPath(treeDataStructure: nodeclass.TreeDataStructures): string {
    if (treeDataStructure.pathRoots.length == 0) {
        return "path" + 1
    }
    var xx = treeDataStructure.pathRoots[treeDataStructure.pathRoots.length - 1].pathID?.replace("path", "")
    if (xx != undefined) {
        xx = "path" + (Number(xx) + 2)
    } else {
        xx = "path1"
    }
    return xx
}

export function splice(p: nodeclass.Path, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): string | nodeclass.Path {
    var v = tail(p)
    if (v.parent == null) {
        return ""
    }
    v = v.parent.target
    var [qPath, rPath, x, y] = split(v, sizeStruct, paths, nodes, edges, treeDataStructure)

    v.weight = v.weight - treeFunctions.getWeightPath(p)
    console.log(qPath, rPath)
    if (qPath != null) { // spravit z toho novu funkciu
        var qTail = tail(qPath)
        treeFunctions.addDashedEdge(v, qTail, x, edges, treeDataStructure)
        v.weight = v.weight + treeFunctions.getWeightPath(qPath)
    } else {
        //console.log("qpath is none ", qPath)
    }
    let vvv = path(v)
    if (vvv == null) {
        return ""
    }
    let tailPValue = tail(p).value
    if (tailPValue == null) {
        tailPValue = 0
    }

    let pa = concatenate(p, vvv, tailPValue, sizeStruct, nodes, edges, paths, treeDataStructure)
    let paPath = treeFunctions.findPath(treeDataStructure.pathRoots, pa)
    if (paPath == undefined) {
        return ""
    }
    if (rPath == null) {
        maintanance.setPropertiesForPath(paPath, sizeStruct)
        return paPath
    } else {
        return concatenate(paPath, rPath, y, sizeStruct, nodes, edges, paths, treeDataStructure)
    }
}

export function expose(v: nodeclass.StructBasic, sizeStruct: boolean, paths: Paths, nodes: Nodes, edges: Edges, treeDataStructure: nodeclass.TreeDataStructures): nodeclass.Path | undefined {
    var [qPath, rPath, x, y] = split(v, sizeStruct, paths, nodes, edges, treeDataStructure)

    if (qPath != null) {
        var qTail = tail(qPath)
        treeFunctions.addDashedEdge(v, qTail, x, edges, treeDataStructure)
        v.weight = v.weight + treeFunctions.getWeightPath(qPath)
    }

    let pathV = path(v)
    if (pathV == null) {
        return
    }
    console.log(pathV, rPath)
    var p: nodeclass.Path | null
    if (rPath == null) {
        p = pathV
    } else {
        p = treeFunctions.findPath(treeDataStructure.pathRoots, concatenate(pathV, rPath, y, sizeStruct, nodes, edges, paths, treeDataStructure)) ?? null
    }
    if (p == null) {
        console.warn("mame chybicku")
        return
    }

    while (tail(p).parent != null) {
        let xx = splice(p, sizeStruct, paths, nodes, edges, treeDataStructure)
        if (xx instanceof nodeclass.Path) {
            p = xx
        } else {
            p = treeFunctions.findPath(treeDataStructure.pathRoots, xx) ?? null
            if (p == null) {
                return
            }
        }
    }
    maintanance.setPropertiesForPath(p, sizeStruct)
    return p
}