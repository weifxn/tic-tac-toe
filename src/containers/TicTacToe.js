import React from 'react';
import './ticstyle.css'
import Firebase from '../firebase'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    InputGroup,
    CardSubtitle,
    InputGroupAddon,
    FormInput,
} from 'shards-react'
import * as Icon from 'react-feather';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <>
                {
                    this.props.disabled ?
                        <Square
                            value={this.props.squares[i]}
                            onClick={() => this.props.onClick(i)}
                        />
                        :
                        <Square
                            value={this.props.squares[i]}
                        />
                }

            </>
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

const initialState = {
    history: [
        {
            squares: Array(9).fill('')
        }
    ],
    stepNumber: 0,
    xIsNext: true,
    isX: false,
    showReset: false,
};

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
        }
    }
    componentDidMount() {
        const key = window.location.pathname.substr(1)
        if (localStorage.getItem(key)) {
            this.setState({
                isX: true
            })
        }
        Firebase.database()
            .ref('game')
            .child(key)
            .on('value', snap => {
                if (snap.exists()) {
                    if (snap.val().newGame) {
                        console.log('new!')
                    } else {
                        this.setState({
                            history: snap.val().history,
                            stepNumber: snap.val().stepNumber,
                            xIsNext: snap.val().xIsNext,
                            showReset: snap.val().showReset
                        })
                    }
                }
            })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
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
        }, () => {
            console.log(this.state.history)
            Firebase.database()
                .ref('game')
                .child(window.location.pathname.substr(1))
                .set({
                    history: this.state.history,
                    stepNumber: this.state.stepNumber,
                    xIsNext: this.state.xIsNext
                })
        });

    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    reset() {
        Firebase.database()
            .ref('game')
            .child(window.location.pathname.substr(1))
            .set(initialState)
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const noWin = (history.length > 9)
        const showCode = (history.length < 3)

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let showReset = false
        let status;
        let toDisable = this.state.isX === this.state.xIsNext

        if (winner) {
            status = winner + "wins";
            showReset = true
        } else if (noWin) {
            status = "No Winners";
            showReset = true
        } else {
            if (toDisable) {
                status = "it's your turn!"
            } else {
                status = "waiting opponent... "
            }
        }


        return (
            <div className="game">
                <div className="game-board">
                    {
                        showCode &&
                        <>
                            <b>share URL</b>
                            <p><a href={window.location.href}>{window.location.host}/{window.location.pathname.substr(1)}</a></p>
                        </>
                    }
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        disabled={toDisable}
                    />
                    <div className="info">
                        {
                            this.state.isX ? <div>you're X</div> : <div>you're O</div>
                        }

                        <b>{status}</b>
                    </div>

                    {
                        showReset &&
                        <Button outline size="sm" theme="danger" onClick={() => this.reset()}><Icon.RotateCcw size={15} /></Button>

                    }
                </div>
            </div>
        );
    }
}

// ========================================


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
            return squares[a];
        }
    }
    return null;
}
