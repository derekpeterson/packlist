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