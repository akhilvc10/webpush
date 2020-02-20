/* eslint-disable no-restricted-globals */


self.addEventListener( 'push', function ( event ) {
    console.log( 'Push Notification received', event.data.text() );

    let data = JSON.parse( JSON.stringify( event.data.text() ) );


    console.log( 'data', data.message )

    var options = {
        body: data.content,
        icon: '/src/images/icons/app-icon-96x96.png',
        badge: '/src/images/icons/app-icon-96x96.png',
        data: {
            url: data.openUrl
        }
    };

    event.waitUntil(
        self.registration.showNotification( data.message, options )
    );
} );

// self.addEventListener( 'push', function ( event ) {
//     console.log( '[Service Worker] Push Received.' );
//     console.log( `[Service Worker] Push had this data: "${event.data.text()}"` );

//     const title = 'Push Codelab';
//     const options = {
//         body: 'Yay it works.',
//         icon: 'images/icon.png',
//         badge: 'images/badge.png',
//         data: {
//             url: event.data.openUrl
//         }
//     };

//     event.waitUntil( self.registration.showNotification( title, options ) );
// } );

self.addEventListener( 'install', function ( event ) {
    console.log( '[Service Worker] Installing Service Worker ...', event );

} );

self.addEventListener( 'activate', function ( event ) {
    console.log( '[Service Worker] Activating Service Worker ....', event );


} );
self.addEventListener( 'notificationclick', function ( event ) {
    var notification = event.notification;
    var action = event.action;

    console.log( notification );

    if ( action === 'confirm' ) {
        console.log( 'Confirm was chosen' );
        notification.close();
    } else {
        console.log( action );

    }
} );

self.addEventListener( 'notificationclose', function ( event ) {
    console.log( 'Notification was closed', event );
} );


self.addEventListener( 'fetch', function ( event ) {
    console.log( event.request.url );

    event.respondWith(
        caches.match( event.request ).then( function ( response ) {
            return response || fetch( event.request );
        } )
    );
} );



