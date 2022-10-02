import * as maintanance from "./maintanance"
import * as treeFunctions from "./treeFunctions"
import { Nodes, Edges, Paths } from "v-network-graph";

export default function firstTry(callParams: any, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: any[] = []) {
    console.log('imported function')
    console.log(callParams.code)
    for (var x in nodes) {
        console.log(x, nodes[x]);
    }
    switch (callParams.code) {
        case 0: //inicializovanie stromu, vytvorenie DS
            console.log('<---code 0 -->', treeDataStructure)
            treeDataStructure.push(treeFunctions.initializeTree(nodes, edges, paths, callParams))
            treeDataStructure.push(maintanance.buildPaths(nodes, edges, paths))
            break;
        case 1: // pridanie uzlu -> do zoznamu uzlov
            treeDataStructure[0] = treeFunctions.addNode(treeDataStructure[0], callParams.name)
            console.log('addX', treeDataStructure)
            break;
        case 2: // odobratie uzlu -> vymazat zo zoznamu uzlov, vymazat hrany, aktualizovat DS
            treeDataStructure[0] = treeFunctions.removeNode(treeDataStructure[0], callParams.name)
            console.log('deleteX', treeDataStructure)
            break;
        case 3: // pridanie hrany -> aktualizovat zoznam uzlov (pridat syna a rodica), prebehnut dotknute DS
            treeDataStructure[0] = treeFunctions.addEdge(treeDataStructure[0], edges, callParams.edgeID)
            break;
        case 4: // odobratie hrany -> aktualizovat zoznam uzlov (odobrat syna a rodica), prebehnut dotknute DS
            treeDataStructure[0] = treeFunctions.removeEdge(treeDataStructure[0], callParams.edgeToRemove)
            if (!callParams.edgeToRemove.dashed) {
                treeDataStructure[1] = maintanance.buildPaths(nodes, edges, paths) // premazem z paths
            }
        /* nad 10 zacnu operacie na cestach a stromoch */
    }

    return treeDataStructure;
}
