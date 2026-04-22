import { Bell, Shield, Wallet, Globe } from 'lucide-react';
import './Settings.css';

export const SettingsView = () => {
  return (
    <div className="settings-view">
      <div className="view-header">
        <div>
          <h2>System Settings</h2>
          <p>Configure global workflow definitions and security policies</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button className="settings-nav-item active"><Globe size={18}/> General</button>
          <button className="settings-nav-item"><Bell size={18}/> Notifications</button>
          <button className="settings-nav-item"><Shield size={18}/> Security</button>
          <button className="settings-nav-item"><Wallet size={18}/> Billing</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Workflow Defaults</h3>
            <div className="setting-control">
              <label>Default Auto-approve Threshold</label>
              <div className="control-row">
                <input type="range" min="0" max="100" defaultValue="80" />
                <span>80%</span>
              </div>
            </div>
            <div className="setting-control">
              <label>Default Task Priority</label>
              <select defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Global Metadata</h3>
            <p>Metadata tags applied to all new workflows by default.</p>
            <div className="tags-input">
              <span className="tag">HR_CORE</span>
              <span className="tag">PROD_ENV</span>
              <button className="btn-add-tag">+</button>
            </div>
          </div>

          <button className="btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
};
