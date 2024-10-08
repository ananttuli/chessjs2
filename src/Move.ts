import { Piece } from "./Piece.js";

export enum MoveType {
  MOVE = "MOVE",
  CAPTURE = "CAPTURE",
  CASTLE_KINGSIDE = "CASTLE_KINGSIDE",
  CASTLE_QUEENSIDE = "CASTLE_QUEENSIDE",
  EN_PASSANT = "EN_PASSANT",
  PAWN_PROMOTION = "PAWN_PROMOTION",
}

export class MoveMade {
  constructor(public move: Move, turn: string, public moveNumber?: number) {}
}

// Move class
export class Move {
  moveType: MoveType;
  piece: Piece;
  x: number;
  y: number;
  toX: number;
  toY: number;
  capturedPiece?: Piece;

  constructor({
    moveType,
    piece,
    capturedPiece,
    x,
    y,
    toX,
    toY,
  }: {
    moveType: MoveType;
    piece: Piece;
    capturedPiece?: Piece;
    x: number;
    y: number;
    toX: number;
    toY: number;
  }) {
    this.moveType = moveType;
    this.piece = piece;
    this.capturedPiece = capturedPiece;
    this.x = x;
    this.y = y;
    this.toX = toX;
    this.toY = toY;
  }
}
