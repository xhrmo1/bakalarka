import * as maintanance from "./maintanance.js"

export default function firstTry(callParams, nodes, edges, paths, treeDataStructure = []) {
    console.log('imported function')
    console.log(callParams)
    for (var x in nodes) {
        console.log(x, nodes[x]);
    }
    switch (callParams.code) {
        case 0: //inicializovanie stromu, vytvorenie DS
            console.log('<---code 0 -->', treeDataStructure)
            treeDataStructure.push(maintanance.initializeTree(nodes, edges, paths, callParams))
            treeDataStructure.push(maintanance.buildPaths(nodes, edges, paths))
            break;
        case 1: // pridanie uzlu -> do zoznamu uzlov
            treeDataStructure[0] = maintanance.addNode(treeDataStructure[0], callParams.name)
            console.log('addX', treeDataStructure)
            break;
        case 2: // odobratie uzlu -> vymazat zo zoznamu uzlov, vymazat hrany, aktualizovat DS
            treeDataStructure[0] = maintanance.removeNode(treeDataStructure[0], callParams.name)
            console.log('deleteX', treeDataStructure)
            break;
        case 3: // pridanie hrany -> aktualizovat zoznam uzlov (pridat syna a rodica), prebehnut dotknute DS
        case 4: // odobratie hrany -> aktualizovat zoznam uzlov (odobrat syna a rodica), prebehnut dotknute DS

        /* nad 10 zacnu operacie na cestach a stromoch */
    }

    return treeDataStructure;
}
