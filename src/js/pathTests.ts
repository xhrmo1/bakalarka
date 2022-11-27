import { Edges, Nodes, Paths } from "v-network-graph";
import data from "../components/data";
import * as nodeClass from "../js/nodeClass";
import * as maintanance from "./maintanance"
import * as treeFunctions from "./treeFunctions"
import * as naiveOP from "./naivePartition"

export function runTests() {
    var nodes: Nodes,
        edges: Edges,
        paths: Paths,
        treeDataStructure: nodeClass.TreeDataStructures;

    [nodes, edges, paths, treeDataStructure] = loadData();
    /* static operations*/
    headTailTest(nodes, edges, paths, treeDataStructure)
    afterBeforeTest(nodes, edges, paths, treeDataStructure)
    pathTest(nodes, edges, paths, treeDataStructure)
    splitTest()
}

function loadData(): [Nodes, Edges, Paths, nodeClass.TreeDataStructures] {
    var nodes: Nodes = data.defaultLayouts[0].nodes,
        edges: Edges = data.defaultLayouts[0].edges,
        paths: Paths = data.defaultLayouts[0].paths,
        treeDataStructure: nodeClass.TreeDataStructures
        ;

    var structBasic: nodeClass.StructBasic[] = treeFunctions.initializeTree(nodes, edges, paths, true)
    treeDataStructure = new nodeClass.TreeDataStructures(
        structBasic,
        maintanance.buildPaths(nodes, edges, paths, structBasic, true)
    )

    return [
        nodes, edges, paths, treeDataStructure
    ]
}

function logStatus(testName: string, testVariant: string, expectedOutput: string | null, gotOutput: string | null) {
    if (expectedOutput == null) {
        console.log('----' + testName + '---- variant:' + testVariant)
    } else {
        console.error('----' + testName + '---- variant: ' + testVariant + ' expectedOutput: ' + expectedOutput + ' got output: ' + gotOutput)
    }

}

export function afterBeforeTest(nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures) {
    logStatus('afterBefore', "basic", null, null)
    var nodeA = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "A")
    var nodeF = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "F")
    var nodeJ = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "J")
    var outputNode: nodeClass.StructBasic | null
    if (nodeA === null || nodeF === null || nodeJ === null) {
        console.error('Node not found')
        return
    }
    outputNode = naiveOP.after(nodeA)
    outputNode != null ? logStatus('afterBeforeTest', "after A", "null", outputNode.name) : null
    outputNode = naiveOP.before(nodeA)
    outputNode?.name != "D" ? logStatus('afterBeforeTest', "before A", "D", outputNode != null ? outputNode.name : 'null') : null

    outputNode = naiveOP.after(nodeF)
    outputNode != null ? logStatus('afterBeforeTest', "after F", "null", outputNode.name) : null
    outputNode = naiveOP.before(nodeF)
    outputNode?.name != "I" ? logStatus('afterBeforeTest', "before F", "I", outputNode != null ? outputNode.name : 'null') : null


    outputNode = naiveOP.after(nodeJ)
    outputNode?.name != "I" ? logStatus('afterBeforeTest', "after J", "I", outputNode != null ? outputNode.name : 'null') : null
    outputNode = naiveOP.before(nodeJ)
    outputNode != null ? logStatus('afterBeforeTest', "before J", "null", outputNode.name) : null

}
export function headTailTest(nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures) {
    logStatus('headTailTest', "basic", null, null)
    var path1 = treeFunctions.findPath(treeDataStructure.pathRoots, "path1")
    var path2 = treeFunctions.findPath(treeDataStructure.pathRoots, "path2")
    var path5 = treeFunctions.findPath(treeDataStructure.pathRoots, "path5")
    var outputNode: nodeClass.StructBasic
    if (path2 === undefined || path1 === undefined || path5 === undefined) {
        console.error('Path not found')
        return
    }
    outputNode = naiveOP.tail(path1)
    outputNode.name != "B" ? logStatus('tailheadTest', "basictail", "B", outputNode.name) : null
    outputNode = naiveOP.tail(path2)
    outputNode.name != "A" ? logStatus('tailheadTest', "basictail", "A", outputNode.name) : null
    outputNode = naiveOP.tail(path5)
    outputNode.name != "K" ? logStatus('tailheadTest', "oneElementPath", "K", outputNode.name) : null

    outputNode = naiveOP.head(path1)
    outputNode.name != "C" ? logStatus('tailheadTest', "basichead", "C", outputNode.name) : null
    outputNode = naiveOP.head(path2)
    outputNode.name != "H" ? logStatus('tailheadTest', "basichead", "H", outputNode.name) : null
    outputNode = naiveOP.head(path5)
    outputNode.name != "K" ? logStatus('tailheadTest', "oneElementPath", "K", outputNode.name) : null

    if (path1.pathRoot != undefined) {
        path1.pathRoot.reversed = true
    }
    if (path2.pathRoot != undefined) {
        path2.pathRoot.reversed = true
    }
    logStatus('tailheadTest', "reversed", null, null)

    outputNode = naiveOP.head(path1)
    outputNode.name != "B" ? logStatus('tailheadTest', "reversedhead", "B", outputNode.name) : null
    outputNode = naiveOP.head(path2)
    outputNode.name != "A" ? logStatus('tailheadTest', "reversedhead", "A", outputNode.name) : null

    outputNode = naiveOP.tail(path1)
    outputNode.name != "C" ? logStatus('tailheadTest', "reversedtail", "C", outputNode.name) : null
    outputNode = naiveOP.tail(path2)
    outputNode.name != "H" ? logStatus('tailheadTest', "reversedtail", "H", outputNode.name) : null

}
export function pathTest(nodes: Nodes, edges: Edges, paths: Paths, treeDataStructure: nodeClass.TreeDataStructures) {
    var nodeA = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "A")
    var nodeF = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "F")
    var nodeK = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "K")
    var outputNode: nodeClass.Path | null
    if (nodeA === null || nodeF === null || nodeK === null) {
        console.error('Node not found')
        return
    }
    outputNode = naiveOP.path(nodeA)
    if (outputNode == null || outputNode.name != 'path2') {
        logStatus('pathTest', "path A", "path2", outputNode != null ? outputNode.name ?? "" : 'null')
    }
    outputNode = naiveOP.path(nodeF)
    if (outputNode == null || outputNode.name != 'path3') {
        logStatus('pathTest', "path F", "path3", outputNode != null ? outputNode.name ?? "" : 'null')
    }
    outputNode = naiveOP.path(nodeK)
    if (outputNode == null || outputNode.name != 'path5') {
        logStatus('pathTest', "path K", "path5", outputNode != null ? outputNode.name ?? "" : 'null')
    }
}
export function splitTest() {
    logStatus("splitTest", "", null, null)
    var nodes: Nodes,
        edges: Edges,
        paths: Paths,
        treeDataStructure: nodeClass.TreeDataStructures;

    [nodes, edges, paths, treeDataStructure] = loadData();
    var nodeE = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "E")
    var nodeD = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "D")
    var nodeG = treeFunctions.findNodeArray(treeDataStructure.basicRoots, "G")
    if (nodeE == null || nodeD == null || nodeG == null) {
        console.error('Path not found')
        return
    }
    let [p, r, x, y] = naiveOP.split(nodeE, true, paths, nodes, edges, treeDataStructure)
    x != 4 ? logStatus("splitTest", "node E", '4', x.toString()) : null
    y != 3 ? logStatus("splitTest", "node E", '3', y.toString()) : null
    if (nodeE.pathPointer == null || nodeE.pathPointer.allNodes == null || nodeE.pathPointer.allNodes.length != 1) {
        logStatus("splitTest", "node E ", 'path has wrong paramas', "")
    }
    if (nodeE.children?.length != 1 || nodeE.children[0].target.name != "F") {
        logStatus("splitTest", "node E ", 'F children is not F', "")
    }
    if (nodeE.parent != null) {
        logStatus("splitTest", "node E ", 'E has parent', "")
    }
    if (nodeD.pathPointer == null || nodeD.pathPointer.allNodes == null || nodeD.pathPointer.allNodes.length != 2) {
        logStatus("splitTest", "node D ", 'path has wrong paramas', "")
    }
    if (nodeD.children?.length != 0) {
        logStatus("splitTest", "node E ", 'D has children', "")
    }

    if (nodeG.pathPointer == null || nodeG.pathPointer.allNodes == null || nodeG.pathPointer.allNodes.length != 2) {
        logStatus("splitTest", "node G ", 'path has wrong paramas', "")
    }
    if (nodeG.parent != null) {
        logStatus("splitTest", "node E ", 'G has parent', "")
    }

    if (nodeE.pathPointer?.name == nodeG.pathPointer?.name == null || nodeE.pathPointer?.name == nodeD.pathPointer?.name) {
        logStatus("splitTest", "node E ", 'E has same pathID as G or D', "")
    }

}
