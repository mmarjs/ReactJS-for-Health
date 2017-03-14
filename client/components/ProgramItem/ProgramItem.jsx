import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import ProgressCircle from '../ProgressCircle/ProgressCircle.jsx'
// import IconButton from 'material-ui/IconButton';
// import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import css from './programitem.css';

const styles = {
    card: {
        width: '100%',
        // height: '100%',
        paddingTop: '10%',
        paddingBottom: '5%',
    },
    cardmedia: {
        paddingLeft: '10%',
        paddingRight: '10%',
        // backgroundColor: '#8BC34A',
    },
    cardtitle: {
        color: '#546E7A'
    }
}
export default class ProgramItem extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // console.log(this.props.onClick);
    }

    render() {
        return (
            <MuiThemeProvider>
                <Card style={styles.card} onClick={this.props.onClick}>
                    <CardMedia style={styles.cardmedia}>
                        {/*<img src='/images/program.png'/>*/}
                        {<ProgressCircle percent={this.props.percent} style={{width: '80%'}}/>}
                    </CardMedia>
                    <CardTitle style={styles.cardtitle}>
                        <h3 className={css.title}> {this.props.title} </h3>
                    </CardTitle>
                </Card>
            </MuiThemeProvider>
        );
    }
}