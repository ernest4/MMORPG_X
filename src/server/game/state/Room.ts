import Transform from "../../../shared/components/Transform";
import { DEFAULT_ROOM_NAME } from "../State";
import Cell from "./room/Cell";

const TILE_SIZE_IN_PX = 32; // 32 px
const MAX_WORLD_SIZE_IN_TILES = 60;
const MAX_WORLD_SIZE_IN_PX = TILE_SIZE_IN_PX * MAX_WORLD_SIZE_IN_TILES; // square worlds
const CELL_SIZE_IN_PX = TILE_SIZE_IN_PX * 60;
const MAX_WORLD_SIZE_IN_CELLS = MAX_WORLD_SIZE_IN_PX; // CELL_SIZE_IN_PX

// TODO: specs
class Room {
  private _cells: Cell[][];
  name: string;
  width: number;
  height: number;
  tiles: number[][];

  constructor() {
    // TODO: testing... will load from config files later...
    this.tiles = [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 2, 1],
      [1, 1, 4, 4, 1, 1],
      [1, 2, 1, 4, 3, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ];

    this.name = DEFAULT_ROOM_NAME;
    this.width = 6;
    this.height = 6;
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
    return new Array(MAX_WORLD_SIZE_IN_CELLS).fill(
      new Array(MAX_WORLD_SIZE_IN_CELLS).fill(new Cell())
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
    return [Math.trunc(x / CELL_SIZE_IN_PX), Math.trunc(y / CELL_SIZE_IN_PX)];
  };

  private getCell = (x: number, y: number) => {
    if (MAX_WORLD_SIZE_IN_CELLS < x) return null;
    if (x < 0) return null;
    if (MAX_WORLD_SIZE_IN_CELLS < y) return null;
    if (y < 0) return null;

    return this._cells[x][y];
  };
}

export default Room;
