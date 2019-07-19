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
			console.log("al turno:"+alTurno);

			let adjac=celdasSiguientes($(idFicha).parent().attr("id"));	
			console.log("Celdas adjacentes: "+adjac);
			console.log("identificador: "+identificador);
			if($.inArray(identificador, adjac)>=0){
				$(idFicha).appendTo(identificador);
				switchTurno();
			}else{
				movInvalido(idFicha,mensMovInv,"Sólo puede moverse a las celdas adjacentes disponibles");
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

//Funcion que valida quien tiene el turno para jugar
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



//Funcion que devuelve las celdas adjacentes
function celdasSiguientes(idCelda){


	let resultado=[];
	let i=0;
	let posIzq,posDer,celdaIzq="",celdaDer="",f,fichaIzq,fichaDer;

	let datosPadre=idCelda.split("_");

	if(alTurno=='fichaclara'){
		fila=parseInt(datosPadre[2])+1;
		posIzq=$.inArray(datosPadre[1], letrasArray)-1;
		posDer=$.inArray(datosPadre[1], letrasArray)+1;
		if(posIzq>=0 && fila <8){
			celdaIzq='#celda_'+letrasArray[posIzq]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda esta ocupada

			if($(celdaIzq).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente
				console.log("hijo de la izquierda: "+$(celdaIzq).children()[0].id);
				console.log($($(celdaIzq).children()[0].id).hasClass(alTurno));
				fichaIzq='#'+$(celdaIzq).children()[0].id;
				if(!$(fichaIzq).hasClass(alTurno)){
					
					if(posIzq-1>=0 && fila+1<8){
						posIzq--;
						f=fila+1;
						celdaIzq='#celda_'+letrasArray[posIzq]+'_'+f;
					}else{
						celdaIzq="";
					}	
				}else{
					celdaIzq="";
				}
			}
		
		}
		if(posDer>=0 && fila <8){
			//resultado[i]='#celda_'+letrasArray[posDer]+'_'+fila;
			
			celdaDer='#celda_'+letrasArray[posDer]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda esta ocupada
			
			if($(celdaDer).children().length>0)
			{
				console.log("hijo de la derecha: "+$(celdaDer).children()[0].id);
				console.log($($(celdaDer).children()[0].id).hasClass(alTurno));
				//Valida si el ocupante de la celda siguiente es un oponente
				fichaDer='#'+$(celdaDer).children()[0].id;
				if(!$(fichaDer).hasClass(alTurno)){
					if(posDer+1<8 && fila+1<8){
						posDer++;
						f=fila+1;
						celdaDer='#celda_'+letrasArray[posDer]+'_'+f;
					}else{
						celdaDer="";
					}	
				}else{
					celdaDer="";
				}
			}

		}
	}else{

		fila=parseInt(datosPadre[2])-1;
		posIzq=$.inArray(datosPadre[1], letrasArray)+1;
		posDer=$.inArray(datosPadre[1], letrasArray)-1;
		if(posIzq<8 && fila >=0){
			celdaIzq='#celda_'+letrasArray[posIzq]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda est[a ocupada]

			if($(celdaIzq).children().length>0)
			{
				console.log("hijo de la izquierda: "+$(celdaIzq).children()[0].id);
				console.log($($(celdaIzq).children()[0].id).hasClass(alTurno));
				//Valida si el ocupante de la celda siguiente es un oponente
				fichaIzq='#'+$(celdaIzq).children()[0].id;
				if(!$(fichaIzq).hasClass(alTurno)){
					if(posIzq+1<8 && fila-1>=0){
						posIzq++;
						f=fila-1;
						celdaIzq='#celda_'+letrasArray[posIzq]+'_'+f;
					}else{
						celdaIzq="";
					}	
				}else{
					celdaIzq="";
				}
			}
			
		}
		if(posDer>=0 && fila >=0){
			//
			celdaDer='#celda_'+letrasArray[posDer]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda est[a ocupada]
			if($(celdaDer).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente
				console.log("hijo de la derecha: "+$(celdaDer).children()[0].id);
				console.log($($(celdaDer).children()[0].id).hasClass(alTurno));
				fichaDer='#'+$(celdaDer).children()[0].id;
				if(!$(fichaDer).hasClass(alTurno)){
					if(posDer-1>=0 && fila-1>=0){
						posDer--;
						f=fila-1;
						celdaDer='#celda_'+letrasArray[posDer]+'_'+f;
					}else{
						celdaDer="";
					}
				}else{
					celdaDer="";
				}
			}
		}
	}

	if(celdaIzq!=""){
		resultado[i]=celdaIzq;
		i++;
	}
	if(celdaDer!=""){
		resultado[i]=celdaDer;
	}	

	return resultado;
}

//Funcion que actualiza a quien le toca el turno de jugar
function switchTurno(){
	if(alTurno=='fichaclara'){
		alTurno='fichaoscura';
	}else{
		alTurno='fichaclara';
	}
}