import { Move, MoveMade } from "./Move.js";
import { Color, Piece, PieceFactory, PieceType } from "./Piece.js";
import { Square } from "./Position.js";
import { tryParseInt } from "./util.js";

export function isEmpty(
  maybePiece: Piece | undefined
): maybePiece is undefined {
  return maybePiece == null;
}

export type Position = (Piece | undefined)[][];

/**
 * Builds the starting position of the game based on FEN notation
 * @param fenNotation The FEN notation string for setting up the board
 */
export function buildStartingPosition(
  fenNotation = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
): Position {
  const positionArr: Position = [];
  const rankConfigs = fenNotation.split("/");

  for (let i = 0; i < rankConfigs.length; i++) {
    const { error, result } = tryParseInt(rankConfigs[i]);

    const pieceObjects: (Piece | undefined)[] = [];

    if (!error && result != null) {
      // Handle empty rows
      for (let j = 0; j < result; j++) {
        pieceObjects.push(undefined);
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
  captured: () => Piece[];
  position: Position;
  state: {
    moveNumber: number;
    turn: string;
    moves: MoveMade[];
  };
  makeMove: (move: Move) => void;
  getLegalMoves: (piece: Piece, row: number, col: number) => any;
}

export function Game(position: Position): GameType {
  const state = { moveNumber: 1, turn: Color.WHITE, moves: [] as MoveMade[] };

  return {
    captured: () =>
      state.moves.map((m) => m.move.capturedPiece).filter((p) => !!p),
    position,
    state,
    makeMove(move: Move) {
      if (move.piece.color === Color.BLACK) {
        state.moveNumber++;
        state.turn = Color.WHITE;
      } else {
        state.turn = Color.BLACK;
      }

      state.moves.push(new MoveMade(move, state.turn, state.moveNumber));
    },
    getLegalMoves: (piece: Piece, row: number, col: number) => {
      const legalMoves = piece.getLegalMoves?.(
        row,
        col,
        state.moveNumber,
        piece.color!,
        position
      );

      return legalMoves;
    },
  };
}
