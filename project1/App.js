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
      minuteTimer: {
        currentValue: 25,
        maxValue: 99,
      },
      secondTimer: {
        currentValue: 0,
        maxValue: 59,
      }
    }

    this.tick = this.tick.bind(this);
  }

  getCurrentInitialValues() {
    if (this.state.inWorkMode) {
      return this.state.initialValues.workMode;
    }

    return this.state.initialValues.breakMode;
  }

  handleTimerChange(newValue, timerName) {
    //if timer is running, do nothing
    if (!this.state.isPaused) {
      return;
    }

    //update timer value to that set by user
    this.setState((prevState) => {

      let newState = {};
      newState[timerName] = {
        currentValue: newValue,
        maxValue: prevState[timerName].maxValue
      }

      return newState;
    });

  }

  decrementTimer(timerName) {
    //if timer is already at zero, do nothing
    if(this.state[timerName].currentValue === 0) {
      return;
    }

    //decrement timer value by one
    this.setState((prevState) => {
      let newState = {};
      newState[timerName] = {
        currentValue: --prevState[timerName].currentValue,
        maxValue: prevState[timerName].maxValue,
      }
      return newState;
    });
  }

  tick() {
    const secondValue = this.state.secondTimer.currentValue;
    const minuteValue = this.state.minuteTimer.currentValue;

    if (minuteValue === 0 && secondValue === 0) {
      this.timerDone();
    } else if (secondValue === 0) {
      this.decrementTimer('minuteTimer');

      //reset second timer back to maxValue
      this.setState((prevState) => {
        return {
          secondTimer: {
            currentValue: prevState.secondTimer.maxValue,
            maxValue: prevState.secondTimer.maxValue,
          }
        }
      });

    } else {
      this.decrementTimer('secondTimer');
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
      this.intervalID = setInterval(this.tick,1000);
    } else {
      clearInterval(this.intervalID);
    }

    //toggle isPaused state
    this.setState({isPaused: !this.state.isPaused});
  }

  handleResetPress() {
    let newState = {};
    const secondTimer = this.state.secondTimer;
    const minuteTimer = this.state.minuteTimer;

    //pause timer if still running
    if (!this.state.isPaused) {
      newState['isPaused'] = true;
      clearInterval(this.intervalID);
    }

    //reset seconds to initial value
    newState['secondTimer'] = {
      currentValue: this.getCurrentInitialValues().second,
      maxValue: secondTimer.maxValue,
    };

    //reset minutes to initial value
    newState['minuteTimer'] = {
      currentValue: this.getCurrentInitialValues().minute,
      maxValue: minuteTimer.maxValue,
    };

    this.setState(newState);
  }

  render() {
    return (
      <View>
        <View style={styles.flexRow}>
          <TimerPicker
           maxValue={this.state.minuteTimer.maxValue}
           currentValue={this.state.minuteTimer.currentValue}
           onValueChange={(itemValue) => {this.handleTimerChange(itemValue, 'minuteTimer')}} />

          <Text style={styles.textFont}> : </Text>

          <TimerPicker
           maxValue={this.state.secondTimer.maxValue}
           currentValue={this.state.secondTimer.currentValue}
           onValueChange={(itemValue) => {this.handleTimerChange(itemValue, 'secondTimer')}} />

        </View>
        <View>
          <Button title={this.state.isPaused ? "Start" : "Pause"} onPress={() => {this.handleStartPress()}}/>
          <Button title="Reset" onPress={() => {this.handleResetPress()}}/>
        </View>
      </View>
    );
  }
}

class PomodoroTimer extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textFont}>Time to work!</Text>
        <Timer />
      </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
        <PomodoroTimer />
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
