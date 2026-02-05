# Frontend - Sistema de Gestión de Inventario

**Estudiante:** YAGUACHI GALARZA DANIEL ALEJANDRO  
**Universidad:** Universidad Católica de Cuenca

Frontend profesional para el Sistema de Gestión de Inventario con HTML, Bootstrap 5 y JavaScript.

## 🎨 Características

- ✅ **Interfaz moderna** con diseño profesional
- ✅ **CRUD completo** de items de inventario
- ✅ **Estadísticas en tiempo real**
  - Total de items diferentes
  - Total de unidades
  - Valor total del inventario
  - Precio promedio
- ✅ **Filtros avanzados**
  - Por categoría
  - Por stock bajo
  - Combinación de filtros
- ✅ **Indicadores visuales de stock**
  - Rojo: Stock crítico (≤ 10)
  - Amarillo: Stock medio (≤ 30)
  - Verde: Stock alto (> 30)
- ✅ **Diseño responsivo** para móviles y tablets
- ✅ **Alertas y notificaciones**
- ✅ **Validación de formularios**

## 🚀 Despliegue en Railway

### **Opción 1: Desde GitHub (Recomendado)**

1. **Subir a GitHub:**
```bash
git init
git add .
git commit -m "Frontend Sistema Gestión Inventario"
git remote add origin <tu-repo-frontend>
git push -u origin main
```

2. **En Railway:**
   - Click "+ New" → "Deploy from GitHub repo"
   - Selecciona tu repositorio
   - Railway detectará `package.json` automáticamente
   - Desplegará usando `npm start`

3. **Generar dominio:**
   - Settings → Networking → "Generate Domain"
   - Tu frontend estará disponible públicamente

### **Opción 2: Railway CLI**

```bash
railway init
railway up
```

## 💻 Uso Local

### **Opción 1: Abrir directamente**
- Abre `index.html` en tu navegador
- Configura la URL de tu API
- ¡Listo para usar!

### **Opción 2: Con servidor HTTP**
```bash
npm install
npm run dev
```
Se abrirá en `http://localhost:8080`

## ⚙️ Configuración

### **Primera vez:**
1. Abre el frontend
2. En "Configuración de API" ingresa la URL de tu backend
3. Ejemplo: `https://inventario-api-production.up.railway.app`
4. Click "Guardar"
5. El indicador debe ponerse verde "Conectado"

### **Categorías disponibles:**
- Tecnología
- Mobiliario
- Papelería
- Electrónica
- Audio
- Iluminación
- Otros

## 📊 Funcionalidades

### **Gestión de Items**
1. **Agregar Item**
   - Completa el formulario
   - Click "Agregar Item"
   - El item aparecerá en la lista

2. **Editar Item**
   - Click en "Editar" en cualquier item
   - Modifica los campos
   - Click "Actualizar Item"

3. **Eliminar Item**
   - Click en "Eliminar" en cualquier item
   - Confirma la eliminación

### **Filtros**
1. **Por Categoría**
   - Selecciona una categoría del dropdown
   - Click "Aplicar Filtros"

2. **Por Stock Bajo**
   - Ingresa una cantidad (ej: 10)
   - Click "Aplicar Filtros"
   - Muestra items con ≤ esa cantidad

3. **Combinado**
   - Selecciona categoría Y stock
   - Click "Aplicar Filtros"

### **Estadísticas**
Se actualizan automáticamente y muestran:
- 📦 Total de items diferentes
- 📚 Total de unidades en stock
- 💰 Valor total del inventario
- 📈 Precio promedio por item

## 🎯 Ejemplos de Items

```javascript
// Item 1: Laptop
{
  "nombre": "Laptop Dell XPS 15",
  "categoria": "Tecnología",
  "cantidad": 25,
  "precioUnitario": 1299.99
}

// Item 2: Silla
{
  "nombre": "Silla Ergonómica Herman Miller",
  "categoria": "Mobiliario",
  "cantidad": 10,
  "precioUnitario": 799.99
}

// Item 3: Audífonos
{
  "nombre": "Audífonos Sony WH-1000XM5",
  "categoria": "Audio",
  "cantidad": 20,
  "precioUnitario": 349.99
}
```

## 🎨 Diseño

- **Colores principales:**
  - Primario: #2c3e50 (Azul oscuro)
  - Secundario: #3498db (Azul)
  - Éxito: #27ae60 (Verde)
  - Advertencia: #f39c12 (Naranja)
  - Peligro: #e74c3c (Rojo)

- **Componentes:**
  - Bootstrap 5.3.2
  - Bootstrap Icons 1.11.1
  - Diseño custom con gradientes

## 📱 Responsividad

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (< 768px)

## 🐛 Troubleshooting

### Error "No configurado"
**Solución:** Ingresa la URL de tu API en la configuración y haz click en "Guardar"

### No se cargan los items
**Solución:** 
1. Verifica que la API esté desplegada y funcionando
2. Revisa que la URL sea correcta
3. Verifica que el backend tenga PostgreSQL conectado

### Los filtros no funcionan
**Solución:** Asegúrate de que la API esté respondiendo correctamente en los endpoints:
- `/api/inventario/categoria/{categoria}`
- `/api/inventario/bajo-stock/{cantidad}`

## 📄 Estructura del Proyecto

```
inventario-frontend/
├── index.html          # Página principal
├── app.js             # Lógica de la aplicación
├── package.json       # Configuración para Railway
└── README.md          # Este archivo
```

## 🌐 URLs de Ejemplo

**Backend API:**
```
https://inventario-api-production.up.railway.app
```

**Frontend desplegado:**
```
https://inventario-frontend-production.up.railway.app
```

## 🎓 Presentación del Examen

### **Puntos a demostrar:**

1. **Configuración:**
   - Muestra cómo se configura la URL de la API

2. **CRUD Completo:**
   - Crea un item en vivo
   - Edita un item existente
   - Elimina un item

3. **Estadísticas:**
   - Muestra las estadísticas en tiempo real
   - Explica cómo se calculan

4. **Filtros:**
   - Filtra por categoría
   - Filtra por stock bajo
   - Muestra filtros combinados

5. **Diseño:**
   - Muestra el diseño responsivo
   - Destaca los indicadores visuales de stock

## 💡 Tips para el Examen

- Prepara algunos items de ejemplo antes del examen
- Ten la API y el frontend desplegados
- Practica el flujo completo de CRUD
- Conoce las estadísticas que se muestran
- Familiarízate con los filtros

## 📦 Stack Tecnológico

- **HTML5**: Estructura
- **CSS3**: Estilos personalizados
- **Bootstrap 5.3.2**: Framework CSS
- **JavaScript (Vanilla)**: Lógica
- **Bootstrap Icons**: Iconografía
- **http-server**: Servidor estático



---


