//Colores por defecto del tablero

let color_celdaclara='#F2F2F2';
let color_celdaoscura='#A4A4A4';

//Colores por defecto de las fichas

let color_fichaclara='#DF013A';
let color_fichaoscura='#000000';

//guarda la ubicacion anterior de una ficha que se ha movido
let posTop,posLeft;

//guarda quien tiene el turno de jugar si las fichas claras o las oscuras
let alTurno="fichaclara";

//Letras de las columnas
const letrasArray = ['a', 'b', 'c','d','e','f','g','h'];

const mensMovInv="Movimiento Inválido";
const mensTurInv="Espera tu turno";

// Funcion principal que se ejecuta una vez se haya cargado el documento html
$(document).ready(function(){

	$("#tablero").html(dibujarTablero());
	
	colorearCeldas();
	crearFichas();
	colorearFichas();
	cumplirReglas();
});



//Funcion que dibuja el tablero de damas
function dibujarTablero(){

	let htmlTablero="";
	let letras=dibujarLetras();

	htmlTablero+=letras;
	htmlTablero+=dibujarCeldas();
	htmlTablero+=letras;

	return htmlTablero;
	
}

//Funcion que dibuja las letras en la parte inferior y superior del tablero
function dibujarLetras(){
	let letrasHtml="";

	letrasHtml+='<div class="numero"></div>';
	for(let j=0;j<8;j++){

		letrasHtml+='<div class="letra ancho">'+letrasArray[j]+'</div>'

	}
	letrasHtml+='<div class="numero"></div>';
	return letrasHtml;
}


//Funcion que dibuja las celdas del tablero
function dibujarCeldas(){

	let k,idCelda;
	let htmlCeldas="";

	for(var i=8;i>=1;i-=2)
	{
		k=i-1;
		htmlCeldas+='<div class="fila" id="fila'+i+'">'+'<div class="numero">'+i+'</div>';
		for(let j=0;j<8;j+=2)
		{
			idCelda=celdaId(letrasArray[j],i);
			htmlCeldas+='<div id='+idCelda+' class="celdaclara ancho altocelda celda "></div>';

			idCelda=celdaId(letrasArray[j+1],i)
			htmlCeldas+='<div id='+idCelda+' class="celdaoscura ancho altocelda celda"></div>';

		}
		
		htmlCeldas+='<div class="numero">'+i+'</div></div>';

		htmlCeldas+='<div class="fila" id="fila'+k+'">'+'<div class="numero">'+k+'</div>';
		for(let j=0;j<8;j+=2)
		{
			idCelda=celdaId(letrasArray[j],k)
			htmlCeldas+='<div id='+idCelda+' class="celdaoscura ancho altocelda celda"></div>';

			idCelda=celdaId(letrasArray[j+1],k)
			htmlCeldas+='<div id='+idCelda+' class="celdaclara ancho altocelda celda "></div>';
		}
		
		htmlCeldas+='<div class="numero">'+k+'</div></div>';
	} 
	
	return htmlCeldas;
}

//Funcion que colorea las celdas

function colorearCeldas(){

	$(".celdaclara").css("background-color", color_celdaclara);
	$(".celdaoscura").css("background-color", color_celdaoscura);

}

//Funcion que colorea las fichas

function colorearFichas(){

	$(".fichaoscura").css("background-color", color_fichaoscura);
	$(".fichaclara").css("background-color", color_fichaclara);

}

//Funcion que organiza las fichas en el tablero
function crearFichas(){
	let i,indicecelda;
	
	for(i=8;i>=6;i--){
		
		colocarEnFila(i%2,i,"fichaoscura");
	}

	for(i=3;i>=1;i--){
		
		colocarEnFila(i%2,i,"fichaclara");
	}	

}

//Funcion que crea las fichas
function colocarEnFila(par,fila,tipo){
	let inicio, fin, indicecelda,indiceficha,indiceficha2;

	if(par==0){
		inicio=1;
		fin=7;
	}else{
		inicio=0;
		fin=6;
	}

	for(let i=inicio;i<=fin;i+=2){
		
		indicecelda='#'+celdaId(letrasArray[i],fila);
		indiceficha=fichaId(letrasArray[i],fila);
		
		fichaAlTablero(indiceficha);
		$(indicecelda).append('<div id="'+indiceficha+'" class="'+tipo+' ficha" ></div>');
		
		indiceficha2='#'+fichaId(letrasArray[i],fila);
		

		
		$(indiceficha2).position({
			my:"center",
			at:"center",
			of:indicecelda,
		});	



	}
}




//Funcion que agrega las fichas al Json tablero
function fichaAlTablero(idFicha){

	let nuevaCelda,nombre,habilitada;

	datosFicha=idFicha.split("_");
	
	columna=datosFicha[1];
	poscolumna=$.inArray(columna, letrasArray);

	fila=datosFicha[2];

	idCelda=celdaId(columna,fila);

	
	for(let i=0;i<tablero.length;i++){
		
		if(tablero[i].nombre==idCelda){

			tablero[i].ocupadaPor=idFicha;
		}
	}
	
}


//Funcion que valida que los movimientos de las fichas se ajusten a las reglas del juego

function cumplirReglas(){
	let idFicha,identificador;

	//Define a que celdas se pueden mover las fichas
	$(".ficha").draggable({
		start:function(event,ui){
			idFicha='#'+$(this).attr("id");
			mover(idFicha)},
		containment: "#tablero",
		scroll: false
	})


	// No se permite colocar fichas en las celdas claras, ni sobre los numeros o letras del tablero
	$(".celdaclara,.numero,.letra").droppable({
		drop:function(event,ui){
			
			idFicha='#'+ui.draggable.attr("id");

			movInvalido(idFicha,mensMovInv,"No se permite colocar fichas en las celdas claras, ni sobre los numeros o letras del tablero");
		}
	});	

	//Define el comportamiento de las fichas cuando se mueven a una celda oscura y
	//Tambien define el comportamiento visual de las celdas oscuras a partir de los movimientos de las fichas
	$(".celdaoscura").droppable({
		drop:function(event,ui){
			let identificador='#'+$(this).attr("id");
			let minLeft,maxLeft

			idFicha='#'+ui.draggable.attr("id");
			let xFicha = $(idFicha).position();
			let xCeldaFinal = $(identificador).position();
			let xCeldaInicial = $(idFicha).parent().position();

			let baseFicha=xFicha.top+$(idFicha).height();
			let fichaRight=xFicha.left+$(idFicha).width();

			let baseCeldaFinal=xCeldaFinal.top+$(identificador).height();
			let baseCeldaInicial=xCeldaInicial.top+$(identificador).height();

			let comiendo=estaComiendo(ui.draggable.attr("id"),$(idFicha).parent().attr("id"),$(this).attr("id"));

			if(!comiendo)
			{
				minLeft=xCeldaInicial.left-$(identificador).width();
				maxLeft=xCeldaInicial.left+$(identificador).width()*2;
			}else{
				minLeft=xCeldaInicial.left-$(identificador).width()*2;
				maxLeft=xCeldaInicial.left+$(identificador).width()*3;
			}

			let maxY,minY;
		

			let hijos=$(identificador).children('.ficha');
			//No puede avanzar a una celda ocupada por otra ficha
			if(hijos.length>0){
				for(let i=0;i<hijos.length;i++)
				{
					console.log("hijo "+i+": "+hijos[i].id);
					if(hijos[i].id!=ui.draggable.attr("id")){
						movInvalido(idFicha,mensMovInv,"No puede avanzar a una celda ocupada por otra ficha");
					}
					
				}	

			}else{
				
				if(esReina()){

				}
				else{ 

					if($(idFicha).hasClass("fichaclara")){

						//Las fichas claras deben subir
						if(xFicha.top>posTop){
							movInvalido(idFicha,mensMovInv,"No puedes retroceder");
							return(false);
						}else{
							//Solo pueden avanzar un paso a la vez a menos que esten comiendo al contrario
							if(xFicha.top>maxY){

								movInvalido(idFicha,mensMovInv,"Sólo se debe avanzar un paso a la vez");
								return(false);									
								
							}							
						}

					}else{
						//Las fichas oscuras deben bajar


						if(baseFicha<minY){

							
							movInvalido(idFicha,mensMovInv,"No puedes retroceder");
							return(false);
						}else{
							//Solo pueden avanzar un paso a la vez a menos que esten comiendo al contrario
							if(xFicha.top>maxY){
								
								movInvalido(idFicha,mensMovInv,"Sólo se debe avanzar un paso a la vez");
								return(false);									
								
							}							
						}
					}

					//Solo se puede avanzar a las celdas diagonales inmediatas
					if(xFicha.left<minLeft || fichaRight>maxLeft){
						movInvalido(idFicha,mensMovInv,"Solo se puede avanzar a las celdas diagonales inmediatas");
						return(false);
					}
					if(!comiendo)
					{
						$(idFicha).appendTo(identificador);
						switchTurno();	
					}


					return(true);
				}
			}
		},
		tolerance: "touch"
	});	

}

//Funcion para crear los ids de las celdas
function celdaId(columna,fila){
	let idCelda='celda_'+columna+'_'+fila;
	return idCelda;
}

//Funcion para crear los ids de las fichas
function fichaId(columna,fila){
	let idFicha='ficha_'+columna+'_'+fila;
	return idFicha;
}

//Funcion que determina para ejecutar acciones cuando el movimiento no sea válido
function movInvalido(idFicha,mensaje,detalle){
	
	alert(mensaje+"\n"+detalle);	

	//Regresa la ficha a la posicion anterior
	$(idFicha).css("top", posTop);
	$(idFicha).css("left", posLeft);
}

function mover(idFicha){

	let x = $(idFicha).position();
	posTop=x.top;
	posLeft=x.left;

	//solo se permite mover las fichas que tienen el turno de jugar
	if (!$(idFicha).hasClass(alTurno)){

		movInvalido(idFicha,mensTurInv,"Le toca jugar al bando contrario");
		
	}

}

//Funcion que indica si una ficha es una reina
function esReina(){return false;}

//Funcion que indica si una ficha se esta comiendo a un contrario
function estaComiendo(idFicha,idCeldaAnterior,idCeldaNueva){

	let datosCeldaA=idCeldaAnterior.split("_");
	let datosCeldaN=idCeldaNueva.split("_");
	let columCeldaM,filaCeldaM,contrario,idCeldaM;

	if($.inArray(datosCeldaA[1], letrasArray)>$.inArray(datosCeldaN[1], letrasArray)){

		columCeldaM=$.inArray(datosCeldaA[1], letrasArray)-1;	
	}else{
		columCeldaM=$.inArray(datosCeldaA[1], letrasArray)+1;	
	}

	if(datosCeldaA[2]>datosCeldaN[2]){
		filaCeldaM=parseInt(datosCeldaA[2])-1;
	}else{
		filaCeldaM=parseInt(datosCeldaA[2])+1;
	}

	idCeldaM='#celda_'+letrasArray[columCeldaM]+"_"+filaCeldaM;

	console.log("Celda Intermedia: "+idCeldaM);

	let alTurnoNombre,contrarioNombre;
	
	// Verifica si en la celda intermedia se encuentra una ficha del bando contrario
	if(alTurno=='fichaclara'){
		contrario='.fichaoscura';
		alTurnoNombre="Fichas Claras";
		contrarioNombre="Fichas Oscuras";
	}else{
		contrario='.fichaclara';
	}

	let hijos=$(idCeldaM).children(contrario);


	//Si hay una ficha contraria en la celda intermedia
	if(hijos.length>0){
		$(idCeldaM).find(contrario).remove();
		
		if($(".celdaoscura").children(contrario).length==0)
		{
			alert("Ganaron las "+alTurnoNombre+"!!!!!");
		}
		return true;
	}else
	{
		return false;
	}
}


//Funcion que actualiza a quien le toca el turno de jugar
function switchTurno(){
	if(alTurno=='fichaclara'){
		alTurno='fichaoscura';
	}else{
		alTurno='fichaclara';
	}
}