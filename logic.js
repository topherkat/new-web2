// Part A: Setup Tiles

let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Declaring variable used for touch input
let startX = 0;
let startY = 0;


function setGame(){
	// Initialize the 4x4 game board with all tiles set to 0
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	];

	// For loop is a code to repeat tasks inside it. 
	// Because of this we are able to create all the tiles for the board, and assign ids for all the tiles through repeating tasks inside.
	// This is through repeating the tasks inside from the first row first column, to the last row's last column.
	for(let r=0; r < rows; r++){
	    for(let c=0; c < columns; c++){

	    	// This is to create a tile through creating div elements
	    	let tile = document.createElement("div");
	    	
	    	// Each tile will have an id based on its row position and column position. 
            // Imagine students in a room who are given an id, but their id number is based on their seat row and column position.

	    	tile.id = r.toString() + "-" + c.toString(); 
	    	

	    	// Get the number of a tile from a backend board
	    	let num = board[r][c];
	    	
	    	// Use the number to update the tile's appearance
	    	updateTile(tile, num); 
	    	
	    	// Add the created tile with id to the frontend game board container.
	    	document.getElementById("board").append(tile);
	   }
	}

	setTwo();
	setTwo();
}

// This function is to update the color of the tile based on its number
function updateTile(tile, num){
    // Resets the tile and its class names 
    tile.innerText = ""; 
    tile.classList.value = ""; 
   
    // Add class name "tile" to resize and design the tile based on our assigned size and styles for class name tile.
    tile.classList.add("tile");

    // If the num value is not zero let's change the color of the tile based on it's num value
    if(num > 0) {
        // Re-assign the tile's text based on the num value 
        tile.innerText = num.toString();
        
        // If the num value of the tile is lesser or equal to 4096, the num value will be basis of what class it will add to color the tile. In short, the color of the will be based on its num value.
        // If the num value of the tile is lesser or equal to 4096,
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

// This ensures that our application will wait until everything on the page is ready before initiating the setGame function to load the tiles.
window.onload = function() {
    setGame();
}


// -----------------------------

// Part B: Merge Tiles

function handleSlide(e) {
    
    // e.code means the pressed key.

    // This is to show in our browser console what key is pressed 
    console.log(e.code);


    // For our application controls, we will only use arrow keys right?
    // Therefore if our application detects an arrow key it will run functionalities for merging tiles.
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        
        // Prevent default behavior (scrolling) on keydown
        e.preventDefault(); 
        
        // Depending on which arrow key was pressed, a corresponding function is called to merge the tiles 
        if (e.code == "ArrowLeft" && canMoveLeft()) {
            slideLeft(); // to merge tiles 
            setTwo();
        } else if (e.code == "ArrowRight" && canMoveRight()) {
            slideRight(); // to merge tiles
            setTwo();
        } else if (e.code == "ArrowUp" && canMoveUp()) {
            slideUp(); // to merge tiles
            setTwo();
        } else if (e.code == "ArrowDown" && canMoveDown()) {
            slideDown(); // to merge tiles
            setTwo();
        }


        document.getElementById("score").innerText = score;     // Updates the score

        checkWin();

        if (hasLost()) {
            // Use setTimeout to delay the alert
            setTimeout(() => {
                alert("Game Over! You have lost the game. Game will restart");
                restartGame();
                alert("Click any arrow key to restart");
                // You may want to reset the game or perform other actions when the user loses.
            }, 100); // Adjust the delay time (in milliseconds) as needed

        }
    }
}

// This will run a handleSlide function upon pressing a key in our keyboard
document.addEventListener("keydown", handleSlide);

// This is to create a storage for rows that will get rid of zeroes
function filterZero(row){
    return row.filter(num => num != 0) ;
}

// Core function for sliding and merging tiles in a row.
function slide(row){
    // row = [0, 2, 2, 2]
    row = filterZero(row); // get rid of zeroes -> [2, 2, 2]

    // Iterate through the row to check for adjacent equal numbers.
    //row = [2, 2, 2]
    for(let i = 0; i < row.length - 1; i++){
       
     
        // If two adjacent numbers are equal.
        if(row[i] == row[i+1]){
            // merge them by doubling the first one
            row[i] *= 2;
            // and setting the second one to zero.      
            row[i+1] = 0;   

            //This code is to update the score every merging:
            score += row[i];    
        } // [2, 2, 2] -> [4, 0, 2]
    }

    row = filterZero(row); //[4, 2]

    // Add zeroes back
    while(row.length < columns){
        // adds zero on the end of the array.
        row.push(0);
    } // [4, 2, 0, 0]

    return row; // [4,2,0,0]
}

// For merging, Slide left and right will be through row values 
function slideLeft(){

    for(let r = 0; r < rows; r++){
    	// All tile values per row are saved in a container row
        let row = board[r] // sample: 0, 2, 2, 2

       	// This line for animation
        let originalRow = row.slice(); // store the original row 

        row = slide(row); // use slide function to merge the same values
        board[r] = row;  // update the row with the merged tile/s

       	// Because of this loop, we are able to update the id and color of all the tiles, 
       	// This is through, by repeating the tasks inside from the first tile until the last tile
        for(let c = 0; c < columns; c++){
        	/*
        		Everytime we slide left the tile, it's position changes, it's id is based on its position. Therefore, we need to update the id of the tile based on it's new position.
        	*/
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            
            // Because tiles are being merged, it will have a new value. Therefore, we need to update the color of the tile based on its new value. 
            updateTile(tile, num);


            // Line for animation 
            if (originalRow[c] !== num && num !== 0) {  // if current tile != to the original tile, apply aninmation
                // specifies the animation style and the duration
                tile.style.animation = "slide-from-right 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

function slideRight() {
    
    // iterate through each row
    for(let r = 0; r < rows; r++){
        let row = board[r];

        let originalRow = row.slice();

        // reverses the order of elements in the row, effectively making the tiles slide to the right as if the board was mirrored.
        row.reverse(); // reverse the array(since it is sliding to the right) before removing the zeroes  row = [0, 2, 2, 2] -> row = [2, 2, 2, 0]
        row = slide(row); // modify the array -> [4, 2, 0, 0]
        // reverts the row back to its original order after the sliding and merging operations.
        row.reverse(); // reverse the array -> [0, 0, 2, 4]
        board[r] = row;

        // Update the id of the tile
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            // Line for animation
            if (originalRow[c] !== num && num !== 0) {  
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

// For merging, Slide up and down will be through column values 
function slideUp(){
    for(let c = 0; c < columns; c++) {
       
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] ;

        // Documents initial position
        let originalRow = row.slice();

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]


        let changedIndices = [];

        for (let r = 0; r < rows; r++) { 
            if (originalRow[r] !== row[r]) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [4, 0, 0, 0]

                1st iteration: 2 !== 4 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 0 (False)
                */
                changedIndices.push(r);
            }
        }

        // Update the id of the tile
        for(let r = 0; r < rows; r++){
            
            board[r][c] = row[r]
            
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num)

            if (originalRow[c] !== num && num !== 0) {  
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

function slideDown(){
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] ;

        let originalRow = row.slice();

        row.reverse();      
        row = slide(row);   
        row.reverse();      

        let changedIndices = [];
        // Check which tiles have changed in this column
        for (let r=0; r < rows; r++){
        	// If the initial array is different from the new array
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r); // Save the row position where it detects the array is different
            }
        }
		
		// Update the id of the tile	        
        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            // Animation - Add sliding effect by animating the movement of the tile 
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

        }
    }
}

// ---------------------------

// Part C: Setting 2 values to an empty tile

function hasEmptyTile(){
    // Iterate through the board
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // Check if current tile == 0, if yes return true
            if(board[r][c] == 0){
                return true
            }
        }
    }
    // Return false if no tile == 0
    return false;
}



function setTwo(){
    
    // This is if all tiles are not empty it will not set a 2 value
    if(!hasEmptyTile()){
        return; // Because the return keyword it will not proceed to next codes inside the function. Therefore it will not set two if all tiles is not empty
    }

    // But if there is an empty tile found it will proceed to this code, which will assign a value 2 to a random tile
    let found = false;

    // While loop is also like for loop that repeats tasks
    // Here, it will repeat the task until he finds the a random empty tile.
    while(!found){
        

    	// This is to get a random tile based on random row and column
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);


        // Then we will check the random tile in the board if it's value is zero. If it is then let's make it 2.
        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            found = true;
        }
    }
}	

// ----------------------------

// Part D: Congratulate Player if the player won, Restart Game and score If the Player loses

function checkWin(){
    
    // The loop's task is to check the first tile until the last tile if it has 2048, 4096, or 8192
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
           	
           	// if it has 2048, 4096, or 8192, it should show an alert box that the player won.
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  
                is2048Exist = true;     
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    
            }
        }
    }
}

function hasLost() {

    // Check if the board is full (because if the board is full and the player has no possible merges, it means he lose)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

        	// If it has an empty tile (value 0), it means the player has not yet lost, so it will return false.
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            // Check if there are adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }
    // No possible moves left or empty tiles, user has lost
    return true;
}

// Restart the game by replacing all values into zero
function restartGame(){

	// This loop will set the per tiles in the board to zerp
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    
        }
    }

    score = 0;
    setTwo()
}

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

//  This will check for where you touch your screen and prevents scrolling if your touch // input targets any element that includes the word tile in their class names
document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); // This line disables scrolling
}, { passive: false }); // Use passive: false to make preventDefault() work

// Listen for the 'touchend' event on the entire document
document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});

// Check if there are available merging moves in the right direction, if there is none it should not add new tile when pressing left 
function canMoveLeft() {
    // It goes through each row of the grid, one by one (a row is like a horizontal line in the grid).
    for (let r = 0; r < rows; r++) {
        // For each row, it starts from the second column (position) because moving to the left means it's checking if the number can slide to the left.
        for (let c = 1; c < columns; c++) {
            console.log(`${r} - ${c}`);
            // This line checks if the current position on the grid (board[r][c]) has a number in it (not empty). If there's a number there, it means the function is looking at a tile that needs to be checked for moving left.
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position to the left of the current tile is empty (0).
                    // It also checks if the number to the left is the same as the current number.
                if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                    // If the conditions are met (you can move a tile to the left), the function immediately says, "Yes, you can move left in this row!" and stops checking.
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if there are available merging moves in the right direction
function canMoveRight() {
    for (let r = 0; r < rows; r++) {
        //  This loop starts from the second-to-last column and goes backwards because moving to the right means checking the number's interaction with the one to its right.
        for (let c = columns - 2; c >= 0; c--) {
            console.log(`${r} - ${c}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position to the right of the current tile is empty (0).
                    // It also checks if the number to the right is the same as the current number.
                if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

 // Check if there are available merging moves in the upward direction
function canMoveUp() {
    // This line starts a loop that goes through each column in the game grid. A column is like a vertical line in the grid, and this loop checks one column at a time.
    for (let c = 0; c < columns; c++) {
        // This loop starts from the second row because moving upward means checking the number's interaction with the one above it.
        for (let r = 1; r < rows; r++) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position above the current tile is empty (0).
                    // It also checks if the number above is the same as the current number.
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if there are available merging moves in the downward direction
function canMoveDown() {
    for (let c = 0; c < columns; c++) {
        // This loop starts from the second-to-last row and goes backward because moving downward means checking the number's interaction with the one below it.
        for (let r = rows - 2; r >= 0; r--) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position below the current tile is empty (0).
                    // It also checks if the number below is the same as the current number.
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}
