import { AssignCustomizer } from "lodash"
import { Edges, Path, Paths } from "v-network-graph"
import { version } from "vue"
import * as nodeclass from "./nodeClass"


//naiveVersion: boolean - means we are requesting naive; otherwise size version is requested

export function path(vertex: nodeclass.StructBasic): nodeclass.Path | null {
    return vertex.pathPointer
}

export function head(p: nodeclass.Path) {
    if (p.rootNaive?.reversed) {
        return p.rootNaive?.bleft
    }
    return p.rootNaive?.bright

}

export function tail(p: nodeclass.Path) {
    if (p.rootNaive?.reversed) {
        return p.rootNaive?.bright
    }
    return p.rootNaive?.bleft

}

function goingRightDown(vertex: nodeclass.NaivePartition | nodeclass.SizePartition): nodeclass.StructBasic | null {
    if (vertex.bright instanceof nodeclass.StructBasic) {
        return vertex.bright
    }
    if (vertex.bright != null) {
        return goingRightDown(vertex.bright)
    }
    return null
}


function beforeInside(vertex: nodeclass.NaivePartition | nodeclass.SizePartition, previousNode: any): nodeclass.StructBasic | null {
    if (vertex.bparent == null) {
        return null // neexistuje before uzlu
    }

    if (vertex.bleft == previousNode) { // z laveho uzlu sme prišli
        return beforeInside(vertex.bparent, vertex)
    }
    // prišli sme z praveho uzlu
    if (vertex.bparent.bleft == null) {
        console.log("Error - beforeInside - left node does not exists")
        return null
    }
    if (vertex.bparent.bleft instanceof nodeclass.StructBasic) {
        return vertex.bparent.bleft
    }
    return goingRightDown(vertex.bparent.bleft)
}


export function before(vertex: nodeclass.StructBasic, naiveVersion: boolean): nodeclass.StructBasic | null {
    if (naiveVersion) {
        if (vertex.parentNaive != null) {
            console.log("OUTPUT - before: ", beforeInside(vertex.parentNaive, vertex))
            return beforeInside(vertex.parentNaive, vertex)
        }
        console.log("Error - before - parentNaive == null")
        return null
    }
    if (vertex.parentSize != null) {
        return beforeInside(vertex.parentSize, vertex)
    }
    console.log("Error - before - parentSize == null")
    return null
}

function goingLeftDown(vertex: nodeclass.NaivePartition | nodeclass.SizePartition): nodeclass.StructBasic | null {
    if (vertex.bleft instanceof nodeclass.StructBasic) {
        return vertex.bleft
    }
    if (vertex.bleft != null) {
        return goingLeftDown(vertex.bleft)
    }
    return null
}

function afterInside(vertex: nodeclass.NaivePartition | nodeclass.SizePartition, previousNode: any): nodeclass.StructBasic | null {
    if (vertex.bparent == null) {
        return null // neexistuje before uzlu
    }
    if (vertex.bright == previousNode) { // z praveho uzlu sme prišli
        return afterInside(vertex.bparent, vertex)
    }
    // prišli sme z praveho laveho uzlu
    if (vertex.bparent.bright == null) {
        console.log("Error - afterInside - left node does not exists")
        return null
    }
    if (vertex.bparent.bright instanceof nodeclass.StructBasic) {
        return vertex.bparent.bright
    }
    return goingLeftDown(vertex.bparent.bright)
}

export function after(vertex: nodeclass.StructBasic, naiveVersion: boolean) {
    if (naiveVersion) {
        if (vertex.parentNaive != null) {
            console.log("OUTPUT - after: ", afterInside(vertex.parentNaive, vertex))
            return afterInside(vertex.parentNaive, vertex)
        }
        console.log("Error - after - parentNaive == null")
        return null
    }
    if (vertex.parentSize != null) {
        return afterInside(vertex.parentSize, vertex)
    }
    console.log("Error - after - parentSize == null")
    return null
}

// null is returned node is tail of path
function pcostInside(vertex: nodeclass.NaivePartition | nodeclass.SizePartition, previousNode: any): number | null {
    if (vertex.bleft == previousNode) {
        return vertex.value
    }
    if (vertex.bparent == null) {
        return null // node is tail of path
    }
    return pcostInside(vertex.bparent, vertex)
}

export function pcost(vertex: nodeclass.StructBasic, naiveVersion: boolean): number | null {
    if (naiveVersion) {
        if (vertex.parentNaive != null) {
            console.log("OUTPUT - after: ", afterInside(vertex.parentNaive, vertex))
            return pcostInside(vertex.parentNaive, vertex)
        }
        console.log("Error - after - parentNaive == null")
        return null
    }
    if (vertex.parentSize != null) {
        return pcostInside(vertex.parentSize, vertex)
    }
    console.log("Error - after - parentSize == null")
    return null
}

function pmincostInside(vertex: nodeclass.NaivePartition | nodeclass.SizePartition): nodeclass.StructBasic | null {
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
    let left = vertex.bleft instanceof nodeclass.NaivePartition && vertex.bleft.netcost != null ? vertex.bleft.netcost : Infinity
    let right = vertex.bright instanceof nodeclass.NaivePartition && vertex.bright.netcost != null ? vertex.bright.netcost : Infinity
    if (right <= left) {
        if (vertex.bright == null || vertex.bright instanceof nodeclass.StructBasic) {
            console.log("Error - pmincostInside - vertex.bright == null")
            return null
        }
        return pmincostInside(vertex.bright)
    } else {
        if (vertex.bleft == null || vertex.bleft instanceof nodeclass.StructBasic) {
            console.log("Error - pmincostInside - vertex.bleft2 == null")
            return null
        }
        return pmincostInside(vertex.bleft)
    }
}

export function pmincost(p: nodeclass.Path, naiveVersion: boolean) {
    if (naiveVersion) {
        if (p.rootNaive != null) {
            return pmincostInside(p.rootNaive)
        }
        console.log("Error - after - parentNaive == null")
        return null
    }
    if (p.rootSize != null) {
        return pmincostInside(p.rootSize)

    }
    console.log("Error - after - parentSize == null")
    return null
}

function pupdateVertex(vertex: nodeclass.NaivePartition | nodeclass.SizePartition, x: number) {
    vertex.value += x
    if (vertex.bleft instanceof nodeclass.NaivePartition || vertex.bleft instanceof nodeclass.SizePartition) {
        pupdateVertex(vertex.bleft, x)
    }
    if (vertex.bright instanceof nodeclass.NaivePartition || vertex.bright instanceof nodeclass.SizePartition) {
        pupdateVertex(vertex.bright, x)
    }
}

// robim to pre obe štruktury naive/size
export function pupdate(p: nodeclass.Path, x: number, edges: Edges) {
    //uprava v tabulke
    for (var e in edges) {
        edges[e].label = edges[e].label + x
    }

    //uprava naive
    if (p.rootNaive == null) {
        console.error("p.rootNaive is null")
        return
    }
    p.rootNaive.netmin += x
    pupdateVertex(p.rootNaive, x)

    //uprava size
    if (p.rootSize == null) {
        console.log("p.rootSize is null")
        return
    }
    p.rootSize.netmin += x
    pupdateVertex(p.rootSize, x)


}

// robim to pre obe štruktury naive/size
function reverseInside(vertex: nodeclass.NaivePartition | nodeclass.SizePartition) {
    vertex.reversed = !vertex.reversed
    if (vertex.bleft instanceof nodeclass.NaivePartition || vertex.bleft instanceof nodeclass.SizePartition) {
        reverseInside(vertex.bleft)
    }
    if (vertex.bright instanceof nodeclass.NaivePartition || vertex.bright instanceof nodeclass.SizePartition) {
        reverseInside(vertex.bright)
    }
}

export function reverse(p: nodeclass.Path) {
    //uprava naive
    if (p.rootNaive == null) {
        console.error("p.rootNaive is null")
        return
    }
    reverseInside(p.rootNaive)

    //uprava size
    if (p.rootSize == null) {
        console.log("p.rootSize is null")
        return
    }
    reverseInside(p.rootSize)
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
    if (vertex.parentNaive == null) {
        console.error("this edge has no parentNaive", vertex)
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