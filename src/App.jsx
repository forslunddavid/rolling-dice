import "./App.css"
import { Model } from "./components/Dice"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

function App() {
	const diceNumbers = [1, 2, 3, 4, 5, 6]
	const randomDiceNumber =
		diceNumbers[Math.floor(Math.random() * diceNumbers.length)]

	return (
		<>
			<div className="App">
				<Canvas camera={{ fov: 64, position: [-4, 3, -4] }}>
					<ambientLight intensity={5} />

					<OrbitControls
						enableZoom={true}
						minDistance={2}
						maxDistance={10}
						target={[0, 0, 0]}
					/>
					<Model position={[0, 0, 0]} />
				</Canvas>
			</div>
		</>
	)
}

export default App
