import React from 'react';
import ReactDOM from 'react-dom';
import CreateReactClass from 'create-react-class'
import Firebase from 'firebase'
import FirebaseUI from 'firebaseui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
const firebase = Firebase.initializeApp(config);
const database = firebase.database().ref();

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
        return { loggedIn: 'false'};
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
    getInitialState: function () {
        this.user = Firebase.auth().currentUser;
        return { data: []};
    },
    init : function () {
        this.printlist();
    },
    addtolist: function () {
        var current = this;
        var link = document.getElementById('link').value;
        firebase.database().ref('links').push({
            link: link,
            uid: current.user.uid
        });
        document.getElementById('link').value = "";
        this.printlist();
    },
    printlist: function () {
        var current = this;
        firebase.database().ref('links').orderByChild('uid').equalTo(this.user.uid).on('value', function (snapshot) {
            var data = [];
            snapshot.forEach(function(childSnapshot) {
                data.push(childSnapshot);
                //console.log(childSnapshot.val().link);
            });
            current.setState({data: data});
        });
    },
    render: function () {
        this.getInitialState();
        if (this.state.data.length == 0){
            this.init();
        }
        var cards = [];
        for (var i = 0; i < this.state.data.length; i++) {
            cards.push(<p>{this.state.data[i].val().link}</p>);
        }
        const buttonstyle = {
            margin: 10,
        };
        const textfieldstyle = {
            margin: 10,
            width: 400,
        };
        return (
            <div>
                <center>
                    <TextField id="link" hintText="Ex. https://hackbit.github.io/reactriot2017-manishbisht/" style={textfieldstyle}/>
                    <RaisedButton onClick={this.addtolist} label="Add to list" primary={true} style={buttonstyle}/>
                    {cards}
                </center>
            </div>
        )
    }
});

const root = document.getElementById('root');
ReactDOM.render((
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>
), root);