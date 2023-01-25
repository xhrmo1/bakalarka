import { Edges, Nodes, Paths } from "v-network-graph"
import * as naiveOP from "./naivePartition"
import * as nodeClass from "./nodeClass"
import { findSuccessor, findAncestor, findPath, addDashedEdge, getWeightPath } from "./treeFunctions"

export function light(path: nodeClass.Path): nodeClass.StructBasic | null {
    if (path.pathRoot == null) {
        return null
    }
    return findLightEdge(path.pathRoot)
}

export function findLightEdge(path: nodeClass.PathStructure): nodeClass.StructBasic | null {
    let rightLight: nodeClass.StructBasic | null = null, leftLight: nodeClass.StructBasic | null = null
    if (path.bright instanceof nodeClass.PathStructure) {
        rightLight = findLightEdge(path.bright)
        if (rightLight != null) {
            return rightLight
        }
    }

    let ancestor = findAncestor(path)
    let succesor = findSuccessor(path)
    if (ancestor.size * 2 > succesor.size) {
        return succesor
    }
    if (path.bleft instanceof nodeClass.PathStructure) {
        leftLight = findLightEdge(path.bleft)
        if (leftLight != null) {
            return leftLight
        }
    }
    return null
}

export function maxwt(v: nodeClass.StructBasic): [nodeClass.Path | null, number] {
    if (v.children == null) {
        return [null, 0]
    }
    var maxWTNode: nodeClass.Path | null = null, maxWTValue: number = 0
    for (let e of v.children) {
        if (e.target.pathPointer?.pathRoot?.weight != null) {
            if (e.target.pathPointer?.pathRoot?.weight > maxWTValue) {
                maxWTValue = e.target.pathPointer?.pathRoot?.weight
                maxWTNode = e.target.pathPointer
            }
        } else if (e.target.pathPointer != null) {
            if (e.target.weight > maxWTValue) {
                maxWTValue = e.target.weight
                maxWTNode = e.target.pathPointer
            }
        }
    }
    return [maxWTNode, 0]
}

export function slice(p: nodeClass.Path | null, sizeStruct: boolean, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures) {
    var v: nodeClass.StructBasic | null
    var r: nodeClass.Path | null, s: nodeClass.Path | undefined
    var x: number, y: number

    if (p == null) {
        console.error("Slice, p.pathRoot is null")
        return null
    }
    v = light(p)
    if (v == null) {
        console.warn("Slice, p.pathRoot is null")
        return null
    }

    [p, r, x, y] = naiveOP.split(v, sizeStruct, paths, nodes, edges, treeDataStructure)
    if (p == null) {
        console.warn("p is null")
        return null
    }

    let pathP = naiveOP.path(v)
    if (pathP == null) {
        console.error("Slice, p.pathRoot is null")
        return null
    }
    if (r == null) {
        s = pathP
    } else {
        let sa = naiveOP.concatenate(pathP, r, y, sizeStruct, nodes, edges, paths, treeDataStructure)
        s = findPath(treeDataStructure.pathRoots, sa)
        if (s == undefined) {
            return null
        }
    }
    addDashedEdge(v, naiveOP.tail(p), x, edges, treeDataStructure)
    v.weight = v.weight + getWeightPath(p)
    var [q, qValue] = maxwt(v)
    if (q != null) {
        if (2 * qValue > v.weight) {
            v.weight = v.weight - getWeightPath(q)
            let qValue = naiveOP.tail(q).value
            if (qValue == null) {
                console.error("QVALUE is null")
                qValue = 0
            }
            naiveOP.concatenate(q, s, qValue, sizeStruct, nodes, edges, paths, treeDataStructure)
        }
    }
    return p
}

export function conceal(path: nodeClass.Path | null, sizeStruct: boolean, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures) {
    if (path == null) {
        console.error("Conceal, path is null")
        return null
    }
    while (light(path) != null) {
        path = slice(path, sizeStruct, nodes, edges, paths, treeDataStructure)
        if (!(path instanceof nodeClass.Path)) {
            break
        }
    }
    if (path == null) {
        console.error("Conceal, path is null")
        return null
    }
    let v = naiveOP.head(path)
    let [s, sValue] = maxwt(v)
    if (s != null && 2 * sValue > v.weight) {
        let [q, r, x, y] = naiveOP.split(v, sizeStruct, paths, nodes, edges, treeDataStructure)
        v.weight = v.weight - sValue
        let sVal = naiveOP.tail(s).value
        if (sVal == null) {
            console.error("QVALUE is null")
            sVal = 0
        }
        let vPath = naiveOP.path(v)
        if (vPath == null) {
            console.error("Conceal, vPath is null")
            return null
        }
        let sName = naiveOP.concatenate(s, vPath, sVal, sizeStruct, nodes, edges, paths, treeDataStructure)
        let sPath = findPath(treeDataStructure.pathRoots, sName)
        if (sPath == undefined) {
            return ""
        }
        if (r != null) {
            naiveOP.concatenate(s, r, y, sizeStruct, nodes, edges, paths, treeDataStructure)
        }
    }
}

export function concealOnVertex(vertex: nodeClass.StructBasic, sizeStruct: boolean, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures) {
    let path = naiveOP.path(vertex)
    if (path != null) {
        conceal(path, sizeStruct, nodes, edges, paths, treeDataStructure)
    }
}