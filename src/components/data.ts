import { Nodes, Edges, Layouts, Paths, defineConfigs } from "v-network-graph"

let nodes: Nodes = {}
let edges: Edges = {}
let paths: Paths = {}

let nodes1: Nodes = {
  A: { name: "A" },
  B: { name: "B" },
  C: { name: "C" },
  D: { name: "D" },
  E: { name: "E" },
  F: { name: "F" },
  G: { name: "G" },
  H: { name: "H" },
  I: { name: "I" },
  J: { name: "J" },
  K: { name: "K" },
}

let nodes2: Nodes = {
  A: { name: "A" },
  B: { name: "B" },
  C: { name: "C" },
  D: { name: "D" },
}
let edges2: Edges = {
  edge1: { source: "A", target: "B", label: "99", dashed: true },
  edge2: { source: "B", target: "C", label: "1", dashed: true },
  edge3: { source: "A", target: "D", label: "6", dashed: true },
}
let paths2: Paths = {}

let edges1: Edges = {
  edge1: { source: "A", target: "B", label: "7", dashed: true },
  edge2: { source: "B", target: "C", label: "1", dashed: false },
  edge3: { source: "A", target: "D", label: "6", dashed: false },
  edge4: { source: "D", target: "E", label: "3", dashed: false },
  edge5: { source: "E", target: "F", label: "1", dashed: true },
  edge6: { source: "E", target: "G", label: "4", dashed: false },
  edge7: { source: "G", target: "H", label: "2", dashed: false },
  edge8: { source: "G", target: "K", label: "1", dashed: true },
  edge9: { source: "F", target: "I", label: "16", dashed: false },
  edge10: { source: "I", target: "J", label: "3", dashed: false },
}

let colors: string[] = ["#ff000066", "#00000066", "#0000ff66", "#00ffff66", "#00ff0066"]

let layouts: Layouts = { nodes: {} }

let layouts1: Layouts = {
  nodes: {
    A: { x: 100, y: -350 },
    B: { x: 0, y: -250 },
    C: { x: 0, y: -150 },
    D: { x: 100, y: -250 },
    E: { x: 100, y: -150 },
    F: { x: 50, y: -50 },
    G: { x: 150, y: -50 },
    H: { x: 100, y: 50 },
    I: { x: 0, y: 0 },
    J: { x: 0, y: 75 },
    K: { x: 200, y: 50 },
  },
}
let layouts2: Layouts = {
  nodes: {
    A: { x: 0, y: -350 },
    B: { x: 150, y: -250 },
    C: { x: 100, y: -150 },
    D: { x: 50, y: -250 },

  },
}

let paths1: Paths = {
  path1: {
    id: "path1",
    edges: ["edge2"],
    color: "#ff00ff66", // #rrggbbaa <- with alpha
    canSee: true,
    mouseOver: false,
    width: 45,
  },
  path2: {
    id: "path2",
    edges: ["edge7", "edge6", "edge4", "edge3"],
    color: "#00aa0066", // #rrggbbaa <- with alpha
    canSee: true,
    mouseOver: false,
  },
  path3: {
    id: "path3",
    edges: ["edge10", "edge9"],
    color: "#ffc341cc", // #rrggbbaa <- with alpha
    canSee: false,
    mouseOver: false,
  },
}

let defaultLayouts = [
  {
    name: "Prvy defaulty layout",
    nodes: nodes1,
    edges: edges1,
    paths: paths1,
    layouts: layouts1,
  },
  {
    name: "Druhy defaulty layout",
    nodes: nodes2,
    edges: edges2,
    paths: paths2,
    layouts: layouts2,
  }
]



//* Config *\\ 

let configs = defineConfigs({

  node: {
    selectable: true, // up to 2 nodes
    normal: {
      type: "circle",
      radius: 16,
      color: "#0d3059",
    },
    hover: {
      type: "circle",
      radius: 19,
      color: "#ef476f",
    },
    focusring: {
      color: "#ffd166",
    },
    label: {
      visible: true,
      fontSize: 18,
      fontFamily: "serif",
      direction: node => (node.direction == null ? "south" : node.direction),
    },
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
      color: "#0d3059",
      dasharray: edge => (edge.dashed ? "4" : "0"),
    },
    selected: {
      color: "#ef476f",
      dasharray: edge => (edge.dashed ? "4" : "0"),
    },
    hover: {
      type: "circle",
      width: 4,
      color: "#ef476f",
    },
    label: {
      visible: true,
      fontSize: 16,
      fontFamily: "serif"
    },
  },
  path: {
    visible: true,
    normal: {
      width: path => (path.canSee ? 10 : 0),
      color: p => p.color,
    },
  },
})

let configsStructure = defineConfigs({
  node: {
    selectable: true, // up to 2 nodes
    normal: {
      type: node => (node.name != null && node.name.indexOf("edge") !== -1 ? "rect" : "circle"),
      radius: 16,
      color: node => (node.name != null && node.name.indexOf("edge") !== -1 ? "#2079df" : "#0d3059"),
    },
    hover: {
      type: "circle",
      radius: 19,
      color: "#ef476f",
    },
    focusring: {
      color: "#ffd166",
    },
    label: {
      visible: true,
      fontSize: 18,
      fontFamily: "serif",
      direction: node => (node.direction == null ? "south" : node.direction),
    },
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
      color: "#0d3059",
      dasharray: edge => (edge.dashed ? "4" : "0"),
    },
    selected: {
      color: "#ef476f",
      dasharray: edge => (edge.dashed ? "4" : "0"),
    },
    hover: {
      type: "circle",
      width: 4,
      color: "#ef476f",
    },
    label: {
      visible: true,
      fontSize: 16,
      fontFamily: "serif"
    },
  },
  path: {
    visible: true,
    normal: {
      width: path => (path.canSee ? 10 : 0),
      color: p => p.color,
    },
  },
})

export default {
  nodes,
  edges,
  layouts,
  configs,
  configsStructure,
  paths,
  defaultLayouts,
  colors,
}