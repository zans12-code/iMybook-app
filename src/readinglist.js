// --- Task 5: CRUD & Local Storage Persistence ---
let watchlist = JSON.parse(localStorage.getItem('imybook_watchlist')) || [];

const bookIndexInput = document.getElementById('bookIndex');
const bookTitleInput = document.getElementById('bookTitleInput');
const bookAuthorInput = document.getElementById('bookAuthorInput');
const bookStatusInput = document.getElementById('bookStatusInput');
const saveBtn = document.getElementById('saveBtn');
const feedbackMsg = document.getElementById('feedbackMsg');
const tableBody = document.getElementById('watchlistTableBody');
const formTitle = document.getElementById('formTitle');

function renderTable() {
    tableBody.innerHTML = '';
    if (watchlist.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9ca3af;">No local reading records found.</td></tr>`;
        return;
    }

    watchlist.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>${item.status}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editRecord(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

saveBtn.addEventListener('click', () => {
    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const status = bookStatusInput.value;
    const editIdx = bookIndexInput.value;

    // Input validation
    if (!title || !author) {
        feedbackMsg.textContent = "Error: Please fill in both the book title and author name.";
        feedbackMsg.style.color = "#f87171";
        return;
    }

    if (editIdx === "") {
        // CREATE Operation
        watchlist.push({ title, author, status });
        feedbackMsg.textContent = "Success: New book record added!";
    } else {
        // UPDATE Operation
        watchlist[editIdx] = { title, author, status };
        feedbackMsg.textContent = "Success: Book record updated!";
        formTitle.textContent = "Add New Book Record";
        saveBtn.textContent = "Save Record";
        bookIndexInput.value = "";
    }

    feedbackMsg.style.color = "#34d399";
    localStorage.setItem('imybook_watchlist', JSON.stringify(watchlist));
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    renderTable();
});

// EDIT (Pre-populate form for Update)
window.editRecord = function(index) {
    const item = watchlist[index];
    bookTitleInput.value = item.title;
    bookAuthorInput.value = item.author;
    bookStatusInput.value = item.status;
    bookIndexInput.value = index;
    formTitle.textContent = "Edit Book Record";
    saveBtn.textContent = "Update Record";
    feedbackMsg.textContent = "";
};

// DELETE Operation
window.deleteRecord = function(index) {
    if (confirm("Are you sure you want to remove this book record?")) {
        watchlist.splice(index, 1);
        localStorage.setItem('imybook_watchlist', JSON.stringify(watchlist));
        renderTable();
        feedbackMsg.textContent = "Success: Record deleted.";
        feedbackMsg.style.color = "#f87171";
    }
};

// Initial render on load
renderTable();