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
            treeDataStructure.basicRoots = treeFunctions.addNode(treeDataStructure.basicRoots, callParams.name)
            console.log('addX', treeDataStructure)
            break;
        case 2: // odobratie uzlu -> vymazat zo zoznamu uzlov, vymazat hrany, aktualizovat DS
            treeFunctions.removeNode(treeDataStructure.basicRoots, callParams.name)
            console.log('deleteX', treeDataStructure)
            break;
        case 3: // pridanie hrany -> aktualizovat zoznam uzlov (pridat syna a rodica), prebehnut dotknute DS
            treeFunctions.addEdge(treeDataStructure.basicRoots, edges, callParams.edgeID)
            break;
        case 4: // odobratie hrany -> aktualizovat zoznam uzlov (odobrat syna a rodica), prebehnut dotknute DS
            treeFunctions.removeEdge(treeDataStructure.basicRoots, callParams.edgeToRemove)
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
                let [pathID, allNodes] = naiveOP.concatenate(foundPath, foundPath2, callParams.values[0], edges, paths, treeDataStructure)
                console.log("po concate, pred spojovanim", pathID, paths)
                treeDataStructure.pathRoots.map((p) => {
                    if (p.pathID == pathID) {
                        allNodes.map((n) => { n.pathPointer = p })
                        p.allNodes = allNodes
                        p.pathRoot = maintanance.createPathStruct(nodes, edges, paths[pathID].edges, allNodes, true, 0, paths[pathID].edges.length)

                    }
                })
            }

            break
        case 111:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie split: ", naiveOP.split(foundNode, paths, nodes, edges, treeDataStructure))
            }
            for (var p in paths) {
                if (paths[p].edges.length == 0) {
                    delete paths[p]
                }
            }
            treeDataStructure.pathRoots.filter(p => p.allNodes?.length != 0)
        /* nad 10 zacnu operacie na cestach a stromoch */
    }

    return treeDataStructure;
}
