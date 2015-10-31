// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('ionicNFC', ['ionic', 'nfcFilters'])

    .service('playerInfo', function () {
        var players = [{
          'name': 'player1',
          'score': 0
        },{
          'name': 'player2',
          'score': 0
        }]

        return {
            getPlayers: function () {
                return players;
            },
            setPlayers: function(userInput) {
                players = userInput;
            }
        };
    })

    .controller('RulesCtrl', function ($scope, nfcService) {
      $scope.tag = nfcService.tag;
        $scope.clear = function() {
            nfcService.clearTag();
        };
    })
    .controller('WelcomeCtrl', function ($scope, playerInfo) {
      $scope.players = [{
        'name': $scope.name1,
        'score': 0
      },{
        'name': $scope.name2,
        'score': 0
      }];

      $scope.saveNames = function(){
        console.log($scope.name1);
        playerInfo.setPlayers($scope.players);
      }
    })
    .controller('GameCtrl', function ($scope, $rootScope) {
      $scope.player1 = $rootScope.player1;
      $scope.player2 = $rootScope.player2;
      // console.log($scope.player1);
      $scope.scores = [];

      $scope.numberEntered = function(newDigit){
        console.log('log number');
        $scope.scores.push(newDigit);
        $scope.newScore = 0;
        console.log($scope.scores);
      }

    })
    .controller('TabsCtrl', function ($scope) {

    })

    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabsCtrl'
      })
      .state('tab.welcome', {
        url: '/welcome',
        views: {
          'tab-welcome': {
            templateUrl: 'templates/welcome.html',
            controller: 'WelcomeCtrl'
          }
        }
      })
      .state('tab.game', {
          url: '/game',
          views: {
            'tab-game': {
              templateUrl: 'templates/game.html',
              controller: 'GameCtrl'
            }
          }
        })
      .state('tab.rules', {
          url: '/rules',
          views: {
            'tab-rules': {
              templateUrl: 'templates/rules.html',
              controller: 'RulesCtrl'
            }
          }
        })
      // If none of the above states are matched, use this as the fallback:
      $urlRouterProvider.otherwise('/tab/welcome');

    })

    .factory('nfcService', function ($rootScope, $ionicPlatform) {

        var tag = {};

        $ionicPlatform.ready(function() {
            nfc.addNdefListener(function (nfcEvent) {
                console.log(JSON.stringify(nfcEvent.tag, null, 4));
                $rootScope.$apply(function(){
                    angular.copy(nfcEvent.tag, tag);
                    // if necessary $state.go('some-route')
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                alert("Error adding NFC Listener " + reason);
            });

        });

        return {
            tag: tag,

            clearTag: function () {
                angular.copy({}, this.tag);
            }
        };
    });
