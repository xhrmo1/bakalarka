<template>
  <div class="mainDivide">
    <div class="main">
      <div class="valuesGrid">
        <span class="valuesGrid-item-header">Ponuka všetkých funkcií</span>
        <!-- vyber categórii -->
        <span class="valuesGrid-item-value1"> Kategórie funkcii:</span>
        <select
          name="whichCategory"
          id="categorySelector"
          @change="functionCategory"
          class="valuesGrid-item-item"
        >
          <option
            :key="key"
            v-for="(index, key) in categorySet"
            :value="index.category"
          >
            {{ index.name }}
          </option>
        </select>

        <!-- vyber funkcii -->
        <span class="valuesGrid-item-value2"> Výber funkcie:</span>
        <select
          name="whichFunction"
          id="functionSelector"
          @change="functionDetails"
          class="valuesGrid-item-item2"
        >
          <option
            :key="key"
            v-for="(index, key) in functionSet"
            :value="index.name"
            :v-if="false"
          >
            {{ index.name }}
          </option>
        </select>

        <button class="valuesGrid-item-item3" @click="runFunction">
          Spustiť funkciu
        </button>
        <button
          class="valuesGrid-item-item4"
          @click="undoLastOperation"
          :disabled="stepBackDisable"
        >
          Vrátiť späť
        </button>
      </div>

      <!-- možnosti pre nodes -->
      <div v-if="nodesCount != 0" class="valuesGrid">
        <span class="valuesGrid-item-header">Uzly</span>
        <template :key="key" v-for="(index, key) in nodesCount">
          <span :class="'valuesGrid-item-value' + index">{{
            nodesDefault[index]
          }}</span>
          <select
            name="whichCategory"
            :class="'valuesGrid-item-item' + index"
            :id="'node' + index"
          >
            <option :key="key" v-for="(index, key) in nodes" :value="index.id">
              {{ key }}
            </option>
          </select>
        </template>
      </div>

      <!-- možnosti pre paths -->
      <div v-if="pathsCount != 0" class="valuesGrid">
        <span class="valuesGrid-item-header">Cesty</span>
        <template :key="key" v-for="(index, key) in pathsCount">
          <span :class="'valuesGrid-item-value' + index">
            {{ pathsDefault[index] }}
          </span>
          <select
            name="whichCategory"
            :class="'valuesGrid-item-item' + index"
            :id="'path' + index"
          >
            <option
              :key="key"
              v-for="(index, key) in paths"
              :value="index.name"
            >
              {{ key }}
            </option>
          </select>
        </template>
      </div>

      <!-- možnosti pre values -->
      <div v-if="valuesCount != 0" class="valuesGrid">
        <span class="valuesGrid-item-header">Hodnoty</span>
        <template :key="key" v-for="(index, key) in valuesCount">
          <span :class="'valuesGrid-item-value' + index">
            {{ valuesDefault[index] }}
          </span>
          <input
            type="sem pojde hodnota"
            :class="'valuesGrid-item-item' + index"
            style="width: 50px"
            :id="'val' + index"
          />
        </template>
      </div>
    </div>

    <div v-if="currentlySelected != ''" class="mainDivide-desc">
      <div>
        <span style="font-weight: bold">Popis Funkcie</span>
      </div>
      <div>
        <span style="font-weight: bold">Argumenty: </span>
        <span> {{ description.args }} </span>
      </div>
      <div>
        <span style="font-weight: bold">Popis: </span>
        <span>{{ description.description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import functionData from "./functions.js";

export default {
  name: "BottomPart",
  data() {
    return {
      functionSet: functionData.functionSetX,
      categorySet: functionData.categorySetX,
      currentlySelected: "",
      nodesCount: 0,
      nodesDefault: ["", "x", "y", "z", "w"],
      pathsCount: 0,
      pathsDefault: ["", "p", "s", "t", "v"],
      valuesCount: 0,
      valuesDefault: ["", "a", "b", "c", "d"],
      description: "",
      code: 0,
      stepBackDisable: true,
      callFunctionData: {
        code: 0,
        nodes: [],
        paths: [],
        values: [],
      },
    };
  },
  props: ["nodes", "paths"],
  methods: {
    runFunction() {
      this.callFunctionData.nodes = [];
      this.stepBackDisable = false;
      for (let i = 1; i <= this.nodesCount; i++) {
        this.callFunctionData.nodes.push(
          document.getElementById("node" + i).value
        );
      }
      this.callFunctionData.paths = [];
      for (let i = 1; i <= this.pathsCount; i++) {
        this.callFunctionData.paths.push(
          document.getElementById("path" + i).value
        );
      }
      this.callFunctionData.values = [];
      for (let i = 1; i <= this.valuesCount; i++) {
        this.callFunctionData.values.push(
          document.getElementById("val" + i).value
        );
      }
      this.callFunctionData.code = this.code;
      console.log("XXX", this.callFunctionData);
      this.$emit("callFunction", this.callFunctionData);
      //console.log("aaa");
      //console.log(this.callFunctionData);
      //console.log("aaa");
    },
    undoLastOperation() {
      console.log("Krok späť");
      this.stepBackDisable = true;
      this.callFunctionData.code = 5;
      this.$emit("callFunction", this.callFunctionData);
    },
    functionDetails() {
      var e = document.getElementById("functionSelector");
      //console.log(e.value, "selector");
      this.currentlySelected = e.value;
      this.nodesCount = this.functionSet.find(
        (x) => x.name == e.value
      ).nodesInPath;
      this.pathsCount = this.functionSet.find((x) => x.name == e.value).paths;
      this.valuesCount = this.functionSet.find((x) => x.name == e.value).values;
      this.code = this.functionSet.find((x) => x.name == e.value).code;
      this.description = this.functionSet.find(
        (x) => x.name == e.value
      ).description;
    },
    functionCategory() {
      var e = document.getElementById("categorySelector");
      //console.log(e.value, "selector2", this.paths);

      this.functionSet = functionData.functionSetX.filter(
        (fnc) => fnc.category == e.value || e.value == "all" || fnc.name == ""
      );
      this.nodesCount = 0;
      this.pathsCount = 0;
      this.valuesCount = 0;
      this.description = 0;
      document.getElementById("functionSelector").selectedIndex = -1;
    },
  },
};
</script>

<style scoped>
.flexgrowXX {
  grid-area: picture;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-content: flex-end;
  align-items: flex-end;
  justify-items: flex-end;
}
img {
  max-height: 100%;
  max-width: 100%;
  min-width: 100%;
  min-height: 100%;
}

.mainDivide {
  max-height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "tech tech"
    "desc desc";
}

.mainDivide-desc {
  grid-area: desc;
  border-top: 5px solid #0d3059;
  background-color: #c4c4c4;
}

.main {
  grid-area: tech;
  display: flex;
  flex-direction: row;
}

.valuesGrid {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto auto auto 1fr;
  grid-template-areas:
    "header header"
    "value1 item1"
    "value2 item2"
    "item3 item4"
    "  .     .  ";
  margin: 0px 8px 0px 8px;
  font-size: 20px;
}
.valuesGrid-item-header {
  grid-area: header;
  background-color: #c4c4c4;
  text-align: center;
}
select {
  font-size: 20px;
}

.valuesGrid-item-value1 {
  grid-area: value1;
  background-color: white;
  padding: 0px 8px 0px 0px;
}
.valuesGrid-item-value2 {
  grid-area: value2;
  background-color: white;
  padding: 0px 8px 0px 0px;
}
.valuesGrid-item-value3 {
  grid-area: value3;
  background-color: white;
  padding: 0px 8px 0px 0px;
}

.valuesGrid-item-item1 {
  grid-area: item1;
}
.valuesGrid-item-item2 {
  grid-area: item2;
}
.valuesGrid-item-item3 {
  grid-area: item3;
}
.valuesGrid-item-value4 {
  grid-area: item4;
}
</style>