import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Grid, Row, Col} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Home from '../Home/Home.jsx';
import Programs from '../Programs/Programs.jsx';
import Support from '../Support/Support.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import {getUserData, getAllowedPrograms, getCaseDetails, getProgramPercent, getFAQs} from '../Service/Service.jsx';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import css from './dashboard.css'

const muiTheme = getMuiTheme({
    tabs: {
        backgroundColor: 'transparent',
    },
    inkBar: {
        backgroundColor: '#FFFF',
    }
});

const styles = {
    tab: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: '18px',
        textTransform: 'capitalize',
    }
}

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            tabIndex: 0,
            nextCase: {},
            totalPercent: 100,
            percentPerProgram:{},
            isPercentLoaded: false,
            isNextCaseLoaded: false,
            isFAQsLoaded: false,
            screenWidth: window.innerWidth,
            menuOpen: this.props.menuOpen,
            faqs:[],
        };

        this.menuOpen = this.menuOpen.bind(this);
        this.menuClose = this.menuClose.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentDidMount() { // every routing calls this ...

        getUserData(this.props.user, function (user) {
            this.setState({user: user});

            if ('enabledPrograms' in user) {
                getAllowedPrograms(user.enabledPrograms);
            } else {
                console.log('User has no enabled programs');
            }

            getCaseDetails(user.progress.next_action.program, user.progress.next_action.case, function(caseData){
                this.setState({nextCase: caseData});
                this.setState({isNextCaseLoaded: true});
            }.bind(this));
            
            // getProgramPercent(function(percent){
            //     this.setState({totalPercent: percent});
            //     this.setState({isPercentLoaded: true});
            // }.bind(this));

            getProgramPercent(function(percentPerProgram, totalPercent){
                this.setState({totalPercent: totalPercent});
                this.setState({percentPerProgram: percentPerProgram});
                this.setState({isPercentLoaded: true});
            }.bind(this));

            getFAQs().then(function(faqs) {
                this.setState({faqs: faqs});
                this.setState({isFAQsLoaded: true});
            }.bind(this));
        }.bind(this));

        this.props.onLoad(this.menuOpen);
        window.addEventListener("resize", this.updateScreenWidth.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateScreenWidth.bind(this));
    }

    menuOpen() {
        this.setState({menuOpen: true});
    }

    menuClose() {
        this.setState({menuOpen: false});
    }

    updateScreenWidth() {
        this.setState({screenWidth: window.innerWidth});
    }

    handleTabChange(value) {    // "onChange"(that is "handleTabChange") is called in child component with value parameter
        this.setState({tabIndex: value});
        this.menuClose();
    }

    render() {
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0 }}>
                <Row className={css.content}>
                    {(this.state.isNextCaseLoaded && this.state.isPercentLoaded) ?
                        <Col xs={12}>
                            <MuiThemeProvider muiTheme={muiTheme}>
                                {/*[ReactJS] real state of controllable component and its descriptive state must be equal, if not equal, state isn't state of it*/}
                                <Tabs value={this.state.tabIndex} onChange={this.handleTabChange} tabItemContainerStyle={{width: '400px', ...(this.state.screenWidth <= 992 ? {display: 'none'}:{display: 'block'}) }} inkBarStyle={{display: (this.state.screenWidth <= 992 ? 'none':'block') }}>
                                    <Tab label="Home" value={0} style={styles.tab} >
                                        <Home nextCase={{...this.state.nextCase, programName: this.state.user.progress.next_action.program, caseId: this.state.user.progress.next_action.case}} totalPercent={this.state.totalPercent}/>
                                        <Drawer
                                            open={this.state.menuOpen}
                                            docked={false}
                                            onRequestChange={(open) => this.setState({menuOpen: open})}
                                        >
                                            <MenuItem onTouchTap={() => this.handleTabChange(0)}>Home</MenuItem>
                                            <MenuItem onTouchTap={() => this.handleTabChange(1)}>Programs</MenuItem>
                                            <MenuItem onTouchTap={() => this.handleTabChange(2)}>Support</MenuItem>
                                        </Drawer>
                                    </Tab>
                                    <Tab label="Programs" value={1} style={styles.tab} >
                                        <Programs enabledPrograms={this.state.user.enabledPrograms} programPercent={this.state.percentPerProgram}/>
                                    </Tab>
                                    <Tab label="Support" value={2} style={styles.tab} >
                                    { this.state.isFAQsLoaded && <Support faqs={this.state.faqs} /> }
                                    </Tab>
                                </Tabs>
                            </MuiThemeProvider>
                        </Col>
                        :
                        <Col xs={12} className={css.loading}>
                            <MuiThemeProvider>
                                <CircularProgress size={300} thickness={7}/>
                            </MuiThemeProvider>
                        </Col>
                    }
                </Row>
            </Grid>
        );
    }
}