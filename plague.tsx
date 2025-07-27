"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Direction, GameState, Player } from "./GameObjects"
import { BOARD_SIZE, INFECTION_RATE, INITIAL_INFECTED_COUNT, GAME_SPEED, COLORS } from "./constants"
import { initializeBoard, updateBoard, calculateStats, generatePlayer, movePlayer, isValidMove } from "./gameUtils"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Users, WormIcon as Virus, Skull, Heart } from "lucide-react"

export default function Plague() {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    tick: 0,
    isRunning: false,
    stats: {
      healthy: BOARD_SIZE * BOARD_SIZE - INITIAL_INFECTED_COUNT,
      infected: INITIAL_INFECTED_COUNT,
      recovered: 0,
      dead: 0,
      population: BOARD_SIZE * BOARD_SIZE,
    },
  })

  const [player, setPlayer] = useState<Player>(generatePlayer())
  const gameLoopRef = useRef<NodeJS.Timeout>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cellSize = canvas.width / BOARD_SIZE

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw cells
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = gameState.board[y][x]
        const cellX = x * cellSize
        const cellY = y * cellSize

        // Cell background
        ctx.fillStyle = COLORS[cell.state]
        ctx.fillRect(cellX, cellY, cellSize, cellSize)

        // Cell border
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 0.5
        ctx.strokeRect(cellX, cellY, cellSize, cellSize)

        // Infection intensity for infected cells
        if (cell.state === "infected" && cell.infectionLevel > 0) {
          ctx.fillStyle = `rgba(255, 0, 0, ${cell.infectionLevel / 100})`
          ctx.fillRect(cellX, cellY, cellSize, cellSize)
        }
      }
    }

    // Draw player
    const playerX = player.position.x * cellSize + cellSize / 2
    const playerY = player.position.y * cellSize + cellSize / 2
    const playerRadius = cellSize / 4

    ctx.fillStyle = player.infected ? "#ff4444" : "#4444ff"
    ctx.beginPath()
    ctx.arc(playerX, playerY, playerRadius, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Player health indicator
    if (player.health < 100) {
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(playerX - playerRadius, playerY - playerRadius - 8, playerRadius * 2 * (player.health / 100), 4)
    }
  }, [gameState.board, player])

  const gameLoop = useCallback(() => {
    setGameState((prevState) => {
      const newBoard = updateBoard(prevState.board)
      const newStats = calculateStats(newBoard)

      return {
        ...prevState,
        board: newBoard,
        tick: prevState.tick + 1,
        stats: newStats,
      }
    })

    // Update player
    setPlayer((prevPlayer) => {
      const currentCell = gameState.board[prevPlayer.position.y][prevPlayer.position.x]
      const newPlayer = { ...prevPlayer }

      // Check if player gets infected
      if (!newPlayer.infected && currentCell.state === "infected") {
        const infectionChance = Math.random() * 100
        if (infectionChance < INFECTION_RATE) {
          newPlayer.infected = true
          newPlayer.infectionTime = 0
        }
      }

      // Update infected player
      if (newPlayer.infected) {
        newPlayer.infectionTime++

        // Health decreases over time when infected
        if (newPlayer.infectionTime % 5 === 0) {
          newPlayer.health = Math.max(0, newPlayer.health - 2)
        }

        // Recovery chance
        if (newPlayer.infectionTime > 30) {
          const recoveryChance = Math.random() * 100
          if (recoveryChance < 10) {
            newPlayer.infected = false
            newPlayer.recovered = true
            newPlayer.health = Math.min(100, newPlayer.health + 50)
          }
        }
      }

      return newPlayer
    })
  }, [gameState.board])

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isRunning: true }))
    gameLoopRef.current = setInterval(gameLoop, GAME_SPEED)
  }

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isRunning: false }))
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
  }

  const resetGame = () => {
    pauseGame()
    setGameState({
      board: initializeBoard(),
      tick: 0,
      isRunning: false,
      stats: {
        healthy: BOARD_SIZE * BOARD_SIZE - INITIAL_INFECTED_COUNT,
        infected: INITIAL_INFECTED_COUNT,
        recovered: 0,
        dead: 0,
        population: BOARD_SIZE * BOARD_SIZE,
      },
    })
    setPlayer(generatePlayer())
  }

  const handlePlayerMove = (direction: Direction) => {
    setPlayer((prevPlayer) => {
      const newPosition = movePlayer(prevPlayer, direction)
      if (isValidMove(newPosition)) {
        return { ...prevPlayer, position: newPosition }
      }
      return prevPlayer
    })
  }

  useEffect(() => {
    drawBoard()
  }, [drawBoard])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault()
        gameState.isRunning ? pauseGame() : startGame()
      } else if (e.key === "r" || e.key === "R") {
        resetGame()
      } else if (e.key === "ArrowUp" || e.key === "w") {
        handlePlayerMove("up")
      } else if (e.key === "ArrowDown" || e.key === "s") {
        handlePlayerMove("down")
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        handlePlayerMove("left")
      } else if (e.key === "ArrowRight" || e.key === "d") {
        handlePlayerMove("right")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState.isRunning])

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Game Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-400">🦠 PLAGUE SIMULATOR</h1>
        <p className="text-gray-300">Spread the infection and survive the outbreak</p>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Population
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{gameState.stats.population}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-400" />
              Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{gameState.stats.healthy}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Virus className="h-4 w-4 text-red-400" />
              Infected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{gameState.stats.infected}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-blue-400" />
              Recovered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{gameState.stats.recovered}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Skull className="h-4 w-4 text-gray-400" />
              Dead
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{gameState.stats.dead}</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center gap-4">
        <Button onClick={gameState.isRunning ? pauseGame : startGame} className="bg-green-600 hover:bg-green-700">
          {gameState.isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {gameState.isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Game Board */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-400">Infection Spread - Tick {gameState.tick}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                Player Health: {player.health}%
              </Badge>
              <Badge
                variant="outline"
                className={player.infected ? "text-red-400 border-red-400" : "text-blue-400 border-blue-400"}
              >
                Status: {player.infected ? "Infected" : player.recovered ? "Recovered" : "Healthy"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <canvas ref={canvasRef} width={600} height={600} className="border border-gray-600 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Game Instructions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400">How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-300">
            • Use <span className="text-green-400">WASD</span> or <span className="text-green-400">Arrow Keys</span> to
            move your player
          </p>
          <p className="text-gray-300">
            • Press <span className="text-green-400">Space</span> to start/pause the simulation
          </p>
          <p className="text-gray-300">
            • Press <span className="text-green-400">R</span> to reset the game
          </p>
          <p className="text-gray-300">• Avoid infected areas to stay healthy</p>
          <p className="text-gray-300">• Watch as the infection spreads through the population</p>
        </CardContent>
      </Card>
    </div>
  )
}
