<template>
  <div>
    <transition name="fade" appear>
      <div class="modal-overlay" @click="$emit('changeHide')"></div>
    </transition>
    <transition name="slide" appear>
      <div class="popup-inner">
        <structureExplanation
          v-if="whichPopup == 'structure'"
          :isInternalNode="isInternalNode"
          :sizeStruct="this.$route.params.type == 'size'"
        />
        <pathExplanation v-if="whichPopup == 'paths'" />
        <h2 v-if="whichPopup == 'functionOutput'">
          Vystup funkcie: <b>{{ dataAbout.functionName }}</b>
        </h2>
        <div v-if="whichPopup == 'functionOutput'" v-html="dataAbout.text" />
        <div class="popup-close">
          <button class="popup-closeButton" @click="$emit('changeHide')">
            Zavrieť
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import pathExplanation from "../explanations/pathExplanation.vue";
import structureExplanation from "../explanations/structureExplanation.vue";
export default {
  components: {
    pathExplanation,
    structureExplanation,
  },
  props: {
    isInternalNode: Boolean,
    whichPopup: String,
    dataAbout: Object, // functionName,  text
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-inner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;

  width: 100%;
  max-width: 401px;
  background-color: #fff;
  border-radius: 16px;

  padding: 25px;
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

.popup-close {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}
</style>