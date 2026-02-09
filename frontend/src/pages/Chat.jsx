import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, User, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import './Chat.css';

const Chat = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Get userId from URL params
    const userIdFromUrl = searchParams.get('userId');

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        // If userId in URL, load that conversation
        if (userIdFromUrl && conversations.length > 0) {
            const conversation = conversations.find(
                conv => conv.otherUser._id === userIdFromUrl
            );
            if (conversation) {
                handleSelectConversation(conversation);
            } else {
                // Create new conversation with this user
                initializeNewConversation(userIdFromUrl);
            }
        }
    }, [userIdFromUrl, conversations]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await chatAPI.getConversations();
            setConversations(response.data.data.conversations || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const initializeNewConversation = async (userId) => {
        try {
            // Fetch conversation with this user (will create if doesn't exist)
            const response = await chatAPI.getConversation(userId);
            const conversation = response.data.data.conversation;
            setSelectedConversation(conversation);
            setMessages(conversation.messages || []);

            // Add to conversations list if not already there
            if (!conversations.find(c => c.otherUser._id === userId)) {
                setConversations(prev => [conversation, ...prev]);
            }
        } catch (error) {
            console.error('Error initializing conversation:', error);
            alert('Failed to start conversation. Please try again.');
        }
    };

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        try {
            const response = await chatAPI.getConversation(conversation.otherUser._id);
            setMessages(response.data.data.conversation.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const response = await chatAPI.sendMessage({
                receiverId: selectedConversation.otherUser._id,
                content: newMessage
            });

            const sentMessage = response.data.data.message;
            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');

            // Update conversation list
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => {
        const messageDate = new Date(date);
        const now = new Date();
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return messageDate.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return messageDate.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="chat-loading">
                    <Loader className="spinner" size={48} />
                    <p>Loading conversations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="gradient-text">Messages</h1>

            <Card className="chat-container">
                <div className="chat-layout">
                    {/* Conversations List */}
                    <div className="conversations-sidebar">
                        <h3>Conversations</h3>
                        {conversations.length === 0 ? (
                            <div className="no-conversations">
                                <MessageSquare size={48} />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            <div className="conversations-list">
                                {conversations.map((conversation) => (
                                    <div
                                        key={conversation._id}
                                        className={`conversation-item ${selectedConversation?._id === conversation._id ? 'active' : ''
                                            }`}
                                        onClick={() => handleSelectConversation(conversation)}
                                    >
                                        <div className="conversation-avatar">
                                            {conversation.otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="conversation-info">
                                            <h4>{conversation.otherUser.name}</h4>
                                            <p className="last-message">
                                                {conversation.lastMessage?.content || 'Start a conversation'}
                                            </p>
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <span className="unread-badge">{conversation.unreadCount}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="messages-area">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="chat-header">
                                    <button
                                        className="back-button"
                                        onClick={() => setSelectedConversation(null)}
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="chat-user-avatar">
                                        {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="chat-user-info">
                                        <h3>{selectedConversation.otherUser.name}</h3>
                                        <p>{selectedConversation.otherUser.email}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="messages-container">
                                    {messages.length === 0 ? (
                                        <div className="no-messages">
                                            <MessageSquare size={48} />
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`message ${message.sender === user.id ? 'sent' : 'received'
                                                    }`}
                                            >
                                                <div className="message-content">
                                                    <p>{message.content}</p>
                                                    <span className="message-time">
                                                        {formatTime(message.createdAt)}
                                                    </span>
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
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="message-input"
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!newMessage.trim() || sending}
                                        loading={sending}
                                    >
                                        <Send size={20} />
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="no-conversation-selected">
                                <MessageSquare size={64} />
                                <h3>Select a conversation</h3>
                                <p>Choose a conversation from the list to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Chat;
