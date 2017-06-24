import React from 'react';
import ReactDOM from 'react-dom';
import CreateReactClass from 'create-react-class'
import Firebase from 'firebase'
import FirebaseUI from 'firebaseui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './index.css';
import '../node_modules/firebaseui/dist/firebaseui.css'

// Needed for onTouchTap
injectTapEventPlugin();

var config = {
    apiKey: "AIzaSyDnIK-Y3rK8joJ5B_nBZMkkmETgKNoY7Us",
    authDomain: "savethelink-9df2f.firebaseapp.com",
    databaseURL: "https://savethelink-9df2f.firebaseio.com",
    projectId: "savethelink-9df2f",
    storageBucket: "savethelink-9df2f.appspot.com",
    messagingSenderId: "553681523097"
};
Firebase.initializeApp(config);

var App = CreateReactClass({
    getcurrentState: function () {
        var user = Firebase.auth().currentUser;
        if (user) {
            this.loggedIn = true;
        }
        else {
            this.loggedIn = false;
        }
        return this.loggedIn;
    },
    render: function () {
        if(this.getcurrentState())
            return (
                <div>
                    <AppBar title="SaveTheLink" showMenuIconButton={false}/>
                    <Bookmarks />
                </div>
            );
        else
            return (
                <div>
                    <AppBar title="SaveTheLink" showMenuIconButton={false}/>
                    <Login />
                </div>
            );
    }
});

var Login = CreateReactClass({
    getInitialState: function () {
        return { loggedIn: 'false',
        };
    },
    whichWindowToShow: function () {
        var user = Firebase.auth().currentUser;
        if (user){
            return (
                <Bookmarks />
            );
        }
        else {
            var current = this;
            var uiConfig = {
                signInOptions: [
                    // Leave the lines as is for the providers you want to offer your users.
                    Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    Firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    Firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    Firebase.auth.GithubAuthProvider.PROVIDER_ID,
                    Firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    Firebase.auth.PhoneAuthProvider.PROVIDER_ID
                ],
                'callbacks': {
                    signInSuccess: function(currentUser, credential, redirectUrl) {
                        current.setState({ loggedIn: 'true' });
                        return false;
                    }
                },
            };
            var ui = new FirebaseUI.auth.AuthUI(Firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
            return (
                <div>
                    <center>
                        <h1>Login to Continue</h1>
                        <div id="firebaseui-auth-container"></div>
                        <p>Save all your useful links at one place and access them anywhere.</p>
                    </center>
                </div>
            );
        }
    },
    render: function () {
        this.getInitialState();
        return (
            <div>
                { this.whichWindowToShow() }
            </div>
        )
    }
});

var Bookmarks = CreateReactClass({
    render: function () {
        var user = Firebase.auth().currentUser;
        console.log(user);
        return <div>Your Bookmarks</div>
    }
});

const root = document.getElementById('root');
ReactDOM.render((
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>
), root);