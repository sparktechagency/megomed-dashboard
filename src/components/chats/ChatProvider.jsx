const ChatProvider = ({ children }) => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Larry',
      message: 'WoofWoof!',
      time: '25m',
      type: 'Client',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      online: true,
      unread: true,
      messages: [
        { id: 1, text: 'Hey there! How are you?', sender: 'them', timestamp: Date.now() - 3600000 },
        { id: 2, text: 'I\'m doing great! Thanks for asking.', sender: 'me', timestamp: Date.now() - 3500000 },
        { id: 3, text: 'WoofWoof!', sender: 'them', timestamp: Date.now() - 1500000 }
      ]
    },
    {
      id: 2,
      name: 'Max',
      message: 'Hello',
      time: '40m',
      type: 'Freelancer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      online: true,
      unread: false,
      messages: [
        { id: 1, text: 'Hello', sender: 'them', timestamp: Date.now() - 2400000 }
      ]
    },
    {
      id: 3,
      name: 'Lemon',
      message: 'Where are You?',
      time: '1 hr',
      type: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      online: false,
      unread: false,
      messages: [
        { id: 1, text: 'Hey!', sender: 'them', timestamp: Date.now() - 7200000 },
        { id: 2, text: 'Where are You?', sender: 'them', timestamp: Date.now() - 3600000 }
      ]
    },
    {
      id: 4,
      name: 'Katy',
      message: 'Hi!',
      time: '3 hr',
      type: '',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      online: true,
      unread: false,
      messages: [
        { id: 1, text: 'Hi!', sender: 'them', timestamp: Date.now() - 10800000 }
      ]
    },
    {
      id: 5,
      name: 'Chedder',
      message: 'Yes',
      time: '1 day',
      type: '',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
      online: false,
      unread: false,
      messages: [
        { id: 1, text: 'Can you help me?', sender: 'them', timestamp: Date.now() - 86400000 },
        { id: 2, text: 'Yes', sender: 'them', timestamp: Date.now() - 86400000 + 300000 }
      ]
    },
    {
      id: 6,
      name: 'Daisy',
      message: 'Sure',
      time: '2 day',
      type: '',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      online: true,
      unread: false,
      messages: [
        { id: 1, text: 'Are you available tomorrow?', sender: 'them', timestamp: Date.now() - 172800000 },
        { id: 2, text: 'Sure', sender: 'them', timestamp: Date.now() - 172800000 + 600000 }
      ]
    }
  ]);

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChat = contacts.find(contact => contact.id === selectedChatId);

  const addMessage = (chatId, message) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === chatId) {
        const newMessage = {
          id: Date.now(),
          text: message,
          sender: 'me',
          timestamp: Date.now()
        };
        return {
          ...contact,
          messages: [...contact.messages, newMessage],
          message: message,
          time: 'now'
        };
      }
      return contact;
    }));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChatContext.Provider value={{
      contacts: filteredContacts,
      selectedChat,
      selectedChatId,
      setSelectedChatId,
      addMessage,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;