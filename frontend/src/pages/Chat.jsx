import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Card from '../components/Card';
import './Chat.css';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="container">
            <h1 className="gradient-text">Messages</h1>

            <Card className="chat-container">
                <div className="chat-empty">
                    <MessageSquare size={64} className="chat-empty-icon" />
                    <h3>No conversations yet</h3>
                    <p>Start chatting with freelancers or employers from job postings</p>
                </div>
            </Card>
        </div>
    );
};

export default Chat;
