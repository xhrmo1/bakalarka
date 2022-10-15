export class TreeDataStructures {
    basicRoots: StructBasic[]
    pathRoots: Path[]
    constructor(
        basicRoots: StructBasic[], pathRoots: Path[]
    ) {
        this.basicRoots = basicRoots
        this.pathRoots = pathRoots
    }
}

export class EdgeDetail {
    target: StructBasic
    edgeID: string
    constructor(target: StructBasic, edgeID: string) {
        this.target = target
        this.edgeID = edgeID
    }
}

export class StructBasic {
    /* name je povinne, parent a children moze byt null */
    name: string | undefined
    parent: EdgeDetail | null
    children: EdgeDetail[] | null
    value: any | undefined
    parentNaive: NaivePartition | null
    parentSize: SizePartition | null
    constructor
        (
            name: string | undefined, parent: EdgeDetail | null = null,
            value: any | undefined = null, children: EdgeDetail[] | null = null,
            parentNaive: NaivePartition | null = null, parentSize: SizePartition | null = null
        ) {
        this.name = name;
        this.parent = parent;
        this.children = children;
        this.value = value;
        this.parentNaive = parentNaive //either NaiveStruct or SizeStruct , if struct is null, it is solo path
        this.parentSize = parentSize
    }
}

// toto je root, vlavo to vypisem ako cestu, vytvorim pri vytvarani stromu, 
// potom pridam odkaz na naive partition a size partition
export class Path {
    /* name je povinne, parent a children moze byt null */
    name: string | undefined;
    allNodes: StructBasic[] | null
    rootNaive: NaivePartition | null;
    rootSize: SizePartition | null;
    constructor(
        name: string | undefined, allNodes: StructBasic[],
        rootNaive: NaivePartition | null, rootSize: SizePartition | null) {
        this.name = name // id
        this.allNodes = allNodes // list
        this.rootNaive = rootNaive  //pointer
        this.rootSize = rootSize
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
    root: Path; //odkaz na path
    constructor(name: string, btail: any = null, bhead: any = null, value: number = 0, insideNode: boolean = false, reversed: any = false, bparent: any = null, netmin: any = 0, netcost: any = 0, bleft: any = null, bright: any = null, root: any = null) {
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
        this.root = root
    }
}

export class SizePartition { }

export default (
    StructBasic
)