import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Text,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { Button } from '../components';
import { Colors } from '../constants';

import Users from '../../fakedata/users.json';

class Profile extends Component {

  state = {user:null}
  componentDidMount = () =>{
    AsyncStorage.getItem('userTokenDecoded', (err, userData) => {
      if(userData){
        this.setState({user: JSON.parse(userData)})
      }
    })
   
  
  }
  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


  
  render() {

    let user = this.state.user
    return (
      this.state.user?
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user.picture }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user.name}
          </Text>
        </View>
        <Button
          style={{ marginTop: 8 }}
          onPress={this._logout}
        >
          Logout
        </Button>
      </View> : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F9',
    padding: 8
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0.5, height: 0.5 },
    alignItems: 'center'
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45
  },
  name: {
    color: Colors.textColor,
    fontSize: 28,
    fontWeight: '700'
  }
})

export default Profile;