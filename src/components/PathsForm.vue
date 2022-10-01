<template>
  <div>
    <div class="title">
      <span style="flex-grow: 1">Cesty</span>
      <button v-on:click="isHidden = !isHidden" class="btn">?</button>
    </div>

    <div class="title" style="border-bottom: 6px solid #0d3059">
      <button style="flex-grow: 1" @click="inputChange(false)">
        Schovať všetky
      </button>
      <button style="flex-grow: 1" @click="inputChange(true)">
        Ukázať všetky
      </button>
    </div>

    <div
      :key="key"
      v-for="(value, key) in modelValue"
      class="pathComponent"
      :style="'border-color: ' + value.color"
    >
      <label style="flex-grow: 1">
        {{ key }}
      </label>
      <button
        v-on:click="
          boolPopUpStructure = !boolPopUpStructure;
          clickedId = value.id;
        "
        class="btn"
      />
      <label class="switch">
        <input
          type="checkbox"
          id="key"
          name="path"
          value="Bike"
          v-model="value['canSee']"
        />

        <div>
          <span></span>
        </div>
      </label>
    </div>

    <Popup v-if="isHidden" @changeHide="changeHidden" :whichPopup="'paths'" />
    <PopUpStructure
      v-if="boolPopUpStructure"
      @changePopUpStructure="showPopUpStructure"
      :pathTree="this.treeOut[1].filter((x) => x.name == this.clickedId)"
      :naivePartition="true"
      :treeDataStructure="treeOut"
    ></PopUpStructure>
  </div>
</template>

<script>
import PopUpStructure from "./PopUpStructure.vue";
import Popup from "./PopUpForm.vue";
import data from "./data";
//console.log(data.paths);
export default {
  components: {
    Popup,
    PopUpStructure,
  },
  props: ["modelValue", "treeOut"],
  data() {
    return {
      isHidden: false,
      boolPopUpStructure: false,
      clickedId: 0,
      pathsss: data.paths,
      nodesss: data.edges,
    };
  },
  methods: {
    changeHidden() {
      this.isHidden = !this.isHidden;
    },
    showPopUpStructure() {
      this.boolPopUpStructure = !this.boolPopUpStructure;
      //console.log(this.treeOut[1][1], "pensasis");
      /*console.log(
        this.treeOut[1].filter((x) => x.name == this.clickedId)[0].allNodes
      );*/
      //console.log(this.clickedId);
    },
    inputChange(obj) {
      for (var x in this.modelValue) {
        this.$emit("pathsChange", obj, x);
      }
      var ele = document.getElementsByName("path");
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == "checkbox") ele[i].checked = obj;
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/generalstyles.css";
.title {
  display: flex;
  padding: 8px 8px 0px 8px;
  margin: 0px 0px 8px 0px;
}

.pathComponent {
  display: flex;
  background-color: #c4c4c4;
  margin: 0px 8px 8px 8px;
  padding: 4px 8px 2px 8px;
  border-radius: 8px;
  border-bottom: 6px solid;
}

.switch {
  --line: #0d3059;
  --dot: #0d3059;
  --circle: #0d3059;
  --duration: 0.3s;
  --text: #9ea0be;
  cursor: pointer;
}
.switch input {
  display: none;
}
.switch input + div {
  position: relative;
}
.switch input + div:before,
.switch input + div:after {
  --s: 1;
  content: "";
  position: absolute;
  height: 4px;
  top: 10px;
  width: 24px;
  background: var(--line);
  transform: scaleX(var(--s));
  transition: transform var(--duration) ease;
}
.switch input + div:before {
  --s: 0;
  left: 0;
  transform-origin: 0 50%;
  border-radius: 2px 0 0 2px;
}
.switch input + div:after {
  left: 28px;
  transform-origin: 100% 50%;
  border-radius: 0 2px 2px 0;
}
.switch input + div span {
  padding-left: 56px;
  line-height: 24px;
  color: var(--text);
}
.switch input + div span:before {
  --x: 0;
  --b: var(--circle);
  --s: 4px;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 var(--s) var(--b);
  transform: translateX(var(--x));
  transition: box-shadow var(--duration) ease, transform var(--duration) ease;
}
.switch input + div span:not(:empty) {
  padding-left: 64px;
}
.switch input:checked + div:before {
  --s: 1;
}
.switch input:checked + div:after {
  --s: 0;
}
.switch input:checked + div span:before {
  --x: 28px;
  --s: 12px;
  --b: var(--dot);
}
* {
  box-sizing: inherit;
}
*:before,
*:after {
  box-sizing: inherit;
}
</style>
