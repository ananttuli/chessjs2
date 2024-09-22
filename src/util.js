/**
 *
 * @param {string} maybeNumber
 */
export function tryParseInt(maybeNumber) {
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

// function fileNotation(num) {
//   return String.fromCharCode(96 + num);
// }
