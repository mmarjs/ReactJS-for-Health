import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Grid, Row, Col} from 'react-bootstrap';
import ProgressCircle from '../ProgressCircle/ProgressCircle.jsx';
// import Paper from 'material-ui/Paper';
import {launchNextCase} from '../Service/Service.jsx';
import {GridList, GridTile} from 'material-ui/GridList';
// import CircularProgress from 'material-ui/CircularProgress';
import { hashHistory } from 'react-router';
import css from './home.css'

const styles={
    tile: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        boxShadow: '6px 10px 12px 2px #8A8A8A',
        width: '100%',
        height: '100%',
    }
}

export default class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0 }}>
                <Row className={css.content}>
                    <Col xs={12} md={6}>
                        {/*<MuiThemeProvider>
                            <Paper style={{width:'100%', textAlign: 'center'}} zDepth={3}>*/}
                                <h2 className={css.itemTitle}> Total Progress </h2>
                                <ProgressCircle percent={this.props.totalPercent} style={{marginLeft:'25%', width: '50%'}}/>
                            {/*</Paper>
                        </MuiThemeProvider>*/}
                    </Col>
                    
                    <Col xs={12} md={6}>
                        <h2 className={css.itemTitle}> Next Case </h2>
                        <div className={css.ratioKeep}>
                            <MuiThemeProvider>
                                {/*<Paper style={{width:'100%', textAlign: 'center'}} zDepth={3}>*/}
                                    {/*<a href="#" onClick={() => launchNextCase(this.props.nextCase.programName, this.props.nextCase.caseId)}>*/}
                                    <a href={'#/case?program=' + this.props.nextCase.programName + '&case=' + this.props.nextCase.caseId} >
                                        <GridTile key={"/images/" + this.props.nextCase.thumb} title={this.props.nextCase.title}
                                            subtitle={<span>by <b>Viven Health</b></span>} style={styles.tile} >
                                            <img src={"/images/" + this.props.nextCase.thumb} style={{width: '100%', height: '100%'}}/>
                                        </GridTile>
                                    </a>
                                {/*</Paper>*/}
                            </MuiThemeProvider>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}