import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Tabs, Tab} from 'material-ui/Tabs';
import css from './header.css'


class Login extends Component {
    // static muiName = 'FlatButton';

    render() {
        return (
            <FlatButton {...this.props} label="Login" />
        );
    }
}

const Logged = (props) => (
    /*<IconMenu
        {...props}
        iconButtonElement={
            props.iconButton
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >*/
    <IconMenu
        iconButtonElement={
            props.iconButton
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
        <MenuItem
            primaryText="Log out"
            leftIcon={
                <Avatar src={props.avatar} size={50} />
            }
        />
    </IconMenu>
);

// Logged.muiName = 'IconMenu';

const muiTheme = getMuiTheme({
    tabs: {
        backgroundColor: 'transparent',
    },
    inkBar: {
        backgroundColor: '#84B5CA',
        // width: '50%',
    }
});

const styles = {
    tab: {
        color: 'rgba(0, 0, 0, 0.7)',
        // width: '10%',
        fontSize: 18,
        textTransform: 'capitalize',
    },
}

export default class Header extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            logged: true,
            menuButtonClicked: false,
        }
    }

    render() {
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0}} >
                <Row className={css.appBar}>
                    <Col xs={12}>
                        <MuiThemeProvider>
                            <div>
                                <AppBar
                                    className={css.mainPart}
                                    title={
                                        <img className={css.logo} src='/images/logo_new.png' />
                                    }
                                    // iconElementRight={
                                    //     this.state.logged ? <Logged avatar={this.props.user.picture} iconButton={<IconButton><MoreVertIcon color={'white'}/></IconButton>} /> : <Login />
                                    // }
                                    onLeftIconButtonTouchTap={this.props.onMenuButtonClick}
                                />
                            </div>
                        </MuiThemeProvider>
                    </Col>
                </Row>
                <Row className={css.appPanel}>
                    <Col xs={12}>
                        <img className={css.logo} src='/images/logo_new.png' />
                        {/*<h1 className={css.health}> Health </h1>*/}
                    </Col>
                    <Col xs={12} style={{textAlign: 'center', position: 'absolute', left: '0'}}>
                        <h1 className={css.welcome}> Welcome, {this.props.user.name}! </h1>
                    </Col>
                    <Col xs={12} style={{textAlign: 'right', marginTop:'-10px', marginBottom: '-20px'}}>
                        <MuiThemeProvider>
                            <Logged avatar={this.props.user.picture}
                                iconButton={
                                    <a href="#">
                                        <Avatar src={this.props.user.picture} size={80}/>
                                    </a>
                                }
                            />
                        </MuiThemeProvider>
                    </Col>
                </Row>
            </Grid>
        );
    }
}