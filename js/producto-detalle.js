// js/producto-detalle.js (CORREGIDO)

document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA PARA EL BOTÓN DE REGRESAR ---
    const btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function(event) {
            event.preventDefault();
            history.back();
        });
    }

    // --- LÓGICA PARA MOSTRAR EL PRODUCTO Y LA GALERÍA ---
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));
    const producto = productos.find(p => p.id === productoId);

    if (producto) {
        // Llenar datos del producto
        document.title = `${producto.nombre} - MiStore22`;
        document.querySelector('.producto-titulo').textContent = producto.nombre;
        document.querySelector('.producto-precio').textContent = `$${producto.precio.toFixed(2)} MX`;
        document.querySelector('.producto-descripcion-corta').textContent = producto.descripcion;

        const imagenPrincipal = document.getElementById('imagen-principal');
        const galeriaMiniaturas = document.getElementById('galeria-miniaturas');

        // Función para crear y manejar la galería
        function crearGaleria(listaDeImagenes) {
            // Verifica si hay imágenes y si la lista no está vacía
            if (!listaDeImagenes || listaDeImagenes.length === 0) {
                imagenPrincipal.alt = "Este producto no tiene imagen.";
                return; // No hagas nada más si no hay imágenes
            }

            // CORRECCIÓN CLAVE: Asigna la primera imagen de la lista a la imagen principal
            imagenPrincipal.src = listaDeImagenes[0].url;
            imagenPrincipal.alt = `Imagen principal de ${producto.nombre}`;

            // Limpia las miniaturas anteriores para no duplicarlas
            galeriaMiniaturas.innerHTML = '';

            // Crea una miniatura por cada imagen en la lista
            listaDeImagenes.forEach(img => {
                const miniatura = document.createElement('img');
                miniatura.src = img.url; // <-- Lee la propiedad 'url' de cada objeto de imagen
                miniatura.alt = "miniatura del producto";
                miniatura.classList.add('miniatura');
                
                // Evento para cambiar la imagen principal al hacer clic en una miniatura
                miniatura.addEventListener('click', () => {
                    imagenPrincipal.src = img.url;
                });
                
                galeriaMiniaturas.appendChild(miniatura);
            });
        }
        
        // Llama a la función con la lista de imágenes del producto
        crearGaleria(producto.imagenes); // <-- Le pasamos la propiedad 'imagenes' (plural)

        // Lógica del botón de WhatsApp
        const btnComprar = document.querySelector('.btn-anadir-carrito');
        btnComprar.addEventListener('click', (e) => {
            e.preventDefault();
            const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}`;
            // ¡RECUERDA PONER TU NÚMERO!
            const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappUrl, '_blank');
        });

    } else {
        const detalleLayout = document.querySelector('.producto-detalle-layout');
        if (detalleLayout) {
            detalleLayout.innerHTML = '<h1>Producto no encontrado</h1>';
        }
    }
});