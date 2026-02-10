import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, User, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import './Users.css';

const Users = () => {
    const { user: currentUser } = useAuth();
    const [users] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'freelancer', status: 'online', lastSeen: 'Active now' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'employer', status: 'online', lastSeen: 'Active now' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'freelancer', status: 'offline', lastSeen: '2 hours ago' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'employer', status: 'online', lastSeen: 'Active now' },
        { id: 5, name: 'David Brown', email: 'david@example.com', role: 'freelancer', status: 'offline', lastSeen: '1 day ago' }
    ]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    // Sample messages for demo
    const sampleMessages = {
        1: [
            { id: 1, senderId: 1, text: 'Hi! I saw your job posting for the Flutter app.', timestamp: '10:30 AM', isOwn: false },
            { id: 2, senderId: currentUser?.id, text: 'Hello! Yes, are you interested?', timestamp: '10:32 AM', isOwn: true },
            { id: 3, senderId: 1, text: 'Absolutely! I have 5 years of experience with Flutter.', timestamp: '10:33 AM', isOwn: false }
        ],
        2: [
            { id: 1, senderId: 2, text: 'Thanks for applying to my project!', timestamp: '9:15 AM', isOwn: false },
            { id: 2, senderId: currentUser?.id, text: 'Thank you! I\'m excited about this opportunity.', timestamp: '9:20 AM', isOwn: true }
        ]
    };

    useEffect(() => {
        if (selectedUser) {
            setMessages(sampleMessages[selectedUser.id] || []);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const message = {
            id: messages.length + 1,
            senderId: currentUser?.id,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-interface">
            {/* Users List Sidebar */}
            <div className="users-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                    <p>{users.length} contacts</p>
                </div>

                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="users-list">
                    {filteredUsers.map(user => (
                        <div
                            key={user.id}
                            className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                            onClick={() => handleSelectUser(user)}
                        >
                            <div className="user-avatar">
                                {user.name.charAt(0)}
                                <span className={`status-dot ${user.status}`}></span>
                            </div>
                            <div className="user-info">
                                <div className="user-header">
                                    <h4>{user.name}</h4>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </div>
                                <p className="last-seen">{user.lastSeen}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-area">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-user-info">
                                <div className="user-avatar">
                                    {selectedUser.name.charAt(0)}
                                    <span className={`status-dot ${selectedUser.status}`}></span>
                                </div>
                                <div>
                                    <h3>{selectedUser.name}</h3>
                                    <p className="user-status">
                                        <Circle size={8} className={selectedUser.status} />
                                        {selectedUser.lastSeen}
                                    </p>
                                </div>
                            </div>
                            <span className={`role-badge ${selectedUser.role}`}>
                                {selectedUser.role}
                            </span>
                        </div>

                        {/* Messages */}
                        <div className="messages-container">
                            {messages.length === 0 ? (
                                <div className="empty-messages">
                                    <MessageSquare size={48} />
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.isOwn ? 'own' : 'other'}`}
                                    >
                                        <div className="message-content">
                                            <p>{message.text}</p>
                                            <span className="message-time">{message.timestamp}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form className="message-input-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="message-input"
                            />
                            <Button type="submit" variant="primary">
                                <Send size={20} />
                                Send
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <MessageSquare size={64} />
                        <h3>Select a conversation</h3>
                        <p>Choose a user from the list to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
