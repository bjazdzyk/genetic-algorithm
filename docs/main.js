let c = document.getElementById("Canvas");
let ctx = c.getContext("2d");

let disp_otb = true

const toggle_otb =()=>{
	disp_otb = (disp_otb+1)%2
}

let b_count = 4000
let states = 8
let decisions = 4

let current_generation = []
let cube_position = []
let fitness = []

for(let i=0; i<b_count; i++){
	current_generation.push("")
	for(let j=0; j<states; j++){
		current_generation[i] += String(Math.floor(Math.random()*decisions))
	}
}

const countFitness =()=>{
	for(let i=0; i<b_count; i++){
		deltaX = Math.abs(apple_position.x - cube_position[i].x)
		deltaY = Math.abs(apple_position.y - cube_position[i].y)
		distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
		fitness[i] = Math.floor(250-distance)
		//console.log("bot " + i + " fitness:" + fitness[i])
	}
}

const GenValue =(gCode, steps, n)=>{
	let fit = 0
	let a_pos
	let cube_pos
	for(let i=0; i<n; i++){
		a_pos = {x:Math.floor(Math.random()*500)+250, y:Math.floor(Math.random()*500)}
		cube_pos = {x:500+Math.floor(Math.random()*20-10), y:250+Math.floor(Math.random()*20-10)}

		for(let j=0; j<steps; j++){
			let decision_point
			let deltaX = a_pos.x - cube_pos.x
			let deltaY = a_pos.y - cube_pos.y
			if(Math.abs(deltaX) > Math.abs(deltaY)){
				if(deltaX < 0){
					if(deltaY < 0){
						decision_point = 1
					}else if(deltaY > 0){
						decision_point = 0
					}
				}else{
					if(deltaY < 0){
						decision_point = 4
					}else if(deltaY > 0){
						decision_point = 5
					}
				}
			}else{
				if(deltaY < 0){
					if(deltaX < 0){
						decision_point = 2
					}else if(deltaX > 0){
						decision_point = 3
					}
				}else{
					if(deltaX < 0){
						decision_point = 7
					}else if(deltaX > 0){
						decision_point = 6
					}
				}
			}

			let decision = gCode[decision_point]

			if(decision == 0){
				cube_pos.x += 5
			}else if(decision == 1){
				cube_pos.y += 5
			}else if(decision == 2){
				cube_pos.x -= 5
			}else if(decision == 3){
				cube_pos.y -= 5
			}
		}
		dX = Math.abs(a_pos.x - cube_pos.x)
		dY = Math.abs(a_pos.y - cube_pos.y)
		distance = Math.sqrt(dX*dX + dY*dY)
		fit -= Math.floor(distance)
	}
	return fit
}

let fitness_wheel_borders = []
let wheel_size = 0

let best_fitness
let best_fitness_GENs
let best_fit_id

let atb_fitness_GENs = "00112233"

const generateFitnessWheel =()=>{
	countFitness()
	best_fitness = -1000000
	for(let i=0; i<b_count; i++){
		if(fitness[i]>100){
			fitness_wheel_borders[i] = wheel_size + fitness[i]*fitness[i]
			wheel_size += fitness[i]*fitness[i]
		}else{
			fitness_wheel_borders[i] = wheel_size
		}
		if(fitness[i] > best_fitness){
			best_fitness = fitness [i]
			best_fitness_GENs = current_generation[i]
			best_fit_id = i
		}
		let r = Math.random()
		if(r < 0.1){
			let cutpoint = Math.floor(Math.random()*7)
			atb_fitness_GENs = atb_fitness_GENs.slice(0, cutpoint) + Math.floor(Math.random()*4) + atb_fitness_GENs.slice(cutpoint+1, 8)
		}
		if(GenValue(best_fitness_GENs, 20, 50) > GenValue(atb_fitness_GENs, 20, 50)){
			atb_fitness_GENs = current_generation[best_fit_id]
		}
		//console.log(fitness_wheel_borders[i])
	}
	console.log("all time best GENCODE: " + atb_fitness_GENs)
	//console.log("size: " + wheel_size)
}

const newGeneration =()=>{
	generateFitnessWheel()
	let next_generation = []
	for(let i=0; i<b_count-1; i++){
		let pre1on_wheel = Math.floor(Math.random()*wheel_size)
		let pre2on_wheel = Math.floor(Math.random()*wheel_size)
		//console.log(wheel_size)
		let pre1id
		let pre2id
		for(let j=0; j<b_count; j++){
			if(fitness_wheel_borders[j]>pre1on_wheel){
				pre1id = j
				break
			}
		}
		for(let j=0; j<b_count; j++){
			if(fitness_wheel_borders[j]>pre2on_wheel){
				pre2id = j
				break
			}
		}
		let pre1GENs = current_generation[pre1id]
		let pre2GENs = current_generation[pre2id]
		let cutpoint = Math.floor(Math.random()*7+1)
		let newbotGENs = pre1GENs.slice(0, cutpoint) + pre2GENs.slice(cutpoint, 9);
		
		let r = Math.random()
		if(r < 0.01){
			let cutpoint = Math.floor(Math.random()*7)
			newbotGENs = newbotGENs.slice(0, cutpoint) + Math.floor(Math.random()*4) + newbotGENs.slice(cutpoint+1, 8)
		}

		next_generation[i] = newbotGENs
	}

	let cutpoint = Math.floor(Math.random()*7+1)
	next_generation[b_count-1] = best_fitness_GENs

	cutpoint = Math.floor(Math.random()*7+1)
	next_generation[b_count-1] = best_fitness_GENs
	return(next_generation)

}

let apple_position
let simulated_generations = 0
let generation_count = 10000
let atb_cube_position = {}
const simulateGeneration =()=>{
	simulated_generations++

	const element = document.getElementById("g");
	element.innerHTML = "Generation: "+simulated_generations;

	apple_position = {x:Math.floor(Math.random()*500)+250, y:Math.floor(Math.random()*500)}
	atb_cube_position = {x:500, y:250}
	cube_position = []
	for(let i=0; i<b_count; i++){
		cube_position.push({x:500+Math.floor(Math.random()*20-10), y:250+Math.floor(Math.random()*20-10)})
	}
	cube_position.push(atb_cube_position)
	let steps = 0
	let steps_limit = 100

	let interval = setInterval(()=>{
		if(steps>=steps_limit){
			clearInterval(interval)
			if(simulated_generations < generation_count){
				current_generation = newGeneration()
				requestAnimationFrame(simulateGeneration)
			}
		}
		steps+=1
		for(let i=0; i<b_count+1; i++){
			let decision_point
			let deltaX = apple_position.x - cube_position[i].x
			let deltaY = apple_position.y - cube_position[i].y
			if(Math.abs(deltaX) > Math.abs(deltaY)){
				if(deltaX < 0){
					if(deltaY < 0){
						decision_point = 1
					}else if(deltaY > 0){
						decision_point = 0
					}
				}else{
					if(deltaY < 0){
						decision_point = 4
					}else if(deltaY > 0){
						decision_point = 5
					}
				}
			}else{
				if(deltaY < 0){
					if(deltaX < 0){
						decision_point = 2
					}else if(deltaX > 0){
						decision_point = 3
					}
				}else{
					if(deltaX < 0){
						decision_point = 7
					}else if(deltaX > 0){
						decision_point = 6
					}
				}
			}
			let GEN
			if(i < b_count){
				GEN = current_generation[i]
			}else{
				GEN = atb_fitness_GENs
			}
			let decision = GEN[decision_point]
			
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
	}, 0);
}
simulateGeneration()
const loop =()=>{
	requestAnimationFrame(loop)
	ctx.fillStyle = "skyblue"
	ctx.fillRect(0, 0, 1000, 500)
	if(!disp_otb){
		for(let i=0; i<b_count; i++){
			ctx.fillStyle = "green"
			ctx.fillRect(cube_position[i].x-5, cube_position[i].y-5, 10, 10)
		}
	}

	ctx.fillStyle = "red"
	ctx.fillRect(apple_position.x-5, apple_position.y-5, 10, 10)

	ctx.fillStyle = "yellow"
	ctx.fillRect(cube_position[b_count-1].x-5, cube_position[b_count-1].y-5, 10, 10)

	ctx.fillStyle = "blue"
	ctx.fillRect(cube_position[b_count].x-5, cube_position[b_count].y-5, 10, 10)
}
loop()

window.onload=()=>{
	document.querySelector('button').addEventListener('click',()=>{
		toggle_otb()
		console.log("clicked")
	})
}
