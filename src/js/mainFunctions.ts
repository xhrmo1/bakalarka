import * as maintanance from "./maintanance"
import * as treeFunctions from "./treeFunctions"
import { Nodes, Edges, Paths } from "v-network-graph";
import * as nodeClass from "./nodeClass";

export default function firstTry(callParams: any, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures): nodeClass.TreeDataStructures {
    console.log('imported function')
    console.log(callParams.code)
    for (var x in nodes) {
        console.log(x, nodes[x]);
    }

    switch (callParams.code) {
        case 0: //inicializovanie stromu, vytvorenie DS
            treeDataStructure = new nodeClass.TreeDataStructures(
                treeFunctions.initializeTree(nodes, edges, paths, callParams),
                maintanance.buildPaths(nodes, edges, paths)
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
                treeDataStructure.pathRoots = maintanance.buildPaths(nodes, edges, paths) // premazem z paths
            }
        /* nad 10 zacnu operacie na cestach a stromoch */
    }

    return treeDataStructure;
}
