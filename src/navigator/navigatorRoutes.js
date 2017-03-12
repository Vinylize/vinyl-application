import { Navigator } from 'react-native';
import Home from './../components/home';
import Login from './../components/login';
import Register from './../components/register';
import Ship from './../components/ship';
import PhoneVerification from './../components/phoneVerification';

const sceneConfig = Navigator.SceneConfigs.FloatFromBottom;

export function homeNavigatorRoute() {
  return {
    Component: Home,
    sceneConfig
  };
}

export function loginNavigatorRoute() {
  return {
    Component: Login,
    sceneConfig
  };
}

export function registerNavigatorRoute() {
  return {
    Component: Register
  };
}

export function shipNavigatorRoute() {
  return {
    Component: Ship,
    sceneConfig
  };
}

export function phoneVerificationNavigatorRoute() {
  return {
    Component: PhoneVerification,
    sceneConfig
  };
}
