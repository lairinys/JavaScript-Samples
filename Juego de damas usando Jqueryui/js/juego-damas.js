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
			let minLeft,maxLeft,adjac,celdaIni,datosCeldaIni,datosCeldaFin, avance;
			let ganador;

			idFicha='#'+ui.draggable.attr("id");
			let xFicha = $(idFicha).position();
			let xCeldaFinal = $(identificador).position();
			let xCeldaInicial = $(idFicha).parent().position();

			let baseFicha=xFicha.top+$(idFicha).height();
			let fichaRight=xFicha.left+$(idFicha).width();

			let baseCeldaFinal=xCeldaFinal.top+$(identificador).height();
			let baseCeldaInicial=xCeldaInicial.top+$(identificador).height();



			//solo se permite mover las fichas que tienen el turno de jugar
			if (!$(idFicha).hasClass(alTurno)){

				movInvalido(idFicha,mensTurInv,"Le toca jugar al equipo contrario");
				
			}else{

				//Si el equipo al turno no ha sido bloqueado

					celdaIni=$(idFicha).parent().attr("id");
					datosCeldaIni=celdaIni.split("_");
					datosCeldaFin=identificador.split("_");
					adjac=celdasSiguientes(celdaIni);

					if($.inArray(identificador, adjac)>=0){
						$(idFicha).appendTo(identificador);
						//La ficha que llegue a la primera fila del equipo contrario se convierte en reina
						if(alTurno=="fichaclara" && parseInt(datosCeldaFin[2])==8){
							$(idFicha).addClass("reina");
						}
						if(alTurno=="fichaoscura" && parseInt(datosCeldaFin[2])==1){
							$(idFicha).addClass("reina");
						}				
						avance=parseInt(datosCeldaIni[2])-parseInt(datosCeldaFin[2]);
						
						
						if(avance==1 || avance==-1){
							switchTurno();
						}else{
							// elimina una ficha del equipo contrario
							removeBetween(datosCeldaIni,datosCeldaFin);
							// si ambos equipos conservan fichas continua el juego
							if ( $(".fichaclara").get().length > 0 && $(".fichaoscura").get().length > 0  ) {

								adjac=celdasSiguientes($(this).attr("id"));
								if(adjac.length==0){
									switchTurno();
								}else{
								
									mantenerTurno=false;
									for(let i=0;i<adjac.length;i++){
										opcion1=adjac[i].split("_");
										filaIni=parseInt(datosCeldaFin[2]);
										filaFin=parseInt(opcion1[2]);
										avance=filaFin-filaIni;
										if(avance>1 || avance<-1)
										{
											mantenerTurno=true;
										}							
									}
									if(!mantenerTurno){
										switchTurno();
									}

								}

							}else{
								
								if(alTurno=="fichaclara"){ganador="equipo de fichas claras";}
									else{ganador="equipo de fichas oscuras";}
								alert("El juego ha terminado, ha ganado el "+ganador);
								$('.ficha').draggable( "destroy" );
							}
						}
						if(bloqueado()){
							if(alTurno=="fichaclara"){ganador="equipo de fichas oscuras";}
							else{ganador="equipo de fichas claras";}
							alert("Juego bloqueado, ha ganado el "+ganador);
							$('.ficha').draggable( "destroy" );
						}
							
					}else{
						movInvalido(idFicha,mensMovInv,"Sólo puede moverse a las celdas adjacentes disponibles");
					}

				

			}
			
		},
		tolerance: "touch",
		hoverClass: "celdaover",
	});	

}

//Funcion que determina si el equipo al turno ha sido bloqueado
function bloqueado(){

	let idFicha,contrario,idCelda;

	claseAlTurno='.'+alTurno;
	console.log("***********  "+alTurno+"  *************");
	for(let i=0; i<$(claseAlTurno).length;i++)
	{
	  idFicha='#'+$(claseAlTurno)[i].id;
	  idCelda=$(idFicha).parent().attr("id");
	  console.log("id celda:"+ idCelda);
	  if(celdasSiguientes(idCelda).length>0){
	  	return false;

	  }
	}

	return true;

}

//Funcion que remueve una ficha eliminada
function removeBetween(celdaIni,celdaFin){
	let filaIni,filaFin,filaInt,columIni,columFin,columInt, ficha;

	filaIni=parseInt(celdaIni[2]);
	filaFin=parseInt(celdaFin[2]);

	columIni=$.inArray(celdaIni[1], letrasArray);
	columFin=$.inArray(celdaFin[1], letrasArray);

	if(filaFin>filaIni)
	{
		filaInt=filaFin-1;
	}else
	{
		filaInt=filaIni-1;
	}

	if(columFin>columIni){
		columInt=columFin-1;
	}else
	{
		columInt=columIni-1;
	}
	celdaInt='#'+celdaId(letrasArray[columInt],filaInt);

	
	fichaInt='#'+$(celdaInt).children()[0].id;

	$(fichaInt).remove();



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



}



//Funcion que devuelve las celdas adjacentes
function celdasSiguientes(idCelda){


	let resultado=[];
	let i=0, claseFicha;
	let posIzq,posDer,celdaIzq="",celdaDer="",celdaIzqI="",celdaDerI="",f,fichaIzq,fichaDer,p;

	let datosPadre=idCelda.split("_");
	
	let celda='#'+idCelda;
	let ficha='#'+$(celda).children()[0].id;

	if($(ficha).hasClass('fichaclara')){
		claseFicha='fichaclara';
	}else{
		claseFicha='fichaoscura';
	}
	
	if(claseFicha=='fichaclara'){
		

		fila=parseInt(datosPadre[2])+1;

		posIzq=$.inArray(datosPadre[1], letrasArray)-1;
		posDer=$.inArray(datosPadre[1], letrasArray)+1;
		

		if(posIzq>=0 && fila <=8){
			celdaIzq='#celda_'+letrasArray[posIzq]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda esta ocupada

			if($(celdaIzq).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente

				fichaIzq='#'+$(celdaIzq).children()[0].id;
				if(!$(fichaIzq).hasClass(claseFicha)){
					//si la ficha a la izquierda es un contrario
					if(posIzq-1>=0 && fila+1<=8){
						p=posIzq-1;
						f=fila+1;
						celdaIzq='#celda_'+letrasArray[p]+'_'+f;
						if($(celdaIzq).children().length>0){
							celdaIzq="";
						}
					}else{
						celdaIzq="";
					}	
				}else{
					celdaIzq="";
				}
			}
		}
	
		if(posDer<8 && fila <=8){
			//resultado[i]='#celda_'+letrasArray[posDer]+'_'+fila;
			
			celdaDer='#celda_'+letrasArray[posDer]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda esta ocupada
			
			if($(celdaDer).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente
				fichaDer='#'+$(celdaDer).children()[0].id;
				if(!$(fichaDer).hasClass(claseFicha)){
					if(posDer+1<8 && fila+1<=8){
						p=posDer+1;
						f=fila+1;
						celdaDer='#celda_'+letrasArray[p]+'_'+f;
						if($(celdaDer).children().length>0){
							celdaDer="";
						}
					}else{
						celdaDer="";
					}	
				}else{
					celdaDer="";
				}
			}
			// Si es reina verifica si la celda anterior a su derecha esta ocupada
		}else{
			celdaDer="";
		}

			// Si es reina verifica si la celda anterior a su izquierda esta ocupada
					
		if($(ficha).hasClass("reina"))
		{
			posDer=$.inArray(datosPadre[1], letrasArray)-1;
			fila=parseInt(datosPadre[2])-1;
			if(posDer>=0 && fila>0){
				celdaDerI='#celda_'+letrasArray[posDer]+'_'+fila;

				//si la celda esta ocupada
				if($(celdaDerI).children().length>0)
				{
					//Valida si el ocupante de la celda siguiente es un oponente

					fichaDer='#'+$(celdaDerI).children()[0].id;

					if(!$(fichaDer).hasClass(claseFicha)){
						//si la ficha a la izquierda es un contrario
						if(posDer-1>=0 && fila>0){
							p=posDer-1;
							f=fila-1;
							celdaDerI='#celda_'+letrasArray[p]+'_'+f;
							if($(celdaDerI).children().length>0){
								celdaDerI="";
							}
						}else{
							celdaDerI="";
						}	
					}else{
						celdaDerI="";
					}
				}
			}else{
				celdaDerI="";
			}

			posIzq=$.inArray(datosPadre[1], letrasArray)+1;	
			fila=parseInt(datosPadre[2])-1;
			celdaIzqI='#celda_'+letrasArray[posIzq]+'_'+fila;
			//si la celda esta ocupada
			if($(celdaIzqI).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente

				fichaizq='#'+$(celdaIzqI).children()[0].id;
				if(!$(fichaIzq).hasClass(claseFicha)){
					//si la ficha a la izquierda es un contrario
					if(posIzq+1<8 && fila>0){
						p=posIzq+1;
						f=fila-1;
						celdaIzqI='#celda_'+letrasArray[p]+'_'+f;
						if($(celdaIzqI).children().length>0){
							celdaIzqI="";
						}
					}else{
						celdaIzqI="";
					}	
				}else{
					celdaIzqI="";
				}
			}
		}			
	}// Al turno fichas oscuras
	else
	{
		fila=parseInt(datosPadre[2])-1;
		posIzq=$.inArray(datosPadre[1], letrasArray)+1;
		posDer=$.inArray(datosPadre[1], letrasArray)-1;
		if(posIzq<8 && fila >0){
			celdaIzq='#celda_'+letrasArray[posIzq]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda est[a ocupada]

			if($(celdaIzq).children().length>0)
			{
				
				//Valida si el ocupante de la celda siguiente es un oponente
				fichaIzq='#'+$(celdaIzq).children()[0].id;
				if(!$(fichaIzq).hasClass(claseFicha)){
					if(posIzq+1<8 && fila-1>0){
						p=posIzq+1;
						f=fila-1;
						celdaIzq='#celda_'+letrasArray[p]+'_'+f;
						if($(celdaIzq).children().length>0){
							celdaIzq="";
						}
					}else{
						celdaIzq="";
					}	
				}else{
					celdaIzq="";
				}
			}
			
		}

		if(posDer>=0 && fila>0){
			celdaDer='#celda_'+letrasArray[posDer]+'_'+fila;
			//Verifica si la celda siguiente a su izquierda est[a ocupada]

			if($(celdaDer).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente

				fichaDer='#'+$(celdaDer).children()[0].id;
				if(!$(fichaDer).hasClass(claseFicha)){
					if(posDer-1>=0 && fila-1>0){
						p=posDer-1;
						f=fila-1;
						celdaDer='#celda_'+letrasArray[p]+'_'+f;
						if($(celdaDer).children().length>0){
							celdaDer="";
						}
					}else{
						celdaDer="";
					}
				}else{
					celdaDer="";
				}
			}
		}else{
			celdaDer="";
		}
				
		if($(ficha).hasClass("reina"))
		{

			posDer=$.inArray(datosPadre[1], letrasArray)+1;
			
			fila=parseInt(datosPadre[2])+1;
			celdaDerI='#celda_'+letrasArray[posDer]+'_'+fila;

			//si la celda esta ocupada
			if($(celdaDerI).children().length>0)
			{
				//Valida si el ocupante de la celda siguiente es un oponente

				fichaDer='#'+$(celdaDerI).children()[0].id;
				if(!$(fichaDer).hasClass(claseFicha)){
					//si la ficha a la izquierda es un contrario
					if(posDer+1<8 && fila<=8){
						p=posDer+1;
						f=fila+1;
						celdaDerI='#celda_'+letrasArray[p]+'_'+f;
						if($(celdaDerI).children().length>0){
							celdaDerI="";
						}
					}else{
						celdaDerI="";
					}	
				}else{
					celdaDerI="";
				}
			}
		
			posIzq=$.inArray(datosPadre[1], letrasArray)-1;
			fila=parseInt(datosPadre[2])+1;
			if(posIzq>=0 && fila<=8){
				celdaIzqI='#celda_'+letrasArray[posIzq]+'_'+fila;

				//si la celda esta ocupada
				if($(celdaIzqI).children().length>0)
				{
					//Valida si el ocupante de la celda siguiente es un oponente

					fichaIzq='#'+$(celdaIzqI).children()[0].id;
					if(!$(fichaIzq).hasClass(claseFicha)){
						//si la ficha a la izquierda es un contrario
						if(posIzq-1>=0 && fila<=8){
							p=posIzq-1;
							f=fila+1;
							celdaIzqI='#celda_'+letrasArray[p]+'_'+f;
							if($(celdaIzqI).children().length>0){
								celdaIzqI="";
							}
						}else{
							celdaIzqI="";
						}	
					}else{
						celdaIzqI="";
					}
				}
			}else{
				celdaIzqI="";
			}
		}			
	}

	if(celdaIzq!=""){
		resultado[i]=celdaIzq;
		i++;
	}
	if(celdaDer!=""){
		resultado[i]=celdaDer;
		i++;
	}	
	if(celdaIzqI!=""){
		resultado[i]=celdaIzqI;
		i++;
	}
		if(celdaDerI!=""){
		resultado[i]=celdaDerI;
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

