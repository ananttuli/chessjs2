export function tryParseInt(maybeNumber: string): {
  result: number | undefined;
  error: string | undefined;
} {
  try {
    const num = parseInt(maybeNumber);
    if (Number.isFinite(num)) {
      return { result: num, error: undefined };
    }
    throw new Error("Not a number");
  } catch (error) {
    return { result: undefined, error: "Not a number" };
  }
}
