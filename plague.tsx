"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Users,
  Activity,
  TrendingUp,
  Info,
  BookOpen,
  Shield,
  FileText,
  User,
} from "lucide-react"
import { GameObjects, Cell, Virus, Cure } from "./GameObjects"
import { gameConfig } from "./constants"
import { GAME_CONSTANTS, COLORS, IMAGES, FONTS } from "../constants"
import { useWallet } from "@solana/wallet-adapter-react"
import WalletConnection from "./WalletConnection"
import AboutModal from "./AboutModal"
import LoreModal from "./LoreModal"
import PrivacyModal from "./PrivacyModal"
import Footer from "./Footer"
import TermsModal from "./TermsModal"
import Profile from "./Profile"
import CookieConsent from "./CookieConsent"

interface Obstacle {
  x: number
  y: number
  sprite: HTMLImageElement
}

interface Player {
  x: number
  y: number
  velocityY: number
  isMovingUp: boolean
  sprite: HTMLImageElement | null
}

interface TrailPoint {
  x: number
  y: number
}

interface AvalancheParticle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

interface GameState {
  player: Player
  obstacles: Obstacle[]
  trailPoints: TrailPoint[]
  frameCount: number
  startTime: number
  gameSpeedMultiplier: number
  obstacleGenerationInterval: number
  lastSpeedIncreaseTime: number
  score: number
  isGameOver: boolean
  lives: number
  invulnerable: boolean
  invulnerabilityTimer: number
  avalancheParticles: AvalancheParticle[]
  avalancheStarted: boolean
  avalancheIntensity: number
  avalancheDistance: number
  avalancheTimer: number
}

interface GameStats {
  infectedCells: number
  healthyCells: number
  curedCells: number
  totalCells: number
  infectionRate: number
  generation: number
  virusStrength: number
  cureEffectiveness: number
}

export default function SnowBored() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const animationRef = useRef<number>()
  const gameObjectsRef = useRef<GameObjects | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const [lives, setLives] = useState(3)
  const { connected } = useWallet()
  const [firstTimeLoad, setFirstTimeLoad] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState<GameStats>({
    infectedCells: 0,
    healthyCells: 0,
    curedCells: 0,
    totalCells: 0,
    infectionRate: 0,
    generation: 0,
    virusStrength: 50,
    cureEffectiveness: 30,
  })

  const [showAbout, setShowAbout] = useState(false)
  const [showLore, setShowLore] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showNFT, setShowNFT] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [activeTab, setActiveTab] = useState<"profile">("profile")

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
        checkMobile()
        if (canvasRef.current) {
          setGameKey((prev) => prev + 0.001)
        }
      }, 100)
    }

    window.addEventListener("orientationchange", handleOrientationChange)
    window.addEventListener("resize", handleOrientationChange)
    if (screen?.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange)
    }

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange)
      window.removeEventListener("resize", handleOrientationChange)
      if (screen?.orientation) {
        screen.orientation.removeEventListener("change", handleOrientationChange)
      }
    }
  }, [])

  const createInitialGameState = useCallback(
    (): GameState => ({
      player: {
        x: 100,
        y: GAME_CONSTANTS.CANVAS_HEIGHT / 2,
        velocityY: 0,
        isMovingUp: false,
        sprite: null,
      },
      obstacles: [],
      trailPoints: [],
      frameCount: 0,
      startTime: Date.now(),
      gameSpeedMultiplier: 1,
      obstacleGenerationInterval: GAME_CONSTANTS.TREE_GENERATION_INTERVAL,
      lastSpeedIncreaseTime: 0,
      score: 0,
      isGameOver: false,
      lives: 3,
      invulnerable: false,
      invulnerabilityTimer: 0,
      avalancheParticles: [],
      avalancheStarted: false,
      avalancheIntensity: 0,
      avalancheDistance: 300,
      avalancheTimer: 300,
    }),
    [],
  )

  const gameStateRef = useRef<GameState>(createInitialGameState())

  useEffect(() => {
    setMounted(true)
  }, [])

  const resetGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    const currentSprite = gameStateRef.current.player.sprite
    gameStateRef.current = createInitialGameState()
    if (currentSprite) {
      gameStateRef.current.player.sprite = currentSprite
    }
    setScore(0)
    setGameTime(0)
    setGameOver(false)
    setLives(3)
    setGameStarted(true)
    setFirstTimeLoad(false)
    setGameKey((prev) => prev + 1)
  }, [
    createInitialGameState,
    setScore,
    setGameTime,
    setGameOver,
    setLives,
    setGameStarted,
    setFirstTimeLoad,
    setGameKey,
  ])

  const handleMoveUp = useCallback(
    (isStarting: boolean) => {
      if (firstTimeLoad || !gameStarted) {
        setFirstTimeLoad(false)
        setGameStarted(true)
        return
      }
      if (!gameStateRef.current.isGameOver) {
        gameStateRef.current.player.isMovingUp = isStarting
      }
    },
    [gameStarted, firstTimeLoad, setFirstTimeLoad, setGameStarted],
  )

  const handleInputStart = useCallback(
    (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      handleMoveUp(true)
    },
    [handleMoveUp],
  )

  const handleInputEnd = useCallback(
    (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      if (gameStarted && !gameStateRef.current.isGameOver) {
        handleMoveUp(false)
      }
    },
    [gameStarted, handleMoveUp],
  )

  const handleStartScreenClick = useCallback(
    (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      if (firstTimeLoad) {
        setFirstTimeLoad(false)
        setGameStarted(true)
      }
    },
    [firstTimeLoad, setFirstTimeLoad, setGameStarted],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        handleMoveUp(true)
      }
    },
    [handleMoveUp],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && gameStarted && !gameStateRef.current.isGameOver) {
        e.preventDefault()
        handleMoveUp(false)
      }
    },
    [gameStarted, handleMoveUp],
  )

  useEffect(() => {
    if (!mounted) return
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("touchstart", handleInputStart, { passive: false })
      canvas.addEventListener("touchend", handleInputEnd, { passive: false })
      canvas.addEventListener("mousedown", handleInputStart)
      canvas.addEventListener("mouseup", handleInputEnd)
      canvas.addEventListener("pointerdown", handleInputStart)
      canvas.addEventListener("pointerup", handleInputEnd)
      canvas.addEventListener("contextmenu", (e) => e.preventDefault())
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (canvas) {
        canvas.removeEventListener("touchstart", handleInputStart)
        canvas.removeEventListener("touchend", handleInputEnd)
        canvas.removeEventListener("mousedown", handleInputStart)
        canvas.removeEventListener("mouseup", handleInputEnd)
        canvas.removeEventListener("pointerdown", handleInputStart)
        canvas.removeEventListener("pointerup", handleInputEnd)
        canvas.removeEventListener("contextmenu", (e) => e.preventDefault())
      }
    }
  }, [mounted, handleKeyDown, handleKeyUp, handleInputStart, handleInputEnd])

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = gameConfig.canvasWidth
    canvas.height = gameConfig.canvasHeight

    // Initialize game objects
    gameObjectsRef.current = new GameObjects(canvas.width, canvas.height)

    // Create initial population
    const totalCells = gameConfig.initialHealthyCells + gameConfig.initialInfectedCells

    // Add healthy cells
    for (let i = 0; i < gameConfig.initialHealthyCells; i++) {
      const cell = new Cell(Math.random() * canvas.width, Math.random() * canvas.height, "healthy")
      gameObjectsRef.current.addCell(cell)
    }

    // Add infected cells
    for (let i = 0; i < gameConfig.initialInfectedCells; i++) {
      const cell = new Cell(Math.random() * canvas.width, Math.random() * canvas.height, "infected")
      gameObjectsRef.current.addCell(cell)
    }

    // Add initial viruses
    for (let i = 0; i < gameConfig.initialViruses; i++) {
      const virus = new Virus(Math.random() * canvas.width, Math.random() * canvas.height)
      gameObjectsRef.current.addVirus(virus)
    }

    // Add initial cures
    for (let i = 0; i < gameConfig.initialCures; i++) {
      const cure = new Cure(Math.random() * canvas.width, Math.random() * canvas.height)
      gameObjectsRef.current.addCure(cure)
    }

    updateStats()
  }, [])

  const updateStats = useCallback(() => {
    if (!gameObjectsRef.current) return

    const cells = gameObjectsRef.current.getCells()
    const viruses = gameObjectsRef.current.getViruses()
    const cures = gameObjectsRef.current.getCures()

    const infectedCells = cells.filter((cell) => cell.state === "infected").length
    const healthyCells = cells.filter((cell) => cell.state === "healthy").length
    const curedCells = cells.filter((cell) => cell.state === "cured").length
    const totalCells = cells.length

    const infectionRate = totalCells > 0 ? (infectedCells / totalCells) * 100 : 0

    setStats({
      infectedCells,
      healthyCells,
      curedCells,
      totalCells,
      infectionRate,
      generation: gameObjectsRef.current.getGeneration(),
      virusStrength: Math.round(viruses.reduce((sum, v) => sum + v.strength, 0) / Math.max(viruses.length, 1)),
      cureEffectiveness: Math.round(cures.reduce((sum, c) => sum + c.effectiveness, 0) / Math.max(cures.length, 1)),
    })
  }, [])

  const gameLoop = useCallback(() => {
    if (!gameObjectsRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update game state
    gameObjectsRef.current.update()

    // Render game objects
    gameObjectsRef.current.render(ctx)

    // Update stats
    updateStats()

    if (isRunning) {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
  }, [isRunning, updateStats])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, gameLoop])

  const handlePlayPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    initializeGame()
  }

  const addVirus = () => {
    if (!gameObjectsRef.current || !canvasRef.current) return

    const virus = new Virus(Math.random() * canvasRef.current.width, Math.random() * canvasRef.current.height)
    gameObjectsRef.current.addVirus(virus)
    updateStats()
  }

  const addCure = () => {
    if (!gameObjectsRef.current || !canvasRef.current) return

    const cure = new Cure(Math.random() * canvasRef.current.width, Math.random() * canvasRef.current.height)
    gameObjectsRef.current.addCure(cure)
    updateStats()
  }

  useEffect(() => {
    if (!mounted || (!gameStarted && firstTimeLoad)) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = GAME_CONSTANTS.CANVAS_WIDTH * dpr
    canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT * dpr
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = false

    const fontLink = document.createElement("link")
    fontLink.href = FONTS.PIXEL
    fontLink.rel = "stylesheet"
    if (!document.querySelector(`link[href="${FONTS.PIXEL}"]`)) {
      document.head.appendChild(fontLink)
    }

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(new Error(`Failed to load image: ${src}. Error: ${e}`))
        img.src = src
      })

    const loadObstacleSprites = async () => {
      try {
        const treeSprites = await Promise.all(IMAGES.TREES.map(loadImage))
        const snowmanSprites = await Promise.all(IMAGES.SNOWMEN.map(loadImage))
        return { treeSprites, snowmanSprites }
      } catch (error) {
        return { treeSprites: [], snowmanSprites: [] }
      }
    }

    const initGame = async () => {
      try {
        if (!gameStateRef.current.player.sprite) {
          gameStateRef.current.player.sprite = await loadImage(IMAGES.PLAYER)
        }

        let heartSprite: HTMLImageElement | null = null
        try {
          heartSprite = await loadImage(
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-pixel-heart-30-E8WvRfI37lnml1fzhv2B1ufLxpPDrI.png",
          )
        } catch (error) {
          try {
            heartSprite = await loadImage("/images/pixel-heart.png")
          } catch (altError) {}
        }

        let mountainBackground: HTMLImageElement | null = null
        try {
          mountainBackground = await loadImage("https://i.postimg.cc/tT0yD64J/fundo5.png")
        } catch (error) {}

        const { treeSprites, snowmanSprites } = await loadObstacleSprites()
        const getRandomObstacleSprite = () => {
          const useTree = Math.random() > 0.3
          const sprites = useTree ? treeSprites : snowmanSprites
          return sprites.length > 0 ? sprites[Math.floor(Math.random() * sprites.length)] : null
        }

        gameStateRef.current.obstacles = []
        for (let i = 0; i < 3; i++) {
          const sprite = getRandomObstacleSprite()
          if (sprite) {
            gameStateRef.current.obstacles.push({
              x: GAME_CONSTANTS.CANVAS_WIDTH + 100 + i * 150,
              y: Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT - 100) + 50,
              sprite,
            })
          }
        }

        gameStateRef.current.trailPoints = []
        gameStateRef.current.startTime = Date.now()
        gameStateRef.current.lastSpeedIncreaseTime = 0

        const generateAvalancheParticles = (count: number) => {
          const particles: AvalancheParticle[] = []
          const playerX = gameStateRef.current.player.x
          for (let i = 0; i < count; i++) {
            particles.push({
              x: playerX - gameStateRef.current.avalancheDistance + Math.random() * 100,
              y: Math.random() * GAME_CONSTANTS.CANVAS_HEIGHT,
              size: 4 + Math.floor(Math.random() * 4) * 2,
              speed: 1 + Math.random() * 3,
              opacity: 0.5 + Math.random() * 0.5,
            })
          }
          return particles
        }

        const drawBackground = () => {
          if (mountainBackground) {
            ctx.drawImage(mountainBackground, 0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT)
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
            ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT)
          } else {
            ctx.fillStyle = COLORS.sky
            ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT)
          }
        }

        const drawAvalanche = () => {
          if (!gameStateRef.current.avalancheStarted) return
          const { avalancheParticles } = gameStateRef.current
          const gradient = ctx.createLinearGradient(
            gameStateRef.current.player.x - gameStateRef.current.avalancheDistance,
            0,
            gameStateRef.current.player.x - gameStateRef.current.avalancheDistance + 150,
            0,
          )
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)")
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.rect(
            gameStateRef.current.player.x - gameStateRef.current.avalancheDistance - 50,
            0,
            200,
            GAME_CONSTANTS.CANVAS_HEIGHT,
          )
          ctx.fill()
          avalancheParticles.forEach((p) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
            const pixelX = Math.floor(p.x / 2) * 2
            const pixelY = Math.floor(p.y / 2) * 2
            const pixelSize = Math.floor(p.size / 2) * 2
            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize)
            if (Math.random() > 0.7) {
              ctx.fillStyle = `rgba(240, 240, 240, ${p.opacity * 0.6})`
              ctx.fillRect(pixelX + 2, pixelY + 2, 2, 2)
            }
            if (Math.random() > 0.8) {
              ctx.fillStyle = `rgba(220, 220, 220, ${p.opacity * 0.4})`
              ctx.fillRect(pixelX - 2, pixelY - 2, 2, 2)
            }
          })
        }

        const drawPlayer = () => {
          const { player, invulnerable, frameCount } = gameStateRef.current
          if (player.sprite) {
            ctx.save()
            ctx.translate(player.x, player.y)
            if (invulnerable && Math.floor(frameCount / 10) % 2 === 0) {
              ctx.globalAlpha = 0.5
            }
            if (gameStateRef.current.isGameOver) {
              ctx.rotate(-Math.PI / 2)
            }
            ctx.drawImage(
              player.sprite,
              -GAME_CONSTANTS.PLAYER_WIDTH / 2,
              -GAME_CONSTANTS.PLAYER_HEIGHT / 2,
              GAME_CONSTANTS.PLAYER_WIDTH,
              GAME_CONSTANTS.PLAYER_HEIGHT,
            )
            ctx.restore()
          }
        }

        const drawObstacles = () => {
          gameStateRef.current.obstacles.forEach((o) => {
            if (o.sprite) {
              ctx.drawImage(
                o.sprite,
                o.x - GAME_CONSTANTS.OBSTACLE_WIDTH / 2,
                o.y - GAME_CONSTANTS.OBSTACLE_HEIGHT,
                GAME_CONSTANTS.OBSTACLE_WIDTH,
                GAME_CONSTANTS.OBSTACLE_HEIGHT,
              )
            }
          })
        }

        const drawSkiTrail = () => {
          if (gameStateRef.current.trailPoints.length > 1) {
            ctx.strokeStyle = COLORS.skiTrail
            ctx.lineWidth = 2
            ctx.beginPath()
            gameStateRef.current.trailPoints.forEach((p, i) => {
              if (i === 0) ctx.moveTo(p.x, p.y)
              else ctx.lineTo(p.x, p.y)
            })
            ctx.stroke()
          }
        }

        const drawHearts = () => {
          const heartSize = 20,
            heartSpacing = 28,
            startX = 20,
            startY = 50
          for (let i = 0; i < 3; i++) {
            const x = startX + i * heartSpacing
            if (heartSprite) {
              ctx.save()
              if (i >= gameStateRef.current.lives) {
                ctx.globalAlpha = 0.3
                ctx.filter = "grayscale(100%)"
              }
              ctx.drawImage(heartSprite, x, startY, heartSize, heartSize)
              ctx.restore()
            } else {
              ctx.fillStyle = i < gameStateRef.current.lives ? "#ff0000" : "#666666"
              ctx.fillRect(x, startY, heartSize, heartSize)
            }
          }
        }

        const drawUI = () => {
          ctx.fillStyle = "#000000"
          ctx.font = '14px "Press Start 2P", monospace'
          const scoreText = `Score: ${gameStateRef.current.score}`
          const scoreWidth = ctx.measureText(scoreText).width
          ctx.fillText(scoreText, GAME_CONSTANTS.CANVAS_WIDTH - scoreWidth - 20, 30)
          const currentTime = gameStateRef.current.isGameOver
            ? gameTime
            : Math.floor((Date.now() - gameStateRef.current.startTime) / 1000)
          const timeString = new Date(currentTime * 1000).toISOString().substr(14, 5)
          ctx.fillText(timeString, 20, 30)
          drawHearts()
        }

        const checkCollision = (player: Player, obstacles: Obstacle[]) => {
          for (const o of obstacles) {
            const dx = Math.abs(player.x - o.x)
            const dy = Math.abs(player.y - o.y)
            if (
              dx < GAME_CONSTANTS.PLAYER_WIDTH / 2 + GAME_CONSTANTS.OBSTACLE_WIDTH / 2 &&
              dy < GAME_CONSTANTS.PLAYER_HEIGHT / 2 + GAME_CONSTANTS.OBSTACLE_HEIGHT / 2
            ) {
              return true
            }
          }
          return false
        }

        const checkAvalancheCollision = () =>
          gameStateRef.current.avalancheStarted && gameStateRef.current.avalancheDistance < 50

        const updateAvalanche = () => {
          const gs = gameStateRef.current
          if (!gs.avalancheStarted) {
            if (gs.avalancheTimer <= 0) {
              gs.avalancheStarted = true
              gs.avalancheParticles = generateAvalancheParticles(50)
            } else {
              gs.avalancheTimer--
            }
            return
          }
          if (gs.frameCount % 60 === 0 && gs.avalancheIntensity < 1) gs.avalancheIntensity += 0.05
          if (gs.frameCount % 30 === 0) gs.avalancheDistance = Math.max(gs.avalancheDistance - 1, 40)
          gs.avalancheParticles = gs.avalancheParticles
            .map((p) => ({
              ...p,
              x: p.x + p.speed,
              y: p.y + (Math.random() - 0.5) * 2,
              opacity: Math.max(0, p.opacity - 0.005),
            }))
            .filter((p) => p.opacity > 0)
          if (gs.frameCount % 5 === 0) {
            const newParticles = generateAvalancheParticles(Math.floor(5 * gs.avalancheIntensity))
            gs.avalancheParticles.push(...newParticles)
          }
        }

        const updateGame = () => {
          if (gameStateRef.current.isGameOver) return
          const gs = gameStateRef.current
          if (gs.invulnerable) {
            gs.invulnerabilityTimer--
            if (gs.invulnerabilityTimer <= 0) gs.invulnerable = false
          }
          if (Date.now() - gs.lastSpeedIncreaseTime >= 2500) {
            gs.gameSpeedMultiplier += 0.05
            gs.obstacleGenerationInterval = Math.max(30, gs.obstacleGenerationInterval - 5)
            gs.lastSpeedIncreaseTime = Date.now()
          }
          gs.player.velocityY += gs.player.isMovingUp ? -0.2 : GAME_CONSTANTS.GRAVITY
          gs.player.velocityY = Math.max(
            -GAME_CONSTANTS.MOVEMENT_SPEED,
            Math.min(GAME_CONSTANTS.MOVEMENT_SPEED, gs.player.velocityY),
          )
          gs.player.y += gs.player.velocityY
          gs.player.y = Math.max(50, Math.min(GAME_CONSTANTS.CANVAS_HEIGHT - 70, gs.player.y))
          gs.trailPoints.unshift({ x: gs.player.x, y: gs.player.y + 10 })
          if (gs.trailPoints.length > 50) gs.trailPoints.pop()
          gs.obstacles = gs.obstacles
            .map((o) => ({ ...o, x: o.x - GAME_CONSTANTS.MOVEMENT_SPEED * gs.gameSpeedMultiplier }))
            .filter((o) => o.x > -50)
          gs.trailPoints = gs.trailPoints
            .map((p) => ({ ...p, x: p.x - GAME_CONSTANTS.MOVEMENT_SPEED * gs.gameSpeedMultiplier }))
            .filter((p) => p.x > 0)
          if (gs.frameCount % gs.obstacleGenerationInterval === 0) {
            const sprite = getRandomObstacleSprite()
            if (sprite)
              gs.obstacles.push({
                x: GAME_CONSTANTS.CANVAS_WIDTH + 50,
                y: Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT - 100) + 50,
                sprite,
              })
          }
          updateAvalanche()
          if (checkAvalancheCollision() || (!gs.invulnerable && checkCollision(gs.player, gs.obstacles))) {
            gs.lives--
            setLives(gs.lives)
            if (gs.lives <= 0) {
              gs.isGameOver = true
              setGameOver(true)
              setGameTime(Math.floor((Date.now() - gs.startTime) / 1000))
            } else {
              gs.invulnerable = true
              gs.invulnerabilityTimer = 120
            }
            return
          }
          if (gs.frameCount % 60 === 0) gs.score += 10
          gs.frameCount++
        }

        const gameLoop = () => {
          ctx.clearRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT)
          drawBackground()
          drawAvalanche()
          drawSkiTrail()
          drawObstacles()
          drawPlayer()
          drawUI()
          if (!gameStateRef.current.isGameOver) {
            updateGame()
            setScore(gameStateRef.current.score)
          }
          animationFrameRef.current = requestAnimationFrame(gameLoop)
        }
        gameLoop()
      } catch (error) {}
    }
    initGame()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    mounted,
    gameKey,
    gameStarted,
    firstTimeLoad,
    gameTime,
    handleInputEnd,
    handleInputStart,
    handleKeyDown,
    handleKeyUp,
    resetGame,
    createInitialGameState,
    setScore,
  ])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400 pixel-font text-sm">Loading PLAGUE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  PLAGUE
                </h1>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                Simulation
              </Badge>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="simulation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-gray-800 border border-gray-700">
            <TabsTrigger value="simulation" className="data-[state=active]:bg-green-600">
              <Activity className="h-4 w-4 mr-2" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-600">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-green-600">
              <Info className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="lore" className="data-[state=active]:bg-green-600">
              <BookOpen className="h-4 w-4 mr-2" />
              Lore
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-green-600">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="terms" className="data-[state=active]:bg-green-600">
              <FileText className="h-4 w-4 mr-2" />
              Terms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="space-y-6">
            {/* Game Controls */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handlePlayPause}
                      variant={isRunning ? "destructive" : "default"}
                      className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    >
                      {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="border-gray-600 bg-transparent">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={addVirus}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Add Virus
                    </Button>
                    <Button
                      onClick={addCure}
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Add Cure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Healthy</p>
                      <p className="text-xl font-bold text-green-400">{stats.healthyCells}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-sm text-gray-400">Infected</p>
                      <p className="text-xl font-bold text-red-400">{stats.infectedCells}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Cured</p>
                      <p className="text-xl font-bold text-blue-400">{stats.curedCells}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Infection Rate</p>
                      <p className="text-xl font-bold text-yellow-400">{stats.infectionRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Game Canvas */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-600 rounded-lg bg-black"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Generation</h3>
                  <p className="text-2xl font-bold">{stats.generation}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Virus Strength</h3>
                  <p className="text-2xl font-bold">{stats.virusStrength}%</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Cure Effectiveness</h3>
                  <p className="text-2xl font-bold">{stats.cureEffectiveness}%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Profile onClose={() => {}} />
          </TabsContent>

          <TabsContent value="about">
            <AboutModal onClose={() => {}} />
          </TabsContent>

          <TabsContent value="lore">
            <LoreModal onClose={() => {}} />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyModal onClose={() => {}} />
          </TabsContent>

          <TabsContent value="terms">
            <TermsModal onClose={() => {}} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <CookieConsent />
    </div>
  )
}
