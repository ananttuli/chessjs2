import { Color, PieceFactory, PieceType } from "./Piece.js";
import { Position } from "./Position.js";
import { tryParseInt } from "./util.js";

// function getPieceRow(color, row) {
//   return [
//     PieceFactory[PieceType.R](color),
//     PieceFactory[PieceType.B](color),
//     PieceFactory[PieceType.Q](color),
//     PieceFactory[PieceType.Q](color),
//     PieceFactory[PieceType.K](color),
//     PieceFactory[PieceType.B](color),
//     PieceFactory[PieceType.R](color),
//     PieceFactory[PieceType.R](color),
//   ].reduce((map, piece, col) => {
//     map[`${row}_${col}`] = piece;
//     return map;
//   }, {});
// }

// function getPawnRow(color, row) {
//   return Array(8)
//     .fill(0)
//     .map((_) => PieceFactory[PieceType.P](color))
//     .reduce((map, piece, col) => {
//       map[`${row}_${col}`] = piece;
//       return map;
//     }, {});
// }

/**
 *
 * @param {number} row
 * @returns {{[key: string]: false}}
 */
// function getEmptyRow(row) {
//   return Array(8)
//     .fill(false)
//     .reduce((map, placeholder, col) => {
//       map[`${row}_${col}`] = placeholder;
//       return map;
//     }, {});
// }

/**
 *
 * @param {number} row
 * @returns
 */
// function getEmptyRows(rows) {
//   return rows
//     .map((row) => getEmptyRow(row))
//     .reduce((acc, r) => {
//       acc = { ...acc, ...r };
//       return acc;
//     }, {});
// }

const EmptyPiece = {};

export function isEmpty(piece) {
  return piece === EmptyPiece;
}

/**
 * @param {string} fenNotation
 */
export function buildStartingPosition(
  fenNotation = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
) {
  const position = {};
  const positionArr = [];

  const rankConfigs = fenNotation.split("/");

  const numRanks = rankConfigs.length;

  for (let i = 0; i < numRanks; i++) {
    const { error, result } = tryParseInt(rankConfigs[i]);

    const pieceObjects = [];

    if (!error && result != null) {
      // empty rows
      for (let j = 0; j < result; j++) {
        pieceObjects.push(EmptyPiece);

        // position[
        //   Position.positionToKey({ file: fileNotation(j + 1), rank: i + 1 })
        // ] = empty;
      }
    } else {
      // non empty row
      const piecesStr = rankConfigs[i];
      const pieces = piecesStr.split("");

      for (let k = 0; k < pieces.length; k++) {
        const piece = pieces[k];
        const pieceType = piece?.toUpperCase();

        // console.log(fileNotation(k + 1), i, "Piece:", piece);
        // console.log(k, piece, pieceType, PieceFactory?.[pieceType]);

        const pieceObject = PieceFactory[pieceType](
          piece === pieceType ? Color.WHITE : Color.BLACK
          // piece === pieceType ? Color.BLACK : Color.WHITE
        );

        pieceObjects.push(pieceObject);
        // position[
        //   Position.positionToKey({ file: fileNotation(k + 1), rank: i + 1 })
        // ] = pieceObject;
      }
    }

    positionArr.push(pieceObjects);
  }

  return positionArr;
  // return position;
}

const MoveType = {
  MOVE: "MOVE",
  CAPTURE: "CAPTURE",
  CASTLE_KINGSIDE: "CASTLE_KINGSIDE",
  CASTLE_QUEENSIDE: "CASTLE_QUEENSIDE",
  EN_PASSANT: "EN_PASSANT",
};

export class Move {
  constructor({ moveType, piece, capturedPiece, moveNumber, turn }) {
    this.moveType = moveType;
    this.piece = piece;
    this.capturedPiece = capturedPiece;
  }
}

export function Game(position) {
  // providedPosition || {
  //   ...getPieceRow(Color.BLACK, 0),
  //   ...getPawnRow(Color.BLACK, 1),
  //   ...getEmptyRows([2, 3, 4, 5]),
  //   ...getPawnRow(Color.WHITE, 6),
  //   ...getPieceRow(Color.WHITE, 7),
  // };

  const captured = [];

  const state = { moveNumber: 1, turn: Color.WHITE, moves: [] };

  return {
    captured,
    position,
    state,
    makeMove() {},
    // makeMove: (piece, from, to) => {
    //   // if (position[to] !== -1) {
    //   //   // Capture has taken place
    //   //   // Process capture
    //   //   captured.push({ ...position[to] });
    //   // }
    //   // position[to] = piece;
    //   // // Empty space from where the move was made
    //   // position[from] = -1;
    // },

    getLegalMoves: (piece, row, col) => {
      const legalMoves = piece.getLegalMoves(
        row,
        col,
        state.moveNumber,
        piece.color,
        position
      );

      console.log({ legalMoves, piece });
      return legalMoves;
    },
  };
}
