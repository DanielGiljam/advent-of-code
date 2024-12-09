import { runSolution } from '../utils.ts';

class Block {
  constructor(readonly fs: FileSystem, readonly initPos: number) {}

  get hasMoved() {
    return this.pos !== this.initPos;
  }

  get pos() {
    return this.fs.getPositionOfBlock(this);
  }
}

class EmptyBlock extends Block {
  constructor(readonly fs: FileSystem, readonly initPos: number) {
    super(fs, initPos);
  }
}

class FileBlock extends Block {
  constructor(readonly fs: FileSystem, readonly initPos: number) {
    super(fs, initPos);
  }
}

abstract class BlockArray<T extends Block = Block> {
  constructor(readonly fs: FileSystem, readonly blocks: T[]) {}

  get hasMoved() {
    return this.blocks.some((b) => b.hasMoved);
  }

  abstract getStringRepresentation(
    format: FileSystemStringRepresentationFormat
  );
}

class EmptySpace extends BlockArray<EmptyBlock> {
  constructor(readonly fs: FileSystem, readonly blocks: EmptyBlock[]) {
    super(fs, blocks);
  }

  getStringRepresentation(format: FileSystemStringRepresentationFormat) {
    if (this.hasMoved) {
      throw new Error(
        'Unable to get compact string representation of empty space which has been moved'
      );
    }
    switch (format) {
      case FileSystemStringRepresentationFormat.Compact:
        return this.blocks.length.toString();
      case FileSystemStringRepresentationFormat.Unfolded:
        return '.'.repeat(this.blocks.length);
    }
  }
}

class File extends BlockArray<FileBlock> {
  constructor(
    readonly fs: FileSystem,
    readonly blocks: FileBlock[],
    readonly id: number
  ) {
    super(fs, blocks);
  }

  getStringRepresentation(format: FileSystemStringRepresentationFormat) {
    if (this.hasMoved) {
      throw new Error(
        'Unable to get compact string representation of file which has been moved'
      );
    }
    switch (format) {
      case FileSystemStringRepresentationFormat.Compact:
        return this.blocks.length.toString();
      case FileSystemStringRepresentationFormat.Unfolded:
        return this.id.toString().repeat(this.blocks.length);
    }
  }
}

/* function* collapseConsecutiveDuplicates<T>(iterable: Iterable<T>) {
  let prev = null;
  for (const item of iterable) {
    if (item !== prev) {
      prev = item;
      yield item;
    }
  }
} */

function* coerceAsNumber(iterable: Iterable<unknown>) {
  for (const item of iterable) {
    yield Number(item);
  }
}

function* chunk<T>(iterable: Iterable<T>, chunkSize: number) {
  if (chunkSize <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }
  let chunk: T[] = [];
  for (const item of iterable) {
    chunk.push(item);
    if (chunk.length === chunkSize) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    yield chunk; // Yield the remaining elements in the last chunk
  }
}

function* entries<T>(iterable: Iterable<T>) {
  let index = 0;
  for (const item of iterable) {
    yield [index, item] as const;
    index++;
  }
}

function* range(start: number, end: number, step = 1) {
  if (step === 0) {
    throw new Error('Step cannot be zero');
  }
  if (start < end && step < 0) {
    throw new Error('Step must be positive for an increasing range');
  }
  if (start > end && step > 0) {
    throw new Error('Step must be negative for a decreasing range');
  }
  for (let i = start; step > 0 ? i < end : i > end; i += step) {
    yield i;
  }
}

enum FileSystemStringRepresentationFormat {
  Compact = 'compact',
  Unfolded = 'unfolded',
}

class FileSystem {
  private readonly _blocks: Block[] = [];
  private readonly _blockArrays: BlockArray[] = [];

  private constructor() {}

  getFirstEmptyBlock() {
    return this._blocks.find((b) => b instanceof EmptyBlock);
  }

  getLastFileBlock() {
    return this._blocks.findLast((b) => b instanceof FileBlock);
  }

  swapBlocks(block1: Block, block2: Block) {
    const pos1 = this.getPositionOfBlock(block1);
    const pos2 = this.getPositionOfBlock(block2);
    this._blocks[pos1] = block2;
    this._blocks[pos2] = block1;
  }

  getPositionOfBlock(block: Block) {
    return this._blocks.indexOf(block);
  }

  getFileIdOfBlock(block: Block) {
    if (!(block instanceof FileBlock)) {
      return 0;
    }
    const file = this._blockArrays.find((b): b is File =>
      b.blocks.includes(block)
    );
    return file.id;
  }

  getNumberOfBlocks() {
    return this._blocks.length;
  }

  getBlocks() {
    return [...this._blocks];
  }

  getStringRepresentation(format: FileSystemStringRepresentationFormat) {
    let str = '';
    for (const b of this._blockArrays) {
      str += b.getStringRepresentation(format);
    }
    return str;
  }

  private _addBlock(block: Block) {
    this._blocks.push(block);
  }

  private _addBlockArray(blockArray: BlockArray) {
    this._blockArrays.push(blockArray);
  }

  static fromDataString(data: string[]) {
    const fs = new FileSystem();
    for (const line of data) {
      if (line.length > 0) {
        for (const [i, [f, e]] of entries(
          chunk(coerceAsNumber(line.split('')), 2)
        )) {
          // console.log([i, [f, e]]);
          const fileId = i;
          const filePos = fs.getNumberOfBlocks();
          const fileSize = f;
          // console.log({ filePos, fileSize });
          const fileBlocks: FileBlock[] = [];
          for (const p of range(filePos, filePos + fileSize)) {
            // console.log('p', p);
            const block = new FileBlock(fs, p);
            fs._addBlock(block);
            fileBlocks.push(block);
          }
          const file = new File(fs, fileBlocks, fileId);
          fs._addBlockArray(file);
          if (e == null) {
            continue;
          }
          const emptyPos = filePos + fileSize;
          const emptySize = e;
          // console.log({ emptyPos, emptySize });
          const emptyBlocks: FileBlock[] = [];
          for (const p of range(emptyPos, emptyPos + emptySize)) {
            // console.log('p', p);
            const block = new EmptyBlock(fs, p);
            fs._addBlock(block);
            emptyBlocks.push(block);
          }
          const emptySpace = new EmptySpace(fs, emptyBlocks);
          fs._addBlockArray(emptySpace);
        }
      }
    }
    return fs;
  }
}

const reorderBlocks = (fs: FileSystem) => {
  let firstEmptyBlock = fs.getFirstEmptyBlock();
  let lastFileBlock = fs.getLastFileBlock();
  while (
    fs.getPositionOfBlock(firstEmptyBlock) <
    fs.getPositionOfBlock(lastFileBlock)
  ) {
    fs.swapBlocks(firstEmptyBlock, lastFileBlock);
    firstEmptyBlock = fs.getFirstEmptyBlock();
    lastFileBlock = fs.getLastFileBlock();
  }
};

const getChecksum = (fs: FileSystem) =>
  fs.getBlocks().reduce((acc, b) => acc + b.pos * fs.getFileIdOfBlock(b), 0);

/** provide your solution as the return of this function */
export async function day9a(data: string[]) {
  console.log(data);
  const fs = FileSystem.fromDataString(data);
  console.log(
    fs.getStringRepresentation(FileSystemStringRepresentationFormat.Compact)
  );
  console.log(
    fs.getStringRepresentation(FileSystemStringRepresentationFormat.Unfolded)
  );
  reorderBlocks(fs);
  return getChecksum(fs);
}

await runSolution(day9a);
