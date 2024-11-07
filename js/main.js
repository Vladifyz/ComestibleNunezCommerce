let productos = [];

fetch("productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonCategoria = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let productoAgregar = document.querySelector(".producto-agregar");
const buscadorProductos = document.querySelector("#buscador");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
            `;

        contenedorProductos.append(div);
    });

    actualizarBotonCarrito();
}

buscadorProductos.addEventListener("keyup", (e) => {
    const valorBusqueda = e.target.value.toLowerCase();
    document.querySelectorAll(".producto").forEach(producto => {
        const tituloProducto = producto.querySelector(".producto-titulo").textContent.toLowerCase();
        tituloProducto.includes(valorBusqueda)
            ? producto.classList.remove("filtro")
            : producto.classList.add("filtro");
    });
});

botonCategoria.forEach(boton => {
    boton.addEventListener("click", (e) => {
        if (e.currentTarget.id !== "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            if (productosBoton.length > 0) {
                tituloPrincipal.innerText = productosBoton[0].categoria.nombre;
            }
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonCarrito() {
    productoAgregar = document.querySelectorAll(".producto-agregar")

    productoAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}