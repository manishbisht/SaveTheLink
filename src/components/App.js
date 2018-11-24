import React, {Component} from 'react';
import * as firebase from "firebase";
import * as FirebaseUI from 'firebaseui'
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';

import Login from './Login';
import Dashboard from './Dashboard';

var config = {
    apiKey: "AIzaSyDnIK-Y3rK8joJ5B_nBZMkkmETgKNoY7Us",
    authDomain: "savethelink-9df2f.firebaseapp.com",
    databaseURL: "https://savethelink-9df2f.firebaseio.com",
    projectId: "savethelink-9df2f",
    storageBucket: "savethelink-9df2f.appspot.com",
    messagingSenderId: "553681523097"
};
firebase.initializeApp(config);
const ui = new FirebaseUI.auth.AuthUI(firebase.auth());

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: '',
            isLoggedIn: false,
        };

        this.registerLogin = this.registerLogin.bind(this);
        this.logout = this.logout.bind(this);
    }

    checkLogin() {
        let self = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                self.setState({
                    currentUser: user,
                    isLoggedIn: true
                });
            }
            else {
                self.setState({
                    isLoggedIn: false
                });
            }
        });
    }

    registerLogin() {
        let self = this;
        let uiConfig = {
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            'callbacks': {
                signInSuccess: function(currentUser, credential, redirectUrl) {
                    self.setState({
                        currentUser: currentUser,
                        isLoggedIn: true
                    });
                }
            },
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    }

    logout() {
        let self = this;
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            self.setState({
                isLoggedIn: false
            });
        }, function(error) {
            // An error happened.
        });
    }

    componentDidMount() {
        this.checkLogin();
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <div>
                    <AppBar className={"header"} title="SaveTheLink" iconElementLeft={<IconButton><FontIcon
                        className="material-icons">bookmark_border</FontIcon></IconButton>}>
                        <div style={{margin: 15}}>
                            <RaisedButton label="Logout" primary={true} onClick={this.logout} />
                        </div>
                    </AppBar>
                    <Dashboard currentUser={this.state.currentUser} />
                </div>
            );
        } else {
            return (
                <div>
                    <AppBar className={"header"} title="SaveTheLink" iconElementLeft={<IconButton><FontIcon
                        className="material-icons">bookmark_border</FontIcon></IconButton>}/>
                    <Login registerLogin={this.registerLogin} />
                </div>
            );
        }
    }
}

export default App;