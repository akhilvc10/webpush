

window.addEventListener( 'push', function ( event ) {
    console.log( 'Push Notification received', event.data.text() );

    let data = JSON.parse( event.data.text() );


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
        window.registration.showNotification( data.message, options )
    );
} );

window.addEventListener( 'install', function ( event ) {
    console.log( '[Service Worker] Installing Service Worker ...', event );

} );

window.addEventListener( 'activate', function ( event ) {
    console.log( '[Service Worker] Activating Service Worker ....', event );


} );
window.addEventListener( 'notificationclick', function ( event ) {
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

window.addEventListener( 'notificationclose', function ( event ) {
    console.log( 'Notification was closed', event );
} );


window.addEventListener( 'fetch', function ( event ) {
    console.log( event.request.url );

    event.respondWith(
        caches.match( event.request ).then( function ( response ) {
            return response || fetch( event.request );
        } )
    );
} );



