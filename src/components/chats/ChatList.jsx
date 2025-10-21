import { SearchOutlined } from "@ant-design/icons";
import { Badge, Input } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageHeader from "./MessageHeader";
import SendMessage from "./SendMessage";
import { useGetChatListQuery } from "../../features/supportChat/supportChatApi";
import { getImageUrl } from "../../utils/getImageUrl";
import { useSocket } from "../../contexts/SocketContext";
import useAuth from "../../hooks/useAuth";

const ChatLayout = ({ children }) => {
  const { id } = useParams();
  console.log("ChatLayout ID from useParams:", id);

  const [searchTerm, setSearchTerm] = useState("");
  const router = useNavigate();
  const { data: chatListResponse, isLoading } = useGetChatListQuery(undefined, {
    // Reduce polling frequency to minimize unnecessary API calls
    pollingInterval: 30000, // Poll every 30 seconds instead of default
    refetchOnMountOrArgChange: true, // Only refetch when component mounts or arguments change
    refetchOnFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch on reconnect (important for chat)
  });
  const { socket, isConnected, on, off } = useSocket();
  const { userId } = useAuth();

  // State for real-time chat updates
  const [realTimeChatUpdates, setRealTimeChatUpdates] = useState({});

  // Socket.IO listener for real-time chat updates
  useEffect(() => {
    if (!socket || !isConnected || !chatListResponse?.data) return;

    // Listen to all chat events for real-time updates
    const chatIds = chatListResponse.data.map((chat) => chat.chat._id);
    console.log(`ChatList: Setting up listeners for ${chatIds.length} chats`);

    chatIds.forEach((chatId) => {
      const eventName = `new-support-message::${chatId}`;

      const handleNewMessage = (messageData) => {
        // Verify this message is for the correct chat
        if (messageData?.chatId !== chatId) {
          return;
        }

        console.log(`ChatList: Received message for chat ${chatId}`);

        // Format time for the new message
        const formatTime = (dateString) => {
          const now = new Date();
          const messageTime = new Date(dateString);
          const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

          if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
          } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hr`;
          } else {
            return `${Math.floor(diffInMinutes / 1440)} day`;
          }
        };

        // Update the chat list with new message info
        setRealTimeChatUpdates((prev) => ({
          ...prev,
          [chatId]: {
            lastMessage:
              messageData.message ||
              (messageData.image ? "Image" : "No message"),
            lastMessageTime: formatTime(messageData.createdAt),
            unreadCount:
              messageData.sender !== userId
                ? (prev[chatId]?.unreadCount || 0) + 1
                : 0,
            lastMessageSender: messageData.sender,
            updatedAt: new Date().toISOString(),
          },
        }));

        // Chat list state updated
      };

      on(eventName, handleNewMessage);
    });

    // Cleanup listeners when component unmounts or chat list changes
    return () => {
      chatIds.forEach((chatId) => {
        const eventName = `new-support-message::${chatId}`;
        off(eventName);
      });
    };
  }, [socket, isConnected, chatListResponse?.data, userId]);
  // Note: 'on' and 'off' are stable functions from the socket context and don't need to be dependencies

  // Transform API data to match the existing structure
  const contacts =
    chatListResponse?.data
      ?.filter((chatItem) => {
        // Filter out chats with no participants
        return (
          chatItem.chat.participants && chatItem.chat.participants.length > 0
        );
      })
      ?.map((chatItem) => {
        const participant = chatItem.chat.participants[0];
        const message = chatItem.message;

        // Format time
        const formatTime = (dateString) => {
          const now = new Date();
          const messageTime = new Date(dateString);
          const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

          if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
          } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hr`;
          } else {
            return `${Math.floor(diffInMinutes / 1440)} day`;
          }
        };

        // Handle cases where participant might be undefined or empty
        const participantName = participant?.fullName || "Unknown User";
        const participantRole = participant?.role || "unknown";
        const participantProfile = participant?.profile;

        // Participant data processed

        // Get real-time updates for this chat
        const realTimeUpdate = realTimeChatUpdates[chatItem.chat._id];

        return {
          id: chatItem.chat._id,
          name: participantName,
          message:
            realTimeUpdate?.lastMessage ||
            message?.message ||
            (message?.image ? "Image" : "No message"),
          time:
            realTimeUpdate?.lastMessageTime ||
            formatTime(message?.createdAt || chatItem.chat.createdAt),
          type:
            participantRole === "freelancer"
              ? "Freelancer"
              : participantRole === "admin"
              ? "Admin"
              : participantRole === "client"
              ? "Client"
              : "Unknown",
          avatar:
            getImageUrl(participantProfile) ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
          online: true, // You can implement online status logic later
          unread:
            (realTimeUpdate?.unreadCount || chatItem.unreadMessageCount) > 0,
          unreadCount:
            realTimeUpdate?.unreadCount || chatItem.unreadMessageCount,
          isRealtime: !!realTimeUpdate, // Mark if this chat has real-time updates
        };
      }) || [];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    console.log(`Navigating to chat: ${chatId}`);

    // Clear unread count for this chat when selected
    setRealTimeChatUpdates((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        unreadCount: 0,
      },
    }));

    router(`/support/${chatId}`);
  };

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <div className="w-3/12 bg-white border flex flex-col h-[800px] shadow-lg border-gray-200 rounded-lg ">
        <div className="flex items-center justify-between p-4 border-b border-gray-400">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
            <Badge
              count={contacts.reduce(
                (total, contact) => total + (contact.unreadCount || 0),
                0
              )}
              className="bg-blue-500 pl-3"
            >
              <span className="w-2 h-2"></span>
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 pb-2">
          <Input
            placeholder="Search Client/Freelancer"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded-lg border-gray-200"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Messages List */}
        <div className="flex flex-col gap-3 px-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading chats...</div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">No chats found</div>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleChatClick(contact.id)}
                className={`flex items-center py-3 px-2 border shadow-xl  cursor-pointer rounded-lg ${
                  id === String(contact.id)
                    ? "bg-blue-500 text-white "
                    : `border-blue-500 bg-white `
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={contact.avatar}
                    className="border-2 w-12 rounded-lg h-12 border-white shadow-sm"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          contact.unread || id === String(contact.id)
                            ? "text-gray-900"
                            : "text-gray-800"
                        }`}
                      >
                        {contact.name}
                      </span>
                      {contact.online && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {contact.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          contact.unread || id === String(contact.id)
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {contact.message}
                      </p>
                      {contact.isRealtime && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
                      )}
                    </div>
                    {contact.type && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
                          contact.type === "Client"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {contact.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Content */}
      <main className="flex-1 flex flex-col  shadow-lg rounded-lg border border-gray-200">
        {!id ? (
          <div className=" flex justify-center items-center h-[400px] text-2xl font-bold">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Welcome to Our Support
              </h2>
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        ) : (
          <div>
            <MessageHeader />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">{children}</div>

            {/* Message Input */}
            <footer className="p-4 border-t bg-white">
              <SendMessage
                id={id}
                onSend={(msg) => children.props.handleNewMessage?.(msg)}
              />
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatLayout;
