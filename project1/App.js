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
  }

  handleTimerChange(newValue, timerName) {
    if (this.state.isPaused) {
      this.setState((prevState) => {

        let newState = {};
        newState[timerName] = {
          currentValue: newValue,
          initialValue: newValue,
          maxValue: prevState[timerName].maxValue
        }

        return newState;
      });
    }
  }

  handleStartPress() {
    this.setState({isPaused: !this.state.isPaused});
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
          <Button title="Reset" onPress={null}/>
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
