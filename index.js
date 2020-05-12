const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

//  This function is called everytime your snake is entered into a game.
//  cherrypy.request.json contains information about the game that's about to be played.
// TODO: Use this function to decide how your snake is going to look on the board.
app.post('/start', (request, response) => {
  console.log("START");

  // Response data
  const data = {
    color: '#2F32C4',
    headType: "shac-caffeine",
    tailType: "skinny"
  }

  return response.json(data)
})

// This function is called on every turn of a game. It's how your snake decides where to move.
// Valid moves are "up", "down", "left", or "right".
// TODO: Use the information in cherrypy.request.json to decide your next move.
app.post('/move', (request, response) => {
  var data = request.body;
/*
  // Choose a random direction to move in
  possible_moves = ["up", "down", "left", "right"]
  var choice = Math.floor(Math.random() * possible_moves.length);
  var snake_move = possible_moves[choice];
*/
  //var choice = Math.floor(Math.random() * possible_moves.length);
  possible_moves = ["up", "down", "left", "right"]
  var choice = 0;
  
  //console.log(data.board.snakes)
  
function safe(x, y) {
    var safest = 0;
    //var myX = data.you.body[0].x;
    //var myY = data.you.body[0].y;
    const cord = [x, y]
    console.log(cord)
    var count = data.board.snakes.length
    console.log(count)
    var count2 = 0
    while (count > 0) { 
      console.log(data.board.snakes[count2].body.indexOf(cord))
      if (data.board.snakes[count2].body.indexOf(cord) != -1) {
      ++safest
      ++count2
      return 0
      }
      --count
      ++count2
      console.log(count)
    }

    if (x == data.board.width || x < 0 || y == data.board.height || y < 0) {
        return 0;
    }
/*
    var count2 = data.you.body.length
    while (count2 > 0) {
        if (data.you.body[count].indexOf(cord) != -1) {
        ++safest
        }
        --count
    } */

    if (safest == 0) {
      return 1
    } else {
      return 0
    }
}
  
  function pick(num) {
    var safety = 1;
    if (num == 0) {
        safety = safe(data.you.body[0].x, data.you.body[0].y - 1)
    } else if (num == 1) {
        safety = safe(data.you.body[0].x, data.you.body[0].y + 1)
    } else if (num == 2) {
        safety = safe(data.you.body[0].x - 1, data.you.body[0].y)
    } else {
        safety = safe(data.you.body[0].x + 1, data.you.body[0].y)
    }

    if (safety == 1) {
        return 1
    } else {
        return 0
    }
}
  
if (pick(choice) != 1) {
    if (pick(1) != 1) {
      if (pick(2) != 1) {
        choice = 3 
      } else {
        choice = 2;
    }
 } else {
      choice = 1;
  }
}
  var snake_move = possible_moves[choice];
  
  console.log("MOVE: " + snake_move);
  return response.json({ move: snake_move })
})

// This function is called when a game your snake was in ends.
// It's purely for informational purposes, you don't have to make any decisions here.
app.post('/end', (request, response) => {
  console.log("END");
  return response.json({ message: "ok" });
})

// The Battlesnake engine calls this function to make sure your snake is working.
app.post('/ping', (request, response) => {
  return response.json({ message: "pong" });
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
