from flask import Flask, render_template, request, url_for, redirect
import sqlite3
from database import create_db
from datetime import datetime, timedelta

app= Flask(__name__)

create_db()

@app.route("/")
def index():
    return render_template("homepage.html")

@app.route("/add", methods=["GET","POST"])
def add_expense():
    
    selected_date = request.args.get("date")    
    if not selected_date:
        from datetime import date
        selected_date = date.today().isoformat()

    if request.method == "POST":
        date_from_form = request.form["date"]
        category = request.form["category"]
        amount = request.form["money"]
        notes = request.form["notes"]

        conn = sqlite3.connect('expenses.db')
        c = conn.cursor()
        c.execute("INSERT INTO expenses (date, category, amount, notes) VALUES (?, ?, ?, ?)",
                  (date_from_form, category, amount, notes))
        conn.commit()
        conn.close()

        return redirect(url_for("add_expense", date=date_from_form))

    conn = sqlite3.connect('expenses.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM expenses WHERE date=?  ORDER BY id DESC",(selected_date,))
    expenses = c.fetchall()
    total_amount = sum(float(expense['amount']) for expense in expenses) if expenses else 0.0


    conn.close()
    return render_template("expensetracker.html",expenses=expenses, selected_date=selected_date,total_amount=total_amount)
    

    
@app.route("/week")
def weekly_trends():

    today = datetime.today()
    last_monday = today - timedelta(days=today.weekday())
    start_date = last_monday.date().isoformat()

    conn = sqlite3.connect("expenses.db")
    conn.row_factory=sqlite3.Row
    c=conn.cursor()

    c.execute("SELECT * FROM expenses WHERE date >= ?", (start_date,))
    expenses = c.fetchall()
    conn.close()
    
    daily_totals = {}
    category_totals = {}

    for e in expenses:
        date = e['date']
        category = e['category']
        try:
            amount = float(e['amount'])
        except (ValueError, TypeError):
            amount = 0.0

        if date not in daily_totals:
            daily_totals[date] = {}

        daily_totals[date][category] = daily_totals[date].get(category, 0) + amount
        category_totals[category] = category_totals.get(category, 0) + amount

    



    return render_template("weeklyanalytics.html",daily_totals=daily_totals,
        category_totals=category_totals,
        expenses=[dict(e) for e in expenses]
        )


@app.route("/delete/<int:expense_id>", methods=["POST"])
def delete_expense(expense_id):
    selected_date = request.args.get("date")  
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute("DELETE FROM expenses WHERE id=?", (expense_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("add_expense", date=selected_date))
