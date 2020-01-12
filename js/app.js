
const player1 = {
	piecesOfPizza: ["0-A", "1-A", "2-A", "3-A", "4-A", "5-A"],
	piecesClicked: [],
	piecesEaten: [], 
	piecesFlushed: [], 
	score: 0,
}

const player2 = {
	piecesOfPizza: ["0-B", "1-B", "2-B", "3-B", "4-B", "5-B"],
	piecesClicked: [],
	piecesEaten: [],
	piecesFlushed: [], 
	score: 0,
}


const game = {

	startGame() {
		$('#startGame').addClass('active')

		$('.closeBox').on("click", () => {
			$('#startGame').removeClass('active')
		})
	},
 
	timerLeft() {

		let sec = 20;
		const timer = setInterval( () => {
			
			$('#timer-left').text(`${sec}s`);
			sec--;

			if (sec === 0) {
				clearInterval(timer);
				//this lets player 2 know that it's their turn
				this.alertPlayer2()
				// this disables all buttons so player 1 cannot continue playing after their turn
				$('.pizzas-left').attr("disabled", true)
				$('#eat-left').attr("disabled", true)
				$('#toilet-left').attr("disabled", true)
				$('#reset-left').attr("disabled", true)
			}	
		}, 1000)
		$('.pizzas-left').attr("disabled", false)
		$('#eat-left').attr("disabled", false)
		$('#toilet-left').attr("disabled", false)
		$('#reset-left').attr("disabled", false)
	},

	clickPizzaLeft(idOfSlice) { 

		// here we make sure that we're only allowed to click a maximum of 6 total slices 
		// otherwise we could just keep endlessly adding slices to the pieces clicked away 

		if(player1.piecesClicked.length > player1.piecesOfPizza.length){

			return;
		}

		// here we check the unique ID of the pizza slice to make sure that is hasn't already been added to the pieces clicked array
		// otherwise we could add the same piece a million times
		// we also make sure that the unique pizza slice hasn't been eaten already 


		if(player1.piecesClicked.includes(idOfSlice) || player1.piecesEaten.includes(idOfSlice)){
			return;
		}

		// since the unique ID of the pizza made it past our checks, it is privileged enough to be added to our pieces array 
		player1.piecesClicked.push(idOfSlice);

		// lets dim the opacity of the unique slice to give feedback to the user to indicate that they have clicked the slice
		$(`#${idOfSlice}`).css("opacity", "0.5")

		// if exactly two unique slice ID's meet the criteria to enter our aray then fade in/out EAT button 

		if(player1.piecesClicked.length === 2){

			$('#eat-left').fadeOut(500)
			$('#eat-left').fadeIn(500)
			$('#eat-left').fadeOut(500)
			$('#eat-left').fadeIn(500)
		}	

	},

	eatLeft(idOfSlice) {
		
		// this prevents the player from clicking the eat button multiple times
		// at the bottom of this function we clear the piecesClicked array so its length is now zero 
		// this if statement will be entered only if the user hasn't selected anything new since last clicking the eatLeft button

		// this variable will be used throughout this function 
		const $player1 = $('#player1-name')

		if(player1.piecesClicked.length == 0){

			return;
		}

		// when the player presses the EAT button, let's add the slices that they've selected to our eaten array 

		player1.piecesEaten = player1.piecesClicked.concat(player1.piecesEaten);

		// if the player clicks exactly two slices, then fade out the emojis of those two unique slices

		if(player1.piecesClicked.length === 2){

			player1.piecesClicked.forEach(idOfSlice => {
				$(`#${idOfSlice}`).css("opacity", "0.0")
			})

			// even though the player has clicked on two pieces, he/she still cannot click
			// on toilet button
			$('#toilet-left').attr("disabled", false)
		}

		// if player clicked on one slice of pizza and pressed EAT button, display alert 

		if (player1.piecesClicked.length <= 1){

			// create h3 element with text 
			const $ateTooLittle = $("<h3></h3>").text("You didn't eat enough! You lose!")
			// create img tag with jquery with an attribute
			const $thumbsDown = $("<img>").attr("src", "http://www.graciaviva.cat/png/big/19/194011_thumbs-up-emoji-no-background.png").css("postion", "absolute")
			// append image tag to player 1 div
			$ateTooLittle.append($thumbsDown)
			// alert player that they didn't eat enough
			$ateTooLittle.insertAfter($player1)

			// if player eats 1 piece or less, all buttons become disabled
			$('.pizzas-left').attr("disabled", true)
			$('#eat-left').attr("disabled", true)
			$('#toilet-left').attr("disabled", true)
			$('#reset-left').attr("disabled", true)

		} 

		// if they've selected between 3 to 5 slices and pressed EAT button, display alert 

		else if (player1.piecesClicked.length > 2 && player1.piecesClicked.length < 6){

			// create h3 element with text 
			const $ateTooMuch = $("<h3></h3>").text("You ate too much! You lose!")
			// create img tag with jquery with an attribute
			const $throwUp = $("<img>").attr("src", "https://www.clipartwiki.com/clipimg/full/173-1733719_barf-vomit-puke-sick-emojisick-emoji-barfemoji-vomit.png")
			// prepend image to created h2 element
			$ateTooMuch.append($throwUp)
			// prepend h2 element to Player 1 name 
			$ateTooMuch.insertAfter($player1)

			// if player eats more than two piece or less than 6, all buttons become disabled
			$('.pizzas-left').attr("disabled", true)
			$('#eat-left').attr("disabled", true)
			$('#toilet-left').attr("disabled", true)
			$('#reset-left').attr("disabled", true)

		}

		// if they've eaten the exact length of the total slices available, display alert and TOILET button fades in and out

		else if (player1.piecesEaten.length === player1.piecesOfPizza.length){

			// pull in div id of player 1 
			//const $player1Update = $("#timer-left")
			// alert player that they need to empty their stomach to eat more
			const $player1Update = $("<h3></h3>").attr('id', 'player1Update').text("Empty your stomach to eat more!")
			$player1Update.insertAfter($player1)


			$('#toilet-left').fadeOut(500)
			$('#toilet-left').fadeIn(500)
			$('#toilet-left').fadeOut(500)
			$('#toilet-left').fadeIn(500)

		}

		// this will completely clear out the pieces clicked array
		// so when the user clickes more slices those slices are given a fresh evaluation 
		// notice we're not clearing out the pieces eaten array
		player1.piecesClicked = []

	},

	// flush 	
	emptyLeft() {	

		// all pieces in piecesEaten array will transfer into piecesFlushed array 
		player1.piecesFlushed = player1.piecesEaten; 
		console.log(player1.piecesFlushed);


		// when the toilet flush button is clicked, we clear out both arrays and re-render the pizza icons to the screen
		// essentially restarting the game 
		// even though we do this, the player can continue to play the game, like continue to add to the score etc 
		// the player also gains one point

		player1.piecesClicked = [],
		console.log(player1.piecesClicked);
		player1.piecesEaten = []
		console.log(player1.piecesEaten);
	

		// removes div class pizzas-left from the UI without removing data 
		$('.pizzasL').detach() 

		// removes the update that tells the player to "empty stomach to eat more"
		$('#player1Update').detach()

		// this allows the player to click on the toilet to move on in the game
		$('#toilet-left').attr("disabled", false)

		this.updateScoreboardL()

		this.displayPizzaL()
	},


	displayPizzaL() {

		const $leftPizzas = $('<div></div>').addClass('pizzasL')

		for (let i = 0; i < player1.piecesOfPizza.length; i++){
			let pizzaSliceL = $('<div></div>').attr('id', player1.piecesOfPizza[i]).text('🍕')
		pizzaSliceL.appendTo($leftPizzas)
		$leftPizzas.appendTo('.pizzas-left')

		}
	},

	updateScoreboardL() {
		// point added to player's score board 
		player1.score++
		const $player1ScoreBoard = $('#player1-score') 
		$player1ScoreBoard.text(`Score: ${player1.score}`)
	},

	alertPlayer2() {

		// this alerts player 2 to let them know it is their time to play
		$('#alertPlayer2').addClass('active')

		$('.closeBox').on("click", () => {
			$('#alertPlayer2').removeClass('active')
			$('#timer-right').attr("disabled", false)
		})
	},

	// this starts player 2 functions 


	timerRight() {

		let sec = 20;
		const timer = setInterval( () => {
			
			$('#timer-right').text(`${sec}s`);
			sec--;

			if (sec === 0) {
				clearInterval(timer);
				// this compares which player has won
				this.compare()
				// after timer is complete, player cannot press buttons anymore
				$('.pizzas-right').attr("disabled", true)
				$('#eat-right').attr("disabled", true)
				$('#toilet-right').attr("disabled", true)
				$('#reset-right').attr("disabled", true)
			}	
		}, 1000)
		$('.pizzas-right').attr("disabled", false)
		$('#eat-right').attr("disabled", false)
		$('#toilet-right').attr("disabled", false)
		$('#reset-right').attr("disabled", false)
	},

	clickPizzaRight(idOfSlice) { 

		// here we make sure that we're only allowed to click a maximum of 6 total slices 
		// otherwise we could just keep endlessly adding slices to the pieces clicked away 

		if(player2.piecesClicked.length > player2.piecesOfPizza.length){

			return;
		}

		// here we check the unique ID of the pizza slice to make sure that is hasn't already been added to the pieces clicked array
		// otherwise we could add the same piece a million times
		// we also make sure that the unique pizza slice hasn't been eaten already 


		if(player2.piecesClicked.includes(idOfSlice) || player2.piecesEaten.includes(idOfSlice)){
			return;
		}

		// since the unique ID of the pizza made it past our checks, it is privileged enough to be added to our pieces array 
		player2.piecesClicked.push(idOfSlice);

		// lets dim the opacity of the unique slice to give feedback to the user to indicate that they have clicked the slice
		$(`#${idOfSlice}`).css("opacity", "0.5")

		// if exactly two unique slice ID's meet the criteria to enter our aray then fade in/out EAT button 

		if(player2.piecesClicked.length === 2){

			$('#eat-left').fadeOut(500)
			$('#eat-left').fadeIn(500)
			$('#eat-left').fadeOut(500)
			$('#eat-left').fadeIn(500)
		}	

	},

	eatRight(idOfSlice) {
		
		// this prevents the player from clicking the eat button multiple times
		// at the bottom of this function we clear the piecesClicked array so its length is now zero 
		// this if statement will be entered only if the user hasn't selected anything new since last clicking the eatLeft button

		// this variable will be used throughout this function 
		const $player2 = $("#player2-name")

		if(player2.piecesClicked.length == 0){

			return;
		}

		// when the player presses the EAT button, let's add the slices that they've selected to our eaten array 

		player2.piecesEaten = player2.piecesClicked.concat(player2.piecesEaten);

		// if the player clicks exactly two slices, then fade out the emojis of those two unique slices

		if(player2.piecesClicked.length === 2){

			player2.piecesClicked.forEach(idOfSlice => {
				$(`#${idOfSlice}`).css("opacity", "0.0")
			})
		}

		// if player clicked on one slice of pizza and pressed EAT button, display alert 

		if (player2.piecesClicked.length <= 1){

			// create h3 element with text 
			const $ateTooLittle = $("<h3></h3>").text("You didn't eat enough! You lose!")
			// create img tag with jquery with an attribute
			const $thumbsDown = $("<img>").attr("src", "http://www.graciaviva.cat/png/big/19/194011_thumbs-up-emoji-no-background.png").css("postion", "absolute")
			// append image tag to player 1 div
			$ateTooLittle.append($thumbsDown)
			// alert player that they didn't eat enough
			$ateTooLittle.insertAfter($player2)

			// if player eats 1 piece or less, all buttons become disabled
			$('.pizzas-right').attr("disabled", true)
			$('#eat-right').attr("disabled", true)
			$('#toilet-right').attr("disabled", true)
			$('#reset-right').attr("disabled", true)

		} 

		// if they've selected between 3 to 5 slices and pressed EAT button, display alert 

		else if (player2.piecesClicked.length > 2 && player2.piecesClicked.length < 6){

			// create h3 element with text 
			const $ateTooMuch = $("<h3></h3>").text("You ate too much! You lose!")
			// create img tag with jquery with an attribute
			const $throwUp = $("<img>").attr("src", "https://www.clipartwiki.com/clipimg/full/173-1733719_barf-vomit-puke-sick-emojisick-emoji-barfemoji-vomit.png")
			// prepend image to created h2 element
			$ateTooMuch.append($throwUp)
			// prepend h2 element to Player 1 name 
			$ateTooMuch.insertAfter($player2)

			// if player eats more than two piece or less than 6, all buttons become disabled
			$('.pizzas-right').attr("disabled", true)
			$('#eat-right').attr("disabled", true)
			$('#toilet-right').attr("disabled", true)
			$('#reset-right').attr("disabled", true)

		}

		// if they've eaten the exact length of the total slices available, display alert and TOILET button fades in and out

		else if (player2.piecesEaten.length === player2.piecesOfPizza.length){

			// pull in div id of player 1 
			//const $player1Update = $("#timer-left")
			// alert player that they need to empty their stomach to eat more
			const $player2Update = $("<h3></h3>").attr('id', 'player2Update').text("Empty your stomach to eat more!")
			$player2Update.insertAfter($player2)


			$('#toilet-right').fadeOut(500)
			$('#toilet-right').fadeIn(500)
			$('#toilet-right').fadeOut(500)
			$('#toilet-right').fadeIn(500)

			$('#toilet-right').attr("disabled", false)
		}

		// this will completely clear out the pieces clicked array
		// so when the user clickes more slices those slices are given a fresh evaluation 
		// notice we're not clearing out the pieces eaten array
		player2.piecesClicked = []

	},

	// flush 	
	emptyRight() {	

		// all pieces in piecesEaten array will transfer into piecesFlushed array 
		player2.piecesFlushed = player2.piecesEaten; 

		// when the toilet flush button is clicked, we clear out both arrays and re-render the pizza icons to the screen
		// essentially restarting the game 
		// even though we do this, the player can continue to play the game, like continue to add to the score etc 
		// the player also gains one point

		player2.piecesClicked = [],
		player2.piecesEaten = []
	

		// removes div class pizzas-left from the UI without removing data 
		$('.pizzasR').detach() 

		// removes the update that tells the player to "empty stomach to eat more"
		$('#player2Update').detach()


		this.updateScoreboardR()
		//this.mainState()
		this.displayPizzaR()

		// this disables the toilet button again so the player cannot click on it again
		$('#toilet-right').attr("disabled", true)
	},


	displayPizzaR() {

		const $pizzaDivR = $('<div></div>').addClass('pizzasR')

		for (let i = 0; i < player2.piecesOfPizza.length; i++){
			let pizzaSliceR = $('<div></div>').attr('id', player2.piecesOfPizza[i]).text('🍕')
			pizzaSliceR.appendTo($pizzaDivR)
			$pizzaDivR.appendTo('.pizzas-right')
		}
		
	},

	updateScoreboardR() {
		// point added to player's score board 
		player2.score++
		const $player2ScoreBoard = $('#player2-score') 
		$player2ScoreBoard.text(`Score: ${player2.score}`)
	},

	compare() {

		if (player1.piecesFlushed.length > player2.piecesFlushed.length){

			$('#player1Wins').addClass('active')

		} else if (player2.piecesFlushed.length > player1.piecesFlushed.length) {

			$('#player2Wins').addClass('active')

		} else if (player1.piecesFlushed.length = player2.piecesFlushed.length) {

			$('#tie').addClass('active')
		}
	},

	resetRight() {
		// move data back to the way it was at the beginning -- pieces should be in pan
		player2.score = 0;
		player2.piecesOfPizza = [],
		player2.piecesClicked = [],
		player2.piecesFlushed = [],
		this.displayPizzaR()
	}

}

game.startGame()

$('#timer-left').on('click', () => {
	game.timerLeft()
})

$('.pizzas-left').on('click', (e) => {
	game.clickPizzaLeft(e.target.id)
}).attr("disabled", true)

$('#eat-left').on('click', () => {
	game.eatLeft()
}).attr("disabled", true)

$('#toilet-left').on('click', () => {
	game.emptyLeft()
}).attr("disabled", true)

$('#reset-left').on('click', () => {
	game.resetLeft()
}).attr("disabled", true)




$('#timer-right').on('click', () => {
	game.timerRight()
}).attr("disabled", true)

$('.pizzas-right').on('click', (e) => {
	game.clickPizzaRight(e.target.id)
}).attr("disabled", true)

$('#eat-right').on('click', () => {
	game.eatRight()
}).attr("disabled", true)

$('#toilet-right').on('click', () => {
	game.emptyRight()
}).attr("disabled", true)

$('#reset-right').on('click', () => {
	game.resetRight()
}).attr("disabled", true)
