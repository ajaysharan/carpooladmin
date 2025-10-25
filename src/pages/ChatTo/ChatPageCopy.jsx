// import React, { useEffect, useRef, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {  FaFile, FaPaperPlane, FaSearch } from "react-icons/fa";
// import { getSocket } from "../../services/socket";
// import { useSelector } from "react-redux";

// const ChatPageCopy = () => {
//   const admin = useSelector((state) => state.admin);
//   const fileInput = useRef(null);
//   const [users, setUsers] = useState([]);
//   const [activeContact, setActiveContact] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     const socket = getSocket();

//     if (socket) {
//       socket.on("users", (usersList) => {
//         setUsers(usersList.filter((u) => u._id !== admin._id));
//       });

//       socket.on("onlineUsers", (online) => {
//         setOnlineUsers(online);
//       });

//       socket.on("newMessage", (message) => {
//         setMessages((prev) => [...prev, message]);
//       });

//       socket.on("chatHistory", (history) => {
//         setMessages(history);
//       });

//       socket.on("typing", ({ from }) => {
//         console.log("Typing from:", from, "Active Contact:", activeContact?._id);
//         if (from === activeContact?._id) {
//           setIsTyping(true);
//           clearTimeout(typingTimeoutRef.current);
//           typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
//         }
//       });

//       socket.on("messageSeenAck", ({ senderId }) => {
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             msg.receiverId === senderId ? { ...msg, isRead: true } : msg
//           )
//         );
//       });

//       socket.emit("getUsers");
//     }

//     return () => {
//       if (socket) {
//         socket.off("users");
//         socket.off("onlineUsers");
//         socket.off("newMessage");
//         socket.off("chatHistory");
//         socket.off("typing");
//         socket.off("messageSeenAck");
//       }
//     };
//   }, [admin?._id, activeContact?._id]);

//   const handelOpenFIle = () => {
//     fileInput.current.click();
//   }

//   useEffect(() => {
//     const socket = getSocket();
//     if (socket && activeContact && messages.length > 0) {
//       socket.emit("messageSeen", {
//         senderId: activeContact._id,
//         receiverId: admin._id,
//       });
//     }
//     scrollToBottom();
//   }, [messages, activeContact, admin._id]);

//   const handleSelectContact = (user) => {
//     setActiveContact(user);
//     setMessages([]);
//     const socket = getSocket();
//     socket.emit("getChatHistory", {
//       userId: admin._id,
//       otherUserId: user._id,
//     });
//   };

//   const handleSendMessage = () => {
//     const text = newMessage.trim();
//     if (!text || !activeContact) return;

//     const message = {
//       senderId: admin._id,
//       receiverId: activeContact._id,
//       content: text,
//       date_time: new Date(),
//       isRead: false,
//     };
//     const socket = getSocket();
//     socket.emit("sendMessage", message);
//       setNewMessage("");
//   };

//   const handleTyping = () => {
//     const socket = getSocket();
//     if (socket && activeContact?._id) {
//       socket.emit("typing", { to: activeContact._id });
//     }
//   };
//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // useEffect(() => {

//   // }, [messages]);

//   const formatTime = (date) =>
//     new Date(date).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   const renderMessage = (msg, i) => {
//     const isMe = msg.senderId === admin._id;
//     return (
//       <div
//         key={i}
//         className={`max-w-md px-4 py-3 rounded-lg text-sm shadow-md relative transition-all duration-300 ${
//           isMe
//             ? "bg-blue-600 text-white ml-auto animate-slide-in-right"
//             : "bg-[#3C4165] text-white animate-slide-in-left"
//         }`}
//       >
//         <div>{msg.content}</div>
//         <div className="text-xs mt-1 text-right text-gray-300">
//           {isMe ? "You" : activeContact?.name} • {formatTime(msg.date_time)}
//         </div>
//         {isMe && (
//           <div className="text-[10px] text-right text-gray-400 mt-1">
//             {msg.isRead ? "✓✓ Read" : "✓ Sent"}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="h-screen flex bg-[#2B2F4E] text-white font-sans">
//           {/* Sidebar */}
//           <aside className="w-1/4 bg-[#1F2340] p-4 flex flex-col">
//             <h2 className="text-lg font-bold mb-4">Messages</h2>
//             <div className="flex items-center bg-[#2B2F4E] p-2 rounded mb-4">
//               <FaSearch className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search Message"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent focus:outline-none text-sm w-full placeholder:text-gray-400"
//               />
//             </div>
//             <div className="flex flex-col gap-3 overflow-y-auto">
//               {users.map((user) => {
//                 const isOnline = onlineUsers.includes(user._id);
//                 return (
//                   <div
//                     key={user._id}
//                     onClick={() => handleSelectContact(user)}
//                     className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
//                       activeContact?._id === user._id
//                         ? "bg-[#2B2F4E]"
//                         : "hover:bg-[#2B2F4E]"
//                     }`}
//                   >
//                     <div className="relative">
//                       <img
//                         src={user.image || "https://i.pravatar.cc/150"}
//                         alt={user.name}
//                         className="w-10 h-10 rounded-full bg-white"
//                       />
//                       {isOnline && (
//                         <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#1F2340] rounded-full"></span>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-semibold">{user.name}</div>
//                       {isOnline && (
//                         <div className="text-xs text-green-400">Active Now</div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </aside>

//           {/* Chat Window */}
//           <main className="flex-1 flex flex-col">
//             {activeContact ? (
//               <>
//                 <header className="bg-[#1F2340] p-4 flex items-center gap-4 border-b border-[#2B2F4E]">
//                   <img
//                     src={activeContact.image || "https://i.pravatar.cc/152"}
//                     alt={activeContact.name}
//                     className="w-16 h-16 p-2 rounded-full bg-white"
//                   />
//                   <div>
//                     <h5 className="font-semibold text-white">
//                       {activeContact.name}
//                     </h5>
//                     <p className="text-sm text-green-400">Active Now</p>
//                   </div>
//                 </header>
//                 <section className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#2B2F4E]">
//                   {messages.map(renderMessage)}
//                   {isTyping && (
//                     <div className="px-2 text-sm text-gray-300 animate-pulse">
//                       {activeContact.name} is typing...
//                     </div>
//                   )}
//                   <div ref={messageEndRef} />
//                 </section>
//                 <footer className="bg-[#1F2340] p-4 border-t border-[#2B2F4E] flex items-center gap-3">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => {
//                       setNewMessage(e.target.value);
//                       handleTyping();
//                     }}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Type a message..."
//                     className="flex-1 p-3 rounded-full bg-[#2B2F4E] text-white focus:outline-none placeholder:text-gray-400"
//                   />
//                   <input
//                     type="file"
//                     id="fileInput"
//                     ref={fileInput}
//                     className="hidden"
//                     onChange={(e) => {
//                       // Handle file upload logic here
//                       console.log(e.target.files);
//                     }}
//                     />

//                    <button
//                     onClick={handelOpenFIle}
//                       className="text-white"
//                     >
//                       <FaFile />
//                     </button>

//                   {/* icon="fa-regular fa-file" */}
//                   <button
//                     onClick={handleSendMessage}
//                     className="bg-blue-600 p-3 rounded-full hover:bg-blue-700"
//                   >
//                     <FaPaperPlane />
//                   </button>
//                 </footer>
//               </>
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-400">
//                 Select a contact to start chatting
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ChatPageCopy;



import React, { useEffect, useRef, useState } from "react";
import { FaFile, FaPaperPlane, FaSearch } from "react-icons/fa";
import { getSocket } from "../../services/socket";
import { useSelector } from "react-redux";

const ChatPageCopy = () => {
  const admin = useSelector((state) => state.admin);
  const fileInput = useRef(null);
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("getUsers");

    socket.on("users", (usersList) => {
      setUsers(usersList.filter((u) => u._id !== admin._id));
    });

    socket.on("onlineUsers", (list) => setOnlineUsers(list));

    socket.on("chatHistory", (history) => setMessages(history));

    socket.on("newMessage", (msg) => {
      if (
        msg.senderId === activeContact?._id ||
        msg.receiverId === activeContact?._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("typing", ({ from }) => {
      if (from === activeContact?._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    socket.on("messageSeenAck", ({ senderId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === senderId ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      socket.off("users");
      socket.off("onlineUsers");
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("typing");
      socket.off("messageSeenAck");
    };
  }, [admin._id, activeContact?._id]);

  useEffect(() => {
    if (activeContact && messages.length > 0) {
      getSocket().emit("messageSeen", {
        senderId: activeContact._id,
        receiverId: admin._id,
      });
    }
    scrollToBottom();
  }, [messages, activeContact, admin._id]);

  const handleSelectContact = (user) => {
    setActiveContact(user);
    setMessages([]);
    getSocket().emit("getChatHistory", {
      userId: admin._id,
      otherUserId: user._id,
    });
  };

  const handleTyping = () => {
    if (activeContact?._id) {
      getSocket().emit("typing", { to: activeContact._id });
    }
  };

  const handleSendMessage = () => {
    if (!activeContact) return;

    const socket = getSocket();
    const now = new Date();

    if (selectedImage) {
      socket.emit("sendMessage", {
        senderId: admin._id,
        receiverId: activeContact._id,
        content: selectedImage,
        type: "image",
        date_time: now,
        isRead: false,
      });
      setSelectedImage(null);
      return;
    }

    const text = newMessage.trim();
    if (!text) return;

    socket.emit("sendMessage", {
      senderId: admin._id,
      receiverId: activeContact._id,
      content: text,
      type: "text",
      date_time: now,
      isRead: false,
    });
    setNewMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleOpenFile = () => {
    fileInput.current.click();
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderMessage = (msg, i) => {
    const isMe = msg.senderId === admin._id;
    const isImage = msg.type === "image";

    return (
      <div
        key={i}
        className={`max-w-md px-4 py-3 rounded-lg text-sm shadow-md relative transition-all duration-300 ${
          isMe
            ? "bg-blue-600 text-white ml-auto animate-slide-in-right"
            : "bg-[#3C4165] text-white animate-slide-in-left"
        }`}
      >
        {isImage ? (
          <img
            src={msg.content}
            alt="sent-img"
            className="rounded max-w-xs max-h-60 object-cover"
          />
        ) : (
          <div>{msg.content}</div>
        )}
        <div className="text-xs mt-1 text-right text-gray-300">
          {isMe ? "You" : activeContact?.name} • {formatTime(msg.date_time)}
        </div>
        {isMe && (
          <div className="text-[10px] text-right text-gray-400 mt-1">
            {msg.isRead ? "✓✓ Read" : "✓ Sent"}
          </div>
        )}
      </div>
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-screen flex bg-[#2B2F4E] text-white font-sans">
          <aside className="w-1/4 bg-[#1F2340] p-4 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Messages</h2>
            <div className="flex items-center bg-[#2B2F4E] p-2 rounded mb-4">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Message"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent focus:outline-none text-sm w-full placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {filteredUsers.map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                return (
                  <div
                    key={user._id}
                    onClick={() => handleSelectContact(user)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                      activeContact?._id === user._id
                        ? "bg-[#2B2F4E]"
                        : "hover:bg-[#2B2F4E]"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={user.image || "https://i.pravatar.cc/150"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full bg-white"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#1F2340] rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      {isOnline && (
                        <div className="text-xs text-green-400">Active Now</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <main className="flex-1 flex flex-col">
            {activeContact ? (
              <>
                <header className="bg-[#1F2340] p-4 flex items-center gap-4 border-b border-[#2B2F4E]">
                  <img
                    src={activeContact.image || "https://i.pravatar.cc/152"}
                    alt={activeContact.name}
                    className="w-16 h-16 p-2 rounded-full bg-white"
                  />
                  <div>
                    <h5 className="font-semibold text-white">
                      {activeContact.name}
                    </h5>
                    {onlineUsers.includes(activeContact._id) && (
                      <p className="text-sm text-green-400">Active Now</p>
                    )}
                  </div>
                </header>
                <section className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#2B2F4E]">
                  {messages.map(renderMessage)}
                  {isTyping && (
                    <div className="px-2 text-sm text-gray-300 animate-pulse">
                      {activeContact.name} is typing...
                    </div>
                  )}
                  <div ref={messageEndRef} />
                </section>
                <footer className="bg-[#1F2340] p-4 border-t border-[#2B2F4E] flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 rounded-full bg-[#2B2F4E] text-white focus:outline-none placeholder:text-gray-400"
                  />

                  {selectedImage && (
                    <div className="mb-2">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-h-40 rounded-lg border border-gray-500" />
                      <button
                        className="mt-1 text-xs text-red-400 hover:text-red-600"
                        onClick={() => setSelectedImage(null)} >
                        Remove
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInput}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image"
                  />
                  <button onClick={handleOpenFile} className="text-white">
                    <FaFile />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 p-3 rounded-full hover:bg-blue-700"
                  >
                    <FaPaperPlane />
                  </button>
                </footer>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a contact to start chatting
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatPageCopy;



