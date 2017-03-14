import React, {Component} from 'react';
import {Collapse} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import css from './support.css'

const styles = {
    download: {
        label: {
            fontSize: '16px'
        },
        overlay: {
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            height: '60px',
            background: 'linear-gradient(to right, #6495AA, #6495AA)',
        }
    },

    send: {
        label: {
            fontSize: '16px'
        },
        overlay: {
            height: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            height: '35px',
            background: 'linear-gradient(to right, #6495AA, #6495AA)',
        }
    },

    underlineStyle: {
        borderColor: '#84B5CA',
    },
    floatingLabelStyle: {
        fontSize: '14px',
        fontWeight: 'normal'
    },
    floatingLabelFocusStyle: {
        color: '#84B5CA',
    },
}

export default class Support extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        // console.log(this.props.faqs);
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0 }}>
                <Row className={css.content}>
                    <Col xs={8}>
                    {
                        this.props.faqs && this.props.faqs.map((value, index) => 
                            <MuiThemeProvider key={index}>
                                <Card>
                                    <CardHeader
                                        title={<h4>{value.q}</h4>}
                                        actAsExpander={true}
                                        showExpandableButton={true}
                                    />
                                    <CardText expandable={true}>
                                        {value.a}
                                    </CardText>
                                </Card>
                            </MuiThemeProvider>
                        )
                    }
                    </Col>
                    <Col xs={4}>
                        <MuiThemeProvider>
                            <div>
                                <RaisedButton label="DOWNLOAD USER MANUAL" primary={true} buttonStyle={styles.download.button}
                                labelStyle={styles.download.label} overlayStyle={styles.download.overlay} fullWidth={true} />
                                <br />
                                <TextField
                                    floatingLabelText="Name"
                                    fullWidth={true}
                                    rows={1}
                                    floatingLabelStyle = {styles.floatingLabelStyle}
                                    underlineFocusStyle = {styles.underlineStyle}
                                    floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
                                /><br />
                                <TextField
                                    floatingLabelText="Email"
                                    fullWidth={true}
                                    rows={1}
                                    floatingLabelStyle = {styles.floatingLabelStyle}
                                    underlineFocusStyle = {styles.underlineStyle}
                                    floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
                                /><br />
                                <TextField
                                    floatingLabelText="Message"
                                    multiLine={true}
                                    fullWidth={true}
                                    rows={1}
                                    floatingLabelStyle = {styles.floatingLabelStyle}
                                    underlineFocusStyle = {styles.underlineStyle}
                                    floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
                                />
                            </div>
                        </MuiThemeProvider>
                        <br />
                        <div style={{width: '100%', textAlign: 'right'}}>
                            <MuiThemeProvider>
                                <RaisedButton label="SEND" primary={true} buttonStyle={styles.send.button}
                                labelStyle={styles.send.label} overlayStyle={styles.send.overlay} />
                            </MuiThemeProvider>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}