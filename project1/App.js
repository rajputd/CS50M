import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Picker } from 'react-native';

class TimerPicker extends React.Component {
  formatNumber(number) {
    if (number < 10) {
      return '0' + number.toString();
    } else {
      return number.toString();
    }
  }

  render() {
    return (
      <Picker
        style={styles.picker}
        selectedValue={this.props.currentValue}
        onValueChange={(itemValue, itemIndex) => {this.props.onValueChange(itemValue, itemIndex)}}>
        {Array(this.props.maxValue + 1).fill(null).map((item, index) => {
          return (<Picker.Item label={this.formatNumber(index)} value={index} key={index} />);
        })}
      </Picker>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPaused: true,
      inWorkMode: true,
      minuteValue: 25,
      secondValue: 0,
      initialValues: {
        workMode: {
          minute: 25,
          second: 0
        },
        breakMode: {
          minute: 5,
          second: 0,
        },
      },
    }

    this.tick = this.tick.bind(this);
  }

  getCurrentInitialValues() {
    if (this.state.inWorkMode) {
      return this.state.initialValues.workMode;
    }

    return this.state.initialValues.breakMode;
  }

  handleTimerChange(newValue, timerType) {
    //if timer is running, do nothing
    if (!this.state.isPaused) {
      return;
    }

    let newState = {};
    newState[timerType + 'Value'] = newValue;

    this.setState(newState);
  }

  decrementTimer(timerType) {
    //if timer is already at zero, do nothing
    if(this.state[timerType + 'Value'] === 0) {
      return;
    }

    //decrement timer value by one
    this.setState((prevState) => {
      let newState = {};
      newState[timerType + 'Value'] =  --prevState[timerType + 'Value'];
      return newState;
    });
  }

  tick() {
    const secondValue = this.state.secondValue;
    const minuteValue = this.state.minuteValue;

    if (minuteValue === 0 && secondValue === 0) {
      this.timerDone();
    } else if (secondValue === 0) {
      this.decrementTimer('minute');

      //reset second timer back to maxValue
      this.setState({ secondValue: 59 });

    } else {
      this.decrementTimer('second');
    }
  }

  timerDone() {
    //pause timer
    this.setState({isPaused: true});
    clearInterval(this.intervalID);
  }

  handleStartPress() {
    //set/delete interval based on context
    if (this.state.isPaused) {
      this.intervalID = setInterval(this.tick, 1000);
    } else {
      clearInterval(this.intervalID);
    }

    //toggle isPaused state
    this.setState({isPaused: !this.state.isPaused});
  }

  handleResetPress() {
    let newState = {};

    //pause timer if still running
    if (!this.state.isPaused) {
      newState['isPaused'] = true;
      clearInterval(this.intervalID);
    }

    //reset timers to initial value
    newState['secondValue'] = this.getCurrentInitialValues().second;
    newState['minuteValue'] = this.getCurrentInitialValues().minute;

    this.setState(newState);
  }

  render() {
    return (
      <View>
        <View style={styles.flexRow}>
          <TimerPicker
           maxValue={99}
           currentValue={this.state.minuteValue}
           onValueChange={(itemValue) => {this.handleTimerChange(itemValue, 'minute')}} />

          <Text style={styles.textFont}> : </Text>

          <TimerPicker
           maxValue={59}
           currentValue={this.state.secondValue}
           onValueChange={(itemValue) => {this.handleTimerChange(itemValue, 'second')}} />

        </View>
        <View>
          <Button title={this.state.isPaused ? "Start" : "Pause"} onPress={() => {this.handleStartPress()}}/>
          <Button title="Reset" onPress={() => {this.handleResetPress()}}/>
        </View>
      </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Timer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 100,
  },
  textFont: {
    fontSize: 40,
  }
});
