chrome.app.runtime.onLaunched.addListener(function ( launchData ) {
    'use strict';
    var size = {
        height: 600,
        width: 400
    };
    chrome.app.window.create('main.html', {
        id: 'Packlist',
        minHeight: size.height,
        minWidth: size.width
    });
});

chrome.runtime.onInstalled.addListener(function () {
    'use strict';
});

chrome.runtime.onSuspend.addListener(function () {
    'use strict';

    chrome.storage.local.get('lists', function ( items ) {
        chrome.storage.sync.set({
            'lists': items
        }, function () {
            console.log('Items have synced');
        });
    });
});