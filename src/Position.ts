export interface Square {
  rank: string;
  file: string;
}

export const Position = {
  indexToPosition: (row: number, col: number): Square => {
    return {
      rank: ["1", "2", "3", "4", "5", "6", "7", "8"][row],
      file: ["a", "b", "c", "d", "e", "f", "g", "h"][col],
    };
  },

  positionToKey: ({ rank, file }: Square): string => `${file}_${rank}`,

  keyToPosition: (key: string): Square => {
    const [file, rank] = key.split("_");
    return { file, rank };
  },
};
