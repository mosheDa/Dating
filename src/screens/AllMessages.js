import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

import { ChatItem } from '../components';

// Fake data
import Messages from '../../fakedata/messages.json';
// import Users from '../../fakedata/users.json';
import Api from '../services/data'


class AllMessages extends Component {
  state = {users:[], messages: []}
  componentWillMount = () =>{
    Api.getUsers((err, users) =>{
      this.setState({users,  messages:Messages})
    })
  }
  _chatItemPressed = (chatId) => {
    this.props.navigation.navigate(
      'Chat',
      { id: chatId }
    );
  }

  _renderChatItem = ({ item }) => {
    const id = item.id;
    const message = item.messages[0];
    const user = this.state.users[item.user];

    return (
      <ChatItem
        user={user}
        text={message.text}
        date="2 days ago"
        onPress={() => this._chatItemPressed(id)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={this.state.messages.map(item =>
            Object.assign({ key: item.id }, item)
          )}
          renderItem={this._renderChatItem}
        />
      </View>
    );
  }
}

export default AllMessages;