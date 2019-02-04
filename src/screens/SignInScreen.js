// import React from 'react';

// import {
//     Button,
//     AsyncStorage,
//     StyleSheet,
//     View,
//   } from 'react-native';

// class SignInScreen extends React.Component {
//     static navigationOptions = {
//       title: 'Please sign in',
//     };
  
//     render() {
//       return (
//         <View style={styles.container}>
//           <Button title="Sign in!" onPress={this._signInAsync} />
//         </View>
//       );
//     }
  
//     _signInAsync = async () => {
//       await AsyncStorage.setItem('userToken', 'abc');
//       this.props.navigation.navigate('Explore');
//     };
//   }
  
// const styles = StyleSheet.create({
//     container: {
//       borderRadius: 4,
//       borderWidth: 0.5,
//       borderColor: '#d6d7da',
//     },
//     title: {
//       fontSize: 19,
//       fontWeight: 'bold',
//     },
//     activeTitle: {
//       color: 'red',
//     },
//   });
  


import { AuthSession } from 'expo';
import React from 'react';
import {
  AsyncStorage,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import jwtDecoder from 'jwt-decode';

/*
  You need to swap out the Auth0 client id and domain with
  the one from your Auth0 client.
  In your Auth0 clent, you need to also add a url to your authorized redirect urls.
  For this application, I added https://auth.expo.io/@community/auth0-example because
  I am signed in as the "community" account on Expo and the slug for this app is "auth0-example".
  You can open this app in the Expo client and check your logs for "Redirect URL (add this to Auth0)"
  to see what URL to add if the above is confusing.
  If you use Facebook through Auth0, be sure to follow this guide: https://auth0.com/docs/connections/social/facebook
*/

const auth0ClientId = 'DKHHKIAl1xAXOmAfy36T0v3Dv92OAeRN';
const auth0Domain = 'https://uploadapp.eu.auth0.com';

  /**
   * Converts an object to a query string.
   */
  function randomString(length) {
    var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
    result = ''

    while (length > 0) {
        var bytes = new Uint8Array(16);
        var random = window.crypto.getRandomValues(bytes);

        random.forEach(function(c) {
            if (length == 0) {
                return;
            }
            if (c < charset.length) {
                result += charset[c];
                length--;
            }
        });
    }
    return result;
}
function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export default class SignInScreen extends React.Component {
  state = {
    username: undefined,
  };



  _loginWithAuth0 = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL (add this to Auth0): ${redirectUrl}`);
  
    const result = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize` + toQueryString({
        client_id: auth0ClientId,
        response_type: 'token id_token',
        scope: 'openid profile  read:users read:current_user read:user_idp_tokens',
        audience: 'https://uploadapp.eu.auth0.com/api/v2/',
        nonce: "E-ok41-OA9bP0DUB",
        redirect_uri: redirectUrl,
      }),
    });

    console.log(result);
    if (result.type === 'success') {
      this.handleParams(result.params);
    }
  }


  handleParams = (responseObj) => {
    if (responseObj.error) {
      Alert.alert('Error', responseObj.error_description
        || 'something went wrong while logging in');
      return;
    }
    const encodedToken = responseObj.id_token;
    const decodedToken = jwtDecoder(encodedToken);
    console.log("decoded:  ",decodedToken)
    AsyncStorage.setItem('userTokenDecoded',JSON.stringify(decodedToken));
    AsyncStorage.setItem('userTokenEncoded',JSON.stringify(encodedToken));

    AsyncStorage.setItem('accessToken',responseObj.access_token);

    this.props.navigation.navigate('Explore');
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.username !== undefined ?
          <Text style={styles.title}>Hi {this.state.username}!</Text> :
          <View>
            <Button title="Login" onPress={this._loginWithAuth0} />
          </View>
        }
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
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
});