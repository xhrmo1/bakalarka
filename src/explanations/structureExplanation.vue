<template>
  <div v-if="!isInternalNode">
    <h2>Základné informácie o uzle</h2>
    Samotná štruktúra ST-Trees nepracuje s týmito atribútmi. Slúži to ako
    nápoveda pre použivateľa, v prípade že by mu graf prišiel neprehľadný
    <ol>
      <li><b>Rodič:</b> Uzol, ktorý je rodič pre daný uzol</li>
      <li><b>Size:</b> Označuje počet všetký potomkov uzla + 1</li>
      <li><b>Potomkovia</b> Všetky uzly, ktoré su potomkom daného uzla</li>
    </ol>
    <div class=""></div>
    <h2>Nápoveda o štruktúre vonkajšieho uzla</h2>
    <p>
      Uzol, ktorý je zakreslený v grafe. Vonkajšie uzly tvoria listy vo
      virtuálnom strome. Prvým listom je najspodnejší uzol v ceste, pretože
      cesty zapisujeme zdola nahor. Počet listov sa rovná počtu uzlov v ceste.
      Každý list má uložený odkaz na svojho rodiča (vnútorný uzol) pomocou
      hodnoty bparent. Rodičom pre vonkajší uzol je vnútorný uzol. Taktiež každý
      list má uložené, do ktorej cesty patrí ako bpath.
    </p>
    <p>
      <span
        >Štruktúra vonkajšieho uzlu závisi od zvoleného spôsobu dátovej
        štruktúry.
        <br />
        Aktuálne máte zvolený spôsob:
        <b>{{ sizeStruct ? "Partitioning by Size" : "Naive Partitioning" }}</b>
      </span>
      <br />
      <span>Ukážka všetkých atribútov, ktorý daný uzol môže nadobúdať</span>
      <img v-if="sizeStruct" class="image" src="./outerNodeSize.png" alt="" />
      <img v-if="!sizeStruct" class="image" src="./outerNodeNaive.png" alt="" />
    </p>
  </div>
  <div v-if="isInternalNode">
    <h2>Nápoveda o vnútornom uzle</h2>
    <p>
      Uzol nie je zakreslený v grafe. Vidíme ho iba pri vykreslení virtuálneho
      stromu. Každý vnútorný uzol symbolizuje jednu hranu z cesty. Štruktúra
      vnútorného uzla záleží podľa typu použitej dátovej štruktúry: Naive
      partitioning alebo Partition by Size. Tieto štruktúry si detailnejšie
      predstavíme neskôr v práci. Práve vďaka týmto uzlom sme schopní rýchlo a
      efektívne vykonávať operácie na stromoch. Vnútorný uzol x reprezentuje
      hranu medzi vonkajšími vrcholmi y a z, pre ktoré platí že y = successor(x)
      a z = ancestor(x).
    </p>
    <p>
      <span
        >Štruktúra vnútorného uzlu závisi od zvoleného spôsobu dátovej
        štruktúry.
        <br />
        Aktuálne máte zvolený spôsob:
        <b>{{ sizeStruct ? "Partitioning by Size" : "Naive Partitioning" }}</b>
      </span>
      <br />
      <span>Ukážka všetkých atribútov, ktorý daný uzol môže nadobúdať</span>
      <img v-if="sizeStruct" class="image" src="./insideNodeSize.png" alt="" />
      <img
        v-if="!sizeStruct"
        class="image"
        src="./insideNodeNaive.png"
        alt=""
      />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    sizeStruct: Boolean,
    isInternalNode: Boolean,
  },
};
</script>

<style>
.image {
  width: 100%;
}
</style>