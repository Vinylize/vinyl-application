import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as YettaServerAPIverification from './../../service/YettaServerAPI/verification';

// assets
import IMG_BACK from './../../../assets/left-arrow-key.png';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  phoneVerificationContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center'
  },
  phoneVerificationHeaderText: {
    fontSize: 30,
    fontWeight: '500',
    color: 'black',
    marginTop: HEIGHT * 0.05,
    alignSelf: 'flex-start',
    marginLeft: WIDTH * 0.1
  },
  phoneVerificationBodyContainer: {
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  phoneVerificationBodyText: {
    fontSize: 18,
    color: 'black',
    marginTop: HEIGHT * 0.07
  },
  phoneVerificationBottomText: {
    fontSize: 14,
    color: 'grey',
    marginTop: HEIGHT * 0.05
  },
  phoneVerificationPhoneNumberTextInputContainer: {
    height: 40,
    width: WIDTH * 0.65,
    backgroundColor: '#f1f1f1',
    alignSelf: 'center',
    marginTop: HEIGHT * 0.07,
    borderRadius: 5,
    paddingLeft: 8
  },
  phoneVerificationPhoneNumberTextInput: {
    height: 40,
    width: WIDTH * 0.65 - 20,
    backgroundColor: '#f1f1f1',
    alignSelf: 'center',
    borderRadius: 5
  },
  phoneVerificationSendButton: {
    width: WIDTH,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  phoneVerificationHeaderBackButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20
  }
});

export default class PhoneVerification extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
      fourDigitNumber: '',
      keyboardDidShow: false,
      keyboardHeight: 0,
      showUserResponseView: false
    };
    this.shouldActivateSendButton = this.shouldActivateSendButton.bind(this);
    this.handleSendButton = this.handleSendButton.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    const { height } = e.endCoordinates;
    LayoutAnimation.easeInEaseOut();
    this.setState(() => {
      return {
        keyboardDidShow: true,
        keyboardHeight: height
      };
    });
  }

  keyboardDidHide() {
    LayoutAnimation.easeInEaseOut();
    this.setState(() => {
      return {
        keyboardDidShow: false,
        keyboardHeight: 0
      };
    });
  }

  shouldActivateSendButton() {
    return (this.state.phoneNumber.length >= 10);
  }

  handleSendButton() {
    if (this.shouldActivateSendButton()) {
      // YettaServerAPIverification.userRequestPhoneVerification(this.state.phoneNumber)
      //   .then(res => {
      //     __DEV__ && console.log(res); // eslint-disable-line no-undef
      //     this.setState(() => {
      //       return {showUserResponseView: true};
      //     });
      //   })
      //   .catch(err => {
      //     __DEV__ && console.log(err); // eslint-disable-line no-undef
      //   });
      this.setState({showUserResponseView: true});
    }
  }

  handleBackButton() {
    if (this.state.showUserResponseView === false) {
      this.navigateBackToLogin();
    } else if (this.state.showUserResponseView === true) {
      LayoutAnimation.easeInEaseOut();
      this.setState({showUserResponseView: false});
    }
  }

  navigateBackToLogin() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login', params: {navigation: this.props.navigation}})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  renderHeader() {
    return (
      <View style={{
        height: (Platform.OS === 'ios') ? 70 : 50,
        width: WIDTH,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
      }}>
        <TouchableOpacity
          style={styles.phoneVerificationHeaderBackButton}
          onPress={this.handleBackButton}
        >
          <Image
            style={{height: 24, width: 24}}
            source={IMG_BACK}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderBodyUserRequestView() {
    return (
      <View style={{
        width: WIDTH,
        alignItems: 'center',
        backgroundColor: 'transparent'}}>
        <Text style={styles.phoneVerificationHeaderText}>
          휴대폰 인증
        </Text>
        <Text style={styles.phoneVerificationBodyText}>
          휴대전화번호를 입력해주세요
        </Text>
        <View style={styles.phoneVerificationPhoneNumberTextInputContainer}>
          <TextInput
            style={styles.phoneVerificationPhoneNumberTextInput}
            onChangeText={(text) => {
              LayoutAnimation.easeInEaseOut();
              this.setState({phoneNumber: text});
            }}
            value={this.state.phoneNumber}
            underlineColorAndroid={'transparent'}
            keyboardType="numeric"
            maxLength={11}
            autoFocus
          />
        </View>
        <Text style={styles.phoneVerificationBottomText}>
          입력하신 번호로 4자리의 인증번호를 보내드립니다
        </Text>
      </View>
    );
  }

  renderBodyUserResponseView() {
    return (
      <View style={{
        width: WIDTH,
        alignItems: 'center',
        backgroundColor: 'transparent'}}>
        <Text style={styles.phoneVerificationHeaderText}>
          휴대폰 인증
        </Text>
        <Text style={{marginTop: HEIGHT * 0.07, color: 'grey'}}>{this.state.phoneNumber}</Text>
        <Text style={[styles.phoneVerificationBodyText, {marginTop: HEIGHT * 0.033}]}>
          전송받은 인증번호를 입력해 주세요
        </Text>
        <View style={styles.phoneVerificationPhoneNumberTextInputContainer}>
          <TextInput
            style={styles.phoneVerificationPhoneNumberTextInput}
            onChangeText={(text) => {
              LayoutAnimation.easeInEaseOut();
              this.setState({fourDigitNumber: text});
              if (text.length === 4) {
                /*
                 YettaServerAPIverification.userResponsePhoneVerification(text)
                 .then(res => {
                 __DEV__ && console.log(res); // eslint-disable-line no-undef
                 // todo:
                 })
                 .catch(err => {
                 __DEV__ && console.log(err); // eslint-disable-line no-undef
                 });
                 */
                this.setState({showUserResponseView: false});
              }
            }}
            value={this.state.fourDigitNumber}
            underlineColorAndroid={'transparent'}
            keyboardType="numeric"
            maxLength={4}
            autoFocus
          />
        </View>
        <TouchableOpacity style={styles.phoneVerificationBottomText}>
          <Text style={{color: '#205D98'}}>도움이 필요하신가요?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderBody() {
    if (this.state.showUserResponseView === true) {
      return this.renderBodyUserResponseView();
    } else if (this.state.showUserResponseView === false) {
      return this.renderBodyUserRequestView();
    }
    __DEV__ && console.log('ERROR: unexpected showUserResponseView value'); // eslint-disable-line no-undef
    return null;
  }

  renderSendButton() {
    if (this.state.showUserResponseView === true) {
      return null;
    }
    return (
      <TouchableOpacity
        style={[styles.phoneVerificationSendButton, {
          backgroundColor: (this.shouldActivateSendButton()) ? '#ff9700' : 'grey',
          bottom: (this.state.keyboardDidShow === true) ? this.state.keyboardHeight : 0}
        ]}
        onPress={this.handleSendButton}
      >
        <Text style={{color: 'white', fontWeight: '500'}}>인증번호 받기</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.phoneVerificationContainer}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderSendButton()}
      </View>
    );
  }
}

PhoneVerification.propTypes = {
  navigation: PropTypes.object.isRequired
};