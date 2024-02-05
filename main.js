import http from 'http';
import RequestController from './controller/requestController.js';
import {Server as IOServer} from 'socket.io';


const server = http.createServer(
    (request, response ) => new RequestController(request, response).handleRequest()
); 

const io = new IOServer(server);
var player1 ;
var player2 ;
var player1Choice;
var player2Choice;
let rock;
let paper ;
let scissors ;
let score1 = 0;
let score2 = 0;



const connectionListener= socket => {
    console.log(`connection done with ${socket.id}`); 

//gere les joueurs connectés 
socket.on('join', ()=> {
     
    if(!player1){
        player1 = socket.id ;  
        io.to(player1).emit('disable', true);  
        socket.emit('message', "You are Player1");
        io.emit('msg');


    }
    else if (!player2){ 
        player2 = socket.id ;
        socket.emit('message', " You are Player2 "); 
        io.to(player1).emit('disable', false);  
        io.to(player1).emit("game-is-ready");
        io.to(player2).emit("game-is-ready"); 
    }else{
        socket.emit('message',"Game is full try again later "); 
        socket.emit('disable', true);
    }
});
// permet d'actualiser la page apres chaque manche 
socket.on("refresh", ()=>  {
    io.to(player1).emit('refresh');
    setTimeout(()=>io.to(player2).emit('refresh'), 500);     
});


// gere les choix des joueurs ainsi le retour du resultat et le score
socket.on('choices', (data)=>{
   
    if(!player1Choice)(player1Choice = data.var1);
    
    else (player2Choice = data.var1);
    if( (player1Choice!=undefined) & (player2Choice!=undefined) ){
        const res = gameRes(player1Choice, player2Choice,data.var2);
        io.to(player1).emit('result', res);
        io.to(player2).emit('result', res);

        if((score1+score2) == 5){
            
            
            if(score1>score2){
                
                io.emit('game', 'Player 1 won the Game !' );
                score1=0;
                score2=0;
            }
            else{
                
                io.emit('game', 'Player 2 won the Game !' );
                score1=0;
                score2=0;
            }
        }
       
        io.emit('score', {score1, score2});

        player1Choice=null;
        player2Choice=null;
        io.emit('play-again');
       
       
       
    }
});
// ceci permet de copier le contenu des boutton dans des variables utilisées dans la fonction qui implemente la logique du jeu 
socket.on('elements', (data)=>{  
    if(!rock){
        rock = data;
    }
    else if(!paper){
        paper = data;
    }else if(!scissors){
        scissors = data;
    }
});



// fonctin d'ecoute sur l'evenement de deconnexion d'un joueur
socket.on('disconnect', () =>{
    console.log(`disconnection from ${socket.id}`)
        if( player1 === socket.id){
            player1 = null; 
    }
        else if(player2 === socket.id ){
            player2 = null ; 
        }
        if (!player1 || !player2 ){
            io.emit('game-waiting');
        }
    });
   


}
//fonction qui implemente la logique du jeu 
const gameRes=(choice1,choice2, player)=>{
    let choice ;
    //le player1 doit toujours avoir choice1 
    if (player == player1){
        choice = choice1;
        choice1 = choice2;
        choice2=choice;

    }

    
    if(choice1==choice2){
        return "It's a tie! ";

    }

   if (choice1 ===  rock) {
     if (choice2 === paper) {
       score2+=1;
       return "Player 2 wins the round !";
     } else {
        score1+=1;
       return "Player 1 wins the round !";
     }
   }

  if (choice1 === paper) {
    if (choice2 == scissors) {
      score2+=1;
      return "Player 2 wins the round !";
    } else {
      score1+=1;
      return "Player 1 wins the round !";
    }
  }

  
   if (choice1 === scissors) {
    if (choice2 === rock) {
      score2+=1;
      return "Player 2 wins the round !";
    } else {
      score1+=1;
      return "Player 1 wins the round !";
    }
   }
}
io.on('connection' , connectionListener);
server.listen(8080); 




