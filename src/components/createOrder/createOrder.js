import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  View
} from 'react-native';

// [start redux actions]
import { setNode } from './../../actions/createOrderActions';
import {
  setBusyOnWaitingNewRunner,
  animateCardAppear
} from './../../actions/componentsActions/homeActions';
// [end redux actions]

import Header from './header/header';
import Overview from './bodies/overview';
import FindStore from './bodies/findStore';
import FindBrandV2 from './bodies/findBrandV2';
import AddProduct from './bodies/addProduct';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
};

class CreateOrder extends Component {
  constructor() {
    super();
    this.state = {
      step: 0,
      brandList: undefined,
      selectedBrand: undefined,
      brandListDataSource: [
        ['편의점', '음식점', '수퍼'],
        ['약국', '113', 'asdf'],
        ['Stationery shop', 'others', 'yangwoo'],
        ['events', 'hooka']
      ]
    };
    this.handleBrandBtn = this.handleBrandBtn.bind(this);
    this.handleNextBtn = this.handleNextBtn.bind(this);
    this.handleCreateOrderDone = this.handleCreateOrderDone.bind(this);
  }

  handleHeaderBackBtn() {
    if (this.state.step === 0) {
      this.props.navigator.pop();
    } else {
      this.setState({step: this.state.step - 1});
    }
  }

  handleBrandBtn(rowData, i) {
    this.setState({
      step: this.state.step + 1,
      brandList: i,
      selectedBrand: rowData
    });
  }

  handleNextBtn() {
    const { step } = this.state;
    this.setState({step: step + 1});
  }

  handleCreateOrderDone() {
    this.props.navigator.pop();
    animateCardAppear();
    /**
     * this disables native API that returns coordinate of the map center
     * todo: implement this in Android
     */
    // if (Platform.OS === 'ios') {
    //   vmm.disableDidChangeCameraPosition();
    // }
    this.props.setBusyOnWaitingNewRunner(true);
  }

  renderBody() {
    const { step, brandList, brandListDataSource, selectedBrand } = this.state;
    if (step === 0) {
      return (<FindBrandV2 handleBrandBtn={this.handleBrandBtn}/>);
    } else if (step === 1) {
      return (
        <FindStore
          brandList={brandListDataSource[brandList]}
          selectedBrand={selectedBrand}
          handleNextBtn={this.handleNextBtn}
          coordinate={this.props.mapCameraPos}
        />
      );
    } else if (step === 2) {
      return (
        <AddProduct/>
      );
    } else if (step === 3) {
      return (
        <Overview handleCreateOrderDone={this.handleCreateOrderDone}/>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        {(this.state.step === 2) ?
          <Header
            back={this.handleHeaderBackBtn.bind(this)}
            next={this.handleNextBtn.bind(this)}
          />
          :
          <Header back={this.handleHeaderBackBtn.bind(this)}/>
        }
        {this.renderBody()}
      </View>
    );
  }
}

CreateOrder.propTypes = {
  navigator: PropTypes.any,
  mapCameraPos: PropTypes.object,
  setNode: PropTypes.func,
  node: PropTypes.array,

  // reducers/components/home
  setBusyOnWaitingNewRunner: PropTypes.func
};

function mapStateToProps(state) {
  return {
    node: state.createOrder.node,
    mapCameraPos: state.home.mapCameraPos
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNode: (node) => dispatch(setNode(node)),
    setBusyOnWaitingNewRunner: (busyOnWaitingNewRunner) => dispatch(setBusyOnWaitingNewRunner(busyOnWaitingNewRunner))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);
