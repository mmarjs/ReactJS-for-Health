import React, {Component} from 'react';
import css from './case.css';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {cyan400, pink400} from 'material-ui/styles/colors';
import Done from 'material-ui/svg-icons/action/done';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {addUserCompletedCase, launchCase} from '../Service/Service.jsx';
import { hashHistory } from 'react-router';
import Snackbar from 'material-ui/Snackbar';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: pink400,
  },
});

const styles = {
    alert: {
        bodyStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80px',
            backgroundColor: cyan400,
        },
        contentStyle:{
            fontSize: '20px',
        }
    }
}

export default class Case extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caseUrl: '',
            alertOpen: false,
        }

        this.caseCompleteCheck = this.caseCompleteCheck.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    componentDidMount() {
        launchCase(this.props.location.query.program, this.props.location.query.case,
            function(caseUrl){
                this.setState({caseUrl: caseUrl});
            }.bind(this)
        );
    }

    caseCompleteCheck() {
        this.setState({alertOpen: true});
        addUserCompletedCase(this.props.location.query.program, this.props.location.query.case);
    }

    handleRequestClose() {
        this.setState({alertOpen: false});
    }

    render() {
        return (
            <div>
                <iframe className={css.content}  src={this.state.caseUrl}>
                </iframe>
                <div className={css.actionPanel}>
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <FloatingActionButton onClick={() => hashHistory.push('/program?name=' + this.props.location.query.program)} >
                            <Exit />
                        </FloatingActionButton>
                    </MuiThemeProvider>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <MuiThemeProvider>
                        <FloatingActionButton onClick={this.caseCompleteCheck} >
                            <Done />
                        </FloatingActionButton>
                    </MuiThemeProvider>
                    <MuiThemeProvider>
                        <Snackbar
                            open={this.state.alertOpen}
                            message="Congratulation!"
                            autoHideDuration={4000}
                            onRequestClose={this.handleRequestClose}
                            bodyStyle={styles.alert.bodyStyle}
                            contentStyle={styles.alert.contentStyle}
                        />
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }
}