const socket = io();
const buttons = document.querySelectorAll(".game");
socket.emit('join'); 

const display= document.getElementById('messages'); 
const infos = document.getElementById('game-infos'); 
    socket.on('msg', ()=>{
        infos.innerHTML= "Wait for te second player to join "});
    socket.on('message', message=> { 
        display.innerHTML= message}); 
    socket.on('disable', state=> {
        for (const b of buttons ){
            b.disabled=state ; 
        }

    })
    const scoreElement = document.getElementById("score"); 
    socket.on('score', (score)=> {
        scoreElement.innerHTML= `Player1: ${score.score1}  Player2:${score.score2}`;

    }
    )

    socket.on('game-is-ready',()=> {
        infos.innerHTML= "game starts choose your move "
    });
    
    
    for (const button of buttons) {
        socket.emit('elements', button.innerHTML); 
        button.addEventListener("click", function () {
        var name = button.innerHTML;
        infos.innerHTML= `You clicked on ${name}`;
        const cliquer = socket.id; 
        socket.emit('choices', {var1:name,var2:cliquer});  
        for (const button of buttons) {
            button.disabled = true;
        }
        }); 
        

   
}   
socket.on('result', (data)=>{
    document.getElementById("result").innerHTML= data;
});
socket.on('game',(data)=>{
    document.getElementById("result").innerHTML=data;
})
socket.on('play-again',function(){
    const playAgainBtn = document.createElement("button");
    playAgainBtn.innerHTML= "Play Again";
    playAgainBtn.className="again";

    playAgainBtn.addEventListener("click", function(){
        
       socket.emit('refresh');  
    });
    const buttonContainer = document.getElementById("button");
    buttonContainer.appendChild(playAgainBtn); 
});
socket.on("refresh" , function(){
    location.reload();
})
socket.on('game-waiting',()=> {
        infos.innerHTML="other player has disconnected, waiting to join ..." 
} )

    
    

