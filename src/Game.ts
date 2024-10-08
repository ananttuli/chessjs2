import { Move, MoveMade, MoveType } from "./Move.js";
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
  // currentSelectedPiece?: Piece;
  // currentCoords?: [number, number];

  selectedPiece: { piece: Piece; sq: [number, number] } | undefined;

  constructor(public game: Game) {}

  clearSelection() {
    this.selectedPiece = undefined;

    // this.currentCoords = undefined;
    // this.currentSelectedPiece = undefined;
  }

  getCurrentlySelectedPieceLegalMoves() {
    if (!this.selectedPiece) {
      return [];
    }

    const [selectedX, selectedY] = this.selectedPiece.sq;

    const legalMoves = this.selectedPiece.piece.getLegalMoves(
      selectedX,
      selectedY,
      this.game.moveNumber,
      this.game
    );

    return legalMoves;
  }

  findLegalMoveAt(row: number, col: number) {
    return this.getCurrentlySelectedPieceLegalMoves().find(
      (m) => m.toX === row && m.toY === col
    );
  }

  isCurrentlyHighlighted(row: number, col: number): boolean {
    return !!this.findLegalMoveAt(row, col);
  }
}

interface GameState {
  // moveNumber: number;
  // turn: string;
  moves: MoveMade[];
}

export class Game {
  state: GameState = { moves: [] };
  position: Position = buildStartingPosition();

  constructor(public startingPosition?: Position, moves?: MoveMade[]) {
    // const { state, position } = this.getFreshGameState(startingPosition);
    // this.init(startingPosition);
    // this.init(startingPosition)
    // this.position = JSON.parse(JSON.stringify(startingPosition));
  }

  get moveNumber() {
    return this.state.moves.length > 0
      ? Math.floor(this.state.moves.length / 2) + 1
      : 1;
  }

  get turn() {
    return this.state.moves.length % 2 === 0 ? Color.WHITE : Color.BLACK;
  }

  get captured() {
    return this.state.moves.map((m) => m.move.capturedPiece).filter((p) => !!p);
  }

  makeMove = (move: Move) => {
    this.state.moves.push(new MoveMade(move, this.turn, this.moveNumber));

    const piece = this.position[move.x][move.y];
    this.position[move.toX][move.toY] = piece;
    this.position[move.x][move.y] = undefined;
  };

  // getFreshGameState(startingPosition: Position): {switch (move.moveType) {
  //   state: GameState;
  //   position: Position;
  // } {
  //   const newPosition: Position = this.clonePosition(startingPosition);
  //   return {
  //     state: { moveNumber: 1, turn: Color.WHITE, moves: [] },
  //     position: newPosition,
  //   };
  // }

  // rebuildGameStateFromMoves(moves: MoveMade[]) {
  //   const { state, position } = this.getFreshGameState(this.startingPosition);

  //   const newPosition = position;

  //   for (const moveMade of moves) {
  //     const { move } = moveMade;

  //     switch (move.moveType) {
  //       case MoveType.MOVE:
  //         const piece = newPosition[move.x][move.y];
  //         newPosition[move.toX][move.toY] = piece;
  //         newPosition[move.x][move.y] = undefined;

  //         state.moveNumber += 0.5;
  //         state.turn = state.turn === Color.WHITE ? Color.BLACK : Color.WHITE;

  //         state.moves.push(moveMade);
  //       case MoveType.CAPTURE:
  //       default:
  //         throw new Error("Unsupported");
  //     }
  //   }

  //   state.moveNumber = Math.floor(state.moveNumber);
  //   this.position = newPosition;
  //   this.state = state;
  // }

  // clonePosition(position: Position): Position {

  //   return JSON.parse(JSON.stringify(position));
  // }

  getLegalMoves = (piece: Piece, row: number, col: number) => {
    const legalMoves = piece.getLegalMoves?.(row, col, this.moveNumber, this);

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
