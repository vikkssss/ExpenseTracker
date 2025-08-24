document.addEventListener("DOMContentLoaded", function() {
    const categorySelect = document.getElementById('category');
    const amtinput = document.querySelector('input[name="money"]');
    const notesinput = document.querySelector('input[name="notes"]');
    const addExpensebutton = document.querySelector('#addExpenseButton');
    const expenseTable = document.querySelector('.expense-list tbody');
    const totalAmt= document.getElementById('total-amount');
    
    let expenses =[];
    let sno=1;
    window.expenseChart = null;

    function addExpense(){
        const category = categorySelect.value;
        const amount = parseFloat(amtinput.value);
        const notes = notesinput.value;
        
        if (!category || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid category and amount!');
            return;
        }
        const expense = {
            sno: sno++,
            category : category,
            amount : amount,
            notes : notes || 'no notes'
        }

            expenses.push(expense);
            updateExpenseTable();
            updateTotal();
            updateCategoryChart();

            amtinput.value = '';
            notesinput.value = '';
            categorySelect.selectedIndex = 0;
            amtinput.focus();
            
    };

     function updateExpenseTable(){
        expenseTable.innerHTML = '';
        expenses.forEach(expense => {
            const row = document.createElement('tr');

                   
            row.innerHTML = `
                <td>${expense.sno}</td>
                <td>${expense.category}</td>
                <td>Rs.${expense.amount.toFixed(2)}</td>
                <td>${expense.notes}</td>
            `;
            expenseTable.appendChild(row);

        })
    }

    function updateTotal()
    {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmt.textContent = `Rs.${total.toFixed(2)}`;
    }

    addExpensebutton.addEventListener('click', addExpense);
    document.getElementById('submitamount').addEventListener('click', function() {
        notesinput.focus();
    });
    document.getElementById('submitnotes').addEventListener('click', function() {
        addExpense();
    });

    amtinput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            notesinput.focus();
            
        }
    });
    notesinput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExpense();
            
        }
    });

    function updateCategoryChart(){

        const categorytotals = {};

        expenses.forEach(expense => {
            if (categorytotals[expense.category]) {
                categorytotals[expense.category] += expense.amount;
            } else {
                categorytotals[expense.category] = expense.amount;
            }
        });

        const categories = Object.keys(categorytotals);
        const amounts = Object.values(categorytotals);
        const colors = generateColors(categories.length);
        const ctx= document.getElementById('categorychart').getContext('2d');

        if(window.expenseChart){
            window.expenseChart.data.labels=categories;
            window.expenseChart.data.datasets[0].data=amounts;
            window.expenseChart.data.datasets[0].backgroundColor = colors;
            window.expenseChart.update();
        }
        else{
            window.expenseChart=new Chart(ctx, {
                type: 'pie',
                data:{
                    labels: categories,
                    datasets:[{
                        data: amounts,
                        backgroundColor: colors,
                        borderColor: '#fff',
                        borderWidth: 2

                    }]
                },
                options: {
                    responsive: true, 
                    plugins: {
                        legend: {
                            position: 'bottom' 
                        }
                    }
                }
            
            })
        }

        
    }
    function generateColors(count){
        const colors=[ '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
        '#7CFC00', '#20B2AA', '#FFD700', '#FF6347']

        return colors.slice(0, count);
    }

       

    
})