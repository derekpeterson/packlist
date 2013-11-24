chrome.app.runtime.onLaunched.addListener(function (launchData) {
    'use strict';
    console.log(launchData);
    var size = {
        height: 600,
        width: 500
    };
    chrome.app.window.create('../main.html', {
        id: 'Packlist',
        bounds: {
            height: size.height,
            width: size.width
        },
        minHeight: size.height,
        minWidth: size.width,
        frame: 'none'
    });
});

chrome.runtime.onInstalled.addListener(function () {
    'use strict';

    console.log('installed');
});

chrome.runtime.onSuspend.addListener(function () {
    'use strict';
    // pass
});
