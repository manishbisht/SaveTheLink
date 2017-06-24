/**
 * Created by manish on 24/6/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
var Login = React.createClass ({
    getInitialState: function(){
        return { loggedIn: 'false' };
    },

    handleLogIn: function(event){

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // ERROR HANDLING
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorMessage);

        });

        this.setState({ loggedIn: 'true' });

    },

    authenticateUser: function(x){

        // INITIALIZATION
        var config = {
            apiKey: "AIzaSyDnIK-Y3rK8joJ5B_nBZMkkmETgKNoY7Us",
            authDomain: "savethelink-9df2f.firebaseapp.com",
            databaseURL: "https://savethelink-9df2f.firebaseio.com",
            projectId: "savethelink-9df2f",
            storageBucket: "savethelink-9df2f.appspot.com",
            messagingSenderId: "553681523097"
        };
        //firebase.initializeApp(config);
        try {
            firebase.initializeApp(config);
        } catch (err) {
            if (!/already exists/.test(err.message)) {
                console.error('Firebase initialization error', err.stack)
            }
        }

        //CHECKING IF SIGNED IN
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // USER IS SIGNED IN
                console.log(user);
                this.setState({ loggedIn: 'true' });
            }
            else {
                // USER IS SIGNED OUT
                console.log('authenticateUser(): false');
                this.setState({ loggedIn: 'false' });
            }
        });

    },

    whichWindowToShow: function() {
        if (this.state.loggedIn === 'unknown'){
            return (
                <div>
                    loading
                </div>
            );
        }
        else if (this.state.loggedIn === 'true'){
            return (
                <div>
                    sassa
                </div>
            );
        }
        else {
            return (
                <div className="login_wrapper">
                    <div className="login_box">
                        <h1>Member Login</h1>
                        <div className="login_fields">
                            <input type="text" id="email" name="email" placeholder="mail"/>
                            <input type="password" id="password" name="password" placeholder="password"/>
                            <button id="signin" name="signin" onClick={this.handleLogIn}>Login</button>
                        </div>
                    </div>
                </div>
            );
        }
    },

    render: function() {
        var data = this.getInitialState();
        console.log(data);
        this.authenticateUser();
        return (
            <div>
                { this.whichWindowToShow() }
            </div>
        );
    },

    setState: function (state) {
        console.log(state.loggedIn);
    }

}); // END LOGIN

export default Login;
