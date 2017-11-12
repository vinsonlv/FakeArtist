'use strict';
var app = angular.module('myApp', ["ngTouch"]);
app.controller('gamesCtrl', function ($scope, $http, $interval) {
    $scope.newGame = new Object();
    $scope.colors = ['gray', 'black', 'red', 'maroon', 'yellow', 'olive', 'lime', 'green', 'aqua', 'teal', 'blue', 'navy', 'fuchsia', 'purple']
    
    if (localStorage.currentColor) {
        $scope.currentColor = localStorage.currentColor;
    } else {
        $scope.currentColor = $scope.colors[0];
    }

    if (localStorage.paths) {
        $scope.paths = localStorage.paths;
    } else {
        $scope.paths = [];
    }

    $scope.isDrawing = 0;

    

    $scope.changeNick = function () {
        if ($scope.newNick == '') {
            $('#nickEmptyAlert').show();
        } else {
            $scope.nick = $scope.newNick;
            localStorage.nick = $scope.nick;
            $('#editNickModal').modal('hide');
        }
    }

    $scope.gameNumSet = function () {
        $('#createGameModal').modal('hide');
        $scope.setRandomGame(1);
        $('#setInfoModal').modal('show');
    }

    $scope.back2NumSet = function () {
        $('#setInfoModal').modal('hide');
        $('#createGameModal').modal('show');
    }

    $scope.newGame.foolInfo = new Array();
    $scope.newGame.foolInfo[0] = '';
    $scope.newGame.foolInfo[1] = '';
    $scope.newGame.foolInfo[2] = '';
    $scope.newGame.foolInfo[3] = '';
    $scope.newGame.foolInfo[4] = '';
    if (localStorage.game) {
        $scope.game = localStorage.game;
    } else {}
    if ($scope.game) {
        $('#createGameModal').modal('show');
    }
    if (localStorage.humanNum) {
        $scope.newGame.humanNum = localStorage.humanNum;
    } else {
        $scope.newGame.humanNum = 3;
    }
    if (localStorage.ghostNum) {
        $scope.newGame.ghostNum = localStorage.ghostNum;
    } else {
        $scope.newGame.ghostNum = 1;
    }

    $scope.newGame.randomGame = 1;

    $scope.setHumanNum = function (i) {
        $scope.newGame.humanNum = i;
        localStorage.humanNum = i;
    }

    $scope.setGhostNum = function (i) {
        $scope.newGame.ghostNum = i;
        localStorage.ghostNum = i;
    }

    $scope.setRandomGame = function (i) {
        $scope.newGame.randomGame = i;
        if (i) {
          var rand=Math.floor(Math.random() * $scope.wordList.length);
          $scope.newGame.category=$scope.wordList[rand].category;
          $scope.newGame.word=$scope.wordList[rand].words[Math.floor(Math.random() *$scope.wordList[rand].words.length)];
        } else {
          $scope.newGame.category='';
          $scope.newGame.word='';
        }
    }
    
    $scope.createGame = function() {
      $('#createGameModal').modal('hide');
      $scope.availableColors=$scope.colors;
      $scope.pickedColors=$scope.colors;
      $('#showInfo').modal('show');
	  };
    
    $scope.pickColor = function (color) {
        $scope.pickedColor = color;
    }

    $scope.newGame.category = "";
    $scope.newGame.word = "";

    $scope.setCurrentColor = function (color) {
        $scope.currentColor = color;
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
        path.c = $scope.currentColor;

        $scope.paths.push(path);

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
        $scope.paths[$scope.paths.length - 1].d += ' L' + (e.pageX - rect.left) + ' ' + (e.pageY - rect.top);
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
    }

    $scope.undoDraw = function (e) {
        $scope.paths.pop();
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