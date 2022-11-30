<script setup lang="ts">
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import { Nodes, Edges, Paths, Layouts, NodePositions } from "v-network-graph";
import * as vNG from "v-network-graph";
import data from "./data";
import functionSwitch from "../implementation/mainFunctions";
import isEqual from "lodash.isequal";
import * as nodeClass from "../implementation/nodeClass";
import * as treeFunctions from "../implementation/treeFunctions";
import Popup from "./PopUpForm.vue";
import { useRoute, useRouter } from "vue-router";
// dagre: Directed graph layout for JavaScript
// https://github.com/dagrejs/dagre
//@ts-ignore
import dagre from "dagre/dist/dagre.min.js";

const route = useRoute();
var sizeStruct = route.params.type == "size";

const copyNodes = JSON.parse(
  JSON.stringify(data.defaultLayouts[0].nodes)
) as typeof nodes;
const copyEdges = JSON.parse(
  JSON.stringify(data.defaultLayouts[0].edges)
) as typeof edges;
const copyPaths = JSON.parse(
  JSON.stringify(data.defaultLayouts[0].paths)
) as typeof paths;
const copyLayouts = JSON.parse(
  JSON.stringify(data.defaultLayouts[0].layouts["nodes"])
);
let layoutsXX: Layouts = { nodes: copyLayouts };
let nodes: Nodes = reactive({ ...copyNodes });
let edges: Edges = reactive({ ...copyEdges });
let paths: Paths = reactive({ ...copyPaths });
let layouts: Layouts = reactive({ ...layoutsXX });
var nextNodeIndex = ref(Object.keys(nodes).length + 1);
var nextEdgeIndex = ref(Object.keys(edges).length + 1);
var nextPathIndex = ref(Object.keys(paths).length + 1);

var selectedNodes = ref<string[]>([]);
var selectedEdges = ref<string[]>([]);

var nodeName = ref("");
var selected = ref(data.defaultLayouts[0].name);
var edgeValue = ref("");
var outPutTree: nodeClass.TreeDataStructures;
var printFunctionMessage: any;
var printFunctionMessageModel = ref(printFunctionMessage);

const emit = defineEmits([
  "selectNode",
  "nodesOut",
  "edgesOut",
  "pathsOut",
  "treeOut",
  "nodeRemove",
  "buildPaths",
  "removeNode",
  "replaceSelectedNodes",
]);
const props = defineProps({
  callFunction: Object,
});
emit("pathsOut", paths);
emit("nodesOut", nodes);
emit("edgesOut", edges);

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // toggle
    let foundNode = treeFunctions.findNodeArray(outPutTree.basicRoots, node);
    emit("selectNode", foundNode);
  },
};

function addNode() {
  var nodeId: string;
  var name: string;
  for (var n in nodes) {
    if (n == nodeName.value) {
      alert(
        "Node with selected name already exists, choose another unique name please"
      );
      nodeName.value = "";
      return;
    }
  }
  if (nodeName.value == undefined || nodeName.value == "") {
    nodeId = `node${nextNodeIndex.value}`;
    name = `node${nextNodeIndex.value}`;
    nextNodeIndex.value++;
  } else {
    nodeId = nodeName.value;
    name = nodeName.value;
  }
  nodes[nodeId] = { name };
  [outPutTree, printFunctionMessage] = functionSwitch(
    { code: 1, name: name },
    sizeStruct,
    nodes,
    edges,
    paths,
    outPutTree
  );
  nodeName.value = "";
  emit("treeOut", outPutTree);
  emit("nodesOut", nodes);
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    emit("removeNode", nodes[nodeId]);
    [outPutTree, printFunctionMessage] = functionSwitch(
      { code: 2, name: nodeId },
      sizeStruct,
      nodes,
      edges,
      paths,
      outPutTree
    );
    delete nodes[nodeId];
    emit("nodeRemove", nodeId);
  }

  emit("edgesOut", nodes);
  emit("pathsOut", paths);
  emit("treeOut", outPutTree);
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return;
  const [source, target] = selectedNodes.value;
  //ošetrenie aby uzol nemal dvoch rodicov
  for (let index in edges) {
    if (
      edges[index].target == target ||
      (edges[index].target == source && edges[index].source == target)
    ) {
      alert("Cannot add edge between " + edges[index].source);
      return console.error("Nemôže pridať edge, uzol už ma rodiča");
    }
  }
  const edgeId = `edge${nextEdgeIndex.value}`;
  edges[edgeId] = {
    source,
    target,
    label:
      edgeValue.value != ""
        ? edgeValue.value
        : Math.floor(Math.random() * 20).toString(),
    dashed: true,
  };
  nextEdgeIndex.value++;
  [outPutTree, printFunctionMessage] = functionSwitch(
    { code: 3, edgeID: edgeId },
    sizeStruct,
    nodes,
    edges,
    paths,
    outPutTree
  );
  emit("treeOut", outPutTree);
  emit("edgesOut", edges);
}

function removeEdge() {
  nextPathIndex.value++;
  nextPathIndex.value++;

  for (const edgeId of selectedEdges.value) {
    var edgeToRemove = edges[edgeId];
    delete edges[edgeId];

    [outPutTree, printFunctionMessage] = functionSwitch(
      { code: 4, edgeToRemove: edgeToRemove },
      sizeStruct,
      nodes,
      edges,
      paths,
      outPutTree
    );
  }

  [outPutTree, printFunctionMessage] = functionSwitch(
    { code: 0 },
    sizeStruct,
    nodes,
    edges,
    paths,
    outPutTree
  );
  emit("pathsOut", paths);
  emit("edgesOut", nodes);
  emit("treeOut", outPutTree);
}

function hidePath(id: string) {
  paths[id].canSee = false;
}

function newLayout(value: any) {
  let selectedProperties = data.defaultLayouts.find(
    (l) => l.name == selected.value
  );
  if (selectedProperties == undefined) {
    console.error("selectedProperties not found", selectedProperties);
    return;
  }
  replaceObjects(nodes, selectedProperties.nodes);
  replaceObjects(edges, selectedProperties.edges);
  replaceObjects(paths, selectedProperties.paths);

  for (const [key2, item2] of Object.entries(
    selectedProperties.layouts.nodes
  )) {
    const positions = JSON.parse(JSON.stringify(item2));
    layouts["nodes"][key2] = positions;
  }
  //layouts = selectedProperties.layouts;
  [outPutTree, printFunctionMessage] = functionSwitch(
    { code: 0 },
    sizeStruct,
    nodes,
    edges,
    paths,
    outPutTree
  );
  emit("treeOut", outPutTree);
  emit("pathsOut", paths);
  emit("nodesOut", nodes);
  emit("edgesOut", edges);
}

const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};

var isHidden = ref(true);

watch(
  () => props.callFunction,
  (x, z) => {
    if (x != undefined && x.code == 5) {
      loadBackUP();
    } else {
      createBackUP();
      [outPutTree, printFunctionMessage] = functionSwitch(
        x,
        sizeStruct,
        nodes,
        edges,
        paths,
        outPutTree
      );
      printFunctionMessageModel.value = printFunctionMessage;
      console.log(paths, edges, outPutTree);
      console.log("x", outPutTree);
      if (x != undefined && x.code == 208) {
        layout("TB");
      }
    }
    emit("treeOut", outPutTree);
    changeHidden();
  },
  {
    immediate: true,
    deep: true,
  }
);
const nodeSize = 30;
const graph = ref<vNG.VNetworkGraphInstance>();

graph.value?.setViewBox;
function layout(direction: "TB" | "LR") {
  if (Object.keys(nodes).length <= 1 || Object.keys(edges).length == 0) {
    return;
  }

  // convert graph
  // ref: https://github.com/dagrejs/dagre/wiki
  const g = new dagre.graphlib.Graph();
  // Set an object for the graph label
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSize * 2,
    edgesep: nodeSize,
    ranksep: nodeSize * 2,
  });
  g.setDefaultEdgeLabel(() => ({}));

  Object.entries(nodes).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize });
  });

  Object.values(edges).forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const box: Record<string, number | undefined> = {};
  g.nodes().forEach((nodeId: string) => {
    const x = g.node(nodeId).x;
    const y = g.node(nodeId).y;
    layouts["nodes"][nodeId] = { x, y };

    // calculate bounding box size
    box.top = box.top ? Math.min(box.top, y) : y;
    box.bottom = box.bottom ? Math.max(box.bottom, y) : y;
    box.left = box.left ? Math.min(box.left, x) : x;
    box.right = box.right ? Math.max(box.right, x) : x;
  });

  const graphMargin = nodeSize * 2;
  const viewBox = {
    top: (box.top ?? 0) - graphMargin, // ak tieto veci nefixnes, vyhod
    bottom: (box.bottom ?? 0) + graphMargin,
    left: (box.left ?? 0) - graphMargin,
    right: (box.right ?? 0) + graphMargin,
  };
  graph.value?.setViewBox(viewBox);
}

function changeHidden() {
  isHidden.value = !isHidden.value;
}

let nodesBackUp: Nodes;
let edgesBackUp: Edges;
let pathsBackUp: Paths;
function createBackUP() {
  nodesBackUp = JSON.parse(JSON.stringify(nodes));
  edgesBackUp = JSON.parse(JSON.stringify(edges));
  pathsBackUp = JSON.parse(JSON.stringify(paths));
}

function loadBackUP() {
  replaceObjects(nodes, nodesBackUp);
  replaceObjects(edges, edgesBackUp);
  replaceObjects(paths, pathsBackUp);

  [outPutTree, printFunctionMessage] = functionSwitch(
    { code: 0 },
    sizeStruct,
    nodes,
    edges,
    paths,
    outPutTree
  );
  emit("treeOut", outPutTree);
  emit("pathsOut", paths);
  emit("nodesOut", nodes);
  emit("edgesOut", edges);
  emit("replaceSelectedNodes");
}

function replaceObjects(oldObjects: Nodes, newObjects: Nodes) {
  for (const [key, item] of Object.entries(oldObjects)) {
    delete oldObjects[key];
  }
  for (const [key, item] of Object.entries(newObjects)) {
    oldObjects[key] = item;
  }
}
</script>

<template>
  <div style="height: 100%">
    <Popup
      v-if="isHidden"
      @changeHide="changeHidden"
      :whichPopup="'functionOutput'"
      :dataAbout="printFunctionMessageModel"
    />
    <div class="operations">
      <input
        type="text"
        placeholder="node name"
        v-model="nodeName"
        style="width: 100px"
      />
      <button @click="addNode">Add Node</button>
      <button :disabled="selectedNodes.length == 0" @click="removeNode">
        Remove Node
      </button>

      <input
        type="text"
        placeholder="edge value"
        v-model="edgeValue"
        style="width: 70px"
      />
      <button :disabled="selectedNodes.length != 2" @click="addEdge">
        Add Edge
      </button>
      <button :disabled="selectedEdges.length == 0" @click="removeEdge">
        Remove Edge
      </button>
      <div style="flex-grow: 1"></div>
      <button @click="newLayout">Reset image</button>
      <select name="defaultLayouts" v-model="selected" @change="newLayout">
        <option
          :key="key"
          v-for="(value, key) in data.defaultLayouts"
          :value="value.name"
        >
          {{ value.name }}
        </option>
      </select>
    </div>

    <v-network-graph
      v-model:selected-nodes="selectedNodes"
      v-model:selected-edges="selectedEdges"
      :nodes="nodes"
      :edges="edges"
      :layouts="layouts"
      :configs="data.configs"
      :event-handlers="eventHandlers"
      :paths="paths"
      style="height: 96%"
      :key="componentKey"
      ref="graph"
    >
      <template #edge-label="{ edge, ...slotProps }">
        <v-edge-label
          :text="edge.label"
          align="center"
          vertical-align="above"
          v-bind="slotProps"
        />
      </template>
    </v-network-graph>
  </div>
</template>

<style scoped>
.operations {
  background-color: grey;
  display: flex;
  height: 4%;
}
</style>