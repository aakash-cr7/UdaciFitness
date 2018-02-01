import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { 
  getMetricMetaInfo, 
  timeToString, 
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification
} from '../utils/helpers';
import UdacitySlider from './UdacitySlider';
import UdacitySteppers from './UdacitySteppers';
import TextButton from './TextButton';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { white, purple } from '../utils/colors';
import { NavigationActions } from 'react-navigation';

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
    state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry',  // go back from
    }))
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    // state => current state
    this.setState((state) => {
      const count = state[metric] + step;

      // new returned state will be merged in to the original one
      return {
        ...state,
        [metric]: count > max ? max : count
      }
    });
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    // state => current state
    this.setState((state) => {
      const count = state[metric] - step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    });
  }

  slide = (metric, value) => {
    this.setState({
      [metric]: value
    });
  }

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // update redux
    this.props.dispatch(addEntry({
      [key]: entry
    }));

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    })
    // navigate to home
    this.toHome();

    // save to 'DB'
    submitEntry({ key, entry });

    // clear local notification
    // if user inputs there stats for current day, clear local notification and set up a local notification for tommorrow
    clearLocalNotification()
      .then(setLocalNotification)
  }

  reset = () => {
    const key = timeToString();

    // update redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }));

    // route to home
    this.toHome();

    // save tp DB
    removeEntry(key);
  }

  render () {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={ Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy' }
            size={100}
          />
          <Text> You already logged your information for today</Text>
          <TextButton onPress={this.reset} style={{padding: 10}}>
            Reset
          </TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <UdacitySlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdacitySteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}

        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2,
    height: 45,
    paddingLeft: 30,
    paddingRight: 30,
    marginRight: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  }
});

function mapStateToProps (state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry); 
