'use strict';
var app = angular.module('myApp', ["ngTouch"]);
app.controller('gamesCtrl', function ($scope, $http, $interval) {

  $scope.colors = ['gray', 'black', 'red', 'maroon', 'yellow', 'olive', 'lime', 'green', 'aqua', 'teal', 'blue', 'navy', 'fuchsia', 'purple'];
  $scope.newGame = new Object();
  $scope.newGame.humanNum = 3;
  $scope.newGame.ghostNum = 1;

  if (localStorage.currentGame) {
    $scope.currentGame = localStorage.currentGame;
  } else {
    $scope.currentGame = new Object();
    $scope.currentGame.stage = 0;
    $scope.currentGame.paths = [];
    $scope.currentGame.toDrawColors = $scope.colors.slice();
    $scope.currentGame.currentColor = $scope.colors[0];
    $scope.currentGame.usedColors = [];
  }

  $scope.isDrawing = 0;

  $scope.setHumanNum = function (i) {
    $scope.newGame.humanNum = i;
    localStorage.humanNum = i;
  }

  $scope.setGhostNum = function (i) {
    $scope.newGame.ghostNum = i;
    localStorage.ghostNum = i;
  }

  $scope.gameNumSet = function () {
    $('#createGameModal').modal('hide');
    $scope.setRandomGame(1);
    $('#setInfoModal').modal('show');
  }

  $scope.setRandomGame = function (i) {
    $scope.newGame.randomGame = i;
    if (i) {
      var rand = Math.floor(Math.random() * $scope.wordList.length);
      $scope.newGame.category = $scope.wordList[rand].category;
      $scope.newGame.word = $scope.wordList[rand].words[Math.floor(Math.random() * $scope.wordList[rand].words.length)];
    } else {
      $scope.newGame.category = '';
      $scope.newGame.word = '';
    }
  }

  $scope.back2NumSet = function () {
    $('#setInfoModal').modal('hide');
    $('#createGameModal').modal('show');
  }

  $scope.createGame = function () {
    $('#setInfoModal').modal('hide');
    $scope.newGame.availableColors = $scope.colors.slice();
    $scope.newGame.pickedColor = $scope.newGame.availableColors[0];
    $scope.newGame.pickedColors = [];
    $('#pickColorModal').modal('show');
  };

  $scope.pickColor = function (color) {
    $scope.newGame.pickedColor = color;
  }

  $scope.showWord = function () {
    $('#showWordModel').modal('show');
    $scope.newGame.pickedColors.push($scope.newGame.pickedColor);
    var index = $scope.newGame.availableColors.indexOf($scope.newGame.pickedColor);
    $scope.newGame.availableColors.splice(index, 1);
    var rand = Math.floor(Math.random() * ($scope.newGame.ghostNum + $scope.newGame.humanNum));
    $scope.newGame.currentIsGhost = rand >= $scope.newGame.ghostNum ? 0 : 1;
    if ($scope.newGame.currentIsGhost) {
      $scope.newGame.ghostNum--;
    } else {
      $scope.newGame.humanNum--;
    }
  }

  $scope.nextPlayerPick = function (color) {
    $('#showWordModel').modal('hide');
    if ($scope.newGame.availableColors.length) {
      $scope.newGame.pickedColor = $scope.newGame.availableColors[0];
    }
    if ($scope.newGame.ghostNum + $scope.newGame.humanNum == 0) {
      $scope.newGame.humanNum = 3;
      $scope.newGame.ghostNum = 1;
      $('#pickColorModal').modal('hide');
      
      $scope.currentGame.stage = 1;
      $scope.currentGame.paths = [];
      $scope.currentGame.toDrawColors = $scope.newGame.pickedColors.slice();
      $scope.currentGame.currentColor = $scope.currentGame.toDrawColors[0];
      $scope.currentGame.usedColors = [];
    }
  }

  $scope.setCurrentColor = function (color) {
    $scope.currentGame.currentColor = color;
  }

  $scope.drawStart = function (e) {
    console.log(e);
    e.preventDefault();
    if (e.touches) {
      e = e.touches[0];
    }
    var rect = document.getElementById('sketchpad').getBoundingClientRect();
    var path = new Object();
    path.d = 'M' + (e.pageX - rect.left) + ' ' + (e.pageY - rect.top);
    path.c = $scope.currentGame.currentColor;

    $scope.currentGame.paths.push(path);

    $scope.isDrawing = 1;
  }

  $scope.drawMove = function (e) {
    if ($scope.isDrawing != 1) {
      return;
    }
    e.preventDefault();
    if (e.touches) {
      e = e.touches[0];
    }
    var rect = document.getElementById('sketchpad').getBoundingClientRect();
    $scope.currentGame.paths[$scope.currentGame.paths.length - 1].d += ' L' + (e.pageX - rect.left) + ' ' + (e.pageY - rect.top);
  }

  $scope.drawEnd = function (e) {
    if ($scope.isDrawing != 1) {
      return;
    }
    e.preventDefault();
    if (e.touches) {
      e = e.touches[0];
    }
    $scope.isDrawing = 0;
    if ($scope.currentGame.stage > 0) {
      $scope.currentGame.usedColors.push($scope.currentGame.currentColor);
      var index = $scope.currentGame.toDrawColors.indexOf($scope.currentGame.currentColor);
      $scope.currentGame.toDrawColors.splice(index, 1);
      if ($scope.currentGame.toDrawColors.length>0) {
      $scope.currentGame.currentColor = $scope.currentGame.toDrawColors[0];
      }
      if ($scope.currentGame.toDrawColors.length == 0) {
        $scope.currentGame.stage = ($scope.currentGame.stage + 1) % 3;
        $scope.currentGame.toDrawColors=$scope.currentGame.usedColors.slice();
        $scope.currentGame.currentColor = $scope.currentGame.toDrawColors[0];
        $scope.currentGame.usedColors=[];
      }
      if ($scope.currentGame.stage == 0) {
        $('#drawRoundModel').modal('show');
      }
    }
  }

  $scope.undoDraw = function (e) {
    if ($scope.currentGame.stage == 0) {
      return;
    }
    $scope.currentGame.paths.pop();
    if ($scope.currentGame.stage > 1 || $scope.currentGame.usedColors.length>0) {
      if ($scope.currentGame.usedColors.length>0) {
        $scope.currentGame.toDrawColors.unshift($scope.currentGame.usedColors.pop());
      } else if ($scope.currentGame.stage > 1){
        var tmp=$scope.currentGame.toDrawColors.pop();
        $scope.currentGame.usedColors=$scope.currentGame.toDrawColors.slice();
        $scope.currentGame.toDrawColors=[tmp];
        $scope.currentGame.stage--;
      }
      $scope.currentGame.currentColor = $scope.currentGame.toDrawColors[0];
    }
  }

  $http.get("/FakeArtist/wordList.json").success(function (response) {
    $scope.wordList = response;
    console.log($scope.wordList);
  });
});

app.filter('range', function () {
  return function (input, total) {
    total = parseInt(total);
    for (var i = 0; i < total; i++)
      input.push(i);
    return input;
  };
});
