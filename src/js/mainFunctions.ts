import * as maintanance from "./maintanance"
import * as treeFunctions from "./treeFunctions"
import { Nodes, Edges, Paths } from "v-network-graph";
import * as nodeClass from "./nodeClass";
import * as naiveOP from "./naivePartition"

class FunctionMessage {
    functionName: string
    text: string
    constructor(functionName: string, text: string) {
        this.functionName = functionName
        this.text = text
    }
}

export default function firstTry(callParams: any, sizeStruct: boolean, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures): [nodeClass.TreeDataStructures, any] {
    console.log('imported function', callParams)
    var functionMessage: FunctionMessage = new FunctionMessage("", "")
    var output: any // na uchovanie outputu a nasledneho vypisania v sprave
    switch (callParams.code) {
        case 0: //inicializovanie stromu, vytvorenie DS
            var structBasic: nodeClass.StructBasic[] = treeFunctions.initializeTree(nodes, edges, paths, callParams)
            treeDataStructure = new nodeClass.TreeDataStructures(
                structBasic,
                maintanance.buildPaths(nodes, edges, paths, structBasic, sizeStruct)
            )
            break;
        case 1: // pridanie uzlu -> do zoznamu uzlov
            treeFunctions.addNode(treeDataStructure, callParams.name)
            console.log('Node was added', callParams.name, treeDataStructure)
            break;
        case 2: // odobratie uzlu -> vymazat zo zoznamu uzlov, vymazat hrany, aktualizovat DS

            treeFunctions.removeNode(treeDataStructure, callParams.name, sizeStruct, nodes, edges, paths)
            console.log('Node was removed', callParams.name, treeDataStructure)
            break;
        case 3: // pridanie hrany -> aktualizovat zoznam uzlov (pridat syna a rodica), prebehnut dotknute DS
            treeFunctions.addEdge(treeDataStructure, edges, callParams.edgeID)
            break;
        case 4: // odobratie hrany -> aktualizovat zoznam uzlov (odobrat syna a rodica), prebehnut dotknute DS
            treeFunctions.removeEdge(treeDataStructure, callParams.edgeToRemove)
            treeDataStructure.pathRoots = maintanance.buildPaths(nodes, edges, paths, treeDataStructure.basicRoots, sizeStruct) // premazem z paths

            break;
        case 101:
            var foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.path(foundNode)
            }
            functionMessage.functionName = "Path"
            functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je cesta s ID: <b>' + output.pathID + '</b>'
            break
        case 102:
            var foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                output = naiveOP.head(foundPath)
            }
            functionMessage.functionName = "Head"
            functionMessage.text = 'Operacia bola spustena na ceste p: <b>' + callParams.paths[0] + '</b>. Výsledkom operácie je uzol s ID: <b>' + output.name + '</b>'
            break;
        case 103:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                output = naiveOP.tail(foundPath)
            }
            functionMessage.functionName = "Tail"
            functionMessage.text = 'Operacia bola spustena na ceste p: <b>' + callParams.paths[0] + '</b>. Výsledkom operácie je uzol s ID: <b>' + output.name + '</b>'
            break;
        case 104:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.before(foundNode)
            }
            functionMessage.functionName = "Before"
            functionMessage.text = 'Operacia bola spustena na uzle x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je uzol s ID: <b>' + output.name + '</b>'
            break;
        case 105:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.after(foundNode)
            }
            functionMessage.functionName = "After"
            functionMessage.text = 'Operacia bola spustena na uzle x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je uzol s ID: <b>' + output.name + '</b>'
            break;
        case 106:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.pcost(foundNode)
            }
            functionMessage.functionName = "PCost"
            functionMessage.text = 'Operacia bola spustena na uzle x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je hodnota: <b>' + output + '</b>'
            break
        case 107:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                output = naiveOP.pmincost(foundPath)
            }
            functionMessage.functionName = "PCost"
            functionMessage.text = 'Operacia bola spustena na ceste p: <b>' + callParams.paths[0] + '</b>. Výsledkom operácie je hodnota: <b>' + output.value + '</b>' // doplnit ktora hrana
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
                let pathID = naiveOP.concatenate(foundPath, foundPath2, callParams.values[0], sizeStruct, nodes, edges, paths, treeDataStructure)
                console.log("po concate, pred spojovanim", pathID, paths)
            }

            break
        case 111:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie split: ", naiveOP.split(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure))
            }
            break
        case 112:
            console.error("xxxxxx", JSON.parse(JSON.stringify(paths)))
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("xxxxxx", paths)
                console.log("Vystup operacie splice", naiveOP.splice(foundPath, sizeStruct, paths, nodes, edges, treeDataStructure))
                console.log(paths, edges, treeDataStructure)
            }
            break
        case 113:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                console.log("Vystup operacie expose: ", naiveOP.expose(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure))
            }
            break
        /* nad 10 zacnu operacie na cestach a stromoch */
    }

    return [treeDataStructure, functionMessage];
}

