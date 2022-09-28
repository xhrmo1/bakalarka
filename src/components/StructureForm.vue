<template>
  <div style="overflow-y: auto">
    <div
      class="container"
      :key="key"
      v-for="(value, key) in clickedNodes.slice().reverse()"
    >
      <StructureItem
        class="item1"
        :node="
          this.treeDataStructure[0].filter(
            (x) => x.StructBasic.name == value
          )[0]
        "
        :whichStructure="this.whichStructure"
        @removeNode="getEmit"
      />
    </div>
  </div>
</template>

<script>
import StructureItem from "./StructureItem.vue";

export default {
  name: "StructureForm",
  components: {
    StructureItem,
  },
  data() {
    return {
      clickedNodesa: {
        node1: {
          name: "aaa",
        },
      },
    };
  },
  props: {
    whichStructure: String,
    clickedNodes: {
      node1: Object,
      node2: Object,
    },
    treeDataStructure: Object,
  },
  emit: ["removeNode"],
  methods: {
    clickxx() {
      console.log(this.treeDataStructure, "treeDataStr");
      let x = this.treeDataStructure.filter(
        (x) => x.StructBasic.name == "N1"
      )[0];
      console.log(x.StructBasic.value);
    },
    getEmit(node) {
      this.$emit("removeNode", node);
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.item1 {
  flex: 1;
  background: #c4c4c4;
  width: calc(100% - 16px);
  border-radius: 16px;
  border-style: solid;
  border-color: #0d3059;
}
</style>