import Transform from "../../../shared/components/Transform";
import { DEFAULT_ROOM_NAME } from "../State";
import Cell from "./room/Cell";

// TODO: specs
class Room {
  private _cells: Cell[][];
  tileSizeInPx: number;
  maxWorldSizeInTiles: number;
  maxWorldSizeInPx: number;
  cellSizeInPx: number;
  maxWorldSizeInCells: number;
  name: string;
  widthInTiles: number;
  heightInTiles: number;
  // tiles: number[][];
  tiles: Uint16Array;

  constructor() {
    this.tileSizeInPx = 32; // 32 px
    this.maxWorldSizeInTiles = 60;
    this.maxWorldSizeInPx = this.tileSizeInPx * this.maxWorldSizeInTiles; // square worlds
    this.cellSizeInPx = this.tileSizeInPx * 60;
    this.maxWorldSizeInCells = this.maxWorldSizeInPx; // cellSizeInPx

    // TODO: testing... will load from config files later...
    const tiles = [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 4, 4, 1, 1],
      [1, 2, 1, 4, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ];

    this.tiles = new Uint16Array(tiles.flat());

    this.name = DEFAULT_ROOM_NAME;
    this.widthInTiles = 6;
    this.heightInTiles = 6;
    this._cells = this.generateEmptyCells();
  }

  // update = (x: number, y: number, entityId: EntityId) => {
  //   // Always removing and adding means we dont need to explicitly check if new cell matches old
  //   // Removing and adding are O(1) for sparse-set
  //   this.removeCharacter(x, y, entityId); // remove from old cell w.e. it was
  //   this.addCharacter(x, y, entityId); // put into new cell w.e. it is
  // };

  update = (transform: Transform) => {
    // Always removing and adding means we dont need to explicitly check if new cell matches old
    // Removing and adding are O(1) for sparse-set
    this.removeTransform(transform); // remove from old cell w.e. it was
    this.addTransform(transform); // put into new cell w.e. it is
  };

  streamNearbyCharacterEntityIds = (x: number, y: number, callback: (EntityId: any) => void) => {
    const cellCallback = (cell: Cell) => cell.streamCharacterIds(callback); // memoizing
    this.streamNearbyCells(x, y, cellCallback);
  };

  private generateEmptyCells = (): Cell[][] => {
    return new Array(this.maxWorldSizeInCells).fill(
      new Array(this.maxWorldSizeInCells).fill(new Cell())
    );
  };

  private streamNearbyCells = (x: number, y: number, callback: (Cell) => void) => {
    const [cellX, cellY] = this.worldToCellCoordinates(x, y);
    const cellXCoords = [cellX - 1, cellX, cellX + 1];
    const cellYCoords = [cellY - 1, cellY, cellY + 1];

    // TODO: optimize by caching the loop functions?
    cellXCoords.forEach(currentCellX => {
      cellYCoords.forEach(currentCellY => {
        const cell = this.getCell(currentCellX, currentCellY);
        if (cell) callback(cell); // NOTE: only returns for cells within room bounds
      });
    });
  };

  private removeTransform = ({ position: { x, y }, id: entityId }: Transform) => {
    const [cellX, cellY] = this.worldToCellCoordinates(x, y);
    this.getCell(cellX, cellY)?.removeCharacter(entityId);
  };

  private addTransform = ({ position: { x, y }, id: entityId }: Transform) => {
    const [cellX, cellY] = this.worldToCellCoordinates(x, y);
    this.getCell(cellX, cellY)?.addCharacter(entityId);
  };

  private worldToCellCoordinates = (x: number, y: number) => {
    return [Math.trunc(x / this.cellSizeInPx), Math.trunc(y / this.cellSizeInPx)];
  };

  private getCell = (x: number, y: number) => {
    if (this.maxWorldSizeInCells < x) return null;
    if (x < 0) return null;
    if (this.maxWorldSizeInCells < y) return null;
    if (y < 0) return null;

    return this._cells[x][y];
  };
}

export default Room;
