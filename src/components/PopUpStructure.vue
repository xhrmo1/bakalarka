
<script setup lang="ts">
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import { Nodes, Edges, Layouts } from "v-network-graph";
import * as vNG from "v-network-graph";
import data from "./data";
import firstTry from "../js/mainFunctions";
import Structure from "./StructureForm.vue";

var nodes: Nodes = reactive({ ...data.nodes });
var edges: Edges = reactive({ ...data.edges });

var nextNodeIndex = ref(Object.keys(nodes).length + 1);
var nextEdgeIndex = ref(Object.keys(edges).length + 1);
//var nextPathIndex = ref(Object.keys(paths).length + 1);

var selectedNodes = ref<string[]>([]);
var selectedEdges = ref<string[]>([]);
//var selectedPaths = ref<string[]>([]);

/*interface Props {
  paths?: Paths;
}

const props = withDefaults(defineProps<{paths?: Nodes}>(), {
  paths? :  data.nodes ;
});*/
console.log("type", nodes);

const props = defineProps({
  pathTree: Object,
  naivePartition: Boolean,
});

let tempArr: any = [];

console.log("this prop is text", props.pathTree);
var clickedNodes: any[] | undefined = reactive([]);
const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // toggle
    if (node == null || clickedNodes == null) {
      return;
    }
    if (!clickedNodes.includes(nodes[node].name)) {
      clickedNodes.push(nodes[node].name);
    }
    console.log("CLICKEDNODES", clickedNodes);
  },
};

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    delete nodes[nodeId];
    // emit("nodeRemove", nodeId);
  }
  console.log(outPutTree);
  //emit("nodesOut", nodes);
}

let layouts: Layouts = {
  nodes: {},
};
watch(
  () => props.pathTree,
  (x, z) => {
    if (x == null) {
      return;
    }
    console.log("ajajaja", z, x[0]);
    nodes = {};
    edges = {};

    console.log(nodes);
    var id = 0;
    var idEdge = 0;
    /*x[0].allNodes.forEach((element: any) => {
      nodes[id] = { name: element.name };
      id++;
    });*/

    var depth = Math.ceil(Math.log2(x[0].allNodes.length));
    console.log("Length is: ", depth, x[0]);
    inside(x[0].rootNaive, 0, depth, 0);
    console.log("Layout", layouts, nodes);

    function inside(node: any, baseX: number, axisX: number, axisY: number) {
      console.log(node.name, "inside Name", baseX, axisX, axisY, node);
      layouts.nodes[id] = { x: baseX, y: axisY * 50 };
      nodes[id] = { name: node.name };
      var bparentId = "a";
      if (node.bparent != null) {
        for (let index in nodes) {
          if (nodes[index].name == node.bparent.name) {
            bparentId = index;
          }
        }
        console.log("edge", bparentId, id.toString(), nodes);
        edges[idEdge] = {
          source: bparentId,
          target: id.toString(),
        };
        idEdge++;
      }
      id++;
      if (node.bleft != null) {
        inside(node.bleft, baseX - 50 * axisX, axisX - 1, axisY + 1);
      }

      if (node.bright != null) {
        inside(node.bright, baseX + 50 * axisX, axisX - 1, axisY + 1);
      }
    }

    console.log("tih are nodes", nodes, edges);
    //emit("treeOut", outPutTree);
  },
  {
    immediate: true,
    deep: true,
  }
);

function getEmit(node: any) {
  clickedNodes?.splice(clickedNodes.indexOf(node.name), 1);
  console.log("!!", clickedNodes);
}
var outPutTree: any[] | undefined;
</script>


<template>
  <div>
    <transition name="fade" appear>
      <div class="modal-overlay" @click="$emit('changePopUpStructure')"></div>
    </transition>
    <transition name="slide" appear>
      <div class="splitPopGrid popup-inner">
        <div class="PopGrid--Header">Vnutorna struktura cesty</div>
        <Structure
          class="PopGrid--Structure"
          :clickedNodes="clickedNodes"
          :whichStructure="props.naivePartition ? 'naive' : 'size'"
          @removeNode="getEmit"
          >XX</Structure
        >
        <v-network-graph
          v-model:selected-nodes="selectedNodes"
          v-model:selected-edges="selectedEdges"
          :nodes="nodes"
          :edges="edges"
          :configs="data.configsStructure"
          :event-handlers="eventHandlers"
          :layouts="layouts"
          class="PopGrid--Network"
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
    </transition>
  </div>
</template>

<style scoped>
.splitPopGrid {
  display: grid;
  grid-template-columns: 10fr 3fr;
  grid-template-rows: 1fr 8fr;
  grid-template-areas:
    "header structure"
    "network structure";
}

.PopGrid--Header {
  grid-area: header;
  background: #0d3059;
}

.PopGrid--Structure {
  grid-area: structure;
  background-color: #ffd166;
}

.PopGrid--Network {
  grid-area: network;
}

.popup-inner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;

  height: 80%;
  width: 80%;
  background-color: #fff;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>