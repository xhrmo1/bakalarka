<template>
  <div class="box">
    <div class="optionBox">
      <span class="header">Naive Partitioning</span>
      <span
        ><b>Časová zložitost</b>: Amortizovaná časová zložitosť O(log(n))</span
      >
      <span
        ><b>Hrany v cestách:</b> Každá hrana môže byť <i>solid</i>, stačí ju
        pomocou operácii prekonvertovať</span
      >
      <span><b>Vnútorná štruktúra uzlu:</b></span>
      <div class="naive">
        <!--<span class="grid-naive-reversed">reversed: true</span>  -->
        <span class="grid-naive-reversed">reversed</span>
        <span class="grid-naive-weight">weight</span>
        <span class="grid-naive-pparent">pparent</span>
        <span class="grid-naive-netmin">netmin</span>
        <span class="grid-naive-netcost">netcost</span>
        <span class="grid-naive-bhead">bhead</span>
        <span class="grid-naive-bleft">bleft</span>
        <span class="grid-naive-bright">bright</span>
        <span class="grid-naive-btail">btail</span>
      </div>
      <div class="stretch"></div>
      <router-link to="/visualization/naive" custom v-slot="{ navigate }">
        <button @click="navigate" role="link" class="routerButton">
          Vybrať možnosť <b>Naive Partitioning</b>
        </button>
      </router-link>
    </div>
    <div class="optionBox">
      <span class="header">Partitioning by size</span>
      <span
        ><b>Časová zložitost</b>: Časová zložitosť za operáciu O(log(n))</span
      >
      <span
        ><b>Hrany v cestách:</b> Aby bola hrana <i> solid</i> musí mať vlastnosť
        <i>: size(parent(x)) &lt; 2 * size(x);</i></span
      >
      <span><b>Vnútorná štruktúra uzlu:</b></span>
      <div class="size">
        <!--<span class="grid-naive-reversed">reversed: true</span>  -->
        <span class="grid-naive-reversed">reversed</span>
        <span class="grid-naive-weight">weight</span>
        <span class="grid-naive-pparent">pparent</span>
        <span class="grid-naive-netmin">netmin</span>
        <span class="grid-naive-netcost">netcost</span>
        <span class="grid-naive-bhead">bhead</span>
        <span class="grid-naive-bleft">bleft</span>
        <span class="grid-naive-bright">bright</span>
        <span class="grid-naive-btail">btail</span>
        <span class="grid-naive-leftmin">leftmin</span>
        <span class="grid-naive-rightmin">rightmin</span>
        <span class="grid-naive-pathset">pathset</span>
      </div>
      <div class="stretch"></div>
      <router-link to="/visualization/size" custom v-slot="{ navigate }">
        <button @click="navigate" role="link" class="routerButton">
          Vybrať možnosť <b>Partitioning by Size</b>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.optionBox > span {
  padding-bottom: 5px;
}
.box {
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 1fr 1fr;
  font-size: 20px;
}

.optionBox {
  display: flex;
  flex-direction: column;
  margin: 18%;
  padding: 18px;
  background: rgba(40, 144, 192, 0.726);
}

.header {
  display: flex;
  font-size: 32px;
  justify-content: center;
}

.stretch {
  flex-grow: 1;
}

.naive {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    "reversed reversed weightt weightt pparent pparent"
    "netmin netmin netcost netcost bhead bhead"
    "bleft bleft bright bright btail btail";
  row-gap: 2px;
  column-gap: 2px;
}

.size {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-areas:
    "reversed reversed weightt weightt pparent pparent"
    "netmin netmin netcost netcost bhead bhead"
    "bleft bleft bright bright btail btail"
    "leftmin leftmin rightmin rightmin pathset pathset";
  row-gap: 2px;
  column-gap: 2px;
}

.naive > span {
  background-color: white;
  text-align: center;
}

.size > span {
  background-color: white;
  text-align: center;
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

.grid-naive-pathset {
  grid-area: pathset;
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
.grid-naive-bleft {
  grid-area: bleft;
}
.grid-naive-bright {
  grid-area: bright;
}
.grid-naive-btail {
  grid-area: btail;
}
.grid-naive-leftmin {
  grid-area: leftmin;
}
.grid-naive-rightmin {
  grid-area: rightmin;
}
.routerButton {
  background-color: #4caf4f7c; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition: all 0.5s ease-out 100ms;
}

.routerButton:hover {
  transform: scale(1.1);
  background-color: #4caf4f; /* Green */
}
</style>