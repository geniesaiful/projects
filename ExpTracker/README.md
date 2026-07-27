# Project: Expense Tracker

### Core Features

- [] Dashboard Summary
    - [] Total Balance, Total Income, Total Expenses, Saving Rate ((Total Balance/ Total Income)x100)
- [] Add Transaction
    - [] Fields: Type (Income/Expense), Title, Amount, Category, Date, Note (optional)
    - [] Validate all fields (no empty title, amount must be > 0, required fields)
    - [] Categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Salary, Freelance, Other
- [] Transaction List
    - [] Show all transactions with title, category, date and amount.
    - [] Income amounts in green with + sign.
    - [] Expense amounts in red with - sign.
    - [] Each item has Edit and Delete actions.
- [] Edit Transaction
- [] Delete Transaction
    - [] Show confirmation dialog before deleting.
- [] Filter and Search
    - [] Filter by: All, Income, Expense.
    - [] Search by title, category or note.
    - [] Optional: Filter by category and date range.
- [] Data Persistance
    - [] Save all transactions in Local Storage.
    - [] Data should persist after page refresh.
- [] Calculations
    - [] Total Income = Sum of all income amounts
    - [] Total Expenses = Sum of all expense amounts
    - [] Total Balance = Total Income - Total Expenses
    - [] Savings Rate = (Total Balance / Total Income) × 100

### Extra Features

- [] Monthly Summary
- [] Category wise spending Chart
- [] Export data as JSON/CSV
- [] Dark Mode