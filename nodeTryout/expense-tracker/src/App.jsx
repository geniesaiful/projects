import { useState } from 'react';
import './App.css';

export default function App() {

  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className='app-container'>
      <header className='app-header'>
        <div className='app-badge-area'>
          <h2>Expense Tracker</h2>
        </div>
        <div className='stats-area'>
          <div className="stat-card">
            <span className="stat-label">Total Income</span>
            <strong className="income-text">$5,000.00</strong>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Total Expense</span>
            <strong className="expense-text">$1,250.00</strong>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Net Balance</span>
            <strong className="balance-text">$3,750.00</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Savings Rate</span>
            <strong className="savings-text">75%</strong>
          </div>
        </div>
      </header>
      
      <div className='app-body'>
        <aside className='sidebar'>
          <nav className='nav-menu'> 
            <button className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={()=> setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`menu-item ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              Add Transaction
            </button>
            <button 
              className={`menu-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button 
              className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
        </aside>

        <main className='main-content'>
          {activeTab==='overview' && (
            <div>
              <h3>overview</h3>
            </div>
          )}
          {activeTab==='add' && (
            <div>
              <h3>add transaction</h3>
            </div>
          )}
          {activeTab==='categories' && (
            <div>
              <h3>categories</h3>
            </div>
          )}
          {activeTab==='settings' && (
            <div>
              <h3>settings</h3>
            </div>
          )}
        </main>
      </div>


    </div>
  );
}