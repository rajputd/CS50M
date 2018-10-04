import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Picker } from 'react-native';

class TimerPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '00',
      isPaused: true,
    }
  }

  handleChange(itemValue, itemIndex) {
    if (this.state.isPaused) {
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
  render() {
    return (
      <View>
        <View style={styles.flexRow}>
          <TimerPicker timerLength={100} />
          <Text style={styles.textFont}> : </Text>
          <TimerPicker timerLength={60} />
        </View>
        <View>
          <Button title="Start" onPress={null}/>
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
