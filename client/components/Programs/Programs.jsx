import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import ProgramItem from '../ProgramItem/ProgramItem.jsx';
// import {setCurrentProgram} from '../Service/Service.jsx';
import {hashHistory} from 'react-router';
import css from './programs.css';

export default class Programs extends Component {

    constructor(props) {
        super(props);
        this.loadProgram = this.loadProgram.bind(this);

    }

    componentWillUnmount() {
        
    }

    loadProgram(value) {
        // setCurrentProgram(value);
        hashHistory.push('/program?name=' + value);
    }

    render() {
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0 }}>
                <Row className={css.content}>
                {
                    this.props.enabledPrograms.map((value, index) => (
                        <Col lg={3} md={4} sm={6} xs={12} key={index}>
                            <a href={'#/program?name=' + value} onClick={() => this.loadProgram(value)}>
                                <ProgramItem title={value} percent={this.props.programPercent[value]}/>
                            </a>
                        </Col>
                        )
                    )
                }
                </Row>
            </Grid>
        );
    }
}