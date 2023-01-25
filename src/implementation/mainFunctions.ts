import * as maintanance from "./maintanance"
import * as treeFunctions from "./treeFunctions"
import { Nodes, Edges, Paths } from "v-network-graph";
import * as nodeClass from "./nodeClass";
import * as naiveOP from "./naivePartition"
import * as sizeOP from "./sizePartitioning"
import * as treeOP from "./treeOperations"
import data from "../components/data";
import { runTests } from "./pathTests";

class FunctionMessage {
    functionName: string
    text: string
    constructor(functionName: string, text: string) {
        this.functionName = functionName
        this.text = text
    }
}

export default function functionSwitch(callParams: any, sizeStruct: boolean, nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures): [nodeClass.TreeDataStructures, any] {
    console.log('imported function', callParams)
    var functionMessage: FunctionMessage = new FunctionMessage("", "")
    var output: any // na uchovanie vystupu funkcie a nasledneho vypisania
    switch (callParams.code) {
        case -1:
            runTests()
            break;
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
            functionMessage.functionName = "Add node"
            break;
        case 2: // odobratie uzlu -> vymazat zo zoznamu uzlov, vymazat hrany, aktualizovat DS
            treeFunctions.removeNode(treeDataStructure, callParams.name, sizeStruct, nodes, edges, paths)
            console.log('Node was removed', callParams.name, treeDataStructure)
            functionMessage.functionName = "Remove node"
            break;
        case 3: // pridanie hrany -> aktualizovat zoznam uzlov (pridat syna a rodica), prebehnut dotknute DS
            functionMessage.functionName = "Add edge"
            treeFunctions.addEdge(treeDataStructure, edges, callParams.edgeID)
            break;
        case 4: // odobratie hrany -> aktualizovat zoznam uzlov (odobrat syna a rodica), prebehnut dotknute DS
            functionMessage.functionName = "Remove edge"
            treeFunctions.removeEdge(treeDataStructure, callParams.edgeToRemove)
            treeDataStructure.pathRoots = maintanance.buildPaths(nodes, edges, paths, treeDataStructure.basicRoots, sizeStruct) // premazem z paths
            break;
        case 101:
            var foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.path(foundNode)
            }
            functionMessage.functionName = "Path"
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Uzol sa nenachádza v žiadnej ceste'
            } else {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je cesta s ID: <b>' + output.pathID + '</b>'
            }
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
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Na ceste neexistuje uzol pred' + callParams.nodes[0]
            } else {
                functionMessage.text = 'Operacia bola spustena na uzle x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je uzol s ID: <b>' + output.name + '</b>'
            }
            break;
        case 105:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.after(foundNode)
            }
            functionMessage.functionName = "After"
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Na ceste neexistuje uzol za' + callParams.nodes[0]
            } else {
                functionMessage.text = 'Operacia bola spustena na uzle x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je uzol s ID: <b>' + output.name + '</b>'
            }
            break;
        case 106:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = naiveOP.pcost(foundNode)
            }
            functionMessage.functionName = "PCost"
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Z tohoto uzlu nevychádza žiadna hrana'
            } else {
                functionMessage.text = 'Operacia bola spustena na uzle x: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je hodnota: <b>' + output + '</b>'
            }
            break
        case 107:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                console.log("AAA", foundPath)
                output = naiveOP.pmincost(foundPath, edges)
            }
            functionMessage.functionName = "PMinCost"
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena na ceste p: <b>' + callParams.paths[0] + '</b>. Výsledkom operácie je hodnota: <b>' + output + '</b>' // doplnit ktora hrana
            } else {
                functionMessage.text = 'Operacia bola spustena na ceste p: <b>' + callParams.paths[0] + '</b>. Výsledkom je hrana medzi uzlami: <b>' + edges[output.parent.edgeID].source + '-' + edges[output.parent.edgeID].target + '</b>' // doplnit ktora hrana
            }
            break
        case 108:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            functionMessage.functionName = "pupdate"
            if (foundPath !== undefined) {
                console.log("Vystup operacie pupdate", naiveOP.pupdate(foundPath, callParams.values[0], edges))
            }
            break
        case 109:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            functionMessage.functionName = "reverse"
            if (foundPath !== undefined) {
                console.log("Vystup operacie reverse", naiveOP.reverse(foundPath))
            }
            break
        case 110:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            functionMessage.functionName = "concatenate"
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
            functionMessage.functionName = "Split"
            break
        case 112:
            console.error("xxxxxx", JSON.parse(JSON.stringify(paths)))
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            functionMessage.functionName = "splice"
            if (foundPath !== undefined) {
                console.log("xxxxxx", paths)
                console.log("Vystup operacie splice", naiveOP.splice(foundPath, sizeStruct, paths, nodes, edges, treeDataStructure))
                console.log(paths, edges, treeDataStructure)
            }
            break
        case 113:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            functionMessage.functionName = "expose"
            if (foundNode != null) {
                console.log("Vystup operacie expose: ", naiveOP.expose(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure))
            }
            break
        case 201: // parent
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = treeOP.parent(foundNode)
            }
            functionMessage.functionName = "parent"
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Uzol <b>' + callParams.nodes[0] + '</b> nemá rodiča'
            } else {
                functionMessage.text = 'Operacia bola spustena na uzle: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je uzol: <b>' + output.name + '</b>' // doplnit ktora hrana    
            }
            break
        case 202: // root
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = treeOP.root(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure)
            }
            functionMessage.functionName = "root"
            functionMessage.text = 'Operacia bola spustena na uzle: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je uzol: <b>' + output.name + '</b>' // doplnit ktora hrana    
            break
        case 203: // cost
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                output = treeOP.cost(foundNode)
            }
            functionMessage.functionName = "cost"
            if (output == null) {
                functionMessage.text = 'Operacia bola spustena s uzlom x: <b>' + callParams.nodes[0] + '</b>. Z tohoto uzlu nevychádza žiadna hrana'
            } else {
                functionMessage.text = 'Operacia bola spustena na uzle: <b>' + callParams.nodes[0] + '</b>. Výsledkom operácie je hodnota: <b>' + output + '</b>' // doplnit ktora hrana    
            }
            break
        case 204: // mincost
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            functionMessage.functionName = "mincost"
            if (foundNode != null) {
                output = treeOP.mincost(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure)
            }
            functionMessage.functionName = "mincost"
            functionMessage.text = 'Operacia bola spustena na ceste p: <b>' + callParams.paths[0] + '</b>. Výsledkom je hrana medzi uzlami: <b>' + edges[output.parent.edgeID].source + '-' + edges[output.parent.edgeID].target + '</b>' // doplnit ktora hrana
            break
        case 205: // update
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            functionMessage.functionName = "update"
            if (foundNode != null) {
                treeOP.update(foundNode, callParams.values[0], sizeStruct, paths, nodes, edges, treeDataStructure)
            }
            break
        case 206: // link
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            var foundSecondNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[1])
            functionMessage.functionName = "link"
            if (foundNode != null && foundSecondNode != null) {
                treeOP.link(foundSecondNode, foundNode, callParams.values[0], sizeStruct, paths, nodes, edges, treeDataStructure)
            }
            break
        case 207: // cut
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            functionMessage.functionName = "cut"
            if (foundNode != null) {
                treeOP.cut(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure)
            }
            break
        case 208: // evert
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            functionMessage.functionName = "evert"
            if (foundNode != null) {
                output = treeOP.evert(foundNode, sizeStruct, paths, nodes, edges, treeDataStructure)
            }
            functionMessage.functionName = "Evert"
            break
        case 301:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            if (foundPath !== undefined) {
                output = sizeOP.light(foundPath)
                functionMessage.functionName = "light"
                if (output == null) {
                    functionMessage.text = 'Operacia bola spustena na ceste: <b>' + callParams.paths[0] + '</b>. Cesta neobsahuje žiadnu light hranu' // doplnit ktora hrana    
                } else {
                    functionMessage.text = 'Operacia bola spustena na ceste: <b>' + callParams.paths[0] + '</b>. Najbližšia light hrana ku tail(p) je solid hrana vychádzajúca z uzlu: <b>' + output.name + '</b>'
                }
            }
            break
        case 302:
            foundNode = treeFunctions.findNodeArray(treeDataStructure.basicRoots, callParams.nodes[0])
            if (foundNode != null) {
                let [output, output2] = sizeOP.maxwt(foundNode)
                functionMessage.functionName = "maxwt"
                if (output == null) {
                    functionMessage.text = 'Operacia bola spustena na uzle: <b>' + callParams.nodes[0] + '</b>. Uzol nieje prepojený so žiadnym ponokom pomocou dashed hrany' // doplnit ktora hrana    
                } else {
                    functionMessage.text = 'Operacia bola spustena na uzle: <b>' + callParams.nodes[0] + '</b>. Potomok tohoto uzla, prepojený pomocou dashed hrany, je uzol <b>' + output + '</b>, kde weight je: <b>' + output2 + '</b>'
                }
            }
            break
        case 303:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            functionMessage.functionName = "slice"
            if (foundPath !== undefined) {
                console.log("Vystup operacie pupdate", sizeOP.slice(foundPath, sizeStruct, nodes, edges, paths, treeDataStructure))
            }
            break
        case 304:
            foundPath = treeFunctions.findPath(treeDataStructure.pathRoots, callParams.paths[0])
            functionMessage.functionName = "conceal"
            if (foundPath !== undefined) {
                console.log("Vystup operacie conceal", sizeOP.conceal(foundPath, sizeStruct, nodes, edges, paths, treeDataStructure))
            }
            break
    }

    return [treeDataStructure, functionMessage];
}

