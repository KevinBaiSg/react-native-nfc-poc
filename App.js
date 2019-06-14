import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import NfcManager, {Ndef, NfcTech, ByteParser} from 'react-native-nfc-manager'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: true,
      enabled: false,
      // isWriting: false,
      // urlToWrite: 'https://www.google.com',
      // rtdType: RtdType.URL,
      // parsedText: null,
      tag: {},
      text: 'Open up App.js to start working on your app!',
    }
    this._startNfc = this._startNfc.bind(this)
    this._onTagDiscovered = this._onTagDiscovered.bind(this)
    this._startDetection = this._startDetection.bind(this)
    this._stopDetection = this._stopDetection.bind(this)
    this._parseText = this._parseText.bind(this)
    
  }

  componentDidMount() {
    NfcManager.isSupported()
        .then(supported => {
          this.setState({ supported });
          if (supported) {
            this._startNfc();
            this._startDetection();
          }
        })
  }

  componentWillUnmount() {
    if (this._stateChangedSubscription) {
        this._stateChangedSubscription.remove();
    }
  }

  _startNfc() {
    NfcManager.start()
        .then(result => {
            console.log('start OK', result);
        })
        .catch(error => {
            console.warn('start fail', error);
            this.setState({supported: false});
        })

    if (Platform.OS === 'android') {
        NfcManager.getLaunchTagEvent()
            .then(tag => {
                console.log('launch tag', tag);
                if (tag) {
                    this.setState({ tag });
                }
            })
            .catch(err => {
                console.log(err);
            })
        NfcManager.isEnabled()
            .then(enabled => {
                this.setState({ enabled });
            })
            .catch(err => {
                console.log(err);
            })
        NfcManager.onStateChanged(
            event => {
                if (event.state === 'on') {
                    this.setState({enabled: true});
                } else if (event.state === 'off') {
                    this.setState({enabled: false});
                } else if (event.state === 'turning_on') {
                    // do whatever you want
                } else if (event.state === 'turning_off') {
                    // do whatever you want
                }
            }
        )
            .then(sub => {
                this._stateChangedSubscription = sub; 
                // remember to call this._stateChangedSubscription.remove()
                // when you don't want to listen to this anymore
            })
            .catch(err => {
                console.warn(err);
            })
    }
  }

  _onTagDiscovered = tag => {
    console.log('Tag Discovered', tag);
    this.setState({ tag });
    // let url = this._parseUri(tag);
    // if (url) {
    //     Linking.openURL(url)
    //         .catch(err => {
    //             console.warn(err);
    //         })
    // }

    let text = this._parseText(tag);
    this.setState({parsedText: text});
    console.log('tag: ', tag)
    this.setState({ text: tag.id });
  }

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered)
        .then(result => {
            console.log('registerTagEvent OK', result)
        })
        .catch(error => {
            console.warn('registerTagEvent fail', error)
        })
  }

  _stopDetection = () => {
      NfcManager.unregisterTagEvent()
          .then(result => {
              console.log('unregisterTagEvent OK', result)
          })
          .catch(error => {
              console.warn('unregisterTagEvent fail', error)
          })
  }

  _parseText = (tag) => {
    try {
        if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
            return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
        }
    } catch (e) {
        console.log(e);
    }
    return null;
}

  render() {
    return (
        <View style={styles.container}>
          <Text>{this.state.text}</Text>
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
