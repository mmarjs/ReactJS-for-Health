import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Grid, Row, Col} from 'react-bootstrap';
import Cases from '../Cases/Cases.jsx';
import {loadProgram} from '../Service/Service.jsx';
// import {loadProgram, getCurrentProgram} from '../Service/Service.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import css from './program.css';

export default class Program extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            programObject: null,
            category: 0,
        };

        // console.log(this.props.location.query.name);
        this.categoryChange = this.categoryChange.bind(this);
        this.categoryDropdownChange = this.categoryDropdownChange.bind(this);
    }

    componentDidMount() {
        // loadProgram(getCurrentProgram(), function(programObject){
        loadProgram(this.props.location.query.name, function(programObject){
            this.setState({programObject: programObject});
        }.bind(this));
        this.setState({category: 0});
    }

    // For DropDownMenu
    categoryDropdownChange(event, index, value) {
        this.setState({
            category: value,
        });
    }

    // For ArrowMenu
    categoryChange(value) {
        const numOfCategories = [...this.state.programObject.program.categories].length;

        this.setState((prevState, props) => {
            let newValue = prevState.category + value;
            if (newValue < 0) newValue += numOfCategories;
            if (newValue >= numOfCategories) newValue -= numOfCategories;
            // console.log(newValue);

            return {
                category: newValue
            };
        });
    }

    render() {
        return (
            <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0 }}>
                <Row className={css.content}>
                    <Col xs={12} className={css.verticalCenter}>
                        <a href="#"><img src='/images/return.png' className={css.return}/></a>
                        <h4 className={css.navigation}> {this.props.location.query.name} </h4>
                        {/*<h4 className={css.navigation}><a href="#">Programs</a> / <a href='#/cases'>Cold and Flu</a></h4>*/}
                    </Col>
                    { this.state.programObject && Object.keys(this.state.programObject).length != 0 &&
                        <div>
                            <Col xs={12} style={{textAlign: 'center'}}>
                                <MuiThemeProvider>
                                        <div>
                                            <div className={css.dropdownSelect}>
                                                <DropDownMenu className={css.categories} value={this.state.category} onChange={this.categoryDropdownChange} autoWidth={false}>
                                                {
                                                    this.state.programObject.program.categories.map((categoryName, index) =>
                                                        <MenuItem key={index} value={index} primaryText={categoryName}/>
                                                    )
                                                }
                                                </DropDownMenu>
                                            </div>
                                            <div className={css.arrowSelect}>
                                                <div className={css.verticalCenter} style={{justifyContent:'center'}}>
                                                    <a href={"#/program?name=" + this.props.location.query.name} onClick={() => this.categoryChange(-1)} >
                                                        <img src='/images/left-arrow.png' className={css.arrow} />
                                                    </a>
                                                    <h2 className={css.categoryName}> {this.state.programObject.program.categories[this.state.category]} </h2>
                                                    <a href={"#/program?name=" + this.props.location.query.name} onClick={() => this.categoryChange(1)} >
                                                        <img src='/images/right-arrow.png' className={css.arrow} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                </MuiThemeProvider>
                            </Col>
                            <Col xs={12}>                        
                                <Cases program={this.state.programObject} category={this.state.category} programName={this.props.location.query.name} />
                            </Col>
                        </div>
                    }
                </Row>
            </Grid>
        );
    }
}