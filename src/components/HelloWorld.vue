<script setup lang="ts">
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import { Nodes, Edges, Paths, Layouts, NodePositions } from "v-network-graph";
import * as vNG from "v-network-graph";
import data from "./data";
import functionSwitch from "../js/mainFunctions";
import isEqual from "lodash.isequal";
import * as nodeClass from "../js/nodeClass";
import * as treeFunctions from "../js/treeFunctions";
import { path } from "@/js/naivePartition";
import Popup from "./PopUpForm.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute(); // console.log("XXXXXXXXXXXXrouteXXXXXXXX", route.params.type);
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
//var selectedPaths = ref<string[]>([]);

/*interface Props {
  paths?: Paths;
}

const props = withDefaults(defineProps<{paths?: Nodes}>(), {
  paths? :  data.nodes ;
});*/
//console.log("type", nodes);
//console.log(typeof paths);

const emit = defineEmits([
  "selectNode",
  "nodesOut",
  "edgesOut",
  "pathsOut",
  "treeOut",
  "nodeRemove",
  "buildPaths",
  "removeNode",
]);
const props = defineProps({
  callFunction: Object,
});
//console.log("this prop is text", props.callFunction);
emit("pathsOut", paths);
emit("nodesOut", nodes);
emit("edgesOut", edges);
//console.log(nodes, edges, paths);

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // toggle
    if (node == null) {
      //console.log("empssxssssssz");
    }
    let xx = treeFunctions.findNodeArray(outPutTree.basicRoots, node);
    console.log("X", node, xx);
    emit("selectNode", xx);
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
  //emit("nodesOut", nodes);
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return;
  const [source, target] = selectedNodes.value;
  //ošetrenie aby uzol nemal dvoch rodicov
  for (let index in edges) {
    if (
      edges[index].target == target ||
      (edges[index].target == source && edges[index].source == target) // alebo dve hrany(rodic--> potomok a potomok--> rodic)
    ) {
      alert("Cannot add edge between " + edges[index].source); //spravit peknu notifikaciu
      return console.error("Nemôže pridať edge, uzol už ma rodiča");
    }
  }
  console.log(edgeValue.value);
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
  //console.log("x", outPutTree);
  emit("pathsOut", paths);
  emit("edgesOut", nodes);
  emit("treeOut", outPutTree);
}

function hidePath(id: string) {
  //console.log("som tu");
  //console.log(paths[id]);

  paths[id].canSee = false;
}

//maly cudlik, co prida path
function smrdis() {
  //console.log(props.callFunction, "xxxxxxxxxxxxxxxxxxx");
  paths["paths20"] = {
    id: "02",
    edges: ["edge11"],
    color: data.colors.pop(), // #rrggbbaa <- with alpha
    canSee: true,
  };
  emit("pathsOut", paths);
}

function newLayout(value: any) {
  console.log(":", selected.value, data.defaultLayouts);
  console.log(selected.value[0]);
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

  console.log(
    "coords: ",
    JSON.stringify(layouts),
    JSON.stringify(selectedProperties)
  );

  console.log("xxxx", JSON.stringify(data.defaultLayouts[0].layouts));
  for (const [key2, item2] of Object.entries(
    selectedProperties.layouts.nodes
  )) {
    const positions = JSON.parse(JSON.stringify(item2));
    layouts["nodes"][key2] = positions;
    console.log("coords: ", key2, item2);
  }
  console.log("coords: ", JSON.stringify(layouts));
  //layouts = selectedProperties.layouts;
  console.log(":", nodes, edges, paths);
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
    if (isEqual(outPutTree, x)) {
      //console.log("sameXXXXXXXXXXXX sad asdXx");
    }

    //console.log("AAAAAAXAXAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //console.log(x, z, "xxxx");
    console.log(x != undefined && x.code == 5);
    if (x != undefined && x.code == 5) {
      console.log("backingUP");
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
    }
    emit("treeOut", outPutTree);
    changeHidden();
  },
  {
    immediate: true,
    deep: true,
  }
);

function changeHidden() {
  console.log(printFunctionMessage);
  console.log("isHiden", isHidden);
  isHidden.value = !isHidden.value;
  console.log("isHiden", isHidden);
}

let nodesBackUp: Nodes;
let edgesBackUp: Edges;
let pathsBackUp: Paths;
function createBackUP() {
  console.log("backinUP");
  nodesBackUp = JSON.parse(JSON.stringify(nodes));
  edgesBackUp = JSON.parse(JSON.stringify(edges));
  pathsBackUp = JSON.parse(JSON.stringify(paths));
}

function loadBackUP() {
  console.log("backinUP2");
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
      <select
        name="defaultLayouts"
        id="categorySelector"
        v-model="selected"
        @change="newLayout"
      >
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