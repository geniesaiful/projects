import { useState, useEffect } from 'react';
import './App.css';

export default function App() {

  const [activeTab, setActiveTab] = useState('overview');

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_categories');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Salary', type: 'income' },
      { id: 2, name: 'Groceries', type: 'expense' },
      { id: 3, name: 'Rent', type: 'expense' }
    ];
  });
  useEffect(() => {
    localStorage.setItem('expense_tracker_categories', JSON.stringify(categories));
  }, [categories]);

  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('expense');

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
            <div className="category-container">
              <h3 className="category-title">Manage Categories</h3>

              {/* ADD CATEGORY FORM */}
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