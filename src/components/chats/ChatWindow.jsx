import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetChatMessagesbyChatIdQuery } from "../../features/supportChat/supportChatApi";
import { getImageUrl } from "../../utils/getImageUrl";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "../../contexts/SocketContext";

export default function MessageInterface() {
  const { id } = useParams();
  const { userId, userRole, userEmail, userFullName } = useAuth();
  const { socket, isConnected, on, off } = useSocket();
  const currentUserId = userId;

  console.log("Decoded user info:", {
    userId,
    userRole,
    userEmail,
    userFullName,
  });

  console.log("id----->", id);
  console.log("currentUserId----->", currentUserId);
  console.log("Socket connected:", isConnected);

  const {
    data: chatMessagesResponse,
    isLoading,
    error,
  } = useGetChatMessagesbyChatIdQuery(id, {
    skip: !id, // Skip the query if no ID is provided
    // Optimize API calls
    refetchOnMountOrArgChange: true, // Only refetch when component mounts or chat ID changes
    refetchOnFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on reconnect (we use socket.io instead)
    // Cache messages for 5 minutes - rely on socket.io for real-time updates
    pollingInterval: 0, // Disable polling since we use socket.io
  });

  // Only log errors to reduce unnecessary console output
  if (error) {
    console.error("Error fetching chat messages:", error);
  }

  const messages = useMemo(() => {
    return (
      chatMessagesResponse?.data?.resultAll?.map((message) => {
        // Format time
        const formatTime = (dateString) => {
          const now = new Date();
          const messageTime = new Date(dateString);
          const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

          if (diffInMinutes < 1) {
            return "just now";
          } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
          } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hr ago`;
          } else {
            return `${Math.floor(diffInMinutes / 1440)} day ago`;
          }
        };

        // Determine if this message is from the current user
        const isFromCurrentUser = message.sender === currentUserId;

        return {
          id: message._id,
          text: message.message || (message.image ? "Image" : "No message"),
          sender: isFromCurrentUser ? "me" : "them",
          time: formatTime(message.createdAt),
          avatar: "👤",
          image: message.image,
          seen: message.seen,
          senderId: message.sender, // Keep original sender ID for debugging
          createdAt: message.createdAt,
        };
      }) || []
    );
  }, [chatMessagesResponse?.data?.resultAll, currentUserId]);

  const [localMessages, setLocalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [forceRender, setForceRender] = useState(0); // Force re-render counter
  const [processedMessageIds, setProcessedMessageIds] = useState(new Set()); // Track processed messages
  const messagesEndRef = useRef(null);

  // Scroll to bottom function (since newest messages are at the bottom)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Clear local messages when chat ID changes
  useEffect(() => {
    setLocalMessages([]);
    setProcessedMessageIds(new Set());
    console.log("Cleared local messages and processed IDs for new chat:", id);
  }, [id]);

  // Socket.IO real-time message listener - ONLY for the current chat
  useEffect(() => {
    if (!socket || !id || !isConnected) return;

    const eventName = `new-support-message::${id}`;
    console.log(`Socket: Listening for messages on ${eventName}`);

    const handleNewMessage = (messageData) => {
      // Verify this message is for the current chat
      if (messageData?.chatId !== id) {
        // Skip messages not meant for this chat
        return;
      }

      console.log(`Socket: Received new message for chat ${id}:`, messageData);

      // Check if we've already processed this message
      const messageId =
        messageData._id || `socket-${Date.now()}-${Math.random()}`;
      if (processedMessageIds.has(messageId)) {
        console.log(`Socket: Message ${messageId} already processed, skipping`);
        return;
      }

      // Format time for the new message
      const formatTime = (dateString) => {
        const now = new Date();
        const messageTime = new Date(dateString);
        const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

        if (diffInMinutes < 1) {
          return "just now";
        } else if (diffInMinutes < 60) {
          return `${diffInMinutes} min ago`;
        } else if (diffInMinutes < 1440) {
          return `${Math.floor(diffInMinutes / 60)} hr ago`;
        } else {
          return `${Math.floor(diffInMinutes / 1440)} day ago`;
        }
      };

      // Determine if this message is from the current user
      const isFromCurrentUser = messageData.sender === currentUserId;

      const newMessage = {
        id: messageId, // Use the tracked message ID
        text:
          messageData.message || (messageData.image ? "Image" : "No message"),
        sender: isFromCurrentUser ? "me" : "them",
        time: formatTime(messageData.createdAt),
        avatar: "👤",
        image: messageData.image,
        seen: messageData.seen,
        senderId: messageData.sender,
        isRealtime: true, // Mark as real-time message
        originalCreatedAt: messageData.createdAt, // Store original timestamp for sorting
        createdAt: messageData.createdAt || new Date().toISOString(),
      };

      console.log(`Socket: Adding new message to local state:`, newMessage);

      // Add the new message to local messages with immediate state update
      setLocalMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some((msg) => msg.id === newMessage.id);
        if (exists) {
          console.log(
            `Socket: Message ${newMessage.id} already exists, skipping`
          );
          return prev;
        }

        // Also check if this message exists in the API messages to avoid duplicates
        const existsInApi = messages.some((msg) => msg.id === newMessage.id);
        if (existsInApi) {
          console.log(
            `Socket: Message ${newMessage.id} already exists in API data, skipping`
          );
          return prev;
        }

        console.log(
          `Socket: Adding message to local state, previous count: ${prev.length}`
        );
        const updated = [...prev, newMessage];
        console.log(`Socket: New local messages count: ${updated.length}`);

        // Mark this message as processed
        setProcessedMessageIds((prev) => new Set([...prev, messageId]));

        // Force re-render for immediate UI update
        setForceRender((prev) => prev + 1);

        return updated;
      });
    };

    // Listen to the specific chat event
    on(eventName, handleNewMessage);

    // Cleanup listener on unmount or when chat ID changes
    return () => {
      console.log(`Socket: Cleaning up listener for ${eventName}`);
      off(eventName, handleNewMessage);
    };
  }, [
    socket,
    id,
    isConnected,
    currentUserId,
    on,
    off,
    messages,
    processedMessageIds,
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const timestamp = Date.now();
      const message = {
        id: `local-${timestamp}`,
        text: newMessage,
        sender: "me",
        time: "just now",
        createdAt: new Date(timestamp).toISOString(), // Add proper timestamp
      };
      setLocalMessages([...localMessages, message]);
      setNewMessage("");
    }
  };

  // Helper function to get message timestamp for consistent sorting
  const getMessageTimestamp = (message) => {
    if (message?.originalCreatedAt) {
      return new Date(message.originalCreatedAt).getTime();
    }
    if (message?.createdAt) {
      return new Date(message.createdAt).getTime();
    }
    if (message?.id && String(message.id).startsWith("local-")) {
      const maybeTs = parseInt(String(message.id).split("-")[1]);
      if (!Number.isNaN(maybeTs)) return maybeTs;
    }
    return 0;
  };

  // Merge, de-duplicate by id (prefer real-time data), then sort chronologically
  const mergedMessages = [...messages, ...localMessages];
  const seenIds = new Set();
  const dedupedMessages = mergedMessages.filter((msg) => {
    if (!msg?.id) return true;
    if (seenIds.has(msg.id)) {
      // Skip duplicate - we've already seen this message
      return false;
    }
    seenIds.add(msg.id);
    return true;
  });

  const allMessages = dedupedMessages.sort((a, b) => {
    return getMessageTimestamp(a) - getMessageTimestamp(b); // Ascending order (oldest first, newest last)
  });

  // Debug logging for message updates
  console.log(
    `Messages update: API=${messages.length}, Local=${localMessages.length}, Total=${allMessages.length}`
  );

  // Scroll to bottom when messages change (since newest messages are at the bottom)
  useEffect(() => {
    // Immediate scroll for real-time messages, slight delay for others
    const hasRealtimeMessages = allMessages.some((msg) => msg.isRealtime);
    const timeout = hasRealtimeMessages ? 0 : 100; // Immediate for real-time, slight delay for others

    const timeoutId = setTimeout(() => {
      scrollToBottom();
      console.log(
        `Scrolling to bottom after messages update (realtime: ${hasRealtimeMessages})`
      );
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [allMessages.length, allMessages, forceRender]); // Depend on length, content, and force render for real-time updates

  // Fallback test messages if no API data
  const testMessages = [
    {
      id: "test-1",
      text: "Test message from API",
      sender: "them",
      time: "2 min ago",
      avatar: "👤",
    },
    {
      id: "test-2",
      text: "Another test message",
      sender: "them",
      time: "1 min ago",
      avatar: "👤",
    },
  ];

  // Use test messages only if no real messages and not loading (but not on error)
  const displayMessages =
    !isLoading && allMessages.length === 0 ? testMessages : allMessages;
  // Display message count for minimal debugging
  console.log(`Displaying ${displayMessages.length} messages`);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className=" flex flex-col h-[600px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : error && !chatMessagesResponse ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-red-500">
              Error loading messages:{" "}
              {typeof error === "string"
                ? error
                : error?.message || "Unknown error"}
            </div>
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">No messages yet</div>
          </div>
        ) : (
          displayMessages.map((message, index) => {
            // Safety check for message object
            if (!message || typeof message !== "object") {
              console.warn("Invalid message object:", message);
              return null;
            }

            const showAvatar =
              message.sender === "them" &&
              (index === 0 ||
                displayMessages[index - 1]?.sender !== "them" ||
                displayMessages[index - 1]?.time !== message.time);

            const isLastInGroup =
              message.sender === "them" &&
              (index === displayMessages.length - 1 ||
                displayMessages[index + 1]?.sender !== "them" ||
                displayMessages[index + 1]?.time !== message.time);

            return (
              <div
                key={message.id || `message-${index}`}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "them" && (
                  <div className="w-8 h-8 mr-2 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                        👤
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`max-w-xs ${
                    message.sender === "me" ? "ml-auto" : ""
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === "me"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                    }`}
                  >
                    {message.image ? (
                      <div className="max-w-xs">
                        <img
                          src={getImageUrl(message.image)}
                          alt="Message image"
                          className="rounded-lg max-w-full h-auto"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                        <p className="text-sm hidden">Image failed to load</p>
                      </div>
                    ) : (
                      <p className="text-sm">
                        {message.text || "No message content"}
                      </p>
                    )}
                  </div>

                  {isLastInGroup || message.sender === "me" ? (
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender === "me"
                          ? "text-right"
                          : "text-left ml-1"
                      }`}
                    >
                      {message.time || "Unknown time"}
                      {message.sender === "me" && (
                        <span className="ml-1">✓</span>
                      )}
                    </div>
                  ) : null}
                </div>

                {message.sender === "me" && (
                  <div className="w-8 h-8 ml-2 border border-blue-500 bg-blue-100 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            );
          })
        )}
        {/* Scroll target (at the bottom for newest messages) */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
