import { FileText, Download, TrendingUp, BarChart3 } from 'lucide-react';
import Card from '../components/Card';
import './Reports.css';

const Reports = () => {
    const reports = [
        { id: 1, title: 'Monthly Revenue Report', type: 'Financial', date: '2026-02-01', status: 'Ready' },
        { id: 2, title: 'User Activity Report', type: 'Analytics', date: '2026-02-05', status: 'Ready' },
        { id: 3, title: 'Job Performance Report', type: 'Performance', date: '2026-02-08', status: 'Processing' }
    ];

    return (
        <div className="reports-page">
            <div className="page-header">
                <h1>Reports</h1>
                <p>View and download your reports</p>
            </div>

            <div className="reports-stats">
                <Card className="stat-card">
                    <TrendingUp size={32} />
                    <h3>24</h3>
                    <p>Total Reports</p>
                </Card>
                <Card className="stat-card">
                    <BarChart3 size={32} />
                    <h3>12</h3>
                    <p>This Month</p>
                </Card>
            </div>

            <div className="reports-list">
                {reports.map(report => (
                    <Card key={report.id} className="report-card">
                        <div className="report-icon">
                            <FileText size={24} />
                        </div>
                        <div className="report-info">
                            <h3>{report.title}</h3>
                            <div className="report-meta">
                                <span className="report-type">{report.type}</span>
                                <span className="report-date">{report.date}</span>
                            </div>
                        </div>
                        <div className="report-actions">
                            <span className={`status-badge ${report.status.toLowerCase()}`}>{report.status}</span>
                            <button className="download-btn">
                                <Download size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Reports;
