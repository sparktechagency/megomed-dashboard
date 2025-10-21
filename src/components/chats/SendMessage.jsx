import {
  PaperClipOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, message as antMessage } from "antd";
import { useState, useRef } from "react";
import { useCreateSupportChatMutation } from "../../features/supportChat/supportChatApi";

const SendMessage = ({ id, onSend }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [createSupportChat, { isLoading }] = useCreateSupportChatMutation();
  const fileInputRef = useRef(null);

  console.log("=== SENDMESSAGE COMPONENT ===");
  console.log("Received Chat ID from props:", id);
  console.log("=============================");

  // Validate chat ID
  if (!id) {
    console.error("ERROR: No chat ID provided to SendMessage component!");
  }
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        antMessage.error("File size must be less than 10MB");
        return;
      }

      // Check file type (images only)
      if (!file.type.startsWith("image/")) {
        antMessage.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) {
      antMessage.warning("Please enter a message or select a file");
      return;
    }

    try {
      console.log("=== SENDING MESSAGE ===");
      console.log("Using Chat ID:", id);

      if (!id) {
        antMessage.error("Cannot send message: No chat selected");
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Add chatId
      formData.append("chatId", id);
      console.log("Added chatId to FormData:", id);

      // Add message if provided
      if (message.trim()) {
        formData.append("message", message.trim());
        console.log("Added message to FormData:", message.trim());
      }

      // Add image if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
        console.log("Added image to FormData:", selectedFile.name);
      }

      console.log("Sending message to chat ID:", id);
      // Call the API
      await createSupportChat(formData).unwrap();

      // Call the onSend callback for immediate UI update
      if (onSend) {
        onSend(message.trim() || (selectedFile ? "Image" : ""));
      }

      // Reset form
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      antMessage.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      antMessage.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {/* File Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PaperClipOutlined className="text-blue-500" />
            <span className="text-sm text-blue-700 truncate max-w-xs">
              {selectedFile.name}
            </span>
            <span className="text-xs text-blue-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={removeSelectedFile}
            className="text-blue-500 hover:text-blue-700"
          />
        </div>
      )}

      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 relative">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder={
                selectedFile ? "Add a message (optional)" : "Type a message"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent text-gray-700 text-base placeholder-gray-400 outline-none border-none"
            />
            <PaperClipOutlined
              className="text-gray-500 text-xl cursor-pointer hover:text-gray-700 transition-colors ml-4"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
        </div>

        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<SendOutlined className="text-white text-lg" />}
          onClick={handleSend}
          loading={isLoading}
          className="bg-blue-500 hover:bg-blue-600 border-none shadow-md flex items-center justify-center"
          disabled={!message.trim() && !selectedFile}
        />
      </div>
    </div>
  );
};

export default SendMessage;
