import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('categories');

  // 1. CATEGORIES STATE (Local Storage)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_categories');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Salary', type: 'income' },
      { id: 2, name: 'Groceries', type: 'expense' },
      { id: 3, name: 'Rent', type: 'expense' }
    ];
  });

  // 2. TRANSACTIONS STATE (Local Storage)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. CATEGORY FORM STATE
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('expense');

  // 4. TRANSACTION FORM STATE
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState('');

  // 5. LOCALSTORAGE PERSISTENCE EFFECTS
  useEffect(() => {
    localStorage.setItem('expense_tracker_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('expense_tracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Set default category whenever transaction type or categories change
  useEffect(() => {
    const available = categories.filter(cat => cat.type === txType);
    if (available.length > 0) {
      setTxCategory(available[0].name);
    } else {
      setTxCategory('');
    }
  }, [txType, categories]);

  // HANDLERS FOR CATEGORIES
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const newCategory = {
      id: Date.now(),
      name: categoryName.trim(),
      type: categoryType,
    };

    setCategories([...categories, newCategory]);
    setCategoryName('');
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // HANDLER FOR ADD TRANSACTION
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!txDescription.trim() || !txAmount || Number(txAmount) <= 0) return;

    const newTransaction = {
      id: Date.now(),
      description: txDescription.trim(),
      amount: parseFloat(txAmount),
      type: txType,
      category: txCategory || 'Uncategorized',
      date: txDate,
    };

    setTransactions([newTransaction, ...transactions]); // Prepend newest transaction
    setTxDescription('');
    setTxAmount('');
    
    // Show temporary success feedback
    setSuccessMsg('Transaction added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Filter categories to only show ones that match selected type (income/expense)
  const filteredCategories = categories.filter(cat => cat.type === txType);

  return (
    <div className="app-container">
      
      {/* HEADER */}
      <header className="header">
        <h2 className="logo">ExpenseTracker</h2>
        
        <div className="stats-row">
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

      {/* MAIN BODY */}
      <div className="body-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button 
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`menu-item ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              ➕ Add Transaction
            </button>
            <button 
              className={`menu-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              🏷️ Categories
            </button>
            <button 
              className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </aside>

        {/* MAIN VIEW AREA */}
        <main className="main-content">
          {activeTab === 'overview' && (
            <div>
              <h3>Overview Tab</h3>
              <p>This is where your transactions list will appear.</p>
            </div>
          )}

          {/* ADD TRANSACTION TAB */}
          {activeTab === 'add' && (
            <div className="transaction-container">
              <h3 className="category-title">Record New Transaction</h3>

              {successMsg && <div className="success-banner">{successMsg}</div>}

              <form onSubmit={handleAddTransaction} className="transaction-card">
                
                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Weekly Grocery Shopping"
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Amount & Type */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select 
                      value={txType} 
                      onChange={(e) => setTxType(e.target.value)}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                {/* Category & Date */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={txCategory} 
                      onChange={(e) => setTxCategory(e.target.value)}
                    >
                      {filteredCategories.length === 0 ? (
                        <option value="">No categories available</option>
                      ) : (
                        filteredCategories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      value={txDate}
                      onChange={(e) => setTxDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="add-btn" style={{ width: '100%', marginTop: '12px' }}>
                  Save Transaction
                </button>

              </form>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="category-container">
              <h3 className="category-title">Manage Categories</h3>

              <form onSubmit={handleAddCategory} className="category-form">
                <input 
                  type="text"
                  placeholder="Category Name (e.g. Dining, Freelance)"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="category-input"
                />

                <select 
                  value={categoryType} 
                  onChange={(e) => setCategoryType(e.target.value)}
                  className="category-select"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <button type="submit" className="add-btn">
                  Add Category
                </button>
              </form>

              {categories.length === 0 ? (
                <p className="empty-state">No categories added yet.</p>
              ) : (
                <div className="category-grid">
                  {categories.map((cat) => (
                    <div key={cat.id} className={`category-card ${cat.type}`}>
                      <div className="category-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-type">{cat.type}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)} 
                        className="delete-btn"
                        title="Delete Category"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3>Settings</h3>
              <p>App preferences and options.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}