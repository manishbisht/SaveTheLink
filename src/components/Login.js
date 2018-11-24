import React, {Component} from 'react';
import '../css/firebaseui.css';

class Login extends Component {
    componentWillMount() {
        this.props.registerLogin();
    }

    render() {
        return (
            <div>
                <div id="firebaseui-auth-container"></div>
            </div>
        );
    }
}

export default Login;