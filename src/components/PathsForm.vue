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
    <div class="overflowing">
      <div
        :key="key"
        v-for="(value, key) in modelValue"
        class="pathComponent underlinePathComponent"
        :style="'border-color: ' + value.color"
      >
        <label style="flex-grow: 1">
          {{ key }}
        </label>
        <i
          v-on:click="
            boolPopUpStructure = !boolPopUpStructure;
            clickedId = value.id;
          "
          class="gg-search"
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
      <span class="title" style="border-top: 6px solid #0d3059; font-size: 14px"
        >Cesty s jednym uzlom</span
      >
      <div
        :key="key"
        v-for="(value, key) in onePathStructureFunction()"
        class="pathComponent"
      >
        <label style="flex-grow: 1">
          {{ value.name }}
        </label>
        <label>
          {{ value.allNodes[0].name }}
        </label>
      </div>

      <Popup v-if="isHidden" @changeHide="changeHidden" :whichPopup="'paths'" />
      <PopUpStructure
        v-if="boolPopUpStructure"
        @changePopUpStructure="showPopUpStructure"
        :pathTree="
          this.treeOut.pathRoots.filter((x) => x.name == this.clickedId)
        "
        :pathStructure="true"
        :treeDataStructure="treeOut"
      ></PopUpStructure>
    </div>
  </div>
</template>

<script>
import PopUpStructure from "./PopUpStructure.vue";
import Popup from "./PopUpForm.vue";
import data from "./data";
export default {
  components: {
    Popup,
    PopUpStructure,
  },
  props: ["modelValue", "treeOut", "count"],
  data() {
    return {
      isHidden: false,
      boolPopUpStructure: false,
      clickedId: 0,
      pathsss: data.paths,
      nodesss: data.edges,
    };
  },
  setup() {},
  computed: {
    onePathStructure: function () {
      if (this.treeOut.pathRoots != null) {
        return this.treeOut.pathRoots.filter((i) => i.allNodes.length == 1);
      }
      return [{ name: "aaa", allNodes: [{ name: "a" }] }];
    },
  },
  methods: {
    onePathStructureFunction() {
      console.log(this.treeOut.pathRoots);
      if (this.treeOut.pathRoots != null) {
        let xx = this.treeOut.pathRoots.filter((i) => i.allNodes.length == 1);
        console.log(xx[0].allNodes[0].name);
        return xx;
      }
    },
    changeHidden() {
      this.isHidden = !this.isHidden;
    },
    showPopUpStructure() {
      this.boolPopUpStructure = !this.boolPopUpStructure;
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
.overflowing {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 80%;
}
.title {
  display: flex;
  padding: 8px 8px 0px 8px;
  margin: 0px 0px 8px 0px;
}

.underlinePathComponent {
  border-bottom: 6px solid;
}

.pathComponent {
  display: flex;
  background-color: #c4c4c4;
  margin: 0px 8px 8px 8px;
  padding: 4px 8px 2px 8px;
  border-radius: 8px;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
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
.gg-search {
  box-sizing: border-box;
  position: relative;
  transform: scale(var(--ggs, 1));
  width: 16px;
  height: 16px;
  border: 3px solid;
  border-radius: 100%;
  margin-left: -4px;
  margin-top: -4px;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  margin-right: 12px;
  color: #0d3059;
}
.gg-search::after {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  border-radius: 3px;
  width: 4px;
  height: 9px;
  background: currentColor;
  transform: rotate(-45deg);
  top: 11px;
  left: 13px;
}
</style>
