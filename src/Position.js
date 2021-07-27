/**
 * @typedef {Object} Position
 * @property {'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'} rank
 * @property {'A'|'B'|'C'|'D'|'E'|'F'|'G'} file
 */

export const PositionUtil = {
  /**
   *
   * @param {number} row
   * @param {number} col
   * @returns {Position}
   */
  indexToPosition: (row, col) => {
    return {
      rank: ["1", "2", "3", "4", "5", "6", "7", "8"][row],
      file: ["A", "B", "C", "D", "E", "F", "G", "H"][col],
    };
  },
};
