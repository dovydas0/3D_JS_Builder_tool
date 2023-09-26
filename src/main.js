import { Scene } from "./scene"
import { World } from "./world"
import { printingCanvas } from "./mouse"

const sceneObject = new Scene(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const worldObject = new World(sceneObject)


const animate = () => {
  // Request next frame
  requestAnimationFrame(animate)

  // Calculate the elapsed time since the last frame
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

  // Update game objects based on deltaTime
  worldObject.update(deltaTime)

  // Render the scene
  sceneObject.renderer.render(sceneObject.scene, sceneObject.camera)

  // Store the current time for the next frame
  previousTime = currentTime;
}

let previousTime = performance.now();

animate()

window.addEventListener('resize', () => {
  sceneObject.camera.aspect = window.innerWidth / window.innerHeight;
  sceneObject.camera.updateProjectionMatrix();
  sceneObject.renderer.setSize(window.innerWidth, window.innerHeight);
})

printingCanvas(sceneObject)
