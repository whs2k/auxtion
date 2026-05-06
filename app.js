document.addEventListener('DOMContentLoaded', () => {
    const salesContainer = document.getElementById('sales-container');
    const searchInput = document.getElementById('search-input');
    const houseFilter = document.getElementById('house-filter');
    const sortOrder = document.getElementById('sort-order');

    let allSales = [];

    // Fetch data
    async function fetchSales() {
        try {
            // Try fetching sales.json, fallback to a mock for now
            const response = await fetch('sales.json');
            if (!response.ok) throw new Error('Failed to load sales data');
            allSales = await response.json();
            renderSales(allSales);
        } catch (error) {
            console.error('Error fetching sales:', error);
            // Fallback mock data for demonstration
            allSales = [
                {
                    name: "Rolex Daytona 'Paul Newman' Ref. 6239",
                    house: "Sotheby's",
                    price: 450000,
                    currency: "USD",
                    date: "2024-05-01",
                    category: "Watches",
                    url: "#"
                },
                {
                    name: "Bansky: Love is in the Air",
                    house: "Christie's",
                    price: 12500000,
                    currency: "USD",
                    date: "2024-04-28",
                    category: "Fine Art",
                    url: "#"
                },
                {
                    name: "Hermès Birkin 30 Crocodile",
                    house: "Phillips",
                    price: 65000,
                    currency: "USD",
                    date: "2024-05-03",
                    category: "Luxury Bags",
                    url: "#"
                },
                {
                    name: "Jordan 1 Retro High Travis Scott",
                    house: "StockX",
                    price: 1800,
                    currency: "USD",
                    date: "2024-05-04",
                    category: "Sneakers",
                    url: "#"
                }
            ];
            renderSales(allSales);
        }
    }

    function formatCurrency(value, currency) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(value);
    }

    function renderSales(sales) {
        salesContainer.innerHTML = '';
        
        if (sales.length === 0) {
            salesContainer.innerHTML = '<div class="no-results">No sales found matching your criteria.</div>';
            return;
        }

        sales.forEach(sale => {
            const card = document.createElement('div');
            card.className = 'sale-card';
            
            // Placeholder image if none provided
            const imageUrl = sale.image || `https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop`;
            
            card.innerHTML = `
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
            `;
            salesContainer.appendChild(card);
        });
    }

    function filterAndSort() {
        let filtered = allSales.filter(sale => {
            const matchesSearch = sale.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                sale.house.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                sale.category.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchesHouse = houseFilter.value === 'all' || sale.house === houseFilter.value;
            return matchesSearch && matchesHouse;
        });

        // Sorting
        const order = sortOrder.value;
        filtered.sort((a, b) => {
            if (order === 'price-desc') return b.price - a.price;
            if (order === 'price-asc') return a.price - b.price;
            if (order === 'date-desc') return new Date(b.date) - new Date(a.date);
            return 0;
        });

        renderSales(filtered);
    }

    // Event Listeners
    searchInput.addEventListener('input', filterAndSort);
    houseFilter.addEventListener('change', filterAndSort);
    sortOrder.addEventListener('change', filterAndSort);

    fetchSales();
});
