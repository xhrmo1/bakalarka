<template>
  <div class="container">
    <header class="header">
      <button
        @click="removeNodeFromClicked"
        class="btn"
        style="margin: 0px 0px 0px 8px"
      >
        X
      </button>
      <div class="title" v-if="basicDisplay">Uzol: {{ node.name }}</div>
      <div class="title" v-if="!basicDisplay">
        {{ isNode ? "Vonkajší uzol: " : "Vnútorný uzol: " }}{{ node.name }}
      </div>
      <button
        v-on:click="isHidden = !isHidden"
        class="btn"
        style="margin: 0px 8px 0px 0px"
      >
        ?
      </button>
    </header>

    <Popup
      v-if="isHidden"
      @changeHide="changeHidden"
      :whichPopup="'structure'"
    />
    <div class="explanation" v-if="isNode && basicDisplay">
      Základné informácie o uzli:
    </div>
    <div class="general" v-if="isNode && basicDisplay">
      <span class="grid-general-parent"
        >rodic:
        <b>{{
          node.parent != null ? node.parent.target.name : "koreň"
        }}</b></span
      >
      <span class="grid-general-size"
        >size: <b>{{ node.size }}</b></span
      >
      <span
        v-if="node.children != null && node.children.length != 0"
        class="grid-general-children"
        >Potomkovia</span
      >
    </div>
    <div
      class="general2"
      v-if="
        isNode &&
        basicDisplay &&
        node.children != null &&
        node.children.length != 0
      "
    >
      <template v-for="children in node.children" :key="children.target.name">
        <span>{{ children.target.name }}</span>
      </template>
    </div>
    <div class="explanation" v-if="isNode && basicDisplay">
      Informacie o vonkajšom uzle:
    </div>
    <div class="externalNode" v-if="isNode">
      <span class="externalNode-weight"><b>weight: </b>{{ node.weight }}</span>
      <span class="externalNode-externalBit"><b>external: </b>true</span>
      <span class="externalNode-bpath"
        ><b>bpath: </b>{{ node.pathPointer.name }}</span
      >
      <span class="externalNode-bparent"
        ><b>bparent: </b
        >{{ node.pParent != null ? node.pParent.name : "null" }}</span
      >
      <span
        class="externalNode-dparent"
        v-if="
          node.parent != null &&
          node.parent.target.pathPointer.name != node.pathPointer.name
        "
        ><b>dparent: </b>{{ node.parent.target.pathPointer.name }}</span
      >
      <span
        class="externalNode-dcost"
        v-if="
          node.parent != null &&
          node.parent.target.pathPointer.name != node.pathPointer.name
        "
        ><b>dcost: </b>{{ node.value }}</span
      >
      <span
        class="externalNode-pathset"
        v-if="isNode && sizeStruct && pathSetList.length != 0"
        ><b>Pathset:</b></span
      >
    </div>
    <div
      class="general2"
      v-if="isNode && sizeStruct && pathSetList.length != 0"
    >
      <template v-for="children in pathSetList" :key="children.target.name">
        <span>{{ children.target.name }}</span>
      </template>
    </div>
    <div :class="sizeStruct ? 'size' : 'naive'" v-if="isInternalNode">
      <!--<span class="grid-naive-reversed">reversed: true</span>  -->
      <span class="grid-naive-pparent"
        >pParent:
        <b>{{
          node.pParent != null ? node.pParent.name : "this is root"
        }}</b></span
      >
      <span class="grid-naive-netmin"
        >netmin: <b>{{ node.netmin }}</b></span
      >
      <span class="grid-naive-netcost"
        >netcost: <b>{{ node.netcost }}</b></span
      >
      <span class="grid-naive-bhead"
        >bhead:
        <b>{{ node.reversed ? node.btail.name : node.bhead.name }}</b></span
      >
      <span class="grid-naive-pleft"
        >pleft: <b>{{ node.pleft.name }}</b></span
      >
      <span class="grid-naive-pright"
        >pright: <b>{{ node.pright.name }}</b></span
      >
      <span class="grid-naive-btail"
        >btail:
        <b>{{ node.reversed ? node.bhead.name : node.btail.name }}</b></span
      >
      <span class="grid-naive-weight"
        >weight: <b>{{ node.weight }}</b></span
      >
      <span class="grid-naive-reversed"
        >reversed: <b>{{ node.reversed }}</b></span
      >
      <span v-if="sizeStruct" class="grid-naive-leftmin"
        >leftmin:
        <b>{{ node.reversed ? node.rightmin : node.leftmin }}</b></span
      >
      <span v-if="sizeStruct" class="grid-naive-rightmin"
        >rightmin:
        <b>{{ node.reversed ? node.leftmin : node.rightmin }}</b></span
      >
    </div>
  </div>
</template>
<script>
import Popup from "./PopUpForm.vue";

export default {
  name: "StructureItem",
  props: {
    node: Object,
    isNode: Boolean,
    isInternalNode: Boolean,
    sizeStruct: Boolean,
    basicDisplay: Boolean,
  },
  components: {
    Popup,
  },
  computed: {
    pathSetList() {
      console.log("XXXXXXXXX", this.node);
      if (this.node.children != null) {
        return this.node.children.filter(
          (c) => c.target.pathPointer.name != this.node.pathPointer.name
        );
      }
      console.log("XXXXXXXXX2", this.node);
      return [];
    },
  },
  data() {
    return {
      isHidden: false,
    };
  },
  methods: {
    changeHidden() {
      this.isHidden = !this.isHidden;
    },
    removeNodeFromClicked() {
      console.log("structureItem");
      this.$emit("removeNodeFromClicked", this.node);
    },
  },
  emit: ["removeNodeFromClicked"],
};
</script>

<style scoped>
@import "../assets/generalstyles.css";

.container {
  margin: 8px;
}
span {
  background-color: white;
}

.explanation {
  padding: 3px;
}

.externalNode {
  padding: 0px 0px 2px 0px;
  background-color: #0d3059;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "weight externalBit"
    "bparent bpath "
    "dparent dcost"
    "pathset pathset";
  column-gap: 2px;
  font-size: 20px;
}
.externalNode > span {
  margin-top: 2px;
}
.externalNode-weight {
  grid-area: weight;
}

.externalNode-externalBit {
  grid-area: externalBit;
}

.externalNode-bparent {
  grid-area: bparent;
}
.externalNode-bpath {
  grid-area: bpath;
}
.externalNode-dparent {
  grid-area: dparent;
}
.externalNode-dcost {
  grid-area: dcost;
}
.externalNode-pathset {
  grid-area: pathset;
}

.stucture-definition {
  width: 100%;
  background-color: none;
  display: flex;
  justify-content: start;
}

.header {
  width: 100%;
  font-size: 32px;
  margin: 8px 0px 8px 0px;
  display: flex;
}

.title {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  font-size: 24px;
}

.general {
  padding: 2px 0px 2px 0px;
  background-color: #0d3059;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas:
    "parent size"
    "children children";
  row-gap: 2px;
  column-gap: 2px;
  font-size: 20px;
}
.general2 {
  padding: 0px 0px 2px 0px;
  background-color: #0d3059;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  row-gap: 2px;
  column-gap: 2px;
  font-size: 20px;
  text-align: center;
}

.grid-general-dparent {
  grid-area: dparent;
}
.grid-general-dcost {
  grid-area: dcost;
}
.grid-general-parent {
  grid-area: parent;
}
.grid-general-value {
  grid-area: value;
}
.grid-general-path {
  grid-area: path;
}
.grid-general-size {
  grid-area: size;
}
.grid-general-children {
  grid-area: children;
  text-align: center;
}
.grid-general-child1 {
  grid-area: child1;
}
.grid-general-child2 {
  grid-area: child2;
}
.grid-general-child3 {
  grid-area: child3;
}
.grid-general-child4 {
  grid-area: child4;
}
.grid-general-child5 {
  grid-area: child5;
}
.grid-general-child6 {
  grid-area: child6;
}

.naive {
  background-color: #0d3059;
  width: 100%;
  display: grid;
  padding: 2px 0px 2px 0px;
  margin: 0px 0px 12px 0px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas:
    "pparent pparent pparent pparent"
    "netmin netmin netcost netcost"
    "bhead bhead btail btail"
    "pleft pleft pright pright"
    "weightt weightt reversed reversed";

  row-gap: 2px;
  column-gap: 2px;
}

.size {
  background-color: #0d3059;
  width: 100%;
  display: grid;
  padding: 2px 0px 2px 0px;
  margin: 0px 0px 12px 0px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas:
    "pparent pparent pparent pparent"
    "netmin netmin netcost netcost"
    "bhead bhead btail btail"
    "pleft pleft pright pright"
    "weightt weightt reversed reversed"
    "leftmin leftmin rightmin rightmin";
  row-gap: 2px;
  column-gap: 2px;
}

.grid-naive-weight {
  grid-area: weightt;
}

.grid-naive-leftmin {
  grid-area: leftmin;
}

.grid-naive-rightmin {
  grid-area: rightmin;
}

.grid-naive-reversed {
  grid-area: reversed;
}
.grid-naive-pparent {
  grid-area: pparent;
}
.grid-naive-netmin {
  grid-area: netmin;
}
.grid-naive-netcost {
  grid-area: netcost;
}
.grid-naive-bhead {
  grid-area: bhead;
}
.grid-naive-pleft {
  grid-area: pleft;
}
.grid-naive-pright {
  grid-area: pright;
}
.grid-naive-btail {
  grid-area: btail;
}
.grid-size-weight {
  grid-area: weightt;
}
.grid-size-leftmin {
  grid-area: leftmin;
}
.grid-size-rightmin {
  grid-area: rightmin;
}
</style>