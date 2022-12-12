<template>
  <div style="overflow-y: auto">
    <div class="sorting sortingLine">
      <select
        @change="sort"
        class="sorting"
        id="sortingSelector"
        style="margin: 5px 5px 0px 5px"
      >
        <option
          :key="key"
          v-for="(index, key) in sortingOptions"
          :value="index.by"
        >
          {{ index.name }}
        </option>
      </select>
    </div>
    <div
      class="container"
      :key="key"
      v-for="(value, key) in clickedNodes.slice().reverse()"
    >
      <StructureItem
        class="item1"
        :basicDisplay="basicDisplay"
        :node="value"
        :isNode="value.hasOwnProperty('pathPointer')"
        :isInternalNode="value.hasOwnProperty('bleft')"
        :sizeStruct="this.$route.params.type == 'size'"
        @removeNodeFromClicked="removeNodeFromClicked"
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
      sortingOptions: [
        { name: "Radenie uzlov podľa kliknutia ASC", by: "clickASC" },
        { name: "Radenie uzlov podľa kliknutia DESC", by: "clickDESC" },
        { name: "Radenie uzlov abecedne ASC", by: "alphaASC" },
        { name: "Radenie uzlov abecedbe DESC", by: "alphaDESC" },
      ],
    };
  },
  props: {
    basicDisplay: Boolean,
    whichStructure: String,
    clickedNodes: {
      node1: Object,
      node2: Object,
    },
  },
  emit: ["removeNodeFromClicked", "sortClickedNodes"],
  methods: {
    removeNodeFromClicked(node) {
      this.$emit("removeNodeFromClicked", node);
    },
    sort(value) {
      let by = document.getElementById("sortingSelector");
      this.$emit("sortClickedNodes", by.value);
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
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-style: solid;
  border-color: #0d3059;
}
.sortingLine {
  border-bottom: 6px solid #0d3059;
}
.sorting {
  display: flex;
  flex-grow: 1;
  font-size: 20px;
}
</style>