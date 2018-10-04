import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import {TimerPicker} from './index';
import {vibrate} from './../utils';

export default class Timer extends React.Component {
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
    //toggle mode
    this.setState((prevState) => {
        return { inWorkMode: !prevState.inWorkMode }
    });

    this.resetTimer();

    vibrate();
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
    this.resetTimer();
  }

  handleSetPress() {
    let initialValues = this.state.initialValues;

    if (this.state.inWorkMode) {
      initialValues.workMode.minute = this.state.minuteValue;
      initialValues.workMode.second = this.state.secondValue;
    } else {
      initialValues.breakMode.minute = this.state.minuteValue;
      initialValues.breakMode.second = this.state.secondValue;
    }

    this.setState({initialValues: initialValues});
  }

  resetTimer() {
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
        <Text style={styles.textFont}>
          {this.state.inWorkMode ? 'Time to work!' : 'Time to relax!'}
        </Text>
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
          <Button title="Set Timer" onPress={() => {this.handleSetPress()}}/>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textFont: {
    fontSize: 40,
  }
});
