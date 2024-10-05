import { Move } from "./Move.js";
import { Color, Piece, PieceFactory, PieceType } from "./Piece.js";
import { Square } from "./Position.js";
import { tryParseInt } from "./util.js";

// Define an empty piece
const EmptyPiece: Piece = {} as Piece;

// Piece interface
// interface Piece {
//   color?: Color;
//   type?: string;
//   getLegalMoves?: (
//     row: number,
//     col: number,
//     moveNumber: number,
//     color: string,
//     position: Piece[][]
//   ) => any;
//   uuid?: string;
// }

// Check if a piece is empty
export function isEmpty(piece: Piece): boolean {
  return piece === EmptyPiece;
}

// Define the types for moves

export type Position = Piece[][];

/**
 * Builds the starting position of the game based on FEN notation
 * @param fenNotation The FEN notation string for setting up the board
 */
export function buildStartingPosition(
  fenNotation = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
): Position {
  const positionArr: Piece[][] = [];
  const rankConfigs = fenNotation.split("/");

  for (let i = 0; i < rankConfigs.length; i++) {
    const { error, result } = tryParseInt(rankConfigs[i]);

    const pieceObjects: Piece[] = [];

    if (!error && result != null) {
      // Handle empty rows
      for (let j = 0; j < result; j++) {
        pieceObjects.push(EmptyPiece);
      }
    } else {
      // Non-empty rows
      const piecesStr = rankConfigs[i];
      const pieces = piecesStr.split("");

      for (let k = 0; k < pieces.length; k++) {
        const piece = pieces[k];
        const pieceType = piece?.toUpperCase();

        const pieceObject = PieceFactory[
          pieceType as keyof typeof PieceFactory
        ](piece === pieceType ? Color.WHITE : Color.BLACK);

        pieceObjects.push(pieceObject);
      }
    }

    positionArr.push(pieceObjects);
  }

  return positionArr;
}

// Define the game state and logic
export interface GameType {
  captured: Piece[];
  position: Position;
  state: {
    moveNumber: number;
    turn: string;
    moves: Move[];
  };
  makeMove: () => void;
  getLegalMoves: (piece: Piece, row: number, col: number) => any;
}

export function Game(position: Position): GameType {
  const captured: Piece[] = [];

  const state = { moveNumber: 1, turn: Color.WHITE, moves: [] as Move[] };

  return {
    captured,
    position,
    state,
    makeMove() {
      // Implementation for makeMove can be added here
    },
    getLegalMoves: (piece: Piece, row: number, col: number) => {
      const legalMoves = piece.getLegalMoves?.(
        row,
        col,
        state.moveNumber,
        piece.color!,
        position
      );

      console.log({ legalMoves, piece });
      return legalMoves;
    },
  };
}
