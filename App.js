import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NfcManager, {Ndef, NfcTech, ByteParser} from 'react-native-nfc-manager'

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    NfcManager.isSupported()
        .then(supported => {
          this.setState({ supported });
          if (supported) {
            // this._startNfc();
          }
        })
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
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
