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