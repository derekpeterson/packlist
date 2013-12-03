'use strict';
angular.module('packlist', [
    'ngRoute'
]);
angular.module('packlist').config(function ( $routeProvider ) {
    $routeProvider
    .when('/', {
        templateUrl: 'html/admin.html',
        controller: 'AdminController'
    })
    .when('/create', {
        templateUrl: 'html/create.html',
        controller: 'CreateController'
    })
    .when('/list/:listId', {
        templateUrl: 'html/list.html',
        controller: 'ListController'
    })
    .otherwise({
        redirectTo: '/'
    });
});
angular.module('packlist')
.directive('giveFocus', [
    '$timeout',
    function ( $timeout ) {
        return function ( scope, element, attrs ) {
            'use strict';

            var focusTarget = attrs.giveFocus;
            var ENTER_KEY = 13;
            var events = {
                input: 'keydown',
                remove: 'click'
            };
            var eventType = element[0].localName === 'a' ? events.remove :
                                                           events.input;

            element.bind(eventType, function ( e ) {
                var key = e.which || e.key || e.keyCode;
                if ( eventType !== events.input || key === ENTER_KEY ) {
                    $timeout(function () {
                        var target = document.getElementById( focusTarget )
                        return target && target.focus();
                    }, 0);
                }
            });
        };
    }
]);
angular.module('packlist')
.controller('AdminController', [
    '$scope', '$location', 'Storage',
    function ( $scope, $location, storage ) {
        'use strict';

        $scope.lists = {};

        storage.getLists().then(function ( data ) {
            $scope.lists = data;
        });

        $scope.goTo = function ( route ) {
            $location.path( route );
        };
    }
]);
angular.module('packlist')
.controller('CreateController', [
    '$scope', '$location', 'Storage',
    function ( $scope, $location, storage ) {
        'use strict';

        var emptyItem = storage.getEmptyItem();
        var emptyList = storage.getEmptyList();
        $scope.list = angular.copy( emptyList );

        $scope.addEmptyItem = function () {
            var lastIndex = $scope.list.items.length - 1;
            if ( !angular.equals( emptyItem, $scope.list.items[ lastIndex ] )) {
                $scope.list.items.push(angular.copy( emptyItem ));
            }
        };

        $scope.saveList = function () {
            var length = $scope.list.items.length;
            var lastItem = $scope.list.items[ length - 1 ];
            if ( angular.equals( emptyItem, lastItem ) ) {
                $scope.removeItem( lastItem );
            }
            storage.save( $scope.list ).then(function () {
                $location.path('list/' + $scope.list.title );
            });
        };

        $scope.removeItem = function ( item ) {
            if ( $scope.list.items.length > 1 ) {
                var index = $scope.list.items.indexOf(item);
                $scope.list.items.splice(index, 1);
            }
        };
    }
]);
angular.module('packlist')
.controller('ListController', [
    '$scope', '$routeParams', 'Storage',
    function ( $scope, $routeParams, storage ) {
        'use strict';
        var listId = $routeParams.listId;

        $scope.list = storage.getList( listId ) || {};
    }
]);
angular.module('packlist')
.factory('Storage', [
    '$q',
    function ( $q ) {
        var storageKey = 'lists';

        var emptyItem = {
            name: '',
            done: false
        };
        var emptyList = {
            title: '',
            items: [angular.copy( emptyItem )],
            done: false
        };

        function _convertLists ( listArray ) {
            var outList = {};
            angular.forEach(listArray.lists, function ( value, key ) {
                outList[ value.title ] = value;
            });
            return outList;
        }

        var lists = {};

        function _loadLists () {
            var dfd = $q.defer();
            chrome.storage.local.get('lists', function ( items ) {
                lists = _convertLists( items );
                dfd.resolve( lists );
            });
            return dfd.promise;
        }

        chrome.storage.onChanged.addListener(function ( change, namespace ) {
            lists = change.newValue || lists;

            if ( namespace === 'sync' ) {
                chrome.storage.sync.set({
                    'lists': lists
                }, function () {
                    console.log('Synced items from sync to local storage');
                });
            }
        });

        return {
            convertLists: _convertLists,
            getEmptyItem: function () {
                return emptyItem;
            },
            getEmptyList: function () {
                return emptyList;
            },
            getList: function ( name ) {
                return lists[ name ];
            },
            getLists: function () {
                var dfd = $q.defer();
                var lists = _loadLists();
                lists.then(function ( data ) {
                    dfd.resolve( data );
                });
                return dfd.promise;
            },
            saveList: function ( list ) {
                var dfd = $q.defer();

                chrome.storage.local.get('lists', function ( items ) {
                    var newList = [ list ];

                    if ( items.lists ) {
                        lists = items.lists.concat( newList );
                    } else {
                        lists = newList;
                    }

                    chrome.storage.local.set({
                        'lists': lists
                    }, function () {
                        console.log('Packlist saved to local');
                    });

                    chrome.storage.sync.set({
                        'lists': lists
                    }, function () {
                        console.log('Packlist saved to sync');
                    });

                    dfd.resolve( list.title );
                });

                return dfd.promise;
            }
        };
    }
])