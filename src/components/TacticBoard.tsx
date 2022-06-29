import React, { useState, useEffect } from "react";
import { ShortMove } from "chess.js";
import Chessboard from "chessboardjsx";
import Tactic from "../types/Tactic";
import { getSideToPlayFromFen, makeMove, validateMove } from "../utils/TacticBoardUtils";

//Defines properties for TacticsBoard. tactic object and callbacks for types of moves
interface Props {
    tactic: Tactic;
    onIncorrect: () => void;
    onCorrect: () => void;
    onSolve: () => void;
}

const TacticBoard: React.FC<Props> = ({
    tactic,
    onIncorrect,
    onCorrect,
    onSolve,
}) => {
        const[fen, setFen] = useState(tactic.fen); //variable holding initial position of tactic, only updated when move is correct
        const[solution, setSolution] = useState(tactic.solution); //variable holding state of tactic, will pop off first solution item until tactic is solved

        useEffect(() => { //plays blunder and update fen at start
            setTimeout(() => {
                const next = makeMove(tactic.fen, tactic.blunderMove);
                if (next) {
                    setFen(next.fen);
                }
            }, 100);
        }, [tactic]);
    
    const handleMove = (move: ShortMove) => {
        const next = validateMove(fen, move, solution); //checks if played move is valid

        if(next) { //if valid, update fen and solution
            setFen(next.fen);
            setSolution(next.solution);

            if(next.solution.length > 0) { //if more moves for solution, call onCorrect
                onCorrect();

                const autoNext = validateMove ( //auto play next move in tactic
                    next.fen,
                    next.solution[0],
                    next.solution,
                );

                if(autoNext) {
                    setFen(autoNext.fen);
                    setSolution(autoNext.solution);
                }
            } else {
                onSolve(); //else array is empty and tactic was solved, call onSolve
            }
        } else {
            onIncorrect(); //else move was incorrect, call onIncorrect
        }
    };

    return (
        <Chessboard
            transitionDuration={200} //duration of move animation
            position={fen}
            width={400}
            orientation={getSideToPlayFromFen(tactic.fen) === "b" ? "white" : "black"}
            onDrop={(move) =>
                handleMove({
                    from: move.sourceSquare,
                    to: move.targetSquare,
                    promotion: "q",
                })
            }
        />
    );
};