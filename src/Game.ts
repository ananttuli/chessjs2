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
  currentSelectedPiece?: Piece;
  currentCoords?: [number, number];

  constructor(public game: Game) {}

  getCurrentlySelectedPieceLegalMoves() {
    if (!this.currentSelectedPiece || !this.currentCoords) {
      return [];
    }

    const [selectedX, selectedY] = this.currentCoords;

    const legalMoves = this.currentSelectedPiece.getLegalMoves(
      selectedX,
      selectedY,
      this.game.state.moveNumber,
      this.game.position
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
  moveNumber: number;
  turn: string;
  moves: MoveMade[];
}

export class Game {
  state: GameState = { moveNumber: 1, turn: Color.WHITE, moves: [] };
  position: Position;

  constructor(public startingPosition: Position) {
    // const { state, position } = this.getFreshGameState(startingPosition);
    this.position = startingPosition;
    this.state = { moveNumber: 1, turn: Color.WHITE, moves: [] };
  }

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

    this.state.moveNumber += this.state.turn === Color.BLACK ? 1 : 0;

    this.state.turn =
      this.state.turn === Color.WHITE ? Color.BLACK : Color.WHITE;

    const piece = this.position[move.x][move.y];
    this.position[move.toX][move.toY] = piece;
    this.position[move.x][move.y] = undefined;

    // switch (move.moveType) {
    //   case MoveType.MOVE:
    //     this.position[move.x][move.y] = undefined;
    //     break;
    //   case MoveType.CAPTURE:
    //     this.position[move.toX][move.toY] = this.position[move.x][move.y];
    //     break;
    //   default:
    //     throw new Error("Unsupported");
    // }

    // this.rebuildGameStateFromMoves(this.state.moves);
    // for (let i = 0; i < this.startingPosition.length; i++) {
    //   for (let j = 0; j < this.startingPosition[i].length; j++) {}
    // }
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
