document.addEventListener('DOMContentLoaded', function() {
    const listaProductosCarrito = document.querySelector('.lista-productos-carrito');
    const resumenSubtotal = document.getElementById('resumen-subtotal');
    const resumenTotal = document.getElementById('resumen-total');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function renderizarCarrito() {
        listaProductosCarrito.innerHTML = '';
        if (carrito.length === 0) {
            listaProductosCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
            actualizarResumen(0);
            return;
        }

        let subtotal = 0;
        carrito.forEach(producto => {
            const itemHTML = `
                <div class="carrito-item" data-id="${producto.id}">
                    <img src="${producto.img}" alt="${producto.nombre}" class="item-imagen">
                    <div class="item-info">
                        <p class="item-nombre">${producto.nombre}</p>
                        <p class="item-precio">$${producto.precio.toFixed(2)}</p>
                    </div>
                    <div class="item-cantidad">
                        <input type="number" value="${producto.cantidad}" min="1" class="input-cantidad">
                    </div>
                    <p class="item-subtotal">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    <button class="item-eliminar">×</button>
                </div>
            `;
            listaProductosCarrito.innerHTML += itemHTML;
            subtotal += producto.precio * producto.cantidad;
        });

        actualizarResumen(subtotal);
        agregarListeners();
    }

    function actualizarResumen(subtotal) {
        const total = subtotal; // Puedes añadir lógica de envío aquí
        resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        resumenTotal.textContent = `$${total.toFixed(2)}`;
    }

    function agregarListeners() {
        document.querySelectorAll('.item-eliminar').forEach(boton => {
            boton.addEventListener('click', eliminarDelCarrito);
        });
        document.querySelectorAll('.input-cantidad').forEach(input => {
            input.addEventListener('change', actualizarCantidad);
        });
    }
    
    function eliminarDelCarrito(evento) {
        const productoId = parseInt(evento.target.closest('.carrito-item').getAttribute('data-id'));
        carrito = carrito.filter(producto => producto.id !== productoId);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    function actualizarCantidad(evento) {
        const productoId = parseInt(evento.target.closest('.carrito-item').getAttribute('data-id'));
        const nuevaCantidad = parseInt(evento.target.value);
        const productoEnCarrito = carrito.find(producto => producto.id === productoId);
        
        if (productoEnCarrito && nuevaCantidad > 0) {
            productoEnCarrito.cantidad = nuevaCantidad;
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    renderizarCarrito();
});