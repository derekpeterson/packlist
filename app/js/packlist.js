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
        templateUrl: 'html/list.html',
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
.directive('packlistLink', function () {
    return function ( scope, element, attrs ) {
        'use strict';
    };
});
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