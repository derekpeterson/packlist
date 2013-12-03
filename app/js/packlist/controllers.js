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