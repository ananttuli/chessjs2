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

export class GameUI {
  currentSelectedPiece?: Piece;
  currentCoords?: [number, number];

  constructor(public game: Game) {}

  isCurrentlyHighlighted(row: number, col: number): boolean {
    if (!this.currentSelectedPiece || !this.currentCoords) {
      return false;
    }

    const [selectedX, selectedY] = this.currentCoords;

    const legalMoves = this.currentSelectedPiece.getLegalMoves(
      selectedX,
      selectedY,
      this.game.state.moveNumber,
      this.game.position
    );

    const isOneOfTheLegalMoves = !!legalMoves.find(
      (move) => move.toX === row && move.toY === col
    );

    console.log(
      JSON.parse(
        JSON.stringify({ currentSelectedPiece: this.currentSelectedPiece })
      ),
      JSON.parse(JSON.stringify(this.currentCoords)),
      [row, col],
      isOneOfTheLegalMoves,
      JSON.parse(JSON.stringify(legalMoves))
    );

    return isOneOfTheLegalMoves;
  }
}
export class Game {
  state: {
    moveNumber: number;
    turn: string;
    moves: MoveMade[];
  } = { moveNumber: 1, turn: Color.WHITE, moves: [] };

  constructor(public position: Position) {}

  get captured() {
    return this.state.moves.map((m) => m.move.capturedPiece).filter((p) => !!p);
  }

  makeMove = (move: Move) => {
    if (move.piece.color === Color.BLACK) {
      this.state.moveNumber++;
      this.state.turn = Color.WHITE;
    } else {
      this.state.turn = Color.BLACK;
    }

    this.state.moves.push(
      new MoveMade(move, this.state.turn, this.state.moveNumber)
    );
  };

  getLegalMoves = (piece: Piece, row: number, col: number) => {
    const legalMoves = piece.getLegalMoves?.(
      row,
      col,
      this.state.moveNumber,
      this.position
    );

    return legalMoves;
  };
}

// export function Game(position: Position): GameType {
//   const state = { moveNumber: 1, turn: Color.WHITE, moves: [] as MoveMade[] };

//   const ui} = { currentSelectedPiece: undefined};

//   return {
//     captured: () =>
//       state.moves.map((m) => m.move.capturedPiece).filter((p) => !!p),
//     position,
//     state,
//     ui: {
//       ...ui,
//       getCurrentlyHighlightedMoves: () => {
//         if(ui.currentSelectedPiece) {
//           ui.currentSelectedPiece.
//         }
//       }
//     },
//     ,
//   };
// }
