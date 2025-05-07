const apiUrl = 'http://localhost:3000/transactions';

function showSection(id) {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('transactions').style.display = 'none';
  document.getElementById(id).style.display = 'block';

  if (id === 'dashboard') {
    updateDashboard();
  }
}


document.getElementById('transaction-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const rawAmount = document.getElementById('amount').value.replace(',', '.').trim();
  const date = document.getElementById('date').value;

  
  const parsedAmount = parseFloat(rawAmount);
  if (isNaN(parsedAmount)) {
    alert("Bitte gib einen gültigen Betrag ein, z. B. 12.50 oder -10.95");
    return;
  }

  
  const amount = Math.round(parsedAmount * 100) / 100;

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, amount, date })
  });

  document.getElementById('transaction-form').reset();
  loadTransactions();
});


async function loadTransactions() {
  const res = await fetch(apiUrl);
  const transactions = await res.json();

  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  let balance = 0;

  transactions.forEach(tx => {
    const roundedAmount = Math.round(tx.amount * 100) / 100;
    const li = document.createElement('li');
    li.innerHTML = `
      ${tx.date} - ${tx.description}: CHF ${roundedAmount.toFixed(2)}
      <button onclick="deleteTransaction(${tx.id})">🗑️</button>
    `;
    list.appendChild(li);
    balance += roundedAmount;
  });

  const roundedBalance = Math.round(balance * 100) / 100;
  document.getElementById('balance').textContent = `Saldo: CHF ${roundedBalance.toFixed(2)}`;
}


async function deleteTransaction(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  loadTransactions();
}


async function updateDashboard() {
  const res = await fetch(apiUrl);
  const transactions = await res.json();

  const total = transactions.reduce((sum, t) => sum + Math.round(t.amount * 100) / 100, 0);
  const roundedTotal = Math.round(total * 100) / 100;

  document.getElementById('balance-summary').textContent = `Aktueller Saldo: CHF ${roundedTotal.toFixed(2)}`;
}


loadTransactions();
