import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props){
  let winner = null;
  if(props.winner){
    let index = props.winner.squares.indexOf(props.number)
    winner = props.winner.squares[index]
    console.log('winner', winner)
  }
  return (
    <button className={`square
      ${props.isActive === props.number ? 'active' : ''}
      ${winner === props.number ? 'winner' : ''}`
    } onClick={ props.onClick }>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(index, position) {
    return (
      <Square
        winner={this.props.winner}
        key={index}
        number={index}
        isActive={this.props.isActive}
        value={this.props.squares[index]}
        onClick={ () => this.props.onClick(index, position) } />
    );
  }

  render() {
    let board = [0,1,2];
    var index = -1;

    return board.map(i => {
      let cols = [{x: i, y: 0},{x: i, y: 1},{x: i, y: 2}]
      return (
        <div key={i} className="board-row">
          {
            cols.map( (col, i) => {
              ++index;
              return this.renderSquare(index, col);
            })
          }
        </div>
      )
    });
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: {x:null, y: null},
        isActive: false
      }],
      stepNumber: 0,
      xIsNext: true,
      order: true,
    }
  }

  handleClick(i, position){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares, position, isActive: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      order: this.state.order
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  reOrder(order){
    this.setState({order: !order })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner.player}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : '0'}`;
    }

    let position = current.position;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner}
            isActive={current.isActive}
            squares={current.squares}
            onClick={(i, pos) => this.handleClick(i, pos)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>Position: ({position.x}, {position.y})</div>
          <div>
            <button onClick={ () => this.reOrder(this.state.order) }>Order</button>
          </div>
          <ul className="moves">{ this.state.order ? moves : moves.reverse()}</ul>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //console.log(i, squares[a], squares[b], squares[c])
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        squares: lines[i]
      };
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
