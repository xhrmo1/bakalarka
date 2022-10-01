

export class Node {
    StructBasic: StructBasic;
    StructNative: NaivePartition | null;
    StructSize: any | null;
    constructor(strucBasic: StructBasic, structNative: NaivePartition | null, structSize: any | null) {
        this.StructBasic = strucBasic
        this.StructNative = structNative
        this.StructSize = structSize
    }
}

export class StructBasic {
    /* name je povinne, parent a children moze byt null */
    name: string | undefined
    parent: any | undefined
    children: string[]
    value: any | undefined
    structPointer: any | undefined
    constructor(name: string | undefined, parent: any | undefined, children: string[], value: any | undefined, structPointer: any | undefined) {
        this.name = name;
        this.parent = parent;
        this.children = children;
        this.value = value;
        this.structPointer = structPointer //either NaiveStruct or SizeStruct , if struct is null, it is solo path
    }
}

export class Path {
    /* name je povinne, parent a children moze byt null */
    name: string | undefined;
    root: any;
    allNodes: any
    constructor(name: string | undefined, root: any, allNodes: any) {
        this.name = name // id
        this.allNodes = allNodes // list
        this.root = root  //pointer
    }
}

export class NaivePartition {
    name: string;
    id: any;
    reversed: any;
    bparent: any;
    netmin: any;
    netcost: any;
    bhead: any;
    bleft: any;
    bright: any;
    btail: any
    constructor(name: any, id = null, reversed = false, bparent = null, netmin = 0, netcost = 0, bhead = null, bleft = null, bright = null, btail = null) {
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
    StructBasic
)