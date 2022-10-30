import * as maintanance from "./maintanance"
import * as treeFunctions from "./treeFunctions"
import { Nodes, Edges, Paths } from "v-network-graph";
import * as nodeClass from "./nodeClass";
import * as naiveOP from "./naivePartition"

export default function firstTry(callParams: any, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures): nodeClass.TreeDataStructures {
    console.log('imported function', callParams)

    switch (callParams.code) {
        case 0: //inicializovanie stromu, vytvorenie DS
            var structBasic: nodeClass.StructBasic[] = treeFunctions.initializeTree(nodes, edges, paths, callParams)
            treeDataStructure = new nodeClass.TreeDataStructures(
                structBasic,
                maintanance.buildPaths(nodes, edges, paths, structBasic)
            )
            break;
        case 1: // pridanie uzlu -> do zoznamu uzlov
            treeFunctions.addNode(treeDataStructure, callParams.name)
            console.log('Node was added', callParams.name, treeDataStructure)
            break;
        case 2: // odobratie uzlu -> vymazat zo zoznamu uzlov, vymazat hrany, aktualizovat DS

            treeFunctions.removeNode(treeDataStructure, callParams.name, nodes, edges, paths)
            console.log('Node was removed', callParams.name, treeDataStructure)
            break;
        case 3: // pridanie hrany -> aktualizovat zoznam uzlov (pridat syna a rodica), prebehnut dotknute DS
            treeFunctions.addEdge(treeDataStructure, edges, callParams.edgeID)
            break;
        case 4: // odobratie hrany -> aktualizovat zoznam uzlov (odobrat syna a rodica), prebehnut dotknute DS
            treeFunctions.removeEdge(treeDataStructure, callParams.edgeToRemove)
            if (!callParams.edgeToRemove.dashed) {
                treeDataStructure.pathRoots = maintanance.buildPaths(nodes, edges, paths, treeDataStructure.basicRoots) // premazem z paths
            }
            break;
        case 101:
            var foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie PATH: ", naiveOP.path(foundNode), " uzol: ", callParams.nodes)
            }
            break
        case 102:
            var foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("Vystup operacie HEAD", naiveOP.head(foundPath))
            }
            break;
        case 103:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("Vystup operacie TAIL", naiveOP.tail(foundPath))
            }
            break;
        case 104:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie BEFORE: ", naiveOP.before(foundNode))
            }
            break;
        case 105:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie after: ", naiveOP.after(foundNode))
            }
            break;
        case 106:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie pcost: ", naiveOP.pcost(foundNode))
            }
            break
        case 107:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("Vystup operacie pmincost", naiveOP.pmincost(foundPath))
            }
            break
        case 108:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("Vystup operacie pupdate", naiveOP.pupdate(foundPath, callParams.values[0], edges))
            }
            break
        case 109:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("Vystup operacie reverse", naiveOP.reverse(foundPath))
            }
            break
        case 110:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            var foundPath2 = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[1])
            if (foundPath !== undefined && foundPath2 !== undefined) {
                let pathID = naiveOP.concatenate(foundPath, foundPath2, callParams.values[0], nodes, edges, paths, treeDataStructure)
                console.log("po concate, pred spojovanim", pathID, paths)
            }

            break
        case 111:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie split: ", naiveOP.split(foundNode, paths, nodes, edges, treeDataStructure))
            }
            break
        case 112:
            console.error("xxxxxx", JSON.parse(JSON.stringify(paths)))
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("xxxxxx", paths)
                console.log("Vystup operacie splice", naiveOP.splice(foundPath, paths, nodes, edges, treeDataStructure))
                console.log(paths, edges, treeDataStructure)
            }
            break
        case 113:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie expose: ", naiveOP.expose(foundNode, paths, nodes, edges, treeDataStructure))
            }
            break
        /* nad 10 zacnu operacie na cestach a stromoch */
    }

    return treeDataStructure;
}
