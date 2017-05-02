import {
  Navigator,
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform
} from 'react-native';
import React, { PropTypes } from 'react';
import { loginNavigatorRoute } from '../navigator/navigatorRoutes';
import { connect } from 'react-redux';
import { setRunnerNotification } from './../actions/pushNotificationActions';

const renderScene = (route, navigator) => {
  const { Component } = route;
  console.log('from allLayout: ', route);
  return (
    <Component
      navigator={navigator}
      func={route.func}
    />
  );
};

const configureScene = (route) => {
  const { sceneConfig } = route;
  return (sceneConfig) ? sceneConfig : Navigator.SceneConfigs.HorizontalSwipeJump;
};

class All extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      // todo: research how to remove these listeners from DeviceEventEmitter for possible memory leaks
      DeviceEventEmitter.addListener('FCMNotificationReceived', async(data) => {
        console.log(data);
      });
    } else {
      PushNotificationIOS.addEventListener('register', console.log);
      PushNotificationIOS.addEventListener('registrationError', console.log);
      PushNotificationIOS.addEventListener('notification', this.receivedRemoteNotification.bind(this));
    }
  }

  componentDidMount() {
    console.log(this.props.runnerNotification);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', console.log);
    PushNotificationIOS.removeEventListener('registrationError', console.log);
    PushNotificationIOS.removeEventListener('notification', console.log);
  }

  receivedRemoteNotification(notification) {
    notification.finish(PushNotificationIOS.FetchResult.NewData);

    console.log(notification.getMessage());
    console.log(notification.getData());

    const message = notification.getMessage();
    const data = notification.getData();

    if (data && data.type === 'NEW_ORDER') {
      // todo: reducing size of chunk may improve performance
      const chunk = { message, data };
      const newArr = this.props.runnerNotification.concat(chunk);
      this.props.setRunnerNotification(newArr);
    }
  }

  render() {
    const initialRoute = loginNavigatorRoute();
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={renderScene}
        configureScene={configureScene}
      />
    );
  }
}

All.propTypes = {
  setRunnerNotification: PropTypes.func,
  runnerNotification: PropTypes.any
};

function mapStateToProps(state) {
  return {
    runnerNotification: state.pushNotification.runnerNotification
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRunnerNotification: (isRunner) => dispatch(setRunnerNotification(isRunner))
  };
};

const AllLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(All);

export default AllLayout;
