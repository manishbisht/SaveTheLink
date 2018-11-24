import React, {Component} from 'react';
class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            currentTab: null
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.openTab = this.openTab.bind(this);
    }

    handleToggle = () => this.setState({open: !this.state.open});

    openTab(tabName) {
        this.setState({
            open: false,
            currentTab: tabName,
        });
    }

    render() {
        return (<h1>sa</h1>);
    }
}

export default Dashboard;