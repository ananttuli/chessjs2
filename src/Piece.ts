import { isEmpty, Position } from "./Game.js";
import { Move, MoveType } from "./Move.js";

export enum PieceType {
  N = "N",
  R = "R",
  B = "B",
  K = "K",
  Q = "Q",
  P = "P",
}

export enum Color {
  BLACK = "BLACK",
  WHITE = "WHITE",
}

const getMoveKey = (row: number, col: number): string => {
  return `${row}_${col}`;
};

// Interface for a Piece object
export interface Piece {
  uuid: string;
  color: Color;
  type: PieceType;
  getLegalMoves: (
    row: number,
    col: number,
    moveNumber: number,
    color: Color,
    position: Position
  ) => Move[];
}

// export class Piece implements Piece {
//   public uuid: string = uuidv4();

//   constructor(
//     public color: Color,
//     public type: PieceType,
//     public getLegalMoves: Piece["getLegalMoves"]
//   ) {}
// }
// Piece factory function
// export function Piece(
//   color: Color,
//   type: PieceType,
//   getLegalMoves: Piece["getLegalMoves"]
// ): Piece {

//   return {
//     color,
//     type,
//     getLegalMoves,
//     uuid: uuidv4(),
//   };
// }

// Factory for creating different types of pieces
export const PieceFactory: Record<PieceType, (color: Color) => Piece> = {
  // [PieceType.N]: Knight,
  // [PieceType.R]: Rook,
  // [PieceType.B]: Bishop,
  // [PieceType.K]: King,
  // [PieceType.Q]: Queen,
  [PieceType.N]: (color: Color) => new Pawn(color),
  [PieceType.R]: (color: Color) => new Pawn(color),
  [PieceType.B]: (color: Color) => new Bishop(color),
  [PieceType.K]: (color: Color) => new Pawn(color),
  [PieceType.Q]: (color: Color) => new Pawn(color),
  [PieceType.P]: (color: Color) => new Pawn(color),
};

// Directions for movement
enum Direction {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
  upRight = "upRight",
  upLeft = "upLeft",
  downLeft = "downLeft",
  downRight = "downRight",
}

// Next square in the direction map
const nextSquareInDirection: Record<
  Direction,
  ([row, col]: [number, number]) => [number, number]
> = {
  up: ([row, col]) => [row - 1, col],
  down: ([row, col]) => [row + 1, col],
  left: ([row, col]) => [row, col - 1],
  right: ([row, col]) => [row, col + 1],
  upRight: ([row, col]) => [row - 1, col + 1],
  upLeft: ([row, col]) => [row - 1, col - 1],
  downLeft: ([row, col]) => [row + 1, col - 1],
  downRight: ([row, col]) => [row + 1, col + 1],
};

type DirectionMap = Record<Direction, boolean>;

// Possible directions for movement
const possibleDirections: DirectionMap = {
  up: false,
  down: false,
  left: false,
  right: false,
  upRight: false,
  upLeft: false,
  downLeft: false,
  downRight: false,
};

// Check if the move is within position limits
function isWithinPositionLimits(
  [row, col]: [number, number],
  position: Position
): boolean {
  const rowUpperLimit = position.length - 1;
  const rowLowerLimit = 0;
  const colUpperLimit = position[0].length - 1;
  const colLowerLimit = 0;

  return (
    row >= rowLowerLimit &&
    row <= rowUpperLimit &&
    col >= colLowerLimit &&
    col <= colUpperLimit
  );
}

function findCapturablePiecesInDirection(
  piece: Piece,
  [startRow, startCol]: [number, number],
  position: Position,
  direction: Direction,
  captureColor: Color,
  maxJumps?: number
): Move | undefined {
  console.log({
    arguments,
  });
  let row = startRow,
    col = startCol;
  let numJumps = 0;
  while (true) {
    const potentialMove = nextSquareInDirection[direction]([row, col]);
    const withinMaxJumps = maxJumps == null ? true : numJumps < maxJumps;

    if (!isWithinPositionLimits(potentialMove, position) || !withinMaxJumps) {
      break;
    }

    const pieceAtNewPos = position[potentialMove[0]][potentialMove[1]];

    const pieceFound = !isEmpty(pieceAtNewPos);
    const isCapturable = pieceFound && pieceAtNewPos.color === captureColor;

    if (pieceFound) {
      if (isCapturable) {
        return new Move({
          moveType: MoveType.CAPTURE,
          piece,
          capturedPiece: pieceAtNewPos,
          x: row,
          y: col,
          toX: potentialMove[0],
          toY: potentialMove[1],
        });
      } else {
        return undefined;
      }
    }

    ++numJumps;
    [row, col] = potentialMove;
  }
}

function findAllMovesInDirectionFromStartingPosition(
  piece: Piece,
  [startRow, startCol]: [number, number],
  position: Position,
  direction: Direction,
  maxJumps?: number
): Move[] {
  const possibleMoves: Move[] = [];
  let row = startRow,
    col = startCol;
  let numJumps = 0;

  while (true) {
    const potentialMove = nextSquareInDirection[direction]([row, col]);
    const withinMaxJumps = maxJumps == null ? true : numJumps < maxJumps;

    if (!isWithinPositionLimits(potentialMove, position) && withinMaxJumps) {
      break;
    }

    const pieceAtNewPos = position[potentialMove[0]][potentialMove[1]];

    if (isEmpty(pieceAtNewPos)) {
      possibleMoves.push(
        new Move({
          moveType: MoveType.MOVE,
          x: row,
          y: col,
          toX: potentialMove[0],
          toY: potentialMove[1],
          piece,
        })
      );
    } else {
      break;
    }

    [row, col] = potentialMove;
    numJumps++;
  }

  return possibleMoves;
}

// Find all possible moves from a starting position
// function findAllMovesFromStartingPosition(
//   [startingRow, startingCol]: [number, number],
//   dirMap: Record<DirectionType, boolean>,
//   position: any[][],
//   maxJumps?: number
// ) {
//   return Object.entries(dirMap).map(([dir]) => {
//     const { pieceFound, possibleMoves } =
//       findAllMovesInDirectionFromStartingPosition(
//         [startingRow, startingCol],
//         position,
//         dir as DirectionType,
//         maxJumps
//       );
//     return { [dir]: { possibleMoves, pieceFound } };
//   });
// }

// Function to create a Pawn

class Pawn implements Piece {
  public uuid: string = uuidv4();
  public type = PieceType.P;

  constructor(public color: Color) {}

  getLegalMoves(
    row: number,
    col: number,
    moveNumber: number,
    color: Color,
    position: Position
  ) {
    const isWhite = color === Color.WHITE;

    const moves = findAllMovesInDirectionFromStartingPosition(
      this,
      [row, col],
      position,
      isWhite ? Direction.up : Direction.down,
      moveNumber === 1 ? 2 : 1
    );

    const captureMoves: Move[] = [Direction.upLeft, Direction.upRight]
      .map((dir) =>
        findCapturablePiecesInDirection(
          this,
          [row, col],
          position,
          dir,
          isWhite ? Color.BLACK : Color.WHITE,
          1
        )
      )
      .filter((m) => !!m);

    return moves.concat(captureMoves);
  }
}

class Bishop implements Piece {
  public uuid: string = uuidv4();
  public type = PieceType.B;

  constructor(public color: Color) {}

  getLegalMoves(
    row: number,
    col: number,
    moveNumber: number,
    color: Color,
    position: Position
  ) {
    const isWhite = color === Color.WHITE;

    const moveDirections = [
      Direction.upLeft,
      Direction.downLeft,
      Direction.upRight,
      Direction.downRight,
    ];

    const captureDirections = moveDirections;

    const moves = moveDirections.flatMap((dir): Move[] =>
      findAllMovesInDirectionFromStartingPosition(
        this,
        [row, col],
        position,
        dir,
        moveNumber === 1 ? 2 : 1
      )
    );

    const captureMoves = captureDirections
      .map((dir): Move | undefined =>
        findCapturablePiecesInDirection(
          this,
          [row, col],
          position,
          dir,
          isWhite ? Color.BLACK : Color.WHITE
        )
      )
      .filter((m) => !!m);

    return moves.concat(captureMoves);
  }
}

// Check if a square is available for a move
// function checkSquareAvailable(
//   row: number,
//   col: number,
//   color: Color,
//   position: Record<string, any>
// ): { isLegal: boolean; pathTerminated: boolean } {
//   const key = getMoveKey(row, col);
//   return {
//     isLegal: !position[key] || position[key].color !== color,
//     pathTerminated: !!position[key],
//   };
// }

// Function to create a Bishop
// function Bishop(color: Color): Piece {
//   return Piece(color, PieceType.B, (row, col, moveNumber, color, position) => {
//     const dirMap = {
//       ...possibleDirections,
//       upRight: true,
//       upLeft: true,
//       downRight: true,
//       downLeft: true,
//     };

//     return findAllMovesFromStartingPosition([row, col], dirMap, position);
//   });
// }

// Function to create a Knight
// function Knight(color: Color): Piece {
//   return Piece(color, PieceType.N, (row, col, moveNumber, color, position) => {
//     return {}; // Legal moves for Knight
//   });
// }

// Function to create a Rook
// function Rook(color: Color): Piece {
//   return Piece(color, PieceType.R, (row, col, moveNumber, color, position) => {
//     const dirMap = {
//       ...possibleDirections,
//       up: true,
//       down: true,
//       left: true,
//       right: true,
//     };

//     return findAllMovesFromStartingPosition([row, col], dirMap, position);
//   });
// }

// Function to create a Queen (combines Rook and Bishop movements)
// function Queen(color: Color): Piece {
//   return Piece(color, PieceType.Q, (row, col, moveNumber, color, position) => {
//     const dirMap = {
//       ...possibleDirections,
//       ...Object.keys(Direction).reduce(
//         (acc, dir) => ({ ...acc, [dir]: true }),
//         {}
//       ),
//     };

//     return findAllMovesFromStartingPosition([row, col], dirMap, position);
//   });
// }

// Function to create a King
// function King(color: Color): Piece {
//   return Piece(color, PieceType.K, (row, col, moveNumber, color, position) => {
//     const checkKingBounds = ([r, c]: [number, number]) =>
//       r <= row + 1 && c <= col + 1 && r >= row - 1 && c >= col - 1;

//     const kingMoves = {}; // Logic for King moves can be implemented

//     return kingMoves;
//   });
// }

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
