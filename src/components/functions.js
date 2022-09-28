
let categorySetX = [
    {
        name: "Všetky",
        category: "all"
    }, {
        name: "Polovica",
        category: "bb"
    }, {
        name: "Druha",
        category: "cc"
    }]

let functionSetX = [
    {
        name: "",
        category: "aa",
        description: "",
        nodes: 0,
        paths: 0,
        values: 0,
        code: "zatial nepouzivat",
    },
    {
        name: "funkcia1",
        description: {
            args: "Cesta p, Cesta s, Hodnota a",
            description: "Funckia zoberie hodnoty p, s spoji ich do jednej cesty a hrana medzi nimi bude mat hodnotu a"
        },
        category: "bb",
        nodes: 0,
        paths: 2,
        values: 1,
        code: 42,
    },
    {
        name: "funkcia2",
        description: {
            args: "Uzol x, Cesta p, Hodnota a, Hodnota b",
            description: "Funckia zoberie hodnoty p, s spoji ich do jednej cesty a hrana medzi nimi bude mat hodnotu a pre DRUHU"
        },
        category: "bb",
        nodes: 1,
        paths: 1,
        values: 2,
        code: 77,
    },
    {
        name: "funkcia3",
        description: {
            args: "Uzol x, Uzol y, Uzol z, Uzol v, Cesta p, Hodnota a, Hodnota b, Hodnota c",
            description: "Funckia zoberie hodnoty p, s spoji ich do jednej cesty a hrana medzi nimi bude mat hodnotu a pre DRUHU"
        },
        category: "cc",
        nodes: 4,
        paths: 1,
        values: 3,
        code: 3,
    }]



export default {
    functionSetX,
    categorySetX,
}