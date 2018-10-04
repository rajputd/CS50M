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
      minuteTimer: {
        initialValue: 25,
        currentValue: 25,
        maxValue: 99,
      },
      secondTimer: {
        initialValue: 0,
        currentValue: 0,
        maxValue: 59,
      }
    }

    this.tick = this.tick.bind(this);
  }

  handleTimerChange(newValue, timerName) {
    if (this.state.isPaused) {
      this.setState((prevState) => {

        let newState = {};
        newState[timerName] = {
          currentValue: newValue,
          initialValue: prevState[timerName].initialValue,
          maxValue: prevState[timerName].maxValue
        }

        return newState;
      });
    }
  }

  decrementTimer(timerName) {

    if(this.state[timerName].currentValue === 0) {
      return;
    }

    this.setState((prevState) => {
      let newState = {};
      newState[timerName] = {
        currentValue: --prevState[timerName].currentValue,
        initialValue: prevState[timerName].initialValue,
        maxValue: prevState[timerName].maxValue,
      }
      return newState;
    });
  }

  tick() {
    const secondValue = this.state.secondTimer.currentValue;
    const minuteValue = this.state.minuteTimer.currentValue;

    if (minuteValue === 0 && secondValue === 0) {
      //call timer done function
      this.timerDone();
    } else if (secondValue === 0) {
      this.decrementTimer('minuteTimer');
      this.setState((prevState) => {
        return {
          secondTimer: {
            currentValue: prevState.secondTimer.maxValue,
            initialValue: prevState.secondTimer.initialValue,
            maxValue: prevState.secondTimer.maxValue,
          }
        }
      });
    } else {
      this.decrementTimer('secondTimer');
    }
  }

  timerDone() {
    this.setState({isPaused: true});
    clearInterval(this.intervalID);
  }

  handleStartPress() {
    if (this.state.isPaused) {
      this.intervalID = setInterval(this.tick,1000);
    } else {
      clearInterval(this.intervalID);
    }

    this.setState({isPaused: !this.state.isPaused});
  }

  handleResetPress() {
    let newState = {};
    const secondTimer = this.state.secondTimer;
    const minuteTimer = this.state.minuteTimer;

    if (!this.state.isPaused) {
      newState['isPaused'] = true;
      clearInterval(this.intervalID);
    }

    newState['secondTimer'] = {
      currentValue: secondTimer.initialValue,
      initialValue: secondTimer.initialValue,
      maxValue: secondTimer.maxValue,
    };

    newState['minuteTimer'] = {
      currentValue: minuteTimer.initialValue,
      initialValue: minuteTimer.initialValue,
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
