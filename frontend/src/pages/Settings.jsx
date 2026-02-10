import { Settings as SettingsIcon, User, Bell, Lock, Globe, Moon } from 'lucide-react';
import Card from '../components/Card';
import './Settings.css';

const Settings = () => {
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your account and preferences</p>
            </div>

            <div className="settings-grid">
                <Card className="setting-card">
                    <div className="setting-icon">
                        <User size={24} />
                    </div>
                    <h3>Profile Settings</h3>
                    <p>Update your personal information and profile details</p>
                </Card>

                <Card className="setting-card">
                    <div className="setting-icon">
                        <Bell size={24} />
                    </div>
                    <h3>Notifications</h3>
                    <p>Configure notification preferences and alerts</p>
                </Card>

                <Card className="setting-card">
                    <div className="setting-icon">
                        <Lock size={24} />
                    </div>
                    <h3>Privacy & Security</h3>
                    <p>Manage your privacy settings and security options</p>
                </Card>

                <Card className="setting-card">
                    <div className="setting-icon">
                        <Globe size={24} />
                    </div>
                    <h3>Language & Region</h3>
                    <p>Set your preferred language and regional settings</p>
                </Card>

                <Card className="setting-card">
                    <div className="setting-icon">
                        <Moon size={24} />
                    </div>
                    <h3>Appearance</h3>
                    <p>Customize the look and feel of your interface</p>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
