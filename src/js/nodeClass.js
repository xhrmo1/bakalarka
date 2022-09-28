

export class Node {
    constructor(strucBasic, StructNative, StrucSize) {
        this.StructBasic = strucBasic
        this.StructNative = StructNative
        this.StrucSize = StrucSize
    }
}

export class StructBasic {
    /* name je povinne, parent a children moze byt null */
    constructor(name, parent = null, children = null, value = null, structPointer = null) {
        this.name = name;
        this.parent = parent;
        this.children = children;
        this.value = value;
        this.structPointer = structPointer //either NaiveStruct or SizeStruct , if struct is null, it is solo path
    }
}

export class Path {
    /* name je povinne, parent a children moze byt null */
    constructor(name, root, allNodes) {
        this.name = name // id
        this.allNodes = allNodes // list
        this.root = root  //pointer
    }
}

export class NaivePartition {
    constructor({ name, id = null, reversed = false, bparent = null, netmin = 0, netcost = 0, bhead = null, bleft = null, bright = null, btail = null }) {
        this.name = name
        this.id = id // toto je ak je to list inak null

        //info o vnutornom uzle
        this.reversed = reversed
        this.bparent = bparent
        this.netmin = netmin
        this.netcost = netcost
        this.bhead = bhead
        this.bleft = bleft
        this.bright = bright
        this.btail = btail
    }
}

export default (
    Node,
    StructBasic
)