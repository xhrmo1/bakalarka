<template>
  <div class="mainWindow">
    <div class="networkWindow">
      <Header class="grid-item-header" />
      <Paths
        class="grid-item-path"
        v-model="paths"
        :count="
          treeDataStructure.pathRoots != null
            ? treeDataStructure.pathRoots.length
            : 0
        "
        :treeOut="treeDataStructure"
        @pathsChange="allPathsChange"
      />
      <GraphForm
        class="mojeee grid-item-network"
        @selectNode="selectNode"
        @nodeRemove="nodeRemove"
        @treeOut="treeOut"
        @removeNode="removeNodeFromClicked"
        @nodesOut="nodesOut"
        @pathsOut="pathsOut"
        @replaceSelectedNodes="replaceSelectedNodes"
        :callFunction="callingFunction"
      />
      <Structure
        class="grid-item-structure"
        :basicDisplay="true"
        :key="componentKey"
        :clickedNodes="clickedNodes"
        :whichStructure="'basic'"
        @removeNodeFromClicked="removeNodeFromClicked"
      />
      <Bottom
        class="grid-item-textarea"
        :nodes="nodes"
        :edges="edges"
        :paths="paths"
        @callFunction="callFunction"
      />
    </div>
  </div>
</template>

<script>
import GraphForm from "../components/GraphForm.vue";
import Structure from "../components/StructureForm.vue";
import Paths from "../components/PathsForm.vue";
import Header from "../components/HeaderForm.vue";
import Bottom from "../components/BottomPart.vue";
import * as nodeClass from "../implementation/nodeClass";
import { findNodeArray } from "../implementation/treeFunctions";

export default {
  name: "App",
  components: {
    GraphForm,
    Structure,
    Paths,
    Header,
    Bottom,
  },
  data() {
    return {
      clickedNodes: [],
      paths: Object,
      nodes: Object,
      edges: Object,
      treeDataStructure: [], // tu mam ulozene info o cestach
      txt: "path1",
      callingFunction: { code: 0 },
      componentKey: 0,
    };
  },
  methods: {
    callFunction(value) {
      this.callingFunction = value;
      //console.log(this.callingFunction, "emit value callfunction");
    },
    selectNode(node) {
      if (!this.clickedNodes.includes(node)) {
        this.clickedNodes.push(node);
      }
    },
    removeNodeFromClicked(node) {
      console.log(node);
      this.clickedNodes.splice(this.clickedNodes.indexOf(node), 1);
    },
    pathsOut(object) {
      //console.log("paths", object);
      this.paths = object;
    },
    nodesOut(object) {
      this.componentKey += 1;
      console.log("changing");
      this.nodes = object;
    },
    edgesOut(object) {
      this.componentKey += 1;
      console.log("changing");
      this.edges = object;
    }, // deprecated
    nodeRemove(object) {
      this.clickedNodes.splice(this.clickedNodes.indexOf(object), 1);
    },
    treeOut(object) {
      console.log("TREEE OUT");
      this.clickedNodes;
      this.componentKey += 1;
      this.treeDataStructure = object;
      let x = object;
      //console.log("treeDataStrucute", this.treeDataStructure, object, x);
      // this.treeDataStructure.filter((x) => x.StructBasic.name == "node1");
    },
    allPathsChange(obj, id) {
      this.paths[id].canSee = obj;
    },
    replaceSelectedNodes() {
      let clickedNodesNew = [];
      for (let s of this.clickedNodes) {
        let node = findNodeArray(this.treeDataStructure.basicRoots, s.name);
        if (node != null) {
          clickedNodesNew.push(node);
        }
      }
      this.clickedNodes.splice(0, this.clickedNodes.length);
      this.clickedNodes = this.clickedNodes.concat(clickedNodesNew);
    },
  },
};
</script>

<style>
.mainWindow {
  background-color: chartreuse;
  height: 100vh;
  width: 100%;

  padding: 0;
  margin: 0;
}

.networkWindow {
  height: 100vh;
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-columns: 2fr 10fr 4fr;
  grid-template-rows: 10% 70% 20%;
  grid-template-areas:
    "header header header"
    "path network structure"
    "textarea  textarea   structure";
}
.grid-item-path {
  grid-area: path;
  background-color: #ef476f;
  height: 100%;
  width: 100%;
}

.grid-item-network {
  grid-area: network;
}

.grid-item-structure {
  grid-area: structure;
  background-color: #ffd166;
}

.grid-item-textarea {
  grid-area: textarea;
  background: #06d6a0;
}
.grid-item-header {
  grid-area: header;
  background-color: #0d3059;
}
</style>
