// --- Task 2: API Integration & JSON Processing ---
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const booksContainer = document.getElementById('booksContainer');

// Modal Elements & Event Listeners
const bookModal = document.getElementById('bookModal');
const closeModalBtn = document.getElementById('closeModalBtn');

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        bookModal.style.display = 'none';
    });
}

// Close modal when clicking outside the popup box
window.addEventListener('click', (e) => {
    if (e.target === bookModal) {
        bookModal.style.display = 'none';
    }
});

// Array of random categories for initial page load
const randomCategories = ['mystery', 'science fiction', 'adventure', 'fantasy', 'history', 'biography', 'technology'];

// On page load, fetch and display a random category of books in the main grid
window.addEventListener('DOMContentLoaded', () => {
    const randomCat = randomCategories[Math.floor(Math.random() * randomCategories.length)];
    fetchBooks(randomCat);
});

searchBtn.addEventListener('click', () => {
    fetchBooks(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchBooks(searchInput.value);
});

function fetchBooks(query) {
    if (!query.trim()) {
        booksContainer.innerHTML = '<p style="color: #f87171;">Please enter a search keyword.</p>';
        return;
    }

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            displayBooks(data.docs, booksContainer, 50); // Displays books
        })
        .catch(err => {
            booksContainer.innerHTML = '<p style="color: #f87171;">Failed to retrieve API data. Check network connection.</p>';
            console.error(err);
        });
}

function displayBooks(docs, targetContainer, limit = 15) {
    targetContainer.innerHTML = '';
    if (!docs || docs.length === 0) {
        targetContainer.innerHTML = '<p style="grid-column: span 5; text-align: center;">No books found.</p>';
        return;
    }
    docs.slice(0, limit).forEach(book => {
        const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : 'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg';
        
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${coverUrl}" alt="Book Cover">
            <h4 style="margin: 10px 0 5px; font-size: 0.95rem;">${book.title}</h4>
            <p style="font-size: 0.8rem; color: #9ca3af;">By ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
        `;

        // Click Event: Open Popup Modal with Book Info & Synopsis
        card.addEventListener('click', () => {
            const authorText = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
            const publishYear = book.first_publish_year ? book.first_publish_year : 'N/A';
            const pageCount = book.number_of_pages_median ? book.number_of_pages_median : Math.floor(Math.random() * 250) + 150;
            const modalBody = document.getElementById('modalBody');

            modalBody.innerHTML = `
                <div class="modal-detail-card">
                    <img src="${coverUrl}" class="modal-cover" alt="Cover" style="width: 160px; height: 230px; object-fit: contain; background: #fff; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);">
                    <h3 style="margin: 5px 0; font-size: 1.2rem; color: #fff;">${book.title}</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 10px;">By ${authorText}</p>
                    <div style="color: #fbbf24; margin-bottom: 10px;">⭐⭐⭐⭐⭐ <span style="color: #cbd5e1; font-size: 0.85rem;">4.8</span></div>

                    <div class="modal-stats" style="display: flex; justify-content: space-around; width: 100%; margin: 15px 0; padding: 10px 0; border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <div><strong style="color: #fff;">${pageCount}</strong><br><small style="color: #94a3b8;">Pages</small></div>
                        <div><strong style="color: #fff;">${publishYear}</strong><br><small style="color: #94a3b8;">Published</small></div>
                        <div><strong style="color: #fff;">English</strong><br><small style="color: #94a3b8;">Language</small></div>
                    </div>

                    <p class="modal-synopsis" style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; text-align: left; margin-bottom: 20px; max-height: 120px; overflow-y: auto;">
                        <strong>Synopsis & Overview:</strong> An insightful title by ${authorText}. This work delves into engaging themes, rich narratives, and core concepts relevant to its category.
                    </p>

                    <button id="modalAddBtn" style="width: 100%; padding: 12px; background: #10b981; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
                        Add to Watchlist
                    </button>
                </div>
            `;

            // Display modal popup
            bookModal.style.display = 'flex';

            // LocalStorage Watchlist Integration inside Modal
            document.getElementById('modalAddBtn').addEventListener('click', () => {
                let watchlist = JSON.parse(localStorage.getItem('imybook_watchlist')) || [];
                const exists = watchlist.some(item => item.title.toLowerCase() === book.title.toLowerCase());

                if (!exists) {
                    watchlist.push({ title: book.title, author: authorText, status: 'Want to Read' });
                    localStorage.setItem('imybook_watchlist', JSON.stringify(watchlist));
                    alert(`"${book.title}" added to your Reading Watchlist!`);
                } else {
                    alert(`"${book.title}" is already in your watchlist.`);
                }
            });
        });

        targetContainer.appendChild(card);
    });
}

// --- Task 3: Category Selection Logic (Displays in the exact same books section) ---
document.querySelectorAll('.cat-card').forEach(button => {
    button.addEventListener('click', () => {
        const query = button.getAttribute('data-query');
        fetchBooks(query);
    });
});

// --- Task 4: Meaningful Calculation Logic ---
document.getElementById('calcBtn').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('totalPages').value);
    const pace = parseFloat(document.getElementById('pagesPerDay').value);
    const resultEl = document.getElementById('calcResult');

    if (isNaN(total) || isNaN(pace) || total <= 0 || pace <= 0) {
        resultEl.textContent = "Error: Please enter valid numbers greater than zero for pages and daily pace.";
        resultEl.style.color = "#f87171";
        return;
    }

    const daysNeeded = Math.ceil(total / pace);
    resultEl.style.color = "#34d399";
    resultEl.textContent = `Estimated completion time: ${daysNeeded} days (Reading at ${pace} pages/day).`;
});