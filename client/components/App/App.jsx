import React from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import {Grid, Row, Col} from 'react-bootstrap';
import Header from '../Header/Header.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import Program from '../Program/Program.jsx';
import Case from '../Case/Case.jsx';
import Footer from '../Footer/Footer.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
// ----------------------------- Component Test ---------------------------
// import Case from '../Case/Case.jsx';
// ----------------------------- /Component Test --------------------------

injectTapEventPlugin();

export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            // menuButtonClicked: false,
            menuOpenListener: {},
        };
        // console.log(this.props.user);
        this.menuOpen = this.menuOpen.bind(this);
        this.registerMenuOpenListener = this.registerMenuOpenListener.bind(this)
    }

    menuOpen() {
        // this.setState({menuButtonClicked: true});
        this.state.menuOpenListener(true);
    }

    registerMenuOpenListener(callback) {
        this.setState({menuOpenListener: callback});
    }

    render() {
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0}}>
                <Router history={hashHistory}>
                    <Route path='/case' component={null} />
                    <Route path='*' component={() => <Header user={this.props.user} onMenuButtonClick={this.menuOpen} />} />
                </Router>

                <Router history={hashHistory}>
                    <Route path='/' component={() => <Dashboard user={this.props.user} onLoad={this.registerMenuOpenListener} />} />
                    <Route path='/program' component={Program} />
                    <Route path='/case' component={Case} />
                </Router>
                
                <Router history={hashHistory}>
                    <Route path='/case/first case' component={null} />
                    <Route path='*' component={Footer} />
                </Router>
                {/*<Login />*/}
                {/*<Case />*/}
            </Grid>
        );
    }
}