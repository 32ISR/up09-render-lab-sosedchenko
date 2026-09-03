<script>
    async function fetchItems() {
        try {
            const response = await fetch('https://kitek.ktkv.dev/static/spotify.json');
            const data = await response.json();
            renderItems(data);
            updateStats(data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showError();
        }
    }

    function renderItems(items) {
        const grid = document.querySelector('.items-grid');
        
        const itemsToShow = items.slice(0, 6);
        
        const html = itemsToShow.map((item, index) => {
            // Проверяем наличие ставок
            const hasBids = item.bids && item.bids.length > 0;
            const currentBid = hasBids ? Math.max(...item.bids) : item.price;
            const bidCount = hasBids ? item.bids.length : 0;
            
            // Генерируем цвет для картинки
            const colors = ['3498db', 'e74c3c', '2ecc71', '9b59b6', 'f39c12', '1abc9c'];
            const color = colors[index % colors.length];
            
            return `
                <div class="item-card">
                    <img
                        src="https://via.placeholder.com/300x200/${color}/ffffff?text=${encodeURIComponent(item.name)}"
                        alt="${item.name}"
                        class="item-image"
                    />
                    <div class="item-content">
                        <span class="status-badge status-active">Активно</span>
                        <h3 class="item-title">${item.name}</h3>
                        <p class="item-description">
                            ${item.description || 'Описание товара'}
                        </p>
                        <div class="item-footer">
                            <div>
                                <div class="item-price">${item.price.toLocaleString()} ₽</div>
                                ${hasBids ? `
                                    <div class="bid-info">
                                        Текущая ставка: ${currentBid.toLocaleString()} ₽
                                        <span class="bid-count">${bidCount}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="item-meta">
                                <span class="item-seller">
                                    Продавец: ${item.seller || 'unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }

    function updateStats(items) {
        const totalItems = items.length;
        const totalBids = items.reduce((sum, item) => sum + (item.bids ? item.bids.length : 0), 0);
        const activeItems = items.filter(item => item.status !== 'closed').length;
        const avgPrice = Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length);
        
        const statValues = document.querySelectorAll('.stat-value');
        statValues[0].textContent = totalItems;
        statValues[1].textContent = totalBids;
        statValues[2].textContent = activeItems;
        statValues[3].textContent = `${avgPrice.toLocaleString()} ₽`;
    }

    function showError() {
        const grid = document.querySelector('.items-grid');
        grid.innerHTML = `
            <div class="no-items">
                <div class="no-items-icon">⚠️</div>
                <h3>Ошибка загрузки данных</h3>
                <p>Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }

    fetchItems();
</script>
