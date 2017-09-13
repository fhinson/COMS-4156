var Puzzle = function(size, board){
  this.size = size;

  if (typeof board === 'undefined'){
    board = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
  }
  else{
    if (board.length != board[0].length) {
      error(100, "Invalid board");
      return;
    }
  }
  this.board = board;
}

Puzzle.prototype.getSize = function(){
  return this.size;
}

Puzzle.prototype.getBoard = function(){
  return this.board;
}

Puzzle.prototype.getFormattedBoard = function(){
  var merged = [];

  // flatten the 2d array
  merged = merged.concat.apply(merged, this.board);

  return merged;
}

Puzzle.prototype.updateBoard = function(board){
  this.board = board;
}

Puzzle.prototype.swap = function(to, from){
  var N = this.size;
  var temp = this.board[Math.floor(to / N)][to % N];
  this.board[Math.floor(to / N)][to % N] = this.board[Math.floor(from / N)][from % N];
  this.board[Math.floor(from / N)][from % N] = temp;
}

// shuffle the board until valid
Puzzle.prototype.shuffleBoard = function(){
  var formattedBoard = this.getFormattedBoard();

  // Fisher-Yates shuffling algorithm
  var currentIndex = formattedBoard.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = formattedBoard[currentIndex];
    formattedBoard[currentIndex] = formattedBoard[randomIndex];
    formattedBoard[randomIndex] = temporaryValue;
  }

  // chunk the board
  var tempBoard = formattedBoard.chunk(4);

  // temporarily set board to the shuffled & chunked board
  this.board = tempBoard;

  if (this.isSolvable()) return;

  this.shuffleBoard();
}

Puzzle.prototype.isSolvable = function(){
  var N = this.size,
      board = this.board,
      inversions = 0;

  for (var i = 0; i < N*N; i++) {
    for (var j = i+1; j < N*N; j++) {
      if (board[Math.floor(i / N)][i % N] > board[Math.floor(j / N)][j % N] && board[Math.floor(j / N)][j % N] != 0){
        inversions++;
      }
    }
  }

  if (N % 2 == 0) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        if (board[i][j] == 0) return (inversions + i) % 2 != 0;
      }
    }
  }
  return inversions % 2 == 0;
}

Puzzle.prototype.hammingDistance = function(){
  var board = this.board,
      N     = this.size,
      dp    = 0;

  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (board[i][j] != 0 && board[i][j] != i * N + j + 1) dp++;
    }
  }
  return dp;
}

Puzzle.prototype.manhattanDistance = function(){
  var board = this.board,
      N     = this.size,
      dp    = 0;
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var val = board[i][j];
      if (val != 0) {
        dp += Math.abs(i - Math.floor((val-1) / N)) + Math.abs(j - (val-1) % N);
      }
    }
  }
  return dp;
}

Puzzle.prototype.getCompletion = function(){
  var N = this.size,
      dp = this.hammingDistance(); // alternative: this.manhattanDistance();

  return (N*N-1-dp)/(N*N-1);
}

Puzzle.prototype.isSolved = function(){
  var N = this.size,
      board = this.board;

  for (var i = 0; i < N*N - 1; i++) {
    if (i + 1 != board[Math.floor(i / N)][i % N]) return false;
  }
  return board[N-1][N-1] == 0;
}

Puzzle.prototype.ascii = function(){
  var board = this.board,
      s = '\n';
  s += '   +-----------+\n';
  for(var i = 0; i < board.length; i++){
    s += '   |';
    for(var j = 0; j < board[0].length; j++){
      s += (board[i][j] == 0 ? " " : board[i][j].toString()) +
           (board[i][j] > 9 ? (j < board[0].length-1 ? " " : "") :
                              (j < board[0].length -1 ? "  " : " "));
    }
    s += '|\n';
  }
  s += '   +-----------+\n';

  return s;
}

function error(code, msg) {
  var errorText = 'Puzzle Error ' + code + ': ' + msg;
  console.log(errorText);
}
