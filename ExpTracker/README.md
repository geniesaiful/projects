# Project: Expense Tracker

### Core Features

- [x] Dashboard Summary
    - [x] Total Balance, Total Income, Total Expenses, Saving Rate ((Total Balance/ Total Income)x100)
- [x] Add Transaction
    - [x] Fields: Type (Income/Expense), Title, Amount, Category, Date, Note (optional)
    - [x] Validate all fields (no empty title, amount must be > 0, required fields)
    - [x] Categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Salary, Freelance, Other
- [x] Transaction List
    - [x] Show all transactions with title, category, date and amount.
    - [x] Income amounts in green with + sign.
    - [x] Expense amounts in red with - sign.
    - [x] Each item has Edit and Delete actions.
- [x] Edit Transaction
- [x] Delete Transaction
    - [x] Show confirmation dialog before deleting.
- [] Filter and Search
    - [] Filter by: All, Income, Expense.
    - [] Search by title, category or note.
    - [] Optional: Filter by category and date range.
- [x] Data Persistance
    - [x] Save all transactions in Local Storage.
    - [x] Data should persist after page refresh.
- [x] Calculations
    - [x] Total Income = Sum of all income amounts
    - [x] Total Expenses = Sum of all expense amounts
    - [x] Total Balance = Total Income - Total Expenses
    - [x] Savings Rate = (Total Balance / Total Income) × 100

### Extra Features

- [] Monthly Summary
- [] Category wise spending Chart
- [] Export data as JSON/CSV
- [] Dark Mode