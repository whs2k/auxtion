document.addEventListener('DOMContentLoaded', () => {
    const salesContainer = document.getElementById('sales-container');
    const tableContainer = document.getElementById('table-container');
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-input');
    const houseFilter = document.getElementById('house-filter');
    const sortOrder = document.getElementById('sort-order');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const tableViewBtn = document.getElementById('table-view-btn');
    const downloadCsvBtn = document.getElementById('download-csv');

    let allSales = [];
    let currentView = 'grid';

    // Fetch data
    async function fetchSales() {
        try {
            const response = await fetch('sales.json');
            if (!response.ok) throw new Error('Failed to load sales data');
            allSales = await response.json();
            updateUI();
        } catch (error) {
            console.error('Error fetching sales:', error);
            // Fallback mock data
            allSales = [
                { name: "Sample Luxury Watch", house: "Christie's", price: 50000, currency: "USD", date: "2024-05-01", category: "Watches", url: "#" }
            ];
            updateUI();
        }
    }

    function formatCurrency(value, currency) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: 0
        }).format(value);
    }

    function renderGridView(sales) {
        salesContainer.innerHTML = sales.map(sale => {
            const imageUrl = sale.image || `https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop`;
            return `
                <div class="sale-card">
                    <div class="sale-image-container">
                        <img src="${imageUrl}" alt="${sale.name}" class="sale-image" loading="lazy">
                        <div class="sale-house-badge">${sale.house}</div>
                    </div>
                    <div class="sale-content">
                        <div class="sale-meta-top">
                            <span class="sale-category-tag">${sale.category}</span>
                            <span class="sale-date-text">${new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 class="sale-title-text">${sale.name}</h3>
                        <div class="sale-price-row">
                            <span class="sale-price-text">${formatCurrency(sale.price, sale.currency || 'USD')}</span>
                            <a href="${sale.url}" target="_blank" class="sale-button">Details</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderTableView(sales) {
        tableBody.innerHTML = sales.map(sale => `
            <tr>
                <td><a href="${sale.url}" target="_blank">${sale.name}</a></td>
                <td>${sale.house}</td>
                <td>${formatCurrency(sale.price, sale.currency || 'USD')}</td>
                <td>${new Date(sale.date).toLocaleDateString()}</td>
                <td><span class="sale-category-tag">${sale.category}</span></td>
            </tr>
        `).join('');
    }

    function updateUI() {
        let filtered = allSales.filter(sale => {
            const query = searchInput.value.toLowerCase();
            const matchesSearch = sale.name.toLowerCase().includes(query) ||
                                 sale.house.toLowerCase().includes(query) ||
                                 sale.category.toLowerCase().includes(query);
            const matchesHouse = houseFilter.value === 'all' || sale.house === houseFilter.value;
            return matchesSearch && matchesHouse;
        });

        const order = sortOrder.value;
        filtered.sort((a, b) => {
            if (order === 'price-desc') return b.price - a.price;
            if (order === 'price-asc') return a.price - b.price;
            if (order === 'date-desc') return new Date(b.date) - new Date(a.date);
            return 0;
        });

        if (currentView === 'grid') {
            salesContainer.style.display = 'grid';
            tableContainer.style.display = 'none';
            renderGridView(filtered);
        } else {
            salesContainer.style.display = 'none';
            tableContainer.style.display = 'block';
            renderTableView(filtered);
        }
    }

    function downloadCSV() {
        const headers = ['Name', 'House', 'Price', 'Currency', 'Date', 'Category', 'URL'];
        const rows = allSales.map(s => [
            `"${s.name.replace(/"/g, '""')}"`,
            s.house,
            s.price,
            s.currency,
            s.date,
            s.category,
            s.url
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `auxtion_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event Listeners
    searchInput.addEventListener('input', updateUI);
    houseFilter.addEventListener('change', updateUI);
    sortOrder.addEventListener('change', updateUI);

    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        gridViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        updateUI();
    });

    tableViewBtn.addEventListener('click', () => {
        currentView = 'table';
        tableViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        updateUI();
    });

    downloadCsvBtn.addEventListener('click', downloadCSV);

    fetchSales();
});
