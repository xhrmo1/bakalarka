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
      <div class="title">Uzol: {{ node.name }}</div>
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

    <div class="general" v-if="isNode">
      <span class="grid-general-parent"
        >rodic:
        <b>{{
          node.parent != null ? node.parent.target.name : "koreň"
        }}</b></span
      >
      <span class="grid-general-value"
        >hodnota: <b>{{ node.value != null ? node.value : "null" }}</b></span
      >
      <span class="grid-general-path"
        >cesta: <b>{{ node.pathPointer.name }} </b></span
      >
      <span class="grid-general-size"
        >size: <b>{{ node.size }}</b></span
      >
      <span v-if="node.children.length != 0" class="grid-general-children"
        >Potomkovia</span
      >
    </div>
    <div class="general2" v-if="isNode && node.children.length != 0">
      <template v-for="children in node.children" :key="children.target.name">
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
        >bhead: <b>{{ node.bhead.name }}</b></span
      >
      <span class="grid-naive-pleft"
        >pleft: <b>{{ node.pleft.name }}</b></span
      >
      <span class="grid-naive-pright"
        >pright: <b>{{ node.pright.name }}</b></span
      >
      <span class="grid-naive-btail"
        >btail: <b>{{ node.btail.name }}</b></span
      >
      <span v-if="sizeStruct" class="grid-naive-weight"
        >weight: <b>{{ node.weight }}</b></span
      >
      <span v-if="sizeStruct" class="grid-naive-netleftmin"
        >netleftmin: <b>{{ node.netleftmin }}</b></span
      >
      <span v-if="sizeStruct" class="grid-naive-netrightmin"
        >netrightmin: <b>{{ node.netrightmin }}</b></span
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
  },
  components: {
    Popup,
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
  height: 300px;
}
span {
  background-color: white;
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
}

.general {
  padding: 2px 0px 2px 0px;
  background-color: #0d3059;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "parent value"
    "path size"
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
  grid-template-columns: 1fr 1fr 1fr;

  margin: 0px 0px 0px 0px;
  row-gap: 2px;
  column-gap: 2px;
  font-size: 20px;
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
    "weightt weightt weightt weightt";

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
    "weightt weightt weightt weightt"
    "netleftmin netleftmin netrightmin netrightmin";
  row-gap: 2px;
  column-gap: 2px;
}

.grid-naive-weight {
  grid-area: weightt;
}

.grid-naive-netleftmin {
  grid-area: netleftmin;
}

.grid-naive-netrightmin {
  grid-area: netrightmin;
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
.grid-size-netleftmin {
  grid-area: netleftmin;
}
.grid-size-netrightmin {
  grid-area: netrightmin;
}
</style>