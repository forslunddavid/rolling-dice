// App.jsx - Updated with complete dice rolling functionality
import { useState, useEffect } from "react"
import "./App.css"
import { DiceModel } from "./components/Dice"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

function App() {
	// State for number of dice and their values
	const [numDice, setNumDice] = useState(1)
	const [diceValues, setDiceValues] = useState([1])
	const [rolling, setRolling] = useState(false)
	const [totalScore, setTotalScore] = useState(1)

	// Function to roll the dice
	const rollDice = () => {
		if (rolling) return // Prevent rolling while animation is in progress

		setRolling(true)

		// Generate new random values
		const newValues = Array(numDice)
			.fill(0)
			.map(() => Math.floor(Math.random() * 6) + 1)

		setDiceValues(newValues)

		// Sum up the total score
		const newTotal = newValues.reduce((sum, value) => sum + value, 0)
		setTotalScore(newTotal)

		// Reset rolling state after animation completes
		setTimeout(() => {
			setRolling(false)
		}, 1000)
	}

	// Handle device shake for mobile devices
	useEffect(() => {
		// Define shake detection threshold
		const SHAKE_THRESHOLD = 15
		let lastX = 0
		let lastY = 0
		let lastZ = 0
		let lastUpdate = 0

		const handleShake = (event) => {
			const current = event.accelerationIncludingGravity

			if (!current) return

			const currentTime = new Date().getTime()

			if (currentTime - lastUpdate > 100) {
				const diffTime = currentTime - lastUpdate
				lastUpdate = currentTime

				const deltaX = Math.abs(current.x - lastX)
				const deltaY = Math.abs(current.y - lastY)
				const deltaZ = Math.abs(current.z - lastZ)

				if (
					(deltaX > SHAKE_THRESHOLD && deltaY > SHAKE_THRESHOLD) ||
					(deltaX > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD) ||
					(deltaY > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD)
				) {
					rollDice()
				}

				lastX = current.x
				lastY = current.y
				lastZ = current.z
			}
		}

		// Add shake detection if supported
		if (window.DeviceMotionEvent) {
			window.addEventListener("devicemotion", handleShake, false)
		}

		return () => {
			if (window.DeviceMotionEvent) {
				window.removeEventListener("devicemotion", handleShake, false)
			}
		}
	}, [numDice, rolling])

	// Update dice values when number of dice changes
	useEffect(() => {
		setDiceValues(
			Array(numDice)
				.fill(0)
				.map(() => Math.floor(Math.random() * 6) + 1)
		)
	}, [numDice])

	return (
		<>
			<div className="App" onClick={rollDice}>
				{/* Controls for selecting number of dice */}
				<div className="controls">
					<div className="dice-count">
						<button
							onClick={(e) => {
								e.stopPropagation()
								setNumDice(Math.max(1, numDice - 1))
							}}
							disabled={numDice === 1}
						>
							-
						</button>
						<span>
							{numDice} {numDice === 1 ? "die" : "dice"}
						</span>
						<button
							onClick={(e) => {
								e.stopPropagation()
								setNumDice(Math.min(5, numDice + 1))
							}}
							disabled={numDice === 5}
						>
							+
						</button>
					</div>
					<button
						className="roll-button"
						onClick={(e) => {
							e.stopPropagation()
							rollDice()
						}}
						disabled={rolling}
					>
						{rolling ? "Rolling..." : "Roll Dice"}
					</button>
				</div>

				{/* Score display */}
				<div className="score">Total: {totalScore}</div>

				{/* 3D Canvas with dice */}
				<Canvas camera={{ fov: 75, position: [-4, 5, -4] }}>
					<ambientLight intensity={0.5} />
					<directionalLight position={[5, 5, 5]} intensity={1} />
					<OrbitControls
						enableZoom={true}
						minDistance={2}
						maxDistance={10}
						target={[0, 0, 0]}
					/>

					{/* Render multiple dice with their values */}
					{diceValues.map((value, index) => {
						// Position dice in a circle or line based on their count
						const angle = (2 * Math.PI * index) / numDice
						const radius = numDice <= 1 ? 0 : 1.5
						const x = radius * Math.cos(angle)
						const z = radius * Math.sin(angle)

						return (
							<DiceModel
								key={index}
								position={[x, 0, z]}
								value={value}
								rolling={rolling}
							/>
						)
					})}

					{/* Ground plane */}
					<mesh
						rotation={[-Math.PI / 2, 0, 0]}
						position={[0, -1, 0]}
						receiveShadow
					>
						<planeGeometry args={[20, 20]} />
						<meshStandardMaterial color="#335577" />
					</mesh>
				</Canvas>
			</div>
		</>
	)
}

export default App
