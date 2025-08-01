document.addEventListener('DOMContentLoaded', function() {
    // ... (Tu código para el botón de regresar) ...
    
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));
    const producto = productos.find(p => p.id === productoId);

    if (producto) {
        // ... (Tu código que llena el título, precio, etc.) ...

        const imagenPrincipal = document.getElementById('imagen-principal');
        const galeriaMiniaturas = document.getElementById('galeria-miniaturas');

        // Función para crear la galería
        function crearGaleria(imagenes) {
            if (!imagenes || imagenes.length === 0) return;

            // Muestra la primera imagen como la principal
            imagenPrincipal.src = imagenes[0].url;

            // Limpia las miniaturas anteriores
            galeriaMiniaturas.innerHTML = '';

            // Crea una miniatura por cada imagen
            imagenes.forEach(img => {
                const miniatura = document.createElement('img');
                miniatura.src = img.url;
                miniatura.alt = "miniatura del producto";
                miniatura.classList.add('miniatura');
                
                // Añade un evento para cambiar la imagen principal al hacer clic
                miniatura.addEventListener('click', () => {
                    imagenPrincipal.src = img.url;
                });
                
                galeriaMiniaturas.appendChild(miniatura);
            });
        }
        
        // Llama a la función con las imágenes del producto
        crearGaleria(producto.imagenes);

    } else {
        // ... (Tu código para producto no encontrado) ...
    }
});