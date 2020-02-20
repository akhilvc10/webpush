import React, { useState } from 'react'

// 'use strict';

const applicationServerPublicKey = 'BB0zhHbxSfoh1bqDsYDc42nvF7xawZ9mItU9eut-5RNuuUhY0OIwyDW9Si_BmZ-94AKrAG0wehgA-uTUA0cjIuI';
let pk = "PRqwuJFs1ZBP8NUJX45noyTYwEMLT4ilgUMjw_P55Ao";

var swRegistration = null;

export default function PushBtn () {
    const [isSubscribed, setIsSubscribed] = useState( false )
    const [pushText, setIsPushText] = useState( "" )
    const [isDisable, setIsDisable] = useState( null )

    function urlB64ToUint8Array ( base64String ) {
        const padding = '='.repeat( ( 4 - base64String.length % 4 ) % 4 );
        const base64 = ( base64String + padding )
            .replace( /\-/g, '+' )
            .replace( /_/g, '/' );

        const rawData = window.atob( base64 );
        const outputArray = new Uint8Array( rawData.length );

        for ( let i = 0; i < rawData.length; ++i ) {
            outputArray[i] = rawData.charCodeAt( i );
        }
        return outputArray;
    }

    function updateBtn () {
        if ( Notification.permission === 'denied' ) {
            setIsPushText( "Push Messaging Blocked" );
            // pushButton.textContent = 'Push Messaging Blocked.';
            setIsDisable( true );
            updateSubscriptionOnServer( null );
            return;
        }

        if ( isSubscribed ) {
            // pushButton.textContent = 'Disable Push Messaging';
            setIsPushText( 'Disable Push Messaging' )
        } else {
            setIsPushText( 'Enable Push Messaging' )
            // pushButton.textContent = 'Enable Push Messaging';
        }

        setIsDisable( false );
    }

    function updateSubscriptionOnServer ( subscription ) {
        // TODO: Send subscription to application server
        console.log( "updating in the server" )
        // const subscriptionJson = document.querySelector( '.js-subscription-json' );
        // const subscriptionDetails =
        //     document.querySelector( '.js-subscription-details' );

        // if ( subscription ) {
        //     subscriptionJson.textContent = JSON.stringify( subscription );
        //     subscriptionDetails.classList.remove( 'is-invisible' );
        // } else {
        //     subscriptionDetails.classList.add( 'is-invisible' );
        // }
    }

    function subscribeUser () {
        const applicationServerKey = urlB64ToUint8Array( applicationServerPublicKey );
        swRegistration.pushManager.subscribe( {
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        } )
            .then( function ( subscription ) {
                console.log( 'User is subscribed.' );

                updateSubscriptionOnServer( subscription );

                setIsSubscribed( true )

                updateBtn();
            } )
            .catch( function ( err ) {
                console.log( 'Failed to subscribe the user: ', err );
                updateBtn();
            } );
    }

    function unsubscribeUser () {
        swRegistration.pushManager.getSubscription()
            .then( function ( subscription ) {
                if ( subscription ) {
                    return subscription.unsubscribe();
                }
            } )
            .catch( function ( error ) {
                console.log( 'Error unsubscribing', error );
            } )
            .then( function () {
                updateSubscriptionOnServer( null );

                console.log( 'User is unsubscribed.' );
                setIsSubscribed( false )

                updateBtn();
            } );
    }

    function initializeUI () {
        setIsDisable( true );
        if ( isSubscribed ) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
            .then( function ( subscription ) {
                let isSub = !( subscription === null );
                setIsSubscribed( isSub )
                updateSubscriptionOnServer( subscription );

                if ( isSubscribed ) {
                    console.log( 'User IS subscribed.' );
                } else {
                    console.log( 'User is NOT subscribed.' );
                }

                updateBtn();
            } );
    }

    if ( 'serviceWorker' in navigator && 'PushManager' in window ) {
        console.log( 'Service Worker and Push is supported' );

        navigator.serviceWorker.register( 'custom-service-worker.js' )
            .then( function ( swReg ) {
                console.log( 'Service Worker is registered', swReg );
                swRegistration = swReg;
            } )
            .catch( function ( error ) {
                console.error( 'Service Worker Error', error );
            } );
    } else {
        console.warn( 'Push messaging is not supported' );
        // pushButton.textContent = ;
        setIsPushText( 'Push Not Supported' )
    }

    return (
        <div>

            <button onClick={initializeUI} disabled={isDisable}>{pushText}</button>
        </div>
    )
}



