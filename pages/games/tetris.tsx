// pages/tetris.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';

// サンプルとして定義、実際には全ての形状を定義する必要があります
const TETROMINOS = {
    0: { shape: [[0]], color: '0, 0, 0' },
    I: {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '80, 227, 230'
    },
    J: {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '36, 95, 223'
    },
    L: {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '223, 173, 36'
    },
    O: {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: '223, 217, 36'
    },
    S: {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      color: '48, 211, 56'
    },
    T: {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '132, 61, 198'
    },
    Z: {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      color: '227, 78, 78'
    }
  };

// 基本のスタイル
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    cell: {
      width: '20px',
      height: '20px',
    },
    board: {
        border: 'solid 1px',
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 20px)',
        gridTemplateRows: 'repeat(20, 20px)',
      },
    // more styles...
  })
);

export default function Tetris() {
  const classes = useStyles();

  const [tetromino, setTetromino] = useState(generateTetromino());
  const [position, setPosition] = useState({ x: 5, y: 0 });

  const [board, setBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  function hasCollision(position) {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        // Check if we're on a tetromino cell
        if (tetromino.shape[y][x] !== 0) {
          if (
            // Check if move is inside the game areas height (y)
            // We should not go through the bottom of the board
            !board[y + position.y] ||
            // Check if move is inside the game areas width (x)
            !board[y + position.y][x + position.x] ||
            // Check if the cell we're moving to isn't set to clear
            board[y + position.y][x + position.x][1] !== 'clear'
          ) {
            return true;
          }
        }
      }
    }
  
    return false;
  }
  
  
  function generateTetromino() {
    const tetrominos = 'IJLOSTZ'; // Add all tetromino names here
    const randTetromino =
      tetrominos[Math.floor(Math.random() * tetrominos.length)];
    return TETROMINOS[randTetromino];
  }
  
    // Handlers for keyboard events
    const handleKeyPress = useCallback(
        (event) => {
          let newPosition = { ...position };
          switch (event.code) {
            // Implement block movement here...
            case 'ArrowLeft':
              newPosition.x--;
              if (!hasCollision(newPosition)) {
                setPosition(newPosition);
              }
              break;
            case 'ArrowRight':
              newPosition.x++;
              if (!hasCollision(newPosition)) {
                setPosition(newPosition);
              }
              break;
            // case 'ArrowUp':
            // rotate the tetromino
            // case 'ArrowDown':
            // move the tetromino down
          }
        },
        [position, setPosition]
      );

  
  const dropTetromino = useCallback(() => {
    let newPosition = { ...position };
    newPosition.y++; // Move tetromino down by one

    // Check for collision (simplified)
    if (!hasCollision(newPosition)) {
      setPosition(newPosition);
    } else {
      // If collision, reset position and generate a new tetromino
      setPosition({ x: 5, y: 0 });
      setTetromino(generateTetromino());
    }
  }, [position, setPosition, hasCollision, setTetromino]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Use the dropTetromino function in a separate useEffect hook
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      dropTetromino();
    }, 1000); // Drop the tetromino every second

    return () => {
      clearInterval(timer);
    };
  }, [dropTetromino, isRunning]);

  
  // Start game function
  const startGame = () => {
    // Reset states
    setBoard(createBoard());
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };



  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Functions for moving/rotating tetrominos, collision detection, and line clearing...

  return (
    <Box className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Score: {score}
      </Typography>
      <Button variant="contained" color="primary" onClick={startGame}>
        Start Game
      </Button>
      <Box className={classes.board}>
        {board.map((row) => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
      </Box>
      {gameOver && (
        <Typography variant="h1" gutterBottom>
          Game Over
        </Typography>
      )}
    </Box>
  );
}

function createBoard() {
    const ROW = 20;
    const COL = 10;
    let board = [];
    for (let r = 0; r < ROW; r++) {
      board.push(new Array(COL).fill([0, 'clear']));
    }
    return board;
  }
  
  function Cell({ type }) {
    const useStyles = makeStyles(() =>
      createStyles({
        cell: {
          backgroundColor: `rgba(${type ? TETROMINOS[type].color : '0, 0, 0'})`,
          border: 'solid 1px',
          width: 'auto',
        },
      })
    );
    const classes = useStyles();
    return <div className={classes.cell}></div>;
  }