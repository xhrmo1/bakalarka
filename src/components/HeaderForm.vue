<template>
  <div class="container">
    <div class="flex-item1">
      <span class="title"
        >DATOVÁ ŠTRUKTÚRA PRE REPREZENTÁCIU DYNAMICKÝCH STROMOV</span
      >
      <span class="author">Bakalárska práca, Lukáš Hrmo, FI MUNI, 2022</span>
    </div>
    <div class="flex-item2">
      <img src="../assets/logo.png" alt="masaryk_logo" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.title {
  font-size: 30px;
  font-weight: 500;
}
.author {
  font-size: 16px;
}
.flex-item1 {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}
.flex-item2 {
  margin: 0px 64px 0px 0px;
}
.container {
  display: flex;
}
img {
  min-width: 100%;
  max-height: 100%;
}
</style>