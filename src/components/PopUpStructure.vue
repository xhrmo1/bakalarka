
<script setup lang="ts">
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import { Nodes, Edges, Layouts } from "v-network-graph";
import * as vNG from "v-network-graph";
import data from "./data";
import functionSwitch from "../tsFunctions/mainFunctions";
import Structure from "./StructureForm.vue";
import * as nodeClass from "../tsFunctions/nodeClass";

var nodes: Nodes = reactive({ ...data.nodes });
var edges: Edges = reactive({ ...data.edges });

var nextNodeIndex = ref(Object.keys(nodes).length + 1);
var nextEdgeIndex = ref(Object.keys(edges).length + 1);

var selectedNodes = ref<string[]>([]);
var selectedEdges = ref<string[]>([]);

const props = defineProps({
  pathTree: Object,
  pathStructure: Boolean,
});

console.log("this prop is text", props.pathTree);
var clickedNodes: any[] | undefined = reactive([]);
const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    if (node == null || clickedNodes == null) {
      return;
    }
    let x = findinPath(props.pathTree, nodes[node].name ?? "");
    if (x != null && !clickedNodes.includes(x)) {
      clickedNodes.push(x);
    }
    console.log("CLICKEDNODES", clickedNodes);
  },
};

function findinPath(pathTree: any, lookingName: string) {
  for (let p of pathTree) {
    let x = findProcess(p.pathRoot, lookingName);
    if (x != null) {
      return x;
    }
  }
  return null;
}

function findProcess(
  p: nodeClass.PathStructure | nodeClass.StructBasic,
  lookingName: string
): nodeClass.PathStructure | nodeClass.StructBasic | null {
  if (p.name == lookingName) {
    return p;
  }
  if (p instanceof nodeClass.StructBasic) {
    return null;
  }
  let node: nodeClass.PathStructure | nodeClass.StructBasic | null = null;
  if (p.bleft != null) {
    node = findProcess(p.bleft, lookingName);
  }
  if (node != null) {
    return node;
  }
  if (p.bright != null) {
    node = findProcess(p.bright, lookingName);
  }
  if (node != null) {
    return node;
  }
  return null;
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    delete nodes[nodeId];
  }
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
    nodes = {};
    edges = {};

    console.log(nodes);
    var id = 0;
    var idEdge = 0;

    var depth = Math.ceil(Math.log2(x[0].allNodes.length));
    inside(x[0].pathRoot, 0, depth, 0, depth);

    function inside(
      node: any,
      baseX: number,
      axisX: number,
      axisY: number,
      distance: number
    ) {
      layouts.nodes[id] = { x: baseX, y: axisY * 50 };
      nodes[id] = { name: node.name };
      var pParentId = "a";
      if (node.pParent != null) {
        for (let index in nodes) {
          if (nodes[index].name == node.pParent.name) {
            pParentId = index;
          }
        }
        edges[idEdge] = {
          source: pParentId,
          target: id.toString(),
        };
        idEdge++;
      }
      id++;
      if (!node.reversed) {
        if (node.bleft != null) {
          inside(
            node.bleft,
            baseX - 50 * axisX,
            axisX - (1 * distance) / 2,
            axisY + 1,
            distance / 2
          );
        }
        if (node.bright != null) {
          inside(
            node.bright,
            baseX + 50 * axisX,
            axisX - (1 * distance) / 2,
            axisY + 1,
            distance / 2
          );
        }
      } else {
        if (node.bright != null) {
          inside(
            node.bright,
            baseX - 50 * axisX,
            axisX - (1 * distance) / 2,
            axisY + 1,
            distance / 2
          );
        }
        id++;
        if (node.bleft != null) {
          inside(
            node.bleft,
            baseX + 50 * axisX,
            axisX - (1 * distance) / 2,
            axisY + 1,
            distance / 2
          );
        }
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

function removeNodeFromClicked(node: any) {
  clickedNodes?.splice(clickedNodes.indexOf(node.name), 1);
}
</script>

<template>
  <div>
    <transition name="fade" appear>
      <div class="modal-overlay" @click="$emit('changePopUpStructure')"></div>
    </transition>
    <transition name="slide" appear>
      <div class="splitPopGrid popup-inner">
        <Structure
          class="PopGrid--Structure"
          :basicDisplay="false"
          :clickedNodes="clickedNodes"
          :whichStructure="props.pathStructure ? 'naive' : 'size'"
          @removeNodeFromClicked="removeNodeFromClicked"
        />
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
    "network structure"
    "network structure";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  height: 90%;
  width: 90%;

  background-color: #fff;
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