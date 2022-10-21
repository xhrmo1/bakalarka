import { AssignCustomizer } from "lodash"
import { Edges, Path, Paths } from "v-network-graph"
import { version } from "vue"
import * as nodeclass from "./nodeClass"


//naiveVersion: boolean - means we are requesting naive; otherwise size version is requested

export function path(vertex: nodeclass.StructBasic): nodeclass.Path | null {
    return vertex.pathPointer
}

export function head(p: nodeclass.Path) {
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.pleft
    }
    return p.pathRoot?.pright

}

export function tail(p: nodeclass.Path) {
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.pright
    }
    return p.pathRoot?.pleft

}

function goingRightDown(vertex: nodeclass.PathStructure): nodeclass.StructBasic | null {
    if (vertex.pright instanceof nodeclass.StructBasic) {
        return vertex.pright
    }
    if (vertex.pright != null) {
        return goingRightDown(vertex.pright)
    }
    return null
}


function beforeInside(vertex: nodeclass.PathStructure, previousNode: any): nodeclass.StructBasic | null {
    if (vertex.pParent == null) {
        return null // neexistuje before uzlu
    }

    if (vertex.pleft == previousNode) { // z laveho uzlu sme prišli
        return beforeInside(vertex.pParent, vertex)
    }
    // prišli sme z praveho uzlu
    if (vertex.pParent.pleft == null) {
        console.log("Error - beforeInside - left node does not exists")
        return null
    }
    if (vertex.pParent.pleft instanceof nodeclass.StructBasic) {
        return vertex.pParent.pleft
    }
    return goingRightDown(vertex.pParent.pleft)
}


export function before(vertex: nodeclass.StructBasic, naiveVersion: boolean): nodeclass.StructBasic | null {
    if (naiveVersion) {
        if (vertex.pParent != null) {
            console.log("OUTPUT - before: ", beforeInside(vertex.pParent, vertex))
            return beforeInside(vertex.pParent, vertex)
        }
        console.log("Error - before - pParent == null")
        return null
    }

    console.log("Error - before - parentSize == null")
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

function afterInside(vertex: nodeclass.PathStructure, previousNode: any): nodeclass.StructBasic | null {
    if (vertex.pParent == null) {
        return null // neexistuje before uzlu
    }
    if (vertex.pright == previousNode) { // z praveho uzlu sme prišli
        return afterInside(vertex.pParent, vertex)
    }
    // prišli sme z praveho laveho uzlu
    if (vertex.pParent.pright == null) {
        console.log("Error - afterInside - left node does not exists")
        return null
    }
    if (vertex.pParent.pright instanceof nodeclass.StructBasic) {
        return vertex.pParent.pright
    }
    return goingLeftDown(vertex.pParent.pright)
}

export function after(vertex: nodeclass.StructBasic, naiveVersion: boolean) {
    if (naiveVersion) {
        if (vertex.pParent != null) {
            console.log("OUTPUT - after: ", afterInside(vertex.pParent, vertex))
            return afterInside(vertex.pParent, vertex)
        }
        console.log("Error - after - pParent == null")
        return null
    }

    console.log("Error - after - parentSize == null")
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

export function pcost(vertex: nodeclass.StructBasic, naiveVersion: boolean): number | null {
    if (naiveVersion) {
        if (vertex.pParent != null) {
            console.log("OUTPUT - after: ", afterInside(vertex.pParent, vertex))
            return pcostInside(vertex.pParent, vertex)
        }
        console.log("Error - after - pParent == null")
        return null
    }

    console.log("Error - after - parentSize == null")
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

export function pmincost(p: nodeclass.Path, naiveVersion: boolean) {
    if (naiveVersion) {
        if (p.pathRoot != null) {
            return pmincostInside(p.pathRoot)
        }
        console.log("Error - after - pParent == null")
        return null
    }
    console.log("Error - after - parentSize == null")
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
    //uprava v tabulke
    for (var e in edges) {
        edges[e].label = edges[e].label + x
    }

    //uprava naive
    if (p.pathRoot == null) {
        console.error("p.pathRoot is null")
        return
    }
    p.pathRoot.netmin += x
    pupdateVertex(p.pathRoot, x)
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

export function concatenate(p: nodeclass.Path, q: nodeclass.Path, x: number, edges: Edges, paths: Paths): Paths | undefined {

    let headVertex = head(q)
    if (!(headVertex instanceof nodeclass.StructBasic)) {
        console.error("Output of head is not StructBasic 1")
        return
    }

    let tailVertex = tail(p)
    if (!(tailVertex instanceof nodeclass.StructBasic)) {
        console.error("Output of tail is not StructBasic 1")
        return
    }
    if (tailVertex.parent != null && tailVertex.parent.target != headVertex) {
        console.log("Error - tailVertex " + tailVertex + " has parent ---")
    }
    edges["edge" + edges.length + 1] = {
        source: headVertex.name != null ? headVertex.name : "",
        target: tailVertex.name != null ? tailVertex.name : "",
        label: x,
        dashed: false
    }

    // tu budeme rebuild cesty
    let pathDominant = path(headVertex)
    let pathSubmisive = path(tailVertex)

    if (pathDominant == null || pathSubmisive == null) {
        console.error("pathDominant or pathSubmisive is null", pathDominant, pathSubmisive)
        return
    }

    pathDominant.allNodes?.concat(pathSubmisive.allNodes != null ? pathSubmisive.allNodes : []) // spojenie poli
    let idFinal, edgesFinal, colorFInal: any
    edgesFinal = ["edge" + edges.length]
    if (pathSubmisive.pathID == null) {
        pathSubmisive.pathID != null ? delete paths[pathSubmisive.pathID] : null
    } else {
        edgesFinal.concat(paths[pathSubmisive.pathID].edges)
    }
    // bud prepisujem alebo spojujem hodnoty
    if (pathDominant.pathID == null) {
        pathDominant.pathID = pathSubmisive.pathID == null ? "path" + paths.length : pathSubmisive.pathID
    } else {
        edgesFinal.concat(paths[pathDominant.pathID].edges)
    }
    idFinal = pathDominant.pathID
    paths[pathDominant.pathID] = {
        id: idFinal,
        edges: edgesFinal,
        color: "#d55040cc", // todo doeditovat
        canSee: true,
        mouseOver: false,
        width: 45,
    };

    return paths
}

//funguje iba na path operaciach, cize vrati rodica iba v pripade ze rodic existuje na rovnakej path
export function split(vertex: nodeclass.StructBasic, paths: Path) {
    var p, q, x, y, vertexIndex
    if (vertex.pParent == null) {
        console.error("this edge has no pParent", vertex)
        return
    }

    var pathID
    if (vertex.pathPointer?.allNodes?.length != 1) {
        vertexIndex = vertex.pathPointer?.allNodes?.findIndex(x => x.name == vertex.name)
        paths.map((rank: any, i: any, paths: any) => {
            if (i + 1 === paths.length) {
                console.log("--Getting last element from array--", rank, i, paths)
                pathID = rank.replace('path', '')
                pathID = +pathID + 1
                console.log(paths.length, pathID)
            }
        })
    }





}



export function splice(p: nodeclass.Path) {

}

export function expose(p: nodeclass.Path) {

}