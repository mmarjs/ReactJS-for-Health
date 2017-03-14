import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {launchCase} from '../Service/Service.jsx';
import css from './cases.css'

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

let tilesData = [];

export default class Cases extends Component {

  constructor(props) {
    super(props);
    this.state = {
      programObjec: this.props.program,
      category: this.props.category,
    };
    // console.log('Cases mounted');
    // console.log(this.props.category);
    // console.log(this.props.program);
    this.updateCaseList = this.updateCaseList.bind(this);
  }

  componentDidMount() {
    this.setState({category: this.props.category, programObject: this.props.program});
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({category: nextProps.category, programObject: nextProps.program});
  }

  updateCaseList() {
    tilesData = [];
    for (let key in this.state.programObject) {
      if (this.state.programObject.hasOwnProperty(key)) {
        let tile = {};
        if (key == 'program') break;
        if (this.state.programObject[key].case.category === 'c' + (parseInt(this.state.category)+1)) {
          tile.img  = '/images/' + this.state.programObject[key].case.thumb;
          tile.title = this.state.programObject[key].case.title;
          tile.author = 'Viven Health';
          tile.caseId = key;
          tilesData.push(tile);
        }
      }
    }
  }

  render() {
    this.updateCaseList();
    
    return (
      <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0 }}>
        <Row className={css.content}>
          { tilesData.map( (tile) => (
              <Col xs={12} sm={6} md={4} lg={4} key={tile.caseId}>
                <div className={css.ratioKeep}>
                  <MuiThemeProvider>
                    <a href={'#/case?program=' + this.props.programName + '&case=' + tile.caseId} >
                      <GridTile title={tile.title} subtitle={<span>by <b>{tile.author}</b></span>} actionIcon={<IconButton><StarBorder color="white" /></IconButton>} style={styles.tile}>
                        <img src={tile.img} style={{width: '100%', height: '100%'}}/>
                      </GridTile>
                    </a>
                  </MuiThemeProvider>
                </div>
              </Col>
          ))}
        </Row>
      </Grid>
    );
  }
}