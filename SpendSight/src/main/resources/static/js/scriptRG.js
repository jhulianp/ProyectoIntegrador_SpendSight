document.addEventListener("DOMContentLoaded", () => {
    const fecha = document.getElementById("fechaGasto");
    const nombre = document.getElementById("nombre");
    const categoria = document.getElementById("categoria");
    const costo = document.getElementById("costo");
    const descripcion = document.getElementById("descripcion");
    const botonGuardar = document.getElementById("button");
    botonGuardar.textContent = "Guardar gasto";
    document.querySelector("section").appendChild(botonGuardar);

    botonGuardar.addEventListener("click", () => {
        const gasto = {
            fecha: fecha.value,
            nombre: nombre.value,
            categoria: categoria.value,
            costo: costo.value,
            descripcion: descripcion.value
        };

        let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
        gastos.push(gasto)
        localStorage.setItem("gastos", JSON.stringify(gastos));

        alert("Gasto guardado correctamente");

        fecha.value = "";
        nombre.value = "";
        categoria.value = "Comida";
        costo.value = "";
        descripcion.value = "";
    });
});
