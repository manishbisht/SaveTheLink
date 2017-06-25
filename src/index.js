import React from 'react';
import ReactDOM from 'react-dom';
import CreateReactClass from 'create-react-class'
import Firebase from 'firebase'
import FirebaseUI from 'firebaseui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import injectTapEventPlugin from 'react-tap-event-plugin';

import na from './na.png';
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
const database = Firebase.database();

var App = CreateReactClass({
    getInitialState: function () {
        return { loggedIn: 'check'};
    },
    getcurrentState: function () {
        var current = this;
        Firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                current.user = user;
                current.setState({ loggedIn: 'true' });
            }
            else {
                current.setState({ loggedIn: 'false' });
            }
        });
    },
    render: function () {
        if(this.state.loggedIn === "check"){
            this.getcurrentState();
        }
        if(this.state.loggedIn === "true")
            return (
                <div>
                    <AppBar className={"header"} title="SaveTheLink" showMenuIconButton={false}/>
                    <Bookmarks />
                </div>
            );
        else if (this.state.loggedIn === "check") {
            return (
                <div>
                    <AppBar className={"header"} title="SaveTheLink" showMenuIconButton={false}/>
                    <div className={"loader"}>
                        <center>
                            <CircularProgress size={60} thickness={5} />
                            <div>Please Wait</div>
                        </center>
                    </div>
                </div>
            );
        }
        else
            return (
                <div>
                    <AppBar className={"header"} title="SaveTheLink" showMenuIconButton={false}/>
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
        return {
            data: [],
            open: false,
        };
    },
    handleOpen: function() {
        this.setState({open: true});
    },
    handleClose: function() {
        this.setState({open: false});
    },
    init : function () {
        this.printlist();
    },
    addtolist: function () {
        var current = this;
        var link = document.getElementById('link').value;
        database.ref('links').push({
            link: link,
            uid: current.user.uid
        });
        document.getElementById('link').value = "";
        this.printlist();
    },
    printlist: function () {
        var current = this;
        database.ref('links').orderByChild('uid').equalTo(this.user.uid).on('value', function (snapshot) {
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
        if (this.state.data.length === 0){
            this.init();
        }
        var _data = this.state.data;
        const buttonstyle = {
            margin: 10,
        };
        const textfieldstyle = {
            margin: 10,
            width: 400
        };
        const titlestyle = {
            height: 36
        };
        if (this.state.data.length === 0){
            return (
                <div>
                    <center>
                        <TextField id="link" hintText="Ex. https://hackbit.github.io/reactriot2017-manishbisht/" style={textfieldstyle}/>
                        <RaisedButton onClick={this.addtolist} label="Add to list" primary={true} style={buttonstyle}/>
                        <div className={"loader"}>
                            <CircularProgress size={60} thickness={5} />
                            <div>Please Wait</div>
                        </div>
                    </center>
                </div>
            );
        }
        else {
        return (
            <div>
                <center>
                    <TextField id="link" hintText="Ex. https://hackbit.github.io/reactriot2017-manishbisht/" style={textfieldstyle}/>
                    <RaisedButton onClick={this.addtolist} label="Add to list" primary={true} style={buttonstyle}/>
                    <div className={"page-content"}>
                    {_data.map(function(object, i){
                        return <div className={"row"} key={i}>
                            <Card className={"card"}>
                                <CardMedia>
                                    <img className={"cardimage"} src={object.val().image} alt="" />
                                </CardMedia>
                                <CardTitle className={"cardtitle"} titleStyle={titlestyle} title={object.val().title} subtitle={object.val().created} />
                                <CardText className={"carddescription"}>
                                    {object.val().description}
                                </CardText>
                                <CardActions>
                                    <a target="_blank" href={object.val().link}>
                                        <FlatButton label="Open Link" />
                                    </a>
                                </CardActions>
                            </Card>

                        </div>;
                    })}
                    </div>
                </center>
            </div>
        )
        }
    }
});

const root = document.getElementById('root');
ReactDOM.render((
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>
), root);