import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { api } from '../../services/api';
import { io } from 'socket.io-client';

import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagesQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', (newMessage) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last3');
      setCurrentMessages(messagesResponse.data);
    }

    fetchMessages();
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessages(prevState => [messagesQueue[0], prevState[1], prevState[2]])
        messagesQueue.shift()
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const message = {
    id: '1',
    text: 'mensagem',
    user: {
      name: 'johnny',
      avatar_url: 'https://github.com/wevanyjohnny1.png'
    }
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map((message) => <Message key={message.id} data={message} />)}

    </ScrollView>
  )
}
