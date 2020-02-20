/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

// 'use strict';

const applicationServerPublicKey = 'BB0zhHbxSfoh1bqDsYDc42nvF7xawZ9mItU9eut-5RNuuUhY0OIwyDW9Si_BmZ-94AKrAG0wehgA-uTUA0cjIuI';
let pk = "PRqwuJFs1ZBP8NUJX45noyTYwEMLT4ilgUMjw_P55Ao";

var swRegistration = null;

export default function PushBtn () {
    const [isSubscribed, setIsSubscribed] = useState( false )
    const [pushText, setIsPushText] = useState( "Enable Push Messaging" )

    useEffect( () => {
        checkForServiceWorker()
    }, [isSubscribed] )

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

    // function updateBtn () {
    //     if ( Notification.permission === 'denied' ) {
    //         setIsPushText( "Push Messaging Blocked" );
    //         updateSubscriptionOnServer( null );
    //         return;
    //     }
    // }

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
                console.log( "TCL: subscribeUser -> subscription", subscription )
                console.log( 'User is subscribed.' );

                updateSubscriptionOnServer( subscription );
                setIsPushText( "Disable Push Notification" )
                setIsSubscribed( true )
            } )
            .catch( function ( err ) {
                console.log( 'Failed to subscribe the user: ', err );
            } );
    }

    function unsubscribeUser () {
        swRegistration.pushManager.getSubscription()
            .then( function ( subscription ) {
                console.log( "TCL: unsubscribeUser -> subscription", subscription )
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
                setIsPushText( "Enable Push Notification" )
            } );
    }


    function toggleSubscribe () {
        // Set the initial subscription value
        if ( isSubscribed ) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }

    }

    function checkForSubscirption () {
        swRegistration.pushManager.getSubscription()
            .then( function ( subscription ) {
                let isSub = !( subscription === null );
                setIsSubscribed( isSub )
                console.log( "TCL: initializeUI -> subscription", subscription )
                updateSubscriptionOnServer( subscription );

                if ( isSubscribed ) {
                    // pushButton.textContent = 'Disable Push Messaging';
                    setIsPushText( 'Disable Push Messaging' )
                } else {
                    setIsPushText( 'Enable Push Messaging' )
                    // pushButton.textContent = 'Enable Push Messaging';
                }

                // updateBtn();
            } );
    }

    function checkForServiceWorker () {

        if ( 'serviceWorker' in navigator && 'PushManager' in window ) {
            console.log( 'Service Worker and Push is supported' );

            navigator.serviceWorker.register( 'custom-service-worker.js' )
                .then( function ( swReg ) {
                    console.log( 'Service Worker is registered', swReg );
                    swRegistration = swReg;
                    checkForSubscirption()
                } )
                .catch( function ( error ) {
                    console.error( 'Service Worker Error', error );
                } );
        } else {
            console.warn( 'Push messaging is not supported' );
            // pushButton.textContent = ;
            setIsPushText( 'Push Not Supported' )
        }
    }


    return (
        <div>
            <button onClick={toggleSubscribe} >{pushText}</button>
        </div>
    )
}



