// constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}
Seguro.prototype.cotizarSeguro = function () {
  /* 1 = Americano 1.15
      2 = Asiatico 1.05
      3 = europeo 1.35 
  */
  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
  }

  //con el year calculamos el descuento o diferencia
  // Asummimos que por cada año de antiguedad el valor sera un 3% menos
  const yearsOfAntiquity = new Date().getFullYear() - this.year;
  cantidad -= (yearsOfAntiquity * 3 * cantidad) / 100;

  /* si el seguro es basico se multiplica por un 30%mas
 si el seguro es completo se multiplica por un 50%mas
 */
  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

// MUESTRA ALERTAS EN PANTALLA
function UI() {}
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const formulario = document.querySelector("#cotizar-seguro");
  const div = document.createElement("div");

  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;
  formulario.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};
UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;
  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
  }
  // crear resultado
  const div = document.createElement("div");
  div.classList.add("mt-10");
  div.innerHTML = `
  <p class="header">Tu Resumen: </p>
  <p class="font-bold">Marca: <span class="font-normal">  ${textoMarca} </span></p>
  <p class="font-bold">Año: <span class="font-normal"> $ ${year} </span></p>
  <p class="font-bold">Tipo: <span class="font-normal capitalize"> $ ${tipo} </span></p>
  <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span></p>

  `;
  const resultadoDiv = document.querySelector("#resultado");

  // mostrar el sppiner
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block"; //activamos el sppiner

  setTimeout(() => {
    spinner.style.display = "none"; // se borra el sppiner
    resultadoDiv.appendChild(div); //se muestra el resultado
  }, 3000);
};

// llena las opciones de los años
UI.prototype.llenarOpciones = () => {
  //usaremos arrow function porque no haremos referencia a 'this' en esta funcion
  const max = new Date().getFullYear(); // me selecciona el año actual
  min = max - 20;

  //seleccionar el selector de años
  const selectYear = document.querySelector("#year");
  // vamos a iterar sobre el año para suminitrar los años al selector
  for (let i = max; i >= min; i--) {
    //creamos el html que se generara al hacer la iteracion
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

// instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

eventListeners();
function eventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  // leer marca seleccionada
  const marca = document.querySelector("#marca").value;
  // leer año seleccionada
  const year = document.querySelector("#year").value;
  // leer tipo de seguro seleccionado
  const tipo = document.querySelector('input[name = "tipo" ]:checked').value;

  //VALIDACION
  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  ui.mostrarMensaje("cotizando...", "correcto");
  //ocultar las cotizaciones previas
  const resultados = document.querySelector("#resultado div");
  if (resultados !== null) {
    resultados.remove();
  }

  // Instanciar el constructor seguro
  const seguro = new Seguro(marca, year, tipo);
  //mandamos a llamar al proto para que realize la cotizacion

  const total = seguro.cotizarSeguro();

  ui.mostrarResultado(total, seguro);
}
