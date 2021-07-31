import { Color, PieceFactory, PieceType } from "./Piece.js";

function getPieceRow(color, row) {
  return [
    PieceFactory[PieceType.ROOK](color),
    PieceFactory[PieceType.BISHOP](color),
    PieceFactory[PieceType.QUEEN](color),
    PieceFactory[PieceType.QUEEN](color),
    PieceFactory[PieceType.KING](color),
    PieceFactory[PieceType.BISHOP](color),
    PieceFactory[PieceType.ROOK](color),
    PieceFactory[PieceType.ROOK](color),
  ].reduce((map, piece, col) => {
    map[`${row}_${col}`] = piece;
    return map;
  }, {});
}

function getPawnRow(color, row) {
  return Array(8)
    .fill(0)
    .map((_) => PieceFactory[PieceType.PAWN](color))
    .reduce((map, piece, col) => {
      map[`${row}_${col}`] = piece;
      return map;
    }, {});
}

/**
 *
 * @param {number} row
 * @returns {{[key: string]: -1}}
 */
function getEmptyRow(row) {
  return Array(8)
    .fill(-1)
    .reduce((map, placeholder, col) => {
      map[`${row}_${col}`] = placeholder;
      return map;
    }, {});
}

/**
 *
 * @param {number} row
 * @returns
 */
function getEmptyRows(rows) {
  return rows
    .map((row) => getEmptyRow(row))
    .reduce((acc, r) => {
      acc = { ...acc, ...r };
      return acc;
    }, {});
}

/**
 *
 * @param {*} providedPosition
 * @returns {GameType}
 */
export function Game(providedPosition) {
  const position = providedPosition || {
    ...getPieceRow(Color.BLACK, 0),
    ...getPawnRow(Color.BLACK, 1),
    ...getEmptyRows([2, 3, 4, 5]),
    ...getPawnRow(Color.WHITE, 6),
    ...getPieceRow(Color.WHITE, 7),
  };

  const captured = [];

  const state = { moveNumber: 1 };
  return {
    captured,
    position,
    state,
    makeMove: (piece, from, to) => {
      // if (position[to] !== -1) {
      //   // Capture has taken place
      //   // Process capture
      //   captured.push({ ...position[to] });
      // }
      // position[to] = piece;
      // // Empty space from where the move was made
      // position[from] = -1;
    },

    getLegalMoves: (piece, row, col) => {
      // piece.getLegalMovesByPieceType;
      const legalMovesMap = piece.getLegalMoves(
        row,
        col,
        state.moveNumber,
        piece.color,
        position
      );

      return legalMovesMap;
    },
  };
}

/**
 * @typedef {import('./Piece').PieceBase} PieceBase
 */

/**
 * @typedef {{[key: string]: -1 | PieceBase}} GamePosition
 */

/**
 * @typedef {Object} GameType
 * @property {GamePosition} position
 * @property {PieceBase[]} captured
 * @property {(piece: PieceBase, from, to) => void} makeMove
 * @property {(piece: PieceBase, row: number, col: number) => {[key: string]: boolean}} getLegalMoves
 */
