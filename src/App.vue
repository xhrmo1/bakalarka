<template>
  <div class="mainWindow">
    <div class="networkWindow">
      <Header class="grid-item-header">bakalarkska praca</Header>
      <Paths
        class="grid-item-path"
        v-model="paths"
        :allPaths="paths"
        :treeOut="treeDataStructure"
        :treeDataStructure="treeDataStructure"
        @pathsChange="allPathsChange"
        >cesta</Paths
      >
      <HelloWorld
        class="mojeee grid-item-network"
        @customChange="logChange"
        @nodeRemove="nodeRemove"
        @treeOut="treeOut"
        @removeNode="getEmit"
        @nodesOut="nodesOut"
        @pathsOut="pathsOut"
        :text="txt"
        :callFunction="callFunctionData"
      />
      <Structure
        class="grid-item-structure"
        :clickedNodes="clickedNodes"
        :treeDataStructure="treeDataStructure"
        :whichStructure="'basic'"
        @removeNode="getEmit"
        >vpravo</Structure
      >
      <Bottom
        class="grid-item-textarea"
        :nodes="nodes"
        :edges="edges"
        :paths="paths"
        @callFunction="callFunction"
      ></Bottom>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Structure from "./components/StructureForm.vue";
import Paths from "./components/PathsForm.vue";
import Header from "./components/HeaderForm.vue";
import Bottom from "./components/BottomPart.vue";

let xxx = [];

export default {
  name: "App",
  components: {
    HelloWorld,
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
      treeDataStructure: [],
      txt: "path1",
      callFunctionData: [],
    };
  },
  methods: {
    callFunction(value) {
      console.log(value, "emit value callfunction");
      this.callFunctionData = value;
      console.log(this.callFunctionData, "emit value callfunction");
    },
    xxxx() {
      this.paths["path1"].canSee = false;
      this.txt = "path2";
      console.log("xxxx", this.txt);
    },
    logChange(node) {
      if (!this.clickedNodes.includes(node)) {
        this.clickedNodes.push(node);
      }
    },
    getEmit(node) {
      this.clickedNodes.splice(this.clickedNodes.indexOf(node), 1);
    },
    pathsOut(object) {
      console.log("paths", object);
      this.paths = object;
    },
    nodesOut(object) {
      this.nodes = object;
    },
    edgesOut(object) {
      this.edges = object;
    },
    nodeRemove(object) {
      this.clickedNodes.splice(this.clickedNodes.indexOf(object), 1);
    },
    treeOut(object) {
      this.treeDataStructure = object;
      let x = object;
      console.log("treeDataStrucute", this.treeDataStructure, object, x);
      // this.treeDataStructure.filter((x) => x.StructBasic.name == "node1");
    },
    allPathsChange(obj, id) {
      this.paths[id].canSee = obj;
      this.paths[id].width = 40;
    },
  },
};
</script>

<style>
/*.mojeee {
  height: 70vh !important;
}*/
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
