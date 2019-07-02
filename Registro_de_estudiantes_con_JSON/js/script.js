

/* Guarda los datos ingresados luego de realizar las validaciones */

$.validator.setDefaults({
	submitHandler:function(){
  		if (confirm('Haga click en Aceptar para confirmar que desea guardar los datos, de lo contracio haga clic en Cancelar')) {

			var codigo=$("#codigo").val();
	  		var nombre=$("#nombre").val();
	  		var nota=$("#nota").val();
	  		alumno={
	  			codigo:codigo,
	  			nombre:nombre,
	  			nota:nota
	  		};
	    	
		  		localStorage.setItem(codigo,JSON.stringify(alumno));
		  		alert("Los datos han sido guardados"); 
		  		listadoGeneral();
	  		
			
			$("#codigo").val("");
			$("#nombre").val("");
			$("#nota").val("");
		}
	}
});

/* Funciones a ejecutar luego de cargarse el HTML */

$(document).ready(function(){
	/* validacion de campos */
	var validator=$("#addEstudiante").validate({
		errorPlacement: function(error, element) {
			$(element).closest("form")
			.find("label[for='"+element.attr("id")+"']")
			.append(error);
		},
		errorElement:"span",
		messages:{
			codigo:{
				required:" (Por favor ingrese el código)",
				minlength:" (Debe tener 5 caracteres)",
				maxlength:" (Debe tener 5 caracteres)"
			},
			nombre:{
				required:" (Por favor ingrese el nombre)",
				minlength:" (Debe tener entre 3 y 35 caracteres)",
				maxlength:" (Debe tener entre 3 y 35 caracteres)"
			},
			nota:{
				required:" (Por favor ingrese la nota)",
				min:" (Ingrese un valor entre 0 y 10 puntos)",
				max:" (Ingrese un valor entre 0 y 10 puntos)",
				number:" (Se requiere un numero válido)"
			}	
				
		}
	});

	listadoGeneral();

	/* Agrega el evento onclick que muestra el formulario de registro de estudiantes */
	$("#mostrar_formulario").on("click", function(){
  		
  		$("#tituloModal").html("Agregar");
  		$("#modal").css('display','flex');

	});

	/* Agrega el evento onclick al enlace que muestra la puntuacion promedio */
	$("#mostrar_promedio").on("click", function(){
  		
  		var numRegistros=localStorage.length;

  		if(numRegistros>0){
	  		var i,sumatoria=0,promedio=0,out="",clave;

	  		for(i=0;i<numRegistros;i++)
			{
				clave=localStorage.key(i);
				sumatoria+=parseFloat($.parseJSON(localStorage.getItem(clave)).nota);
			}
		
			promedio=sumatoria/numRegistros;
			promedio=promedio.toFixed(2);
			

			out+="Puntuación Promedio: " + promedio;
			alert(out);

		}
	});

	/* Agrega el evento onclick al enlace que muestra la puntuacion mayor */
	$("#mostrar_mayor").on("click", function(){
  		var numRegistros=localStorage.length;

  		if(numRegistros>0){
  			var mayor=0,nota=0,out="";

			for(i=0;i<numRegistros;i++)
			{
				clave=localStorage.key(i);
				nota=parseFloat($.parseJSON(localStorage.getItem(clave)).nota)
				if(nota>mayor){

					mayor=nota;
				}
				
			}
			out+="Nota mayor: " + mayor;
			alert(out);
  		}
	});

	/* Agrega el evento onclick al enlace que muestra la puntuacion menor */
	$("#mostrar_menor").on("click", function(){
  		var numRegistros=localStorage.length;

  		if(numRegistros>0){
  			var menor=10,nota=0,out="";

			for(i=0;i<numRegistros;i++)
			{
				clave=localStorage.key(i);
				nota=parseFloat($.parseJSON(localStorage.getItem(clave)).nota)
				if(nota<menor){

					menor=nota;
				}
				
			}
			out+="Nota menor: " + menor;
			alert(out);
  		}
	});

	/* Agrega el evento onclick al boton (CANCELAR) que oculta el formulario de registro */
	$("#cancelar").on("click", function(){
  		$("#modal").css('display','none');
	});


	//Lista los estudiantes registrados
	function listadoGeneral(){

		if(localStorage.length>0){
			var clave, persona;
			var out="<h1>Listado de Estudiantes</h1><br><table><tr><th>Código</th><th>Nombre</th><th>Nota</th><th>Editar</th><th>Eliminar</th></tr>";
			
			$("#listado").css('display','block');
			for(var i=0;i<localStorage.length;i++){
				clave=localStorage.key(i);
				persona=$.parseJSON(localStorage.getItem(clave));
			    out+="<tr><td>" + persona.codigo + "</td><td>"+ persona.nombre + "</td><td>"+persona.nota +"</td>";
			    out+='<td><img id="' + clave + '" class="editar imagen_actualizar" src="img/edit.png" ></td>';
			    out+='<td><img id="' + clave + '" class="eliminar imagen_actualizar" src="img/trash.png" ></td>';
			    out+="</tr>";

			}
			out+="</table>";

			$("#listado").html(out);			
		}
	}

	//  Agrega el evento onclick alos enlaces para eliminar estudiantes

	$(".eliminar").on("click", function(e) {
		if (confirm('Haga click en Aceptar para confirmar que desea eliminar un estudiante, de lo contracio haga clic en Cancelar')) {
    		var clave = e.target.id;
			localStorage.removeItem(clave);
			listadoGeneral();
		}

	});

	/* Agrega el evento onclick que muestra el formulario para editar estudiantes */
	$(".editar").on("click", function(e){
  		
  		$("#tituloModal").html("Editar");
  		$("#modal").css('display','flex');

  		var clave = e.target.id;

  		persona=$.parseJSON(localStorage.getItem(clave));

  		$("#codigo").val(persona.codigo);
  		$("#nombre").val(persona.nombre);
  		$("#nota").val(persona.nota);
	});

});