import { useState } from 'react';
import { CheckSquare, Plus, Filter, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete project proposal', status: 'in-progress', priority: 'high', dueDate: '2026-02-15' },
        { id: 2, title: 'Review client feedback', status: 'pending', priority: 'medium', dueDate: '2026-02-12' },
        { id: 3, title: 'Update documentation', status: 'completed', priority: 'low', dueDate: '2026-02-10' }
    ]);

    const getStatusBadge = (status) => {
        const badges = {
            'pending': { class: 'status-pending', text: 'Pending' },
            'in-progress': { class: 'status-progress', text: 'In Progress' },
            'completed': { class: 'status-completed', text: 'Completed' }
        };
        return badges[status] || badges.pending;
    };

    return (
        <div className="tasks-page">
            <div className="page-header">
                <div>
                    <h1>Tasks</h1>
                    <p>Manage your tasks and to-dos</p>
                </div>
                <Button variant="primary">
                    <Plus size={20} />
                    New Task
                </Button>
            </div>

            <div className="tasks-filters">
                <div className="search-box">
                    <Search size={20} />
                    <input type="text" placeholder="Search tasks..." />
                </div>
                <Button variant="outline">
                    <Filter size={20} />
                    Filter
                </Button>
            </div>

            <div className="tasks-grid">
                {tasks.map(task => (
                    <Card key={task.id} className="task-card">
                        <div className="task-header">
                            <CheckSquare size={24} />
                            <span className={`status-badge ${getStatusBadge(task.status).class}`}>
                                {getStatusBadge(task.status).text}
                            </span>
                        </div>
                        <h3>{task.title}</h3>
                        <div className="task-meta">
                            <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                            <span className="due-date">Due: {task.dueDate}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
