/*--------------------------------------- VARIABLES GLOBALES Y CONSTANTES ----------------------------------------------*/

/************* Ruta para las imágenes de las frutas *************/

const RUTAIMGPNG="img/frutas/";
const RUTAIMGSVG="img/frutas/SVG/";

/*********** Variables que controlan el estado actual del juego ***********/
estadoActual=0;
let ronda=0;
const ESTADOS=[
	{
		"clase":"revInac",
		"txtBoton":"REVISAR",
		"txtTitulo":"",
		"txtMensaje":""
	},
	{	
		"clase":"revAct",
		"txtBoton":"REVISAR",
		"txtTitulo":"",
		"txtMensaje":""
	},
	{	
		"clase":"positivo",
		"txtBoton":"ENVIAR",
		"txtTitulo":"¡MUY BIEN!",
		"txtMensaje":"Así se hace."
	},
	{	
		"clase":"negativo",
		"txtBoton":"CONTINUAR",
		"txtTitulo":"¡Oops!",
		"txtMensaje":"Algo anda mal."
	},
	{	
		"clase":"negativo",
		"txtBoton":"ENVIAR",
		"txtTitulo":"¡Pon atención!",
		"txtMensaje":"Esta es la respuesta correcta."
	}
];

/*********** Constante y variable que registran los valores de los signos "<" y "<" *************/

const SIGNOS=[
	{"signo":"<","clase":"menorQue"},
	{"signo":">","clase":"mayorQue"}
];

let signosAleatorios;

/***********Arreglo que contiene los daos de las frutas************/

const FRUTAS = [
	{"nombre":"Damasco","precio":800,"unidad":"el kilo","imagen":"Damasco"},
	{"nombre":"Durazno","precio":650,"unidad":"el kilo","imagen":"Durazno"},
	{"nombre":"Frambueza","precio":2500,"unidad":"el kilo","imagen":"Frambuesa"},
	{"nombre":"Frutilla","precio":1500,"unidad":"el kilo","imagen":"Frutilla"},
	{"nombre":"Manzana","precio":450,"unidad":"el kilo","imagen":"Manzana"},
	{"nombre":"Naranja","precio":530,"unidad":"el kilo","imagen":"Naranja"},
	{"nombre":"Pera","precio":430,"unidad":"el kilo","imagen":"Pera"},
	{"nombre":"Plátano","precio":650,"unidad":"el kilo","imagen":"Platano"},
	{"nombre":"Sandía","precio":1000,"unidad":"la unidad","imagen":"Sandia"},
	{"nombre":"Uva","precio":1800,"unidad":"el kilo","imagen":"Uva"},
];

/**************Variable que guarda las posiciones de las frutas seleccionadas ***********/

let seleccionadas;

/************Variable que guarda los valores de las frutas seleccionadas ****************/

let valoresSel;

/*-------------------------------------- FUNCIONES GENERALES ------------------------------------------------*/

/*************** Funciones que inician y reinician las rondas de juego ************/

$(document).ready(function(){
	iniciarRonda();
});

function iniciarRonda()
{
	// Actualiza el numero de ronda
	ronda++;

	// Inicializa las variables globales
	seleccionadas=[];
	valoresSel=[];
	signosAleatorios=[];

	//Vacia los cajones y los signos

	$("#contenedor_0").empty();
	$("#contenedor_1").empty();
	$("#contenedor_2").empty();

	$("#signo_0").empty();
	$("#signo_1").empty();

	//Determina el comportamiento de los botones al hacer click
	actualizarFuncionalidad()

	//Selecciona las frutas aa mostrar de manera aleatoria
	frutasAleatorias();

	// Muestra las frutas
	mostrarFrutas();

	// Actualiza los signos mayor que y menor que
	colocarSignos();

	// Da movimiento a las frutas y Establece las acciones a ejecutar cuando estas se sueltan en un cajon
	animarFrutas();

}


/*********Funcion que busca un valor en un arreglo***********/

function siExiste(arreglo,valor){
	
	for(i=0;i<arreglo.length;i++)
	{
		if(arreglo[i]==valor)
		{
			return true;
		}			
	}
	return false;
}

/******* Funcion que le da formato de moneda al precio ******/

function toCurrency(amount) {
  
  let numero=new Intl.NumberFormat("de-DE").format(amount);
  return "$" + numero;
};

/******* Funcion que devuelve los datos de una fruta ********/

function buscarFruta(fruta){
	for(let i=0;i<FRUTAS.length;i++)
	{
		if(FRUTAS[i].imagen==fruta){
			return FRUTAS[i];
		}
	}
}

/****** Funcion que determina si los cajones estan llenos *******/

function cajonesLlenos(){
	let cajon;
	for(let i=0;i<3;i++)
	{
		cajon='#contenedor_'+i;
		
		if($(cajon).children().length==0){
			return false;
		}
	}
	return true;	
}

/******* Funcion que ordena las frutas seleccionadas de acuerdo al precio *********/

function ordenarSeleccionados() {

	for(let i=0;i<2;i++){
		for(j=1;j<3;j++){
			if(valoresSel[i].precio>valoresSel[j].precio){
				temporal=valoresSel[i];
				valoresSel[i]=valoresSel[j];
				valoresSel[j]=temporal;
			}
		}
		
	}	
}


/*--------------------------------------- MOSTRAR FRUTAS -----------------------------------------------*/

/************Funcion que muestra las frutas de manera aleatoria***************/

function mostrarFrutas()
{
	let padre,srcRuta,srcsetRuta;


	for(let i=0;i<seleccionadas.length;i++)
	{
		padre='#fruta_'+i;

		srcRuta=RUTAIMGPNG+FRUTAS[seleccionadas[i]].imagen+".png";

		srcsetRuta=RUTAIMGSVG+FRUTAS[seleccionadas[i]].imagen+".svg";

		$(padre).append('<img id="'+FRUTAS[seleccionadas[i]].imagen+'" class="imgFruta" src="'+srcRuta+'" srcset="'+srcsetRuta+'"></div>');
		
		valoresSel[i]=FRUTAS[seleccionadas[i]];
	
	}
}

/*******************Funcion que selecciona las frutas de manera aleatoria******************/

function frutasAleatorias(){

	let aleatorio;

	//Agrega la primera fruta aleatoria
	aleatorio=Math.trunc(Math.random()*FRUTAS.length);
	seleccionadas.push(aleatorio);
	
	//Luego selecciona las otras frutas verificando que no se repitan
	while(seleccionadas.length<3)
	{		
		aleatorio=Math.trunc(Math.random()*FRUTAS.length);
		if(!siExiste(seleccionadas,aleatorio) && precioDistinto(aleatorio)){
			seleccionadas.push(aleatorio);

		}

	}

	return seleccionadas;
}

/************Funcion para validar que las frutas seleccionadas tengan distinto precio *******/

function precioDistinto(aleatorio){

	
	for(let i=0;i<seleccionadas.length;i++){

		if(FRUTAS[seleccionadas[i]].precio==FRUTAS[aleatorio].precio){
			return false;
		}
	}
	return true;
}

/*----------------------------------------------- COLOCAR SIGNOS -------------------------------------------*/

/**********Funcion que genera los signos aleatorios****************/

function colocarSignos(){

	signosAleatorios[0]=Math.round(Math.random());
	signosAleatorios[1]=Math.round(Math.random());
	
	$("#signo_0").append('<img id="imgSigno_0" class="'+SIGNOS[signosAleatorios[0]].clase+'" src="img/menor_que.png" srcset="img/menor_que.svg"></div>');
	$("#signo_1").append('<img id="imgSigno_1" class="'+SIGNOS[signosAleatorios[1]].clase+'" src="img/menor_que.png" srcset="img/menor_que.svg"></div>');
}

/*----------------------------------------------- ANIMAR OBJETOS -------------------------------------------*/


/******* Función que permite arrastrar y le da un comportamiento animado a las frutas **************/

function animarFrutas(){

	// Muestra la informacion de la fruta cuando se le hace click

	mostrarInformacion()
	
	// Permite que las frutas puedan ser arrastradas y que sólo puedan soltarse en los cajones
	$(".imgFruta").draggable({
	    revert : "invalid"
	});

	// Permite que los cajones reciban las frutas

	$(".cajon").droppable({
		drop:function(event,ui){
			
			//Toma los datos de la fruta arrastrada y del contenedor que la recibe
			let fruta='#'+ui.draggable.attr("id");
			let datosId=this.id.split("_");
			let contenedor='#contenedor_'+datosId[1];
			
			//Si existe otra fruta en el cajon la devuelve al area de seleccion

			if($(contenedor).children().length>0){
				let idfrutaAnterior='#'+$(contenedor).children()[0].id;
				let espacio=buscarEspacio();

				$(idfrutaAnterior).appendTo(espacio);
			}


			//Agrega la fruta nueva al contenedor
			
			$(fruta).appendTo(contenedor);

			//Ubica la fruta al centro de su nuevo contenedor

			//let tope=-1*$(contenedor).height()/2;
			
			//centra la fruta en el cajon
			$(fruta).css('width','65%');
			$(fruta).css('left','0px');
			//$(fruta).css('top',tope); 
			$(fruta).css('margin-left','15%'); 
			let tope=-1*$(contenedor_0).height()/2;

			let indiceContFrut=contenedor+" .imgFruta"

			$(indiceContFrut).css('top',tope);
			//Verifica si todos los cajones estan llenos

			if(cajonesLlenos()){
				estadoActual+=1;
				actualizarFuncionalidad();
			}
		}
	});	
}



/*******************  Muestra la informacion de la fruta al hacer click **********************/

function mostrarInformacion(){

	let srcRuta,srcSetRuta;


	$(".imgFruta").on("click", function(e){

		let fruta = e.target.id;
		let seleccionada=buscarFruta(fruta);

		srcRuta=RUTAIMGPNG+seleccionada.imagen+".png";
		srcSetRuta=RUTAIMGSVG+seleccionada.imagen+".svg";

		$("#nombre").html(seleccionada.nombre);
		$("#precio").html(toCurrency(seleccionada.precio)+" "+seleccionada.unidad);
		$("#imgFrutaSel").attr('src',srcRuta);
		$("#imgFrutaSel").attr('srcset',srcSetRuta);

	});
}

/********************** Funcion que busca un div vacio en el area de seleccion ***************/

function buscarEspacio(){

	let espacio;

	for(let i=0;i<3;i++){
		espacio='#fruta_'+i;
		if($(espacio).children().length==0){
			return espacio;
		}
	}
}


/************Funcion que establece el comportamiento del boton ***********/

function actualizarFuncionalidad(){

	switch (estadoActual) {
  	case 0:

  		if(ronda>1){
  			$("#aceptar").prop("onclick", null).off("click");
  		}else{
  			$("#feedback").addClass(ESTADOS[0].clase);
  		}
  		// el boton permanece inactivo hasta que el usuario llene los tres canastos
		$("#aceptar").prop('disabled', 'disabled');
		
		break;

  	case 1:

  		//Actualiza el estilo del feedback
  		$("#feedback").switchClass(ESTADOS[0].clase, ESTADOS[1].clase,500,'easeInOutBounce');
		$("#titulo").html(ESTADOS[1].txtTitulo);
		$("#descripcion").html(ESTADOS[1].txtMensaje);
		$("#aceptar").html(ESTADOS[1].txtBoton);

		// Desactiva el movimiento de las frutas
		$(".imgFruta").draggable( "disable" );
		//Se activa el boton
  		$("#aceptar").removeAttr('disabled'); 

  		// Indica que acciones ejecutar al hacer click
  		$("#aceptar").on("click", function(){
  		
  			let resultado=revisar();
  			//Revisa el resultado
	  		if(revisar(resultado)){
	  			estadoActual=estadoActual+1;
	  		}else{
	  			estadoActual=estadoActual+2;
	  		}
	  		actualizarFuncionalidad();
		});
		
  	break;
  	
    case 2:

   		//Actualiza el estilo del feedback
  		$("#feedback").switchClass(ESTADOS[1].clase, ESTADOS[2].clase,500,'easeInOutBounce');
		$("#titulo").html(ESTADOS[2].txtTitulo);
		$("#descripcion").html(ESTADOS[2].txtMensaje);
		$("#aceptar").html(ESTADOS[2].txtBoton);

		$("#aceptar").prop("onclick", null).off("click");
		//Reinicia el juego
  		$("#aceptar").on("click", function(){
    		//Actualiza el estilo del feedback
	  		$("#feedback").switchClass(ESTADOS[2].clase, ESTADOS[0].clase,500,'easeInOutBounce');
			$("#titulo").html(ESTADOS[0].txtTitulo);
			$("#descripcion").html(ESTADOS[0].txtMensaje);
			$("#aceptar").html(ESTADOS[0].txtBoton); 	
			estadoActual=0;		
  			iniciarRonda();
		});

  	break;

  	case 3:
  			
  		//Actualiza el estilo del feedback
  		$("#feedback").switchClass(ESTADOS[1].clase, ESTADOS[3].clase,500,'easeInOutBounce');
		$("#titulo").html(ESTADOS[3].txtTitulo);
		$("#descripcion").html(ESTADOS[3].txtMensaje);
		$("#aceptar").html(ESTADOS[3].txtBoton);

		// Indica que acciones ejecutar al hacer click
		$("#aceptar").prop("onclick", null).off("click");
  		$("#aceptar").on("click", function(){
  			estadoActual=estadoActual+1;
  			actualizarFuncionalidad();
		});
			
  	break;

  	case 4:
  			
  		//Actualiza el estilo del feedback
		$("#titulo").html(ESTADOS[4].txtTitulo);
		$("#descripcion").html(ESTADOS[4].txtMensaje);
		$("#aceptar").html(ESTADOS[4].txtBoton);

		//Muestra el resultado correcto
		mostrarResultado();

		$("#aceptar").prop("onclick", null).off("click");
  		$("#aceptar").on("click", function(){
  			//Actualiza el estilo del feedback
	  		$("#feedback").switchClass(ESTADOS[4].clase, ESTADOS[0].clase,500,'easeInOutBounce');
			$("#titulo").html(ESTADOS[0].txtTitulo);
			$("#descripcion").html(ESTADOS[0].txtMensaje);
			$("#aceptar").html(ESTADOS[0].txtBoton); 	
			estadoActual=0;		
  			iniciarRonda();
		});
  	break;
	}
}

/****** Función que verifica si el usuario ingresó la respuesta correcta ******/

function revisar(){
	

	valoresSel[0]=buscarFruta($("#contenedor_0").children()[0].id);
	valoresSel[1]=buscarFruta($("#contenedor_1").children()[0].id);
	valoresSel[2]=buscarFruta($("#contenedor_2").children()[0].id); 

	let expresion1=valoresSel[0].precio+SIGNOS[signosAleatorios[0]].signo+valoresSel[1].precio;
	let expresion2=valoresSel[1].precio+SIGNOS[signosAleatorios[1]].signo+valoresSel[2].precio;
		
	if(eval(expresion1) && eval(expresion2)){
		return true;
	}else{
		return false;
	}
}

/*****Funcion que busca una respuesta correcta al ejercicio **************/

function mostrarResultado(){

	ordenarSeleccionados()

	let primera,segunda,tercera;

	if(signosAleatorios[0]==signosAleatorios[1])
	{
		if(signosAleatorios[0]==0){
			primera='#'+valoresSel[0].imagen;
			segunda='#'+valoresSel[1].imagen;
			tercera='#'+valoresSel[2].imagen;
		}else{

			primera='#'+valoresSel[2].imagen;	
			segunda='#'+valoresSel[1].imagen;	
			tercera='#'+valoresSel[0].imagen;		
		}
	}else{
		if(signosAleatorios[0]==0){
			primera='#'+valoresSel[0].imagen;
			segunda='#'+valoresSel[2].imagen;
			tercera='#'+valoresSel[1].imagen;
		}else{
			primera='#'+valoresSel[1].imagen;
			segunda='#'+valoresSel[0].imagen;
			tercera='#'+valoresSel[2].imagen;
		}
	}
	
	$(primera).appendTo(contenedor_0);
	$(segunda).appendTo(contenedor_1);
	$(tercera).appendTo(contenedor_2);
	
}