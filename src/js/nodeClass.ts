

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
    bhead: any;
    btail: any
    insideNode: boolean;
    reversed: any; //todo
    bparent: NaivePartition | null;
    netmin: any;
    netcost: any;
    bleft: NaivePartition | null;
    bright: NaivePartition | null;
    value: number;
    constructor(name: string, btail: any = null, bhead: any = null, value: number = 0, insideNode: boolean = false, reversed: any = false, bparent: any = null, netmin: any = 0, netcost: any = 0, bleft: any = null, bright: any = null) {
        this.name = name
        this.insideNode = insideNode // toto je ak je to list inak null
        this.value = value
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