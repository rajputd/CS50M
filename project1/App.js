import React from 'react';
import { StyleSheet, View} from 'react-native';
import {Timer} from './components';

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
});
