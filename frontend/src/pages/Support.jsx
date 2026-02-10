import { HelpCircle, Mail, Phone, MessageCircle, Book } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Support.css';

const Support = () => {
    return (
        <div className="support-page">
            <div className="page-header">
                <h1>Support</h1>
                <p>Get help and find answers to your questions</p>
            </div>

            <div className="support-grid">
                <Card className="support-card">
                    <div className="support-icon">
                        <MessageCircle size={32} />
                    </div>
                    <h3>Live Chat</h3>
                    <p>Chat with our support team in real-time</p>
                    <Button variant="primary">Start Chat</Button>
                </Card>

                <Card className="support-card">
                    <div className="support-icon">
                        <Mail size={32} />
                    </div>
                    <h3>Email Support</h3>
                    <p>Send us an email and we'll respond within 24 hours</p>
                    <Button variant="outline">Send Email</Button>
                </Card>

                <Card className="support-card">
                    <div className="support-icon">
                        <Phone size={32} />
                    </div>
                    <h3>Phone Support</h3>
                    <p>Call us for immediate assistance</p>
                    <Button variant="outline">Call Now</Button>
                </Card>

                <Card className="support-card">
                    <div className="support-icon">
                        <Book size={32} />
                    </div>
                    <h3>Documentation</h3>
                    <p>Browse our comprehensive guides and tutorials</p>
                    <Button variant="outline">View Docs</Button>
                </Card>
            </div>

            <Card className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-item">
                    <h4>How do I post a job?</h4>
                    <p>Navigate to the Jobs page and click on "Post Job" button to create a new job listing.</p>
                </div>
                <div className="faq-item">
                    <h4>How do I apply for jobs?</h4>
                    <p>Browse available jobs and click "Apply" on any job that matches your skills.</p>
                </div>
                <div className="faq-item">
                    <h4>How do I contact support?</h4>
                    <p>You can reach us via live chat, email, or phone using the options above.</p>
                </div>
            </Card>
        </div>
    );
};

export default Support;
