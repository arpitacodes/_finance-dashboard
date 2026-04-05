let currentRole = "viewer";

const roleSelect = document.getElementById("roleSelect");
const roleText = document.getElementById("roleText");

roleSelect.addEventListener("change", (e) => {
  currentRole = e.target.value;

  roleText.textContent = `Hello, ${currentRole}`;
});

// Calculating data


// const transactions = [
//   { date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
//   { date: "2026-04-02", amount: 2000, category: "Food", type: "expense" },
//   { date: "2026-04-03", amount: 3000, category: "Freelance", type: "income" },
//   { date: "2026-04-04", amount: 1000, category: "Travel", type: "expense" }
// ];

let transactions = JSON.parse(localStorage.getItem("transactions")) || [
  { date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
  { date: "2026-04-02", amount: 2000, category: "Food", type: "expense" },
  { date: "2026-04-03", amount: 3000, category: "Freelance", type: "income" },
  { date: "2026-04-04", amount: 1000, category: "Travel", type: "expense" }
];





const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");

function updateSummary() {
  let income = 0;
  let expenses = 0;

  transactions.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expenses += t.amount;
    }
  });

  const balance = income - expenses;

  balanceEl.textContent = `₹${balance}`;
  incomeEl.textContent = `₹${income}`;
  expensesEl.textContent = `₹${expenses}`;
}

updateSummary();
// + Add Transcation ---- from slider



// ===== GET ELEMENTS =====

const addBtn = document.getElementById("addBtn");

const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const addMoreBtn = document.getElementById("addMoreBtn");

// ===== ROLE SWITCHING =====

roleSelect.addEventListener("change", (e) => {
  currentRole = e.target.value;

  roleText.textContent = `Hello, ${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}`;

  // Show button only for admin
  if (currentRole === "admin") {
    addBtn.style.display = "block";
  } else {
    addBtn.style.display = "none";
  }
});

// Run once on page load
roleSelect.dispatchEvent(new Event("change"));

const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");

// OPEN modal
addBtn.addEventListener("click", () => {
  overlay.classList.add("active");
});

// CLOSE modal
closeModal.addEventListener("click", () => {
  overlay.classList.remove("active");
});

// If user clicks on background (not modal)
overlay.addEventListener("click", (e) => {  
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});



// ===== SUBMIT TRANSACTION =====
submitBtn.addEventListener("click", () => {
  const date = document.getElementById("tDate").value;
  const amount = document.getElementById("tAmount").value;
  const category = document.getElementById("tCategory").value;
  const type = document.getElementById("tType").value;

  if (!date || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  const newTransaction = {
    date,
    amount: Number(amount),
    category,
    type
  };

  transactions.push(newTransaction);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions(transactions);
  updateSummary();
  updateInsights();

  overlay.classList.remove("active"); // close drawer after submit
});

// ===== RESET FORM =====
resetBtn.addEventListener("click", () => {
  document.getElementById("tDate").value = "";
  document.getElementById("tAmount").value = "";
  document.getElementById("tCategory").value = "";
});

// ===== ADD MORE =====
addMoreBtn.addEventListener("click", () => {
  submitBtn.click();   // submit data
  resetBtn.click();    // clear fields
});





// Ends + Add Transcation ---- From Slider

// filer Data

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

function filterTransactions() {
  let filtered = transactions;

  // Search filter
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(t =>
      t.category.toLowerCase().includes(searchValue)
    );
  }

  // Type filter
  const typeValue = filterType.value;
  if (typeValue !== "all") {
    filtered = filtered.filter(t => t.type === typeValue);
  }

  renderTransactions(filtered);
}

// Event listeners
searchInput.addEventListener("input", filterTransactions);
filterType.addEventListener("change", filterTransactions);




// Render table data



const tableBody = document.getElementById("transactionTable");

function renderTransactions(data) {
  tableBody.innerHTML = "";

  data.forEach(t => {
    const row = `
      <tr>
        <td>${t.date}</td>
        <td>₹${t.amount}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

renderTransactions(transactions);



const topCategoryEl = document.getElementById("topCategory");
const totalExpenseText = document.getElementById("totalExpenseText");

function updateInsights() {
  let categoryMap = {};
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === "expense") {
      totalExpense += t.amount;

      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }

      categoryMap[t.category] += t.amount;
    }
  });

  // Find highest spending category
  let topCategory = "";
  let max = 0;

  for (let cat in categoryMap) {
    if (categoryMap[cat] > max) {
      max = categoryMap[cat];
      topCategory = cat;
    }
  }

  topCategoryEl.textContent = `Highest spending category: ${topCategory}`;
  totalExpenseText.textContent = `Total expenses: ₹${totalExpense}`;
}

updateInsights();


// Dark Mode


// const darkToggle = document.getElementById("darkModeToggle");

// darkToggle.addEventListener("click", () => {
//   document.body.classList.toggle("dark");

//   // Save preference
//   localStorage.setItem("darkMode", document.body.classList.contains("dark"));
// });