// components/Dice.jsx - Updated with animation and value support
import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

// Define rotations for each dice face value
const diceRotations = {
	1: [0, Math.PI, 0], // Default orientation showing 1
	2: [-Math.PI / 2, 0, 0], // Rotate to show 2
	3: [0, 0, Math.PI / 2], // Rotate to show 3
	4: [0, 0, -Math.PI / 2], // Rotate to show 4
	5: [Math.PI / 2, 0, 0], // Rotate to show 5
	6: [0, 0, 0], // Rotate to show 6
}
console.log(diceRotations, 1)

export function DiceModel({ position, value = 1, rolling = false }) {
	const { nodes, materials } = useGLTF("/dice.glb")
	const diceRef = useRef()

	// Rolling animation variables
	const rotationSpeed = useRef({
		x: Math.random() * 2 - 1,
		y: Math.random() * 2 - 1,
		z: Math.random() * 2 - 1,
	})

	const targetRotation = useRef(
		new THREE.Euler(
			...diceRotations[value].map(
				(val) => val + Math.PI * 2 * Math.floor(Math.random() * 4)
			)
		)
	)

	// Reset rotation speed when rolling starts
	useEffect(() => {
		if (rolling) {
			// Random rotation speeds for each axis
			rotationSpeed.current = {
				x: (Math.random() * 10 - 5) * Math.PI,
				y: (Math.random() * 10 - 5) * Math.PI,
				z: (Math.random() * 10 - 5) * Math.PI,
			}

			// Set a new target rotation based on the dice value
			const baseRotation = diceRotations[value] || [0, 0, 0]
			targetRotation.current = new THREE.Euler(
				baseRotation[0] + Math.PI * 2 * Math.floor(Math.random() * 4),
				baseRotation[1] + Math.PI * 2 * Math.floor(Math.random() * 4),
				baseRotation[2] + Math.PI * 2 * Math.floor(Math.random() * 4)
			)
		}
	}, [rolling, value])

	// Handle the dice animation
	useFrame((_, delta) => {
		if (!diceRef.current) return

		if (rolling) {
			// Fast random rotation during rolling
			diceRef.current.rotation.x += rotationSpeed.current.x * delta
			diceRef.current.rotation.y += rotationSpeed.current.y * delta
			diceRef.current.rotation.z += rotationSpeed.current.z * delta
		} else {
			// Smooth interpolation to the target rotation (the correct dice face)
			diceRef.current.rotation.x = THREE.MathUtils.lerp(
				diceRef.current.rotation.x,
				targetRotation.current.x,
				0.1
			)
			diceRef.current.rotation.y = THREE.MathUtils.lerp(
				diceRef.current.rotation.y,
				targetRotation.current.y,
				0.1
			)
			diceRef.current.rotation.z = THREE.MathUtils.lerp(
				diceRef.current.rotation.z,
				targetRotation.current.z,
				0.1
			)
		}
	})

	return (
		<group position={position} ref={diceRef}>
			<group position={[0, 1, 0]}>
				<mesh
					geometry={nodes.Cube_1.geometry}
					material={materials.black}
					castShadow
				/>
				<mesh
					geometry={nodes.Cube_2.geometry}
					material={materials.white}
					castShadow
				/>
			</group>
		</group>
	)
}

useGLTF.preload("/dice.glb")
