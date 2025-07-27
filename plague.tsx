"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { GAME_CONSTANTS, COLORS, IMAGES, FONTS } from "../constants"
import { useWallet } from "@solana/wallet-adapter-react"
import WalletConnection from "./WalletConnection"
import AboutModal from "./AboutModal"
import LoreModal from "./LoreModal"
import NFTModal from "./NFTModal"
import Footer from "./Footer"
import TermsModal from "./TermsModal"
import Profile from "./Profile"

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

export default function SnowBored() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
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

  const [showAbout, setShowAbout] = useState(false)
  const [showLore, setShowLore] = useState(false)
  const [showNFT, setShowNFT] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

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
    <div className="mobile-container flex flex-col min-h-screen bg-gray-900 touch-optimized">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 1)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ice-RFivzrFYklghXcbtYkoYiMiESh5rh5.png')`,
          backgroundRepeat: "repeat",
        }}
      />
      <header className="relative z-10 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-3 sm:p-4">
          <button
            onClick={() => {
              if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
              gameStateRef.current = createInitialGameState()
              setScore(0)
              setGameTime(0)
              setGameOver(false)
              setLives(3)
              setFirstTimeLoad(true)
              setGameStarted(false)
              setGameKey((prev) => prev + 1)
            }}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="/plague-logo.png" alt="PLAGUE Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded" />
            <h1 className="text-sm sm:text-lg font-bold text-white pixel-font">PLAGUE</h1>
          </button>
          <nav className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setShowAbout(true)}
              className="text-gray-400 hover:text-orange-400 text-sm pixel-font transition-colors"
            >
              ABOUT
            </button>
            <button
              onClick={() => setShowLore(true)}
              className="text-gray-400 hover:text-orange-400 text-sm pixel-font transition-colors"
            >
              LORE
            </button>
            <button
              onClick={() => setShowNFT(true)}
              className="text-gray-400 hover:text-orange-400 text-sm pixel-font transition-colors"
            >
              NFTs
            </button>
          </nav>
          <WalletConnection />
        </div>
        <div className="sm:hidden border-t border-gray-700 px-3 py-2">
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setShowAbout(true)}
              className="text-gray-400 hover:text-orange-400 text-xs pixel-font transition-colors"
            >
              ABOUT
            </button>
            <button
              onClick={() => setShowLore(true)}
              className="text-gray-400 hover:text-orange-400 text-xs pixel-font transition-colors"
            >
              LORE
            </button>
            <button
              onClick={() => setShowNFT(true)}
              className="text-gray-400 hover:text-orange-400 text-xs pixel-font transition-colors"
            >
              NFTs
            </button>
          </div>
        </div>
      </header>
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-start justify-center gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full landscape:py-2 lg:py-8">
        <div className="w-full lg:w-auto flex flex-col items-center order-1 lg:order-1 lg:flex-shrink-0">
          <h2
            className={`text-base sm:text-xl lg:text-2xl font-bold mb-3 lg:mb-4 text-center pixel-font ${gameOver ? "text-red-400" : firstTimeLoad || !gameStarted ? "text-orange-400" : "text-green-400"}`}
          >
            {gameOver ? "GAME OVER" : firstTimeLoad || !gameStarted ? "RUN GORILLA, RUN!" : "SNOWBOARDING"}
          </h2>
          <div
            ref={containerRef}
            className="relative shadow-2xl shadow-orange-900/20 rounded-lg bg-gray-800/50"
            style={{
              width: "800px",
              maxWidth: isMobile ? (window.innerHeight > window.innerWidth ? "100%" : "85vw") : "100%",
              aspectRatio: `${GAME_CONSTANTS.CANVAS_WIDTH} / ${GAME_CONSTANTS.CANVAS_HEIGHT}`,
              maxHeight: isMobile ? "70vh" : "none",
            }}
          >
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-600 rounded-lg w-full h-full touch-optimized block"
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: `${GAME_CONSTANTS.CANVAS_WIDTH} / ${GAME_CONSTANTS.CANVAS_HEIGHT}`,
                display: "block",
              }}
            />
            {firstTimeLoad && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm select-none">
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundImage: `url('https://i.postimg.cc/d16khCd7/backgroundape.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                />
                <div className="relative z-20 text-white text-center space-y-3 p-3 max-w-xs bg-black/40 rounded-lg backdrop-blur-sm px-5">
                  <h3 className="text-xs sm:text-base font-bold text-orange-400 pixel-font">HOW TO PLAY</h3>
                  <div className="space-y-1 text-[0.65rem] sm:text-xs pixel-font">
                    <p className="text-white font-bold">TAP or CLICK to move up</p>
                    <p className="text-white font-bold">Release to move down</p>
                    <p className="text-white font-bold">Avoid obstacles</p>
                    <p className="text-white font-bold">You have 3 lives ❤️</p>
                    <p className="text-yellow-300 font-bold">Outrun the avalanche!</p>
                  </div>
                  <div
                    onClick={handleStartScreenClick}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleStartScreenClick(e)
                    }}
                    onTouchStart={handleStartScreenClick}
                    onPointerDown={handleStartScreenClick}
                    className="pulse-glow bg-orange-600 text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-orange-500 active:bg-orange-700 transition-colors"
                  >
                    <p className="text-[0.65rem] sm:text-xs font-bold pixel-font">TAP TO START</p>
                  </div>
                </div>
              </div>
            )}
            {gameOver && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm"
                style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(17,24,39,0.9) 100%)" }}
              >
                <div className="text-white text-center space-y-2 p-2 w-full max-w-[300px] sm:max-w-xs">
                  <div className="space-y-0">
                    <p className="font-bold text-white pixel-font text-xs sm:text-sm">Final Score: {score}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 pixel-font">
                      Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-2 px-3 rounded-lg text-xs border-2 border-orange-500 hover:border-orange-400 transition-all pixel-font shadow-lg"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>
          {gameStarted && !gameOver && (
            <div className="mt-3 lg:mt-4 text-center">
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base pixel-font">
                {isMobile ? "TAP & HOLD to move up" : "CLICK & HOLD to move up"}
              </p>
            </div>
          )}
          <a
            href="https://x.com/plague_labs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 text-xs sm:text-sm lg:text-base pixel-font mt-4 lg:mt-6 transition-colors"
          >
            Points unlock exclusive perks.
          </a>
          {/* Mobile Profile */}
          <div className="w-full mt-6 lg:hidden" style={{ maxWidth: "800px" }}>
            <div className="flex justify-center mb-3 gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className="px-4 py-1.5 text-xs pixel-font rounded-lg transition-all bg-orange-500 text-white border-2 border-orange-400"
              >
                PROFILE
              </button>
            </div>
            <Profile />
          </div>
        </div>
        {/* Desktop Profile */}
        <div
          className="hidden lg:block w-full lg:w-auto lg:flex-shrink-0 lg:self-start order-2 lg:order-2"
          style={{ width: "400px", maxWidth: "100%" }}
        >
          <div className="flex justify-center mb-4 gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className="px-5 py-2 text-sm pixel-font rounded-lg transition-all bg-orange-500 text-white border-2 border-orange-400 shadow-lg"
            >
              PROFILE
            </button>
          </div>
          <Profile />
        </div>
      </main>
      <section className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-6 lg:pb-8 mt-8 lg:mt-6">
        <div className="lg:hidden">
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-orange-900/20 bg-gradient-to-r from-orange-600/20 to-blue-600/20 backdrop-blur-sm border border-orange-500/30">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url('/images/coming-soon-banner.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="relative z-10 p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className="w-20 h-20 bg-gray-800 border-2 border-orange-500 rounded-none shadow-lg relative overflow-hidden"
                    style={{
                      imageRendering: "pixelated",
                      clipPath:
                        "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))",
                    }}
                  >
                    <div className="absolute inset-1 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-none"></div>
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cBmsGMqcvVflSojbhYBvFFj5RTv2tE.png"
                      alt="Gorilla Silhouette"
                      className="w-full h-full object-contain relative z-10 p-1"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <div className="absolute top-0 left-0 w-1 h-1 bg-orange-400"></div>
                    <div className="absolute top-0 right-0 w-1 h-1 bg-orange-400"></div>
                    <div className="absolute bottom-0 left-0 w-1 h-1 bg-orange-400"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-orange-400"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-orange-400 pixel-font mb-2">COMING SOON</h3>
                  <p className="text-sm sm:text-base text-gray-300 pixel-font mb-4">
                    New features, rewards, and adventures await!
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <div className="bg-gray-800/80 px-4 py-2 rounded-lg border border-gray-600">
                  <p className="text-xs text-gray-400 pixel-font">🎮 Enhanced Gameplay</p>
                </div>
                <div className="bg-gray-800/80 px-4 py-2 rounded-lg border border-gray-600">
                  <p className="text-xs text-gray-400 pixel-font">🏆 New Rewards</p>
                </div>
                <div className="bg-gray-800/80 px-4 py-2 rounded-lg border border-gray-600">
                  <p className="text-xs text-gray-400 pixel-font">🎯 Special Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-orange-900/20 bg-gradient-to-r from-orange-600/20 to-blue-600/20 backdrop-blur-sm border border-orange-500/30">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url('/images/coming-soon-banner.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="relative z-10 p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl lg:text-4xl font-bold text-orange-400 pixel-font mb-4">COMING SOON</h3>
                  <p className="text-lg lg:text-xl text-gray-300 pixel-font mb-6 max-w-2xl">
                    Get ready for an epic expansion! New features, exclusive rewards, and thrilling adventures are on
                    their way to enhance your PLAGUE experience.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="bg-gray-800/80 px-6 py-3 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors">
                      <p className="text-sm text-gray-300 pixel-font">🎮 Enhanced Gameplay Mechanics</p>
                    </div>
                    <div className="bg-gray-800/80 px-6 py-3 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors">
                      <p className="text-sm text-gray-300 pixel-font">🏆 Exclusive NFT Rewards</p>
                    </div>
                    <div className="bg-gray-800/80 px-6 py-3 rounded-lg border border-gray-600 hover:border-orange-500 transition-colors">
                      <p className="text-sm text-gray-300 pixel-font">🎯 Special Community Events</p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div
                      className="w-36 h-36 lg:w-44 lg:h-44 bg-gray-800 border-4 border-orange-500 rounded-none shadow-xl relative overflow-hidden"
                      style={{
                        imageRendering: "pixelated",
                        clipPath:
                          "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))",
                      }}
                    >
                      <div className="absolute inset-2 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-none"></div>
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cBmsGMqcvVflSojbhYBvFFj5RTv2tE.png"
                        alt="Gorilla Silhouette"
                        className="w-full h-full object-contain relative z-10 p-2"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <div className="absolute top-0 left-0 w-2 h-2 bg-orange-400"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-orange-400"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 bg-orange-400"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-orange-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer onTermsClick={() => setShowTerms(true)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <LoreModal isOpen={showLore} onClose={() => setShowLore(false)} />
      <NFTModal isOpen={showNFT} onClose={() => setShowNFT(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  )
}
