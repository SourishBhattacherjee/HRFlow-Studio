import { Mail, Shield, BadgeCheck } from 'lucide-react';
import './Employees.css';

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Chen', role: 'HR Manager', email: 'sarah@hrflow.ai', department: 'People Operations' },
  { id: '2', name: 'Marcus Wright', role: 'Tech Lead', email: 'marcus@hrflow.ai', department: 'Engineering' },
  { id: '3', name: 'Elena Rodriguez', role: 'Director', email: 'elena@hrflow.ai', department: 'Executive' },
  { id: '4', name: 'David Kim', role: 'Product Manager', email: 'david@hrflow.ai', department: 'Product' },
];

export const EmployeeList = () => {
  return (
    <div className="employee-view">
      <div className="view-header">
        <div>
          <h2>Employee Directory</h2>
          <p>Manage access and roles for your workflow participants</p>
        </div>
        <button className="btn-primary">Add Employee</button>
      </div>

      <div className="employee-grid">
        {MOCK_EMPLOYEES.map((emp) => (
          <div key={emp.id} className="employee-card">
            <div className="card-top">
              <div className="avatar">
                {emp.name[0]}
              </div>
              <div className="badge">
                <Shield size={12} />
                {emp.role === 'Director' ? 'Admin' : 'Member'}
              </div>
            </div>
            <div className="card-body">
              <h3>{emp.name}</h3>
              <span className="role">{emp.role}</span>
              <div className="contact-info">
                <div className="info-item">
                  <Mail size={14} />
                  {emp.email}
                </div>
                <div className="info-item">
                  <BadgeCheck size={14} />
                  {emp.department}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
