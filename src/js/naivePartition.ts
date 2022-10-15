import * as nodeclass from "./nodeClass"


export function path(vertex: nodeclass.NaivePartition): nodeclass.Path | null {
    if (vertex.bparent != null) {
        return path(vertex.bparent)
    }
    return vertex.root
}

export function head(p: nodeclass.Path) {
    return p.rootNaive?.bright
}

export function tail(p: nodeclass.Path) {
    return p.rootNaive?.bleft
}

export function before(vertex: nodeclass.NaivePartition) {

}

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