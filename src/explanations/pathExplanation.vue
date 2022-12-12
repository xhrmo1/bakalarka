<template>
  <h2>Nápoveda o ceste</h2>
  <p>
    V grafe sú hrany rozdelené dva typy: <b>súvislé</b> a <b>prerušované</b>.
    Platí podmienka, že medzi uzlom x a jeho všetkými synmi je maximálne jedna
    súvislá hrana. Súvislé hrany definujú rozdelenie stromu na uzlovo-disjunktné
    cesty. Cesty majú ohodnotené hrany. Taktiež cesta môže obsahovať iba jeden
    uzol a teda žiadne súvislé hrany. Najskôr si ukážeme ako vyriešiť problém
    dynamických stromov na jednej ceste. Následne si ukážeme ako vďaka operáciám
    na cestách bude možné vykonať stromové operácie.
  </p>
  <p>
    V tejto časti sú najprv zobrazené cesty, ktoré obsahujú aspoň jednu hranu. Popis jednotlivých častí cesty
    <ol>
        <li><b>Path2:</b> Jednoznačný identifikátor cesty </li>
        <li><b>Lupa:</b> Slúži na zobrazenie virtuálneho stromu</li>
        <li><b>Prepínač:</b> Slúži na zapnutie farebného označenia hrán</li>
        <li><b>Farebná čiara:</b> Ukazuje akú farbu má cesta priradená</li>
    </ol>
    <img src="./pathExplanationpicture.png" alt="">
  </p>
</template>

<script>
export default {};
</script>

<style>
</style>