import React, { Component } from 'react';
import { View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { UserCard, MatchButton, NoMoreMatches } from '../components';
import { Colors } from '../constants';

import Api from '../services/data'
import Axios from "axios";


import * as Animatable from 'react-native-animatable';

import Users from '../../fakedata/users.json';

import Auth0 from 'react-native-auth0';




const auth0 = new Auth0({
  
   domain: 'uploadapp.eu.auth0.com', clientId: 'DKHHKIAl1xAXOmAfy36T0v3Dv92OAeRN' 
  });

class Explore extends Component {
  state = {
    userIndex: 0,
    users: []
  };
  

  getUsers = () => {
  
      // var config = {
      //   headers:  { authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik16ZEZRalEyTUVKRk1FTkJNVE5HUmpKR056QTNNVUl4T0RBMFJFSTRNRVZCTjBFelJrVTVOdyJ9.eyJpc3MiOiJodHRwczovL3VwbG9hZGFwcC5ldS5hdXRoMC5jb20vIiwic3ViIjoiMjR5dExWVWlXMkpEeG1adFRRanlBY3A4azNxd0M3a2JAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vdXBsb2FkYXBwLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTQ5Mjc5OTk1LCJleHAiOjE1NDkzNjYzOTUsImF6cCI6IjI0eXRMVlVpVzJKRHhtWnRUUWp5QWNwOGszcXdDN2tiIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.ExSLJNc3jI-pk0PKiWUUExiqGOy4N9nlK9C5EhUWfWNr8QM6eXmd_F9oweLWHknp-e71O9O9zwkkBL_utyZmt6Pnqr_GIjxMMKFz67yRge7Ux9TPHLcY1ltOr7hSB41EOCd5woY2hOLDu65mXZJsnzK-KPlQct8b0o4jC2Fx5vID6mG0a_8GXbN001LnjiNvbqf95VVKsgtEiC7odtdnNqonz3EitZLeG-UfivC799cxybcGxYHLMI9N1B5VsQlLzy-TGmjW9TH0AHv9h9x5ugnCj9dihgAmHeA1-tH-Dc4gDJaxMlXW2RatF8o2ucs5DsC023eOD46r8qDK8xOLEw" } 
      // };
      // Axios.get('https://uploadapp.eu.auth0.com/apA/v2/users', config)
      // .then((res)=>{ 
      //     this.setState({users: res.data})
      // })

      Api.getUsers((err, users) =>{
        
        this.setState({users})
      })
  
  }
  
  
    // auth0
    // .users(accessToken)
    // .getUser({id: "google-oauth2|114644417227228368616"})
    // .then(console.log)
    // .catch(console.error);
  

  componentWillMount =()=> {
    this.getUsers()
   
    /**
     * Save users so we're not calculating every render
     * We also want to filter out the current user
     * 
     * Btw, not double equal because it could be string or int
     */

    this.setState({
      users: Object.keys(Users)
        .filter(i => i != 1337)
        .map(i => Object.assign({ id: i }, Users[i]))
    });
  }
  

  _userLike = () => {
    // TODO: User like stuff
    this._nextUser();
  }

  _userDislike = () => {
    // TODO: User dislike stuff
    this._nextUser();
  }

  hgt = (user) => {
    this.props.navigation.navigate('UserProfile', { user });
  }

  _nextUser = () => this.setState({
    userIndex: this.state.userIndex + 1
  });

  render() {

    const { userIndex, users } = this.state;
    const user = users[userIndex];

    // Check if end of users
    if (userIndex >= users.length) {
      return (<NoMoreMatches />);
    }

    // Display users
    return (
      <View style={styles.container}>
        <UserCard
          onPress={() => this.hgt(user)}
          imageUrl={user.picture}
        />
        <View style={styles.buttons}>
          <MatchButton
            onPress={this._userDislike}
            icon="md-close"
            iconColor="#5B93FA"
          />
          <Animatable.Text
            animation="bounceIn"
            delay={750}
            duration={500}
            style={styles.name}
          >{user.nickname}
          </Animatable.Text>
          <MatchButton
            onPress={this._userLike}
            icon="ios-heart"
            iconColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    position: 'relative',
    backgroundColor: '#F8F8F9'
  },
  buttons: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24
  },
  name: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    backgroundColor: 'transparent',
    alignSelf: 'center'
  },
})

export default Explore;