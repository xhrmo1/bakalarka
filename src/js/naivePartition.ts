import * as nodeclass from "./nodeClass"


export function path(vertex: nodeclass.NaivePartition): nodeclass.Path | null {
    if (vertex.bparent != null) {
        return path(vertex.bparent)
    }
    return vertex.root
}

export function head(p: nodeclass.Path) {

    if (p.rootNaive?.reversed) {
        return p.rootNaive?.bleft
    } else {
        return p.rootNaive?.bright
    }
}

export function tail(p: nodeclass.Path) {
    if (p.rootNaive?.reversed) {
        return p.rootNaive?.bright
    } else {
        return p.rootNaive?.bleft
    }
}

/*export function before(vertex: nodeclass.NaivePartition): nodeclass.NaivePartition {
    if (vertex.bleft != null) {
        if (!(vertex instanceof nodeclass.StructBasic)) {
            return before(vertex.bleft)
        }
    }
}*/

export function after(vertex: nodeclass.StructBasic) {

}

export function pcost(vertex: nodeclass.StructBasic) {

}

export function pmincost(p: nodeclass.Path) {

}

export function pupdate(p: nodeclass.Path, x: number) {

}

export function reverse(p: nodeclass.Path) {

}

export function concatenate(p: nodeclass.Path, q: any, x: number) {

}

export function split(vertex: nodeclass.StructBasic) {

}

export function splice(p: nodeclass.Path) {

}