<template>
  <div>
    <transition name="fade" appear>
      <div class="modal-overlay" @click="$emit('changeHide')"></div>
    </transition>
    <transition name="slide" appear>
      <div class="popup-inner">
        <h2 v-if="whichPopup == 'structure'">Nápoveda o štruktúre</h2>
        <h2 v-if="whichPopup == 'paths'">Nápoveda o ceste</h2>
        <button class="popup-close" @click="$emit('changeHide')">
          Zavrieť
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    whichPopup: String,
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
  max-width: 400px;
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
</style>