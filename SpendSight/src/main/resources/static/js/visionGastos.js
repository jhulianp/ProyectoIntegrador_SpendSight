document.addEventListener("DOMContentLoaded", () => {
    
    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    const lista = document.getElementById("listaGastos");

    if (gastos.length === 0) {
        lista.innerHTML = "<li>No hay gastos registrados.</li>";
    } else {
        gastos.forEach(gasto => {
            const item = document.createElement("li");
            item.innerHTML = `
                <strong>${gasto.nombre}</strong> - ${gasto.fecha}<br>
                Categoría: ${gasto.categoria} | Costo: $${gasto.costo}<br>
                Descripción: ${gasto.descripcion}
            `;
            lista.appendChild(item);
        });
    }
});
