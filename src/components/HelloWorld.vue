<script setup lang="ts">
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import { Nodes, Edges, Paths, Layouts } from "v-network-graph";
import * as vNG from "v-network-graph";
import data from "./data";
import firstTry from "../js/mainFunctions";
import isEqual from "lodash.isequal";
import * as nodeClass from "../js/nodeClass";
import * as treeFunctions from "../js/treeFunctions";
import { path } from "@/js/naivePartition";

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
  JSON.stringify(data.defaultLayouts[0].layouts)
) as typeof layouts;

let nodes: Nodes = reactive({ ...copyNodes });
let edges: Edges = reactive({ ...copyEdges });
let paths: Paths = reactive({ ...copyPaths });
let layouts: Layouts = reactive({ ...copyLayouts });
var nextNodeIndex = ref(Object.keys(nodes).length + 1);
var nextEdgeIndex = ref(Object.keys(edges).length + 1);
var nextPathIndex = ref(Object.keys(paths).length + 1);

var selectedNodes = ref<string[]>([]);
var selectedEdges = ref<string[]>([]);

var nodeName = ref("");
var selected = ref(data.defaultLayouts[0].name);
var edgeValue: string;
var outPutTree: nodeClass.TreeDataStructures;
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
  console.log(nodeName.value);
  var nodeId = `node${nextNodeIndex.value}`;
  var name = `node${nextNodeIndex.value}`;
  nodes[nodeId] = { name };
  nextNodeIndex.value++;
  //console.log("addNode name", name);
  outPutTree = firstTry(
    { code: 1, name: name },
    nodes,
    edges,
    paths,
    outPutTree
  );
  emit("treeOut", outPutTree);
  emit("nodesOut", nodes);
}

function removeNode() {
  //console.log("edges:", edges, edges.length);
  for (const nodeId of selectedNodes.value) {
    emit("removeNode", nodes[nodeId]);
    outPutTree = firstTry(
      { code: 2, name: nodeId },
      nodes,
      edges,
      paths,
      outPutTree
    );
    delete nodes[nodeId];
    emit("nodeRemove", nodeId);
    for (let p in paths) {
      let arraCopy = [...paths[p].edges];
      let arraCopyD = [...paths[p].edges];
      for (let pe in paths[p].edges) {
        if (edges[paths[p].edges[pe]].source == nodeId) {
          const index = arraCopy.indexOf(arraCopy[pe]);
          arraCopy.splice(0, index);
          arraCopy.splice(0, 1);
        }
        if (edges[paths[p].edges[pe]].target == nodeId) {
          const index = paths[p].edges.indexOf(paths[p].edges[pe]);
          var edgesNew = arraCopyD.splice(0, index);
          arraCopyD.splice(0, 1);
          var pathName = `path${nextPathIndex.value}`;
          if (edgesNew.length != 0) {
            paths[pathName] = {
              id: (pathName = `path${nextPathIndex.value}`),
              edges: edgesNew,
              color: "#d55040cc",
              canSee: true,
              mouseOver: false,
              width: 45,
            };
          }
        }
      }
      //console.log("ArrayCopy-length", arraCopy.length, paths[p].edges.length);

      if (arraCopy.length == 0 || arraCopyD.length == 0) {
        delete paths[p];
      } else {
        /*console.log(
          "ArrayCopy-length222",
          arraCopy.length,
          paths[p].edges.length
        );*/

        paths[p].edges = [...arraCopy];
      }
    }
    for (let index in edges) {
      if (edges[index].source == nodeId || edges[index].target == nodeId) {
        delete edges[index];
        //console.log("mazeme edge");
      }
    }
  }
  //console.log("edges:", edges, edges.length);
  outPutTree = firstTry({ code: 0 }, nodes, edges, paths, outPutTree); // toto je asi zle

  //console.log("x", outPutTree);

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

  const edgeId = `edge${nextEdgeIndex.value}`;
  edges[edgeId] = {
    source,
    target,
    label: Math.floor(Math.random() * 20).toString(),
    dashed: true,
  };
  nextEdgeIndex.value++;
  outPutTree = firstTry(
    { code: 3, edgeID: edgeId },
    nodes,
    edges,
    paths,
    outPutTree
  );
  emit("treeOut", outPutTree);
  emit("edgesOut", nodes);
}

function removeEdge() {
  nextPathIndex.value++;
  nextPathIndex.value++;
  //console.log("test");
  /*console.log(
    edges[selectedEdges.value[0]].source,
    edges[selectedEdges.value[0]].label
  );*/
  //edges[selectedEdges.value[0]].label = "88888";
  //console.log(selectedEdges.value[0]);
  for (const edgeId of selectedEdges.value) {
    var edgeToRemove = edges[edgeId];
    delete edges[edgeId];

    for (let p in paths) {
      for (let pe in paths[p].edges) {
        //console.log("paths:", paths[p].edges[pe], edgeId);
        if (paths[p].edges[pe] == edgeId) {
          if (paths[p].edges.length == 1) {
            delete paths[p];
          } else {
            const index = paths[p].edges.indexOf(paths[p].edges[pe]);
            //console.log("INDEXXXXXXXX", index, pe);
            var arr2 = paths[p].edges.splice(0, index);
            paths[p].edges.splice(0, 1);
            var pathName = `path${nextPathIndex.value}`;
            if (arr2.length != 0) {
              paths[pathName] = {
                id: (pathName = `path${nextPathIndex.value}`),
                edges: arr2,
                color: "#d55040cc",
                canSee: true,
                mouseOver: false,
                width: 45,
              };
            }
            if (paths[p].edges.length == 0) {
              delete paths[p];
            }
          }
        }
      }
    }
    outPutTree = firstTry(
      { code: 4, edgeToRemove: edgeToRemove },
      nodes,
      edges,
      paths,
      outPutTree
    );
  }

  emit("pathsOut", paths);
  emit("edgesOut", nodes);
  outPutTree = firstTry({ code: 0 }, nodes, edges, paths, outPutTree);
  //console.log("x", outPutTree);
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
    color: "#00aa0066", // #rrggbbaa <- with alpha
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
  for (const [key, item] of Object.entries(nodes)) {
    delete nodes[key];
  }
  for (const [key, item] of Object.entries(selectedProperties.nodes)) {
    nodes[key] = item;
  }

  for (const [key, item] of Object.entries(edges)) {
    delete edges[key];
  }
  for (const [key, item] of Object.entries(selectedProperties.edges)) {
    edges[key] = item;
  }

  for (const [key, item] of Object.entries(paths)) {
    delete paths[key];
  }
  for (const [key, item] of Object.entries(selectedProperties.paths)) {
    paths[key] = item;
  }

  /* for (const [key, item] of Object.entries(layouts)) {
    for (const [key2, item2] of Object.entries(item)) {
      delete layouts["nodes"][key2];
    }
  }*/
  console.log(
    "coords: ",
    JSON.stringify(layouts),
    JSON.stringify(selectedProperties)
  );

  console.log("xxxx", JSON.stringify(data.defaultLayouts[0].layouts));
  for (const [key2, item2] of Object.entries(
    selectedProperties.layouts.nodes
  )) {
    layouts["nodes"][key2] = item2;
    console.log("coords: ", key2, item2);
  }
  console.log("coords: ", JSON.stringify(layouts));
  //layouts = selectedProperties.layouts;
  console.log(":", nodes, edges, paths);
  outPutTree = firstTry({ code: 0 }, nodes, edges, paths, outPutTree);
  emit("treeOut", outPutTree);
  emit("pathsOut", paths);
  emit("nodesOut", nodes);
  emit("edgesOut", edges);
}

const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};

watch(
  () => props.callFunction,
  (x, z) => {
    if (isEqual(outPutTree, x)) {
      //console.log("sameXXXXXXXXXXXX sad asdXx");
    }

    //console.log("AAAAAAXAXAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //console.log(x, z, "xxxx");
    outPutTree = firstTry(x, nodes, edges, paths, outPutTree);
    console.log(paths, edges, outPutTree);
    console.log("x", outPutTree);
    emit("treeOut", outPutTree);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <div style="height: 100%">
    <div class="operations">
      <input type="text" placeholder="node name" v-model="nodeName" />
      <button @click="addNode">Add Node</button>
      <button :disabled="selectedNodes.length == 0" @click="removeNode">
        Remove Node
      </button>

      <input type="text" placeholder="edge value" v-model="edgeValue" />
      <button :disabled="selectedNodes.length != 2" @click="addEdge">
        Add Edge
      </button>
      <button :disabled="selectedEdges.length == 0" @click="removeEdge">
        Remove Edge
      </button>
      <div></div>
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