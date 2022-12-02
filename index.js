const input = document.querySelector('input');
const easy = document.querySelector('#easy');
const intermediate = document.querySelector('#intermediate');
const hard = document.querySelector('#hard');
const tables = document.querySelector('#tables');
const game = document.querySelector('#game');
const text = document.querySelector('#text');
const restart = document.querySelector('#restart');
const completed = document.querySelector('#completed');

let matrix  = [];
let current_matrix = [];
let difficulty = "";
let playerName = "";
let gameState = 0;
let bulbs = [];
let startTime;
let time;

document.addEventListener('click', function(e){
    if (e.target.matches('img')){
        if (gameState == 0){
            gameState++;
            genTable(e);
            restart.classList.remove('hidden');
            game.classList.remove('hidden');
            completed.classList.add("hidden");
            startTime = new Date();
            document.getElementById("time").innerHTML = `Time elapsed: 0 seconds`; bulbs = [];
            //load();
            drawTable(current_matrix);
        }
    }else if (gameState == 1 && e.target.matches('td')){
        play(e);
    }
    if(e.target.matches("button")){
        matrix = []; current_matrix = []; 
        localStorage.setItem(difficulty.toString(),bulbs);
        bulbs = [];
        game.classList.add('hidden');
        restart.classList.add('hidden');
        easy.classList.remove('hidden');
        intermediate.classList.remove('hidden');
        hard.classList.remove('hidden');
        gameState = 0;
        text.innerHTML = "Enter player name:";
        input.classList.remove("hidden");
        completed.classList.remove("hidden");
    }
})

function genTable(e) {
    if (e.target.matches('img')){
        difficulty = e.target.dataset.difficulty; 
        decide_matrix(); 
        current_matrix = structuredClone(matrix);
        gameStart();
        drawTable(matrix); 
    }
}

function load() {
    console.log(bulbs);
    if (localStorage.getItem( difficulty.toString()) == undefined){
        console.log("a");
        return; 
    }
    let str = localStorage.getItem( difficulty.toString()).split(',')
            //console.log(i, i+1);
    for (let i = 0; i < Math.ceil(str.length/2); i++) {
        bulbs.push( [ parseInt(str[i]), parseInt(str[i+1])])
        //console.log(i, i+1);
        i++;
    }
}

const gameTable = game.querySelector('table');
function play(e) {
    let x = parseInt(e.target.dataset.col); let y = parseInt(e.target.dataset.row); 
    step(y, x);
    drawTable(current_matrix);  //kirajzolja a current_matrix-ot a benne levo adatok alapjan
}

function step(x, y){
    current_matrix = structuredClone(matrix);
    if (matrix[x][y] == -2 && has(bulbs, x, y) == -1 ){
        bulbs.push( [x, y] );
        current_matrix[x][y] = -4;
    }else if(matrix[x][y] == -2 && has(bulbs, x, y) >= 0) {
        bulbs.splice(has(bulbs, x, y), 1);
        current_matrix[x][y] = -2;
    }
    bulbs.forEach(bulb => {
        current_matrix[bulb[0]][bulb[1]] = -4;
    });
    setTable();

    if (isEnd()){
        var endTime = new Date();
        time = (endTime - startTime) / 1000;
        gameState = 0;
        playerName = input.value;
        text.innerHTML = `
        <h1 style="margin-bottom:0px">Congratulations ${playerName}, you won!</h1>
        <p>Your time is ${time}</p>
        `;
        completed.innerHTML += `
        <p>Player: ${playerName}   |    Difficulty: ${difficulty}    |     Time: ${time}</p>
        `

    }
}

function setTable() {
    for (let i = 0; i < current_matrix.length; i++){
        for (let j = 0; j < current_matrix[0].length; j++){
            if (has(bulbs, i, j) >= 0){
                lightUp(i, j); 
            }
        }
    }
}

function isEnd(){
    let end = true;
    if (current_matrix.map( list => list.includes(-5)).includes(true)) end = false;
    for (let i = 0; i < current_matrix.length; i++){
        for (let j = 0; j < current_matrix[i].length; j++){
            if (current_matrix[i][j] >= 0){
                if (check(i,j) == false) { end = false; break; }
            }
            if (current_matrix[i][j] == -2) end = false;
        }
    }
    return end;
}

function check(i, j){
    let c = 0;
    /*
    if (current_matrix[i+1][j] == -4) c++;  //alatta
    if (current_matrix[i][j+1] == -4) c++;  //jobbra
    if (current_matrix[i-1][j] == -4) c++;  //felette
    if (current_matrix[i][j-1] == -4) c++;  //balra
    */
    if (i == 0 && j == 0){
        if (current_matrix[i+1][j] == -4 || current_matrix[i+1][j] == -5) c++;
        if (current_matrix[i][j+1] == -4 || current_matrix[i][j+1] == -5) c++;
    }
    else if(i == 0 && j == matrix.length-1){
        if (current_matrix[i][j-1] == -4 || current_matrix[i][j-1] == -5) c++;
        if (current_matrix[i+1][j] == -4 || current_matrix[i+1][j] == -5) c++; 
    }else if(i == matrix.length-1 && j == 0){
        if (current_matrix[i-1][j] == -4 || current_matrix[i-1][j] == -5) c++;
        if (current_matrix[i][j+1] == -4 || current_matrix[i][j+1] == -5) c++; 
    }else if(i == current_matrix.length-1 && j == current_matrix.length-1){
        if (current_matrix[i-1][j] == -4 || current_matrix[i-1][j] == -5) c++;
        if (current_matrix[i][j-1] == -4 || current_matrix[i][j-1] == -5) c++;
    }else if( i == 0){
        if (current_matrix[i+1][j] == -4 || current_matrix[i+1][j] == -5) c++;  
        if (current_matrix[i][j+1] == -4 || current_matrix[i][j+1] == -5) c++; 
        if (current_matrix[i][j-1] == -4 || current_matrix[i][j-1] == -5) c++;
    }else if( j == 0){
        if (current_matrix[i+1][j] == -4 || current_matrix[i+1][j] == -5) c++;  
        if (current_matrix[i][j+1] == -4 || current_matrix[i][j+1] == -5) c++;  
        if (current_matrix[i-1][j] == -4 || current_matrix[i-1][j] == -5) c++;
    }else if( i == current_matrix.length-1){
        if (current_matrix[i][j+1] == -4 || current_matrix[i][j+1] == -5) c++;  //jobbra
        if (current_matrix[i-1][j] == -4 || current_matrix[i-1][j] == -5) c++;  //felette
        if (current_matrix[i][j-1] == -4 || current_matrix[i][j-1] == -5) c++;  //balra
    }else if( j == current_matrix.length-1){
        if (current_matrix[i-1][j] == -4 || current_matrix[i-1][j] == -5) c++;
        if (current_matrix[i+1][j] == -4 || current_matrix[i+1][j] == -5) c++; 
        if (current_matrix[i][j-1] == -4 || current_matrix[i][j-1] == -5) c++; 
    }else{
        if (current_matrix[i+1][j] == -4 || current_matrix[i+1][j] == -5) c++;  //alatta
        if (current_matrix[i][j+1] == -4 || current_matrix[i][j+1] == -5) c++;  //jobbra
        if (current_matrix[i-1][j] == -4 || current_matrix[i-1][j] == -5) c++;  //felette
        if (current_matrix[i][j-1] == -4 || current_matrix[i][j-1] == -5) c++;  //balra
    }
    return (c == current_matrix[i][j]);
}

//UTILITY
function decide_matrix(){
    if (difficulty == "easy"){
        matrix = structuredClone(matrix_easy);
    }else if(difficulty == "hard"){
        matrix = structuredClone(matrix_hard);
    }else{
        matrix = structuredClone(matrix_intermediate);
    }
}

function has(arr, a, b){
    let x = -1;
    for (let i = 0; i < arr.length; i++){
        if (arr[i][0] == a && arr[i][1] == b){
            x = i
        }
    }
    return x;
}



/*DATA
-5 => light_red
-4 => bulb
-3 => light
-2 => white
-1 => black
n>0 => black with n*/

const matrix_easy = [
    [-2, -2, -2, 1, -2, -2, -2],
    [-2, 0, -2, -2, -2, 2, -2],
    [-2, -2, -2, -2, -2, -2, -2],
    [-1, -2, -2, -1, -2, -2, -1],
    [-2, -2, -2, -2, -2, -2, -2 ],
    [-2, -1, -2, -2, -2, 2, -2],
    [-2, -2, -2, 3, -2, -2, -2]
]

const matrix_intermediate = [
    [-2, -2, 0, -2, -1, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2],
    [-1, -2, -1, -2, 3, -2, -1 ],
    [-2, -2, -2, 1, -2, -2, -2],
    [2, -2, -1, -2, -1, -2, -1],
    [-2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -1, -2, 2, -2, -2]
]

const matrix_hard = [
    [-2, -1, -2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, 3, -2, 2, -2, -1],
    [-2, 0, -1, -2, -2, -2, -2, -1, -2, -2 ],
    [-2, -2, -2, -2, -1, -2, -2, -2, -2, -2],
    [-2, 1, -2, -2, -1, 1, -1, -2, -2, -2],
    [-2, -2, -2, -1, -1, -1, -2, -2, 3, -2],
    [-2, -2, -2, -2, -2, -1, -2, -2, -2, -2],
    [-2, -2, 1, -2, -2, -2, -2, 0, -1, -2],
    [3, -2, -1, -2, 0, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2, 0, -2],
]

function gameStart(){
    easy.classList.add('hidden');
    intermediate.classList.add('hidden');
    hard.classList.add('hidden');
    playerName = input.value;
    text.innerHTML = `
    <p style="font-size: 20px;margin-bottom:0px">WELCOME</p>
    <h1>${playerName}</h1>
    <p id="time"></p>
    `;
    setInterval(doTime, 1000);
    input.classList.add('hidden');
}

function doTime()
{
    if (gameState == 1){
    var now = new Date(); time = Math.round((now - startTime) / 1000);
    document.getElementById("time").innerHTML = `Time elapsed: ${time.toString()} seconds`;
    }
}

function drawTable(m){
    let i = 0;
    game.innerHTML = `<table class="table">
    ${m.map(list => rowGen(list, i++)).join("")}
    </table>`;
}

function rowGen(list, i){
    let j = 0;
    return `
    <tr>${list.map(x => decideValue(x, i, j++)).join("")}</tr>
    `
}

function decideValue(str, i, j){
    if (str == "-2"){
        return `<td data-row="${i}" data-col="${j}" class="table_white"></td>`
    }else if(str == "-1"){
        return `<td data-row="${i}" data-col="${j}" class="table_black"></td>`
    }else if (str >= 0){
        if ( check(i, j)) return `<td data-row="${i}" data-col="${j}" class="table_black green">${str}</td>`;
        else return `<td data-row="${i}" data-col="${j}" class="table_black">${str}</td>`;
    }else if( str == -4){
        return `<td data-row="${i}" data-col="${j}" class="light_bulb_good"></td>`
    }else if( str == -3){
        return `<td data-row="${i}" data-col="${j}" class="light"></td>`
    }else if( str == -5){
        return `<td data-row="${i}" data-col="${j}" class="light_bulb_wrong"></td>`
    }

}

function lightUpTop(x, y){
    let a = x; let b = y;
    x--;
    while( x >= 0 && !(matrix[x][y] >= -1)  ){
        if (has(bulbs, x, y) >= 0 ){
            current_matrix[x][y] = -5;
            current_matrix[a][b] = -5;
            break;
        }else{
            current_matrix[x--][y] = -3;
        }
    }
}

function lightUpBottom(x, y){
    let a = x; let b = y;
    x++;
    while( x < matrix.length && !(matrix[x][y] >= -1)  ){
        if (has(bulbs, x, y) >= 0 ){
            current_matrix[x][y] = -5;
            current_matrix[a][b] = -5;
            break;
        }else{
            current_matrix[x++][y] = -3;
        }
    }
}

function lightUpLeft(x, y){
    let a = x; let b = y;
    y--;
    while( y >= 0 && !(matrix[x][y] >= -1)  ){
        if (has(bulbs, x, y) >= 0 ){
            current_matrix[x][y] = -5;
            current_matrix[a][b] = -5;
            break;
        }else{
            current_matrix[x][y--] = -3;
        }
    }
}

function lightUpRight(x, y){
    let a = x; let b = y;
    y++;
    while( y < matrix.length && !(matrix[x][y] >= -1)  ){
        if (has(bulbs, x, y) >= 0 ){
            current_matrix[x][y] = -5;
            current_matrix[a][b] = -5;
            break;
        }else{
            current_matrix[x][y++] = -3;
        }
    }
}

function lightUp(x, y){
    lightUpTop(x, y);
    lightUpBottom(x, y);
    lightUpLeft(x, y);
    lightUpRight(x, y);
}


