import React from "react";

function Square(props) {
    const classes = props.isWinningSquare ? "square winner" : "square";
    return (
        <button className={classes} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, isWinningSquare) {
        return (
            <Square
                value={this.props.squares[i]}
                isWinningSquare={isWinningSquare}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        );
    }

    render() {
        const response = [];
        for (let i = 0; i < 3; i++) {
            const squares = []
            for (let j = 0; j < 3; j++) {
                const n = i + j * 3;
                const isWinningSquare = this.props.winningSquares.includes(n);
                console.log(this.props.winningSquares);
                squares.push(this.renderSquare(n, isWinningSquare));
            }
            response.push(<div className="board-row" key={i}>{squares}</div>);
        }

        return response;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const [winner] = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, winningSquares] = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            if (move === this.state.stepNumber) {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            <b>{desc}</b>
                        </button>
                    </li>
                );
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
            }
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else if (history.length > 9) {
            status = "Draw!";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winningSquares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, [null]];
}

export default Game;