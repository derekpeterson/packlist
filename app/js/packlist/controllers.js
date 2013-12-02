angular.module('packlist')
.controller('AdminController', [
    '$scope',
    function ( $scope ) {
        'use strict';

        $scope.lists = [];
    }
]);
angular.module('packlist')
.controller('CreateController', [
    '$scope',
    function ( $scope ) {
        'use strict';

        var emptyItem = {
            name: '',
            done: false
        };
        var emptyList = {
            title: '',
            items: [angular.copy( emptyItem )],
            done: false
        };

        $scope.list = angular.copy( emptyList );

        $scope.addEmptyItem = function () {
            $scope.list.items.push(angular.copy( emptyItem ));
        };

        $scope.createList = function () {
            console.log($scope.list);
        };
    }
]);
angular.module('packlist')
.controller('ListController', [
    '$scope', '$routeParams',
    function ( $scope, $routeParams ) {
        'use strict';

        $scope.list = {};
    }
]);