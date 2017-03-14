import React from 'react';
// import CircularProgress from 'material-ui/CircularProgress';
import CircularProgressbar from 'react-circular-progressbar';

// const styles = {
//   this: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   percent: {
//     position: 'absolute',
//     textAlign: 'center',
//     color: '#4DD0E1',
//     fontSize: 60,
//   }
// }

export default class ProgressCircle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: this.props.percent,
    };
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.percent !== this.state.completed) {
      this.setState({ completed: nextProps.percent });
    }
  }

  // componentDidMount() {
  //   this.timer = setTimeout(() => this.progress(5), 1000);
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  // }

  // progress(completed) {
  //   if (completed > 100) {
  //     this.setState({completed: 100});
  //   } else {
  //     this.setState({completed});
  //     const diff = Math.random() * 10;
  //     this.timer = setTimeout(() => this.progress(completed + diff), 1000);
  //   }
  // }

  render() {
    return (
      <div style={this.props.style}>
        <CircularProgressbar percentage={this.state.completed} strokeWidth={5} />
        {/*<CircularProgress
          mode="determinate"
          value={this.state.completed}
          size={300}
          thickness={15}
        />*/}
        {/*<div style={styles.percent}> {this.state.completed}% </div>*/}
      </div>
    );
  }
}