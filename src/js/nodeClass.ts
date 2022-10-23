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
    name: string
    parent: EdgeDetail | null
    value: number | null
    children: EdgeDetail[] | null
    pParent: PathStructure | null
    pathPointer: Path | null
    constructor
        (
            name: string, parent: EdgeDetail | null = null, value: number | null = null,
            children: EdgeDetail[] | null = null, pParent: PathStructure | null = null,
            pathPointer: Path | null = null
        ) {
        this.name = name;
        this.parent = parent;
        this.children = children;
        this.pParent = pParent //either PathStruct or SizeStruct , if struct is null, it is solo path
        this.pathPointer = pathPointer
        this.value = value
    }
}

// toto je root, vlavo to vypisem ako cestu, vytvorim pri vytvarani stromu, 
// potom pridam odkaz na naive partition a size partition
export class Path {
    /* name je povinne, parent a children moze byt null */
    name: string | undefined;
    allNodes: StructBasic[] | null
    pathRoot: PathStructure | null;
    pathID: string | null;
    constructor(
        name: string | undefined, allNodes: StructBasic[],
        pathRoot: PathStructure | null, pathID: string | null) {
        this.name = name // id
        this.allNodes = allNodes // list
        this.pathRoot = pathRoot  //pointer
        this.pathID = pathID
    }
}

export class PathStructure {
    //zakladne udaje
    name: string;
    bhead: any;
    btail: any
    reversed: boolean; //todo
    pParent: PathStructure | null;
    pleft: PathStructure | StructBasic | null;
    pright: PathStructure | StructBasic | null;
    root: Path; //odkaz na path

    //naivePartition
    netmin: any;
    netcost: any;
    value: number;

    //sizePartition
    //doplnime
    constructor(name: string, btail: any = null, bhead: any = null, value: number = 0, insideNode: boolean = false, reversed: any = false, pparent: any = null, netmin: any = 0, netcost: any = 0, pleft: any = null, pright: any = null, root: any = null) {
        this.name = name
        this.value = value
        //info o vnutornom uzle
        this.reversed = reversed
        this.pParent = pparent
        this.netmin = netmin
        this.netcost = netcost
        this.bhead = bhead
        this.pleft = pleft
        this.pright = pright
        this.btail = btail
        this.root = root
    }
}


export default (
    StructBasic
)