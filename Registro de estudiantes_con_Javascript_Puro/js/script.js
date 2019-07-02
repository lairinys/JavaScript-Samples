
// Expresion regular para evaluar campos con solo letras y espacios
const pattern = new RegExp('^[a-zA-Z ]+$', 'i');

// Creando un JSON vacio
var estudiantesjson = [];

// creando variables para agregar estudiantes
codigo=document.getElementById("codigo");
nombre=document.getElementById("nombre");
nota=document.getElementById("nota");

// Utilizando el eventListener para asignar eventos a los botones

document.getElementById("mostrar_formulario").addEventListener("click",function(){mostrar_flex('modal')});
document.getElementById("mostrar_promedio").addEventListener("click",promedio);
document.getElementById("mostrar_mayor").addEventListener("click",mayor);
document.getElementById("mostrar_menor").addEventListener("click",menor);
document.getElementById("cancelar").addEventListener("click",function(){ocultar('modal')});
document.getElementById("aceptar").addEventListener("click",agregarJson);


// utilizando eventListener para asignar las funciones de validacion en los campos de texto

codigo.addEventListener("blur",codigoValido);
codigo.addEventListener("focus",function(){this.select()});

nombre.addEventListener("blur",nombreValido);
nombre.addEventListener("focus",function(){this.select()});

nota.addEventListener("blur",notaValida);
nota.addEventListener("focus",function(){this.select()});


// Funcion que permite agregar un nuevo JSON

function agregarJson()
{

try{ 
		
		var nuevoRegistro;

		cod=codigo.value;
		nom=nombre.value;
		not=nota.value;

		if(cod.toString()!=""&&nom.toString()!=""&&not.toString()!="")
		{
			nuevoRegistro='{"codigo":"'+cod+'","nombre":"'+nom+'","nota":'+not+'}';
			
			estudiantesjson.push(JSON.parse(nuevoRegistro));
		
			listadoGeneral();
			ocultar('modal');
			limpiarCampos();
		}

	}catch(error){
		alert("No es posible agregar un nuevo registro, contate al administrador del sistema");
	}

}



// Lee el Json y devuelve un string con el HTM a mostrar

function leerJSON(json){


	var out="<h1>Listado de Estudiantes</h1><br><table><tr><th>Código</th><th>Nombre</th><th>Nota</th></tr>";
	var i;
	for(i=0;i<json.length;i++)
	{
		out+="<tr><td>" + json[i].codigo + "</td><td>"+ json[i].nombre + "</td><td>"+json[i].nota +"</td></tr>";
	}
	out+="</table>";
	
	return out;

	
}


// Calcula la nota promedio
function promedioJSON(json)
{
	var i;
	var sumatoria=0;
	var promedio=0;
	var out="";

	for(i=0;i<json.length;i++)
	{
		sumatoria+=json[i].nota;
	}

	if (json.length>0){
		promedio=sumatoria/json.length;
		promedio=promedio.toFixed(2);
	}

	out+="Puntuación Promedio: " + promedio;

	return out;
}

// devuelve los nombres de los estudiantes con mayor nota
function mejoresJSON(json)
{
	var i;
	var mayor=mayorNota(json);
	var j=0;
	var out="";

	out+="Mejor nota:" + mayor;
	out+="\nEstudiantes con la mejor nota:\n";

	for(i=0;i<json.length;i++)
	{
		if(json[i].nota==mayor){
			out+=json[i].codigo + " - " + json[i].nombre + " - " + json[i].nota + "\n";
		}
		
	}

	return out;

}

// devuelve la mayor nota
function mayorNota(json)
{
	var mayor=0;

	for(i=0;i<json.length;i++)
	{
		if(json[i].nota>mayor){

			mayor=json[i].nota;
		}
		
	}

	return mayor;

}

//Busca los estudiantes con la nota mas baja

function peoresJSON(json)
{
	var i;
	var menor=menorNota(json);
	var j=0;
	var out="";

	out+="Menor nota: " + menor;
	out+="\nEstudiantes con la menor nota:\n";

	for(i=0;i<json.length;i++)
	{
		if(json[i].nota==menor){
			out+=json[i].codigo + " - " + json[i].nombre + " - " + json[i].nota + "\n";
		}
		
	}

	return out;

	console.log(out);

}

// calcula la nota mas baja

function menorNota(json)
{
	var menor;

	for(i=0;i<json.length;i++)
	{
		if(i==0){
			menor=json[i].nota;
		} else if(json[i].nota<menor){

			menor=json[i].nota;
		}
		
	}

	return menor;

}

// Crea el listado de estudiantes

function listadoGeneral(){
	var listado=document.getElementById('listado');
	mostrar_block('listado');
	listado.innerHTML=leerJSON(estudiantesjson);
}

function promedio(){
	alert(promedioJSON(estudiantesjson));
}

function mayor(){
	alert(mejoresJSON(estudiantesjson));
}

function menor(){
	alert(peoresJSON(estudiantesjson));
}

// Muestra un objeto cambiando la propiedad display a block

function mostrar_block(id)
{
	objeto=document.getElementById(id);
    objeto.style.display="block";
}


// Muestra un objeto cambiando la propiedad display a flex

function mostrar_flex(id)
{
	objeto=document.getElementById(id);
    objeto.style.display="flex";
}

// Oculta un objeto

function ocultar(id)
{

	objeto=document.getElementById(id);
    objeto.style.display="none";
}

// limpia los campos de texto
function limpiarCampos()
{
	codigo.value="";
	nombre.value="";
	nota.value="";
}

// Valida solo letras

function validarTexto(texto){
	if(!texto){
		return(false);
	}else if(!pattern.test(texto))
	{
		return (false);
	}
	else{
		texto=texto.trim();
		if(texto.length==0)
		{
			return(false);
		}
	}
	return(true);
}

// Valida datos alfanumericos

function validarAlfanumericos(texto){
	if(!texto){
		return(false);
	}
	else{
		texto=texto.trim();
		if(texto.length==0)
		{
			return(false);
		}
	}
	return(true);
}

// Vailda datos numericos

function validarNumero(numero){

	if (isNaN(numero)||(!numero)){
		return(false);
	 }else{
	 	numero=numero.trim();
	 	if(numero.length==0)
		{
			return(false);
		}else{
	 		return(true);
	 	}
	 }

}


// Validacion de la nota

function notaValida()
{

	if (!validarNumero(nota.value)){
		alertaNota.innerHTML="* Nota Inválida (Valor requerido, sólo admite números)";
		alertaNota.style.color="red";
		return false;
	}else{
		alertaNota.innerHTML="* Correcto";
		alertaNota.style.color="#2980B9";
		return true;
	}
}

// Validacion del codigo
function codigoValido()
{
	
	alertaCodigo=document.getElementById("alertaCodigo");
	alertaCodigo.style.color="red";

	if (!validarAlfanumericos(codigo.value)){
		alertaCodigo.innerHTML="* Código Inválido (Valor requerido, admite letras y números)";
		return false;
	}else if(buscarCodigo(codigo.value)){
		alertaCodigo.innerHTML="* Código Inválido (Ya existe un estudiante con ese código])";
		return false;
	}else{
		alertaCodigo.innerHTML="* Correcto";
		alertaCodigo.style.color="#2980B9";
		return true;
	}

}

//Validacion del nombre

function nombreValido()
{
	
	alertaNombre=document.getElementById("alertaNombre");


	if (!validarTexto(nombre.value)){
		alertaNombre.innerHTML="* Nombre Inválido (Valor requerido, sólo admite letras)";
		alertaNombre.style.color="red";
		return false;
	}else{
		alertaNombre.innerHTML="* Correcto";
		alertaNombre.style.color="#2980B9";
		return true;
	}

	
}

function buscarCodigo(codigo){

	var i;
	for(i=0;i<estudiantesjson.length;i++)
	{
		if(estudiantesjson[i].codigo==codigo){
			return true;
		}
	}

	return false;

}


