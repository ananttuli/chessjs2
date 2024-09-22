/**
 * @typedef {Object} Position
 * @property {string} rank
 * @property {string} file
 */

export const Position = {
  /**
   *
   * @param {number} row
   * @param {number} col
   * @returns {Position}
   */
  indexToPosition: (row, col) => {
    return {
      rank: ["1", "2", "3", "4", "5", "6", "7", "8"][row],
      file: ["a", "b", "c", "d", "e", "f", "g", "h"][col],
    };
  },

  positionToKey({ rank, file }) {
    return `${file}_${rank}`;
  },
  keyToPosition(key) {
    const [file, rank] = key.split("_");

    return { file, rank };
  },
};
