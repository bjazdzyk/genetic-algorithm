let c = document.getElementById("Canvas");
let ctx = c.getContext("2d");

let b_count = 100
let states = 8
let decisions = 4

let current_generation = []
let next_generation = []
let cube_position = []
let fitness = []

for(let i=0; i<b_count; i++){
	current_generation.push("")
	for(let j=0; j<states; j++){
		current_generation[i] += String(Math.floor(Math.random()*decisions))
	}
	current_generation[i] += String(Math.floor(Math.random()*2))
}

const countFitness =()=>{
	for(let i=0; i<b_count; i++){
		deltaX = Math.abs(apple_position.x - cube_position[i].x)
		deltaY = Math.abs(apple_position.y - cube_position[i].y)
		distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
		fitness[i] = 0-distance
	}
}


let apple_position
let simulated_generations = 0
let generation_count = 10
const simulateGeneration =()=>{
	simulated_generations++
	apple_position = {x:Math.floor(Math.random()*400), y:Math.floor(Math.random()*400)}
	cube_position = []
	for(let i=0; i<b_count; i++){
		cube_position.push({x:200, y:200})
	}
	let steps = 0
	let steps_limit = 20

	let interval = setInterval(()=>{
		if(steps>=steps_limit){
			clearInterval(interval)
			if(simulated_generations < generation_count){
				requestAnimationFrame(simulateGeneration)
			}
		}
		steps+=1
		for(let i=0; i<b_count; i++){
			let decision_point
			let random_decider = current_generation[i][decisions]
			let deltaX = apple_position.x - cube_position[i].x
			let deltaY = apple_position.y - cube_position[i].y
			if(Math.abs(deltaX) > Math.abs(deltaY)){
				if(deltaX < 0){
					if(deltaY < 0){
						decision_point = 1
					}else if(deltaY > 0){
						decision_point = 0
					}else{
						if(random_decider == 0){
							decision_point = 1
						}else{
							decision_point = 0
						}
					}
				}else{
					if(deltaY < 0){
						decision_point = 4
					}else if(deltaY > 0){
						decision_point = 5
					}else{
						if(random_decider == 0){
							decision_point = 4
						}else{
							decision_point = 5
						}
					}
				}
			}else{
				if(deltaY < 0){
					if(deltaX < 0){
						decision_point = 2
					}else if(deltaX > 0){
						decision_point = 3
					}else{
						if(random_decider == 0){
							decision_point = 2
						}else{
							decision_point = 3
						}
					}
				}else{
					if(deltaX < 0){
						decision_point = 7
					}else if(deltaX > 0){
						decision_point = 6
					}else{
						if(random_decider == 0){
							decision_point = 7
						}else{
							decision_point = 6
						}
					}
				}
			}

			let decision = current_generation[i][decision_point]

			if(decision == 0){
				cube_position[i].x += 5
			}else if(decision == 1){
				cube_position[i].y += 5
			}else if(decision == 2){
				cube_position[i].x -= 5
			}else if(decision == 3){
				cube_position[i].y -= 5
			}
			
		}
	}, 100);
}
simulateGeneration()
const loop =()=>{
	requestAnimationFrame(loop)
	ctx.fillStyle = "skyblue"
	ctx.fillRect(0, 0, 400, 400)

	ctx.fillStyle = "red"
	ctx.fillRect(apple_position.x-5, apple_position.y-5, 10, 10)

	for(let i=0; i<b_count; i++){
		ctx.fillStyle = "green"
		ctx.fillRect(cube_position[i].x-5, cube_position[i].y-5, 10, 10)
	}
}
loop()