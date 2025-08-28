
document.addEventListener("DOMContentLoaded", function(){
function renderWeeklyChart(){
        const dataElement = document.getElementById('expenses-data');
        if (!dataElement) {
            console.error('The expenses-data element was not found on the page.');
            return;
        }
        const canvas = document.getElementById('weeklyChart');
        
        console.log('Attempting to find canvas element...');
        console.log('Canvas element found:', canvas);

        const rawData = JSON.parse(dataElement.textContent);
        const dailyTotals = rawData.daily_totals;
        const categoryTotals = rawData.category_totals;

        const dates = Object.keys(dailyTotals);
        const sortedDates = dates.sort();

        const categories = Object.keys(categoryTotals);

        const labels = sortedDates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        });


        const datasets = categories.map((category) => ({
            label: category,
            data: sortedDates.map(date => {return(dailyTotals[date] && dailyTotals[date][category]) ? dailyTotals[date][category] : 0;} ),
            backgroundColor: generateColors(categories.length)[categories.indexOf(category)],
        }));

        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        barPercentage: 0.5, 
                        categoryPercentage: 0.7 
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (Rs.)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Weekly Expense Breakdown'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });


    }
    function generateColors(count) {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#7CFC00', '#20B2AA', '#FFD700', '#FF6347'
        ];
        return colors.slice(0, count);
    }
    

    renderWeeklyChart();
});