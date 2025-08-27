
document.addEventListener("DOMContentLoaded", function() {
         flatpickr("#datePicker",{
            dateFormat:"Y-m-d",
            defaultDate: "{{selected date}}",
            onChange: function(selectedDates, dateStr) {
              document.getElementById('hiddenDate').value = dateStr;
            }
        })

    
    const ctx = document.getElementById('categorychart').getContext('2d');
    let expenseChart = null;

    function updateCategoryChart() {
        const categoryTotals = {};

       
        const rows = document.querySelectorAll('.expense-list tbody tr');
        rows.forEach(row => {
            const category = row.cells[1].textContent;
            const amount = parseFloat(row.cells[2].textContent.replace('Rs.', ''));
            if (categoryTotals[category]) {
                categoryTotals[category] += amount;
            } else {
                categoryTotals[category] = amount;
            }
        });

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        const colors = generateColors(categories.length);

        if (expenseChart) {
            expenseChart.data.labels = categories;
            expenseChart.data.datasets[0].data = amounts;
            expenseChart.data.datasets[0].backgroundColor = colors;
            expenseChart.update();
        } else {
            expenseChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: categories,
                    datasets: [{
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
            });
        }
    }
    function generateColors(count) {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#7CFC00', '#20B2AA', '#FFD700', '#FF6347'
        ];
        return colors.slice(0, count);
    }

    updateCategoryChart();

});
