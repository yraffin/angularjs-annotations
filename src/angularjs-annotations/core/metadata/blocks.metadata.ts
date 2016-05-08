import {Class} from "angularjs-annotations/core/types"

export enum BlockType { CONFIG, RUN};

export class BlockMetadata {
    constructor(public blockType: BlockType, public block: Class) {
    }
}

export class ConfigBlockMetadata extends BlockMetadata {
    constructor(configBlock: Class) {
        super(BlockType.CONFIG, configBlock);
    }
}

export class RunBlockMetadata extends BlockMetadata {
    constructor(runBlock: Class) {
        super(BlockType.RUN, runBlock);
    }
}