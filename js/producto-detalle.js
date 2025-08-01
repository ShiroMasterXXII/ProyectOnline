// js/producto-detalle.js (CORREGIDO)

document.addEventListener('DOMContentLoaded', async function() {
    // Función para cargar todos los productos desde los archivos del CMS
    async function cargarProductos() {
        try {
            // Esta es una suposición de la ruta donde Netlify pone los datos.
            // Si no funciona, puede que necesitemos un paso de 'build'.
            // Por ahora, asumimos que los datos son accesibles directamente.
            const response = await fetch('/_productos/productos.json'); // O la ruta correcta
            if (!response.ok) {
                throw new Error('No se pudo cargar la data de productos.');
            }
            return await response.json();
        } catch (error) {
            console.error("Error al cargar productos:", error);
            return [];
        }
    }

    // --- LÓGICA PRINCIPAL ---
    const productos = await cargarProductos();
    const urlParams = new new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id')); // O por 'slug' si es texto
    
    // Busca el producto por un identificador único (slug o id)
    const producto = productos.find(p => p.id === productoId); // Ajustar si se usa 'slug'

    if (producto) {
        // ... (resto del código para llenar la página, crear galería, etc.) ...
        // Este código debería funcionar si 'producto' se carga correctamente.
    } else {
        // ... (código para producto no encontrado) ...
    }
});