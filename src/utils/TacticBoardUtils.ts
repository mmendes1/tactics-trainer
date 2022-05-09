import { ChessInstance, ShortMove } from "chess.js";

const Chess = require("chess.js");

/**Function that takes in a fen and calls turn to determine who's turn it is */
export function getSideToPlayFromFen(fen: string) {
    const chess: ChessInstance = new Chess(fen);
    return chess.turn();
}

/**Function that takes in a fen and a move in the form of a shortmove or string, makes the move, updates the fen 
 * and returns if the resulting fullMove is valid, otherwise it returns null */
export function makeMove(fen: string, move: ShortMove | string) {
    const chess: ChessInstance = new Chess(fen);
    const fullMove = chess.move(move);
    return fullMove ? { fullMove, fen: chess.fen() } : null; /**https://www.tektutorialshub.com/typescript/ternary-conditional-operator-typescript/ */
}

/**Function that takes in a fen, move, and solution array and then checks if there are solutions in the array, 
 * if none return null, it then saves the next movwe to a variable and checks if it has a solution and returns 
 * the next fen and solution, otherwiise it returns null
 * https://stackoverflow.com/questions/45401095/colon-after-function-declaration-in-javascript
 */
export function validateMove(
    fen: string,
    move: ShortMove | string,
    solution: string[]
): null | { solution: string[]; fen: string} {
    if (solution.length === 0) {
        return null;
    }

    const next = makeMove(fen, move); 

    if (next && next.fullMove.san === solution[0]) {
        return {
            fen: next.fen,
            solution: solution.slice(1),
        };
    }

    return null;
}