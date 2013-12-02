angular.module('gDriveApp', []);
angular.module('gDriveApp').factory('gdocs', function () {
    var gdocs = new GDocs();

    var dnd = new DnDFileController('body', function ( files ) {
        var $scope = angular.element( this ).scope();
        Util.toArray( files ).forEach(function ( file, i ) {
            gdocs.upload( file, function () {
                $scope.fetchDocs();
            });
        });
    });

    return gdocs;
});
angular.module('gDriveApp')
.controller('DocsController', ['$scope', '$http', 'gdocs',
    function( $scope, $http, gdocs ) {
        $scope.docs = [];

        $scope.fetchDocs = function () {
            $scope.docs = [];

            var successCallbackWithFsCaching = function ( resp, status, headers, config ) {
                var docs = [];
                var totalEntries = resp.feed.entry.length;

                resp.feed.entry.forEach(function ( entry, i ) {
                    var doc = {
                        title: entry.title.$t,
                        updatedDate: Util.formatDate(entry.updated.$t),
                        updatedDateFull: entry.updated.$t,
                        icon: gdocs.getLink( entry.link,
                            'http://schemas.google.com/docs/2007#icon' ).href,
                        alternateLink: gdocs.getLink( entry.link, 'alternate' ).href,
                        size: entry.docs$size ? '( ' + entry.docs$size.$t + ' bytes)' : null
                    };

                    doc.iconFileName = doc.icon.substring( doc.icon.lastIndexOf('/') + 1 );

                    var fsURL = fs.root.toURL() + FOLDERNAME + '/' + doc.iconFilename;
                    window.webkitResolveLocalFileSystemURL( fsURL, function ( entry ) {
                        doc.icon = fsURL;
                        $scope.docs.push( doc );

                        if ( totalEntries - 1 === i ) {
                            $scope.docs.sort( Util.sortByDate );
                            $scope.$apply(function ( $scope ) {});
                        }

                    }, function ( e ) {
                        $http.get( doc.icon, { responseType: 'blob' }).success(function ( blob ) {
                            console.log('Fetched icon via XHR');
                            blob.name = doc.iconFilename;

                            writeFile( blob );

                            doc.icon = window.URL.createObjectURL( blob );

                            $scope.docs.push(doc);

                            // Only sort when last entry is seen.
                            if ( totalEntries - 1 === i ) {
                                $scope.docs.sort( Util.sortByDate );
                            }
                        });
                    }
                });
            };

            var config = {
                params: {
                    'alt': 'json'
                },
                headers: {
                    'Authorization': 'Bearer ' + gdocs.accessToken,
                    'GData-Version': '3.0'
                }
            };

            $http.get( gdocs.DOCLIST_FEED, config )
                 .success( successCallback );
        };

        gdocs.auth(function () {
            $scope.fetchDocs();
        });
    }
]);