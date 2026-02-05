// Configuración
const API_URL_KEY = 'inventario_api_url';
let API_BASE_URL = localStorage.getItem(API_URL_KEY) || 'https://web-production-ad4c8.up.railway.app';
let allItems = []; // Cache de todos los items

// Cargar URL guardada al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const savedUrl = localStorage.getItem(API_URL_KEY);
    if (savedUrl) {
        document.getElementById('apiUrl').value = savedUrl;
        API_BASE_URL = savedUrl;
    } else {
        // Si no hay URL guardada, usar la predeterminada
        API_BASE_URL = 'https://web-production-ad4c8.up.railway.app';
        localStorage.setItem(API_URL_KEY, API_BASE_URL);
    }
    
    // Conectar automáticamente
    checkApiStatus();
    loadStatistics();
    loadItems();
});

// Guardar URL de API
function saveApiUrl() {
    const url = document.getElementById('apiUrl').value.trim();
    if (!url) {
        showAlert('Por favor ingresa una URL válida', 'warning');
        return;
    }
    
    API_BASE_URL = url.endsWith('/') ? url.slice(0, -1) : url;
    localStorage.setItem(API_URL_KEY, API_BASE_URL);
    
    showAlert('URL de API guardada correctamente', 'success');
    checkApiStatus();
    loadStatistics();
    loadItems();
}

// Verificar estado de la API
async function checkApiStatus() {
    if (!API_BASE_URL) {
        updateStatusBadge('danger', 'No configurado');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            updateStatusBadge('success', 'Conectado');
        } else {
            updateStatusBadge('warning', 'Advertencia');
        }
    } catch (error) {
        updateStatusBadge('danger', 'Error de conexión');
        console.error('Error checking API status:', error);
    }
}

// Actualizar badge de estado
function updateStatusBadge(type, text) {
    const badge = document.getElementById('apiStatus');
    const statusText = document.getElementById('statusText');
    const colorMap = {
        'success': 'text-success',
        'warning': 'text-warning',
        'danger': 'text-danger',
        'secondary': 'text-secondary'
    };
    
    badge.querySelector('i').className = `bi bi-circle-fill ${colorMap[type]}`;
    statusText.textContent = text;
}

// Cargar estadísticas
async function loadStatistics() {
    if (!API_BASE_URL) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/inventario/estadisticas/valor-total`);
        if (!response.ok) throw new Error('Error al cargar estadísticas');
        
        const stats = await response.json();
        renderStatistics(stats);
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Renderizar estadísticas
function renderStatistics(stats) {
    const statsSection = document.getElementById('statisticsSection');
    const statsGrid = document.getElementById('statsGrid');
    
    statsSection.style.display = 'block';
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon text-primary">
                <i class="bi bi-box-seam"></i>
            </div>
            <div class="stat-value">${stats.total_items_diferentes}</div>
            <div class="stat-label">Items Diferentes</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon text-info">
                <i class="bi bi-stack"></i>
            </div>
            <div class="stat-value">${stats.total_unidades || 0}</div>
            <div class="stat-label">Total Unidades</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon text-success">
                <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stat-value">$${formatNumber(stats.valor_total_inventario)}</div>
            <div class="stat-label">Valor Total</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon text-warning">
                <i class="bi bi-graph-up"></i>
            </div>
            <div class="stat-value">$${formatNumber(stats.precio_promedio)}</div>
            <div class="stat-label">Precio Promedio</div>
        </div>
    `;
}

// Cargar items
async function loadItems() {
    if (!API_BASE_URL) {
        showAlert('Por favor configura la URL de la API primero', 'warning');
        return;
    }

    const loadingBtn = document.querySelector('.loading');
    loadingBtn.classList.add('active');

    try {
        const response = await fetch(`${API_BASE_URL}/api/inventario`);
        if (!response.ok) throw new Error('Error al cargar items');
        
        allItems = await response.json();
        renderItems(allItems);
        loadStatistics(); // Actualizar estadísticas
    } catch (error) {
        showAlert('Error al cargar los items: ' + error.message, 'danger');
        console.error('Error loading items:', error);
    } finally {
        loadingBtn.classList.remove('active');
    }
}

// Renderizar items
function renderItems(items) {
    const container = document.getElementById('itemsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (items.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    container.innerHTML = items.map(item => {
        const stockClass = getStockClass(item.cantidad);
        const stockIcon = getStockIcon(item.cantidad);
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <h5 class="item-title">${escapeHtml(item.nombre)}</h5>
                    <span class="item-category">${escapeHtml(item.categoria)}</span>
                </div>
                
                <div class="item-details">
                    <div class="item-detail">
                        <div class="item-detail-label">
                            <i class="bi bi-currency-dollar"></i> Precio Unitario
                        </div>
                        <div class="item-detail-value price-tag">
                            $${formatNumber(item.precioUnitario)}
                        </div>
                    </div>
                    
                    <div class="item-detail">
                        <div class="item-detail-label">
                            <i class="bi ${stockIcon}"></i> Stock Disponible
                        </div>
                        <div class="item-detail-value ${stockClass}">
                            ${item.cantidad} unidades
                        </div>
                    </div>
                    
                    <div class="item-detail">
                        <div class="item-detail-label">
                            <i class="bi bi-calculator"></i> Valor en Stock
                        </div>
                        <div class="item-detail-value text-success">
                            $${formatNumber(item.cantidad * item.precioUnitario)}
                        </div>
                    </div>
                    
                    <div class="item-detail">
                        <div class="item-detail-label">
                            <i class="bi bi-hash"></i> ID del Item
                        </div>
                        <div class="item-detail-value">
                            #${item.id}
                        </div>
                    </div>
                </div>
                
                <div class="mt-3 d-flex justify-content-end">
                    <button class="btn btn-outline-primary btn-action btn-sm" onclick="editItem(${item.id})" title="Editar">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-action btn-sm" onclick="deleteItem(${item.id})" title="Eliminar">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Obtener clase de stock según cantidad
function getStockClass(cantidad) {
    if (cantidad <= 10) return 'stock-low';
    if (cantidad <= 30) return 'stock-medium';
    return 'stock-high';
}

// Obtener icono de stock según cantidad
function getStockIcon(cantidad) {
    if (cantidad <= 10) return 'bi-exclamation-triangle-fill';
    if (cantidad <= 30) return 'bi-exclamation-circle-fill';
    return 'bi-check-circle-fill';
}

// Aplicar filtros
async function applyFilters() {
    const categoria = document.getElementById('filterCategoria').value;
    const stockInput = document.getElementById('filterStock').value;
    
    if (!API_BASE_URL) {
        showAlert('Por favor configura la URL de la API primero', 'warning');
        return;
    }

    try {
        let items;
        
        if (stockInput) {
            // Filtrar por stock bajo
            const response = await fetch(`${API_BASE_URL}/api/inventario/bajo-stock/${stockInput}`);
            if (!response.ok) throw new Error('Error al filtrar');
            items = await response.json();
            
            // Aplicar filtro de categoría si existe
            if (categoria) {
                items = items.filter(item => item.categoria === categoria);
            }
        } else if (categoria) {
            // Filtrar solo por categoría
            const response = await fetch(`${API_BASE_URL}/api/inventario/categoria/${categoria}`);
            if (!response.ok) throw new Error('Error al filtrar');
            items = await response.json();
        } else {
            // Sin filtros, cargar todos
            items = allItems;
        }
        
        renderItems(items);
        showAlert(`Se encontraron ${items.length} item(s)`, 'info');
    } catch (error) {
        showAlert('Error al aplicar filtros: ' + error.message, 'danger');
        console.error('Error applying filters:', error);
    }
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filterCategoria').value = '';
    document.getElementById('filterStock').value = '';
    renderItems(allItems);
}

// Crear o actualizar item
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!API_BASE_URL) {
        showAlert('Por favor configura la URL de la API primero', 'warning');
        return;
    }

    const itemId = document.getElementById('itemId').value;
    const itemData = {
        nombre: document.getElementById('itemNombre').value,
        categoria: document.getElementById('itemCategoria').value,
        cantidad: parseInt(document.getElementById('itemCantidad').value),
        precioUnitario: parseFloat(document.getElementById('itemPrecio').value)
    };

    try {
        let response;
        if (itemId) {
            // Actualizar
            response = await fetch(`${API_BASE_URL}/api/inventario/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });
        } else {
            // Crear
            response = await fetch(`${API_BASE_URL}/api/inventario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });
        }

        if (!response.ok) throw new Error('Error al guardar el item');

        showAlert(
            itemId ? 'Item actualizado correctamente' : 'Item agregado correctamente', 
            'success'
        );
        resetForm();
        loadItems();
    } catch (error) {
        showAlert('Error: ' + error.message, 'danger');
        console.error('Error saving item:', error);
    }
});

// Editar item
async function editItem(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`);
        if (!response.ok) throw new Error('Error al cargar el item');
        
        const item = await response.json();
        
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemNombre').value = item.nombre;
        document.getElementById('itemCategoria').value = item.categoria;
        document.getElementById('itemCantidad').value = item.cantidad;
        document.getElementById('itemPrecio').value = item.precioUnitario;
        
        document.getElementById('formTitle').textContent = 'Editar Item del Inventario';
        document.getElementById('submitBtnText').textContent = 'Actualizar Item';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        // Scroll al formulario
        document.getElementById('itemForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
        showAlert('Error al cargar el item: ' + error.message, 'danger');
        console.error('Error editing item:', error);
    }
}

// Eliminar item
async function deleteItem(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este item del inventario?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/inventario/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el item');

        showAlert('Item eliminado correctamente', 'success');
        loadItems();
    } catch (error) {
        showAlert('Error: ' + error.message, 'danger');
        console.error('Error deleting item:', error);
    }
}

// Resetear formulario
function resetForm() {
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('formTitle').textContent = 'Agregar Item al Inventario';
    document.getElementById('submitBtnText').textContent = 'Agregar Item';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// Formatear números
function formatNumber(num) {
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Escapar HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
