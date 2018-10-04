import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Picker } from 'react-native';

class TimerPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '00',
    }
  }

  handleChange(itemValue, itemIndex) {
    if (this.props.isPaused) {
      this.setState({value: itemValue});
      return;
    }
  }

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
        selectedValue={this.state.value}
        onValueChange={(itemValue, itemIndex) => {this.handleChange(itemValue, itemIndex)}}>
        {Array(this.props.timerLength).fill(null).map((item, index) => {
          let val = this.formatNumber(index);
          return (<Picker.Item label={val} value={val} key={val} />);
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
    }
  }

  handleStartPress() {
    this.setState({isPaused: !this.state.isPaused});
  }

  render() {
    return (
      <View>
        <View style={styles.flexRow}>
          <TimerPicker timerLength={100} isPaused={this.state.isPaused} />
          <Text style={styles.textFont}> : </Text>
          <TimerPicker timerLength={60} isPaused={this.state.isPaused} />
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
