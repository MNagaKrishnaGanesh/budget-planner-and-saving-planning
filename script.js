
let transactions = JSON.parse(localStorage.getItem("budgetData")) || [];
let savingsGoal = localStorage.getItem("savingsGoal") || 0;

function updateUI() {
    const transactionList = document.getElementById("transactions");
    transactionList.innerHTML = "";
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="${item.type === 'income' ? 'income' : 'expense'}">
                ${item.desc} - ₹${item.amount}
            </span>
            <button class="delete-btn" onclick="deleteTransaction(${index})">❌</button>
        `;
        transactionList.appendChild(li);

        if (item.type === "income") {
            totalIncome += item.amount;
        } else {
            totalExpense += item.amount;
        }

        balance += item.type === "income" ? item.amount : -item.amount;
    });

    document.getElementById("balance").innerText = balance;
    document.getElementById("goal-progress").innerText = `Goal Progress: ₹${balance} / ₹${savingsGoal}`;
    localStorage.setItem("budgetData", JSON.stringify(transactions));
    updateChart(totalIncome, totalExpense);
}

function addTransaction() {
    let desc = document.getElementById("desc").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;

    if (desc === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid details.");
        return;
    }

    transactions.push({ desc, amount, type });
    updateUI();
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

function setGoal() {
    let goal = parseFloat(document.getElementById("goalAmount").value);
    if (isNaN(goal) || goal <= 0) {
        alert("Enter a valid savings goal!");
        return;
    }
    savingsGoal = goal;
    localStorage.setItem("savingsGoal", goal);
    updateUI();
}

let budgetChart;
function updateChart(income, expense) {
    const ctx = document.getElementById("budgetChart").getContext("2d");
    if (budgetChart) budgetChart.destroy();
    budgetChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["green", "red"]
            }]
        }
    });
}

updateUI();
