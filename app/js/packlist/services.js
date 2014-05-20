angular.module('packlist')
.factory('Storage', [
    '$q',
    function ( $q ) {
        'use strict';
        var STORAGE_KEY = 'lists';
        var emptyItem = {
            name: '',
            done: false
        };
        var emptyList = {
            title: '',
            items: [ angular.copy( emptyItem ) ],
            done: false
        };

        function _convertLists ( listArray ) {
            var outList = {};
            angular.forEach(listArray.lists, function ( value /* key */ ) {
                outList[ value.title ] = value;
            });
            return outList;
        }

        var lists = {};

        function _loadLists () {
            var dfd = $q.defer();
            chrome.storage.local.get(STORAGE_KEY, function ( items ) {
                lists = _convertLists( items );
                dfd.resolve( lists );
            });
            return dfd.promise;
        }

        chrome.storage.onChanged.addListener(function ( change, namespace ) {
            lists = change.newValue || lists;

            if ( namespace === 'sync' ) {

                var config = {};
                config[ STORAGE_KEY ] = lists;

                chrome.storage.sync.set( config, function () {
                    console.log( 'Synced items from sync to local storage' );
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

                chrome.storage.local.get(STORAGE_KEY, function ( items ) {

                    angular.extend( lists, items.lists || {} );

                    lists[ list.title ] = list;

                    var config = {};
                    config[ STORAGE_KEY ] = lists;

                    chrome.storage.local.set( config, function () {
                        console.log( 'Packlist saved to local' );
                    });

                    chrome.storage.sync.set( config, function () {
                        console.log( 'Packlist saved to sync' );
                    });

                    dfd.resolve( list.title );
                });

                return dfd.promise;
            }
        };
    }
]);