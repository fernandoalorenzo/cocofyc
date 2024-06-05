const datatableLanguageConfig = {
	buttons: {
		copy: "Copiar",
		colvis: "Visibilidad",
		colvisRestore: "Restaurar visibilidad",
		copyTitle: "Copiar al portapapeles",
		copySuccess: {
			1: "Copiado 1 registro al portapapeles",
			_: "Copiados %d registros al portapapeles",
		},
		csv: "CSV",
		excel: "Excel",
		pageLength: {
			"-1": "Mostrar todos los registros",
			_: "Mostrar %d registros",
		},
		pdf: "PDF",
		print: "Imprimir",
	},
	lengthMenu: "Mostrar _MENU_ registros",
	zeroRecords: "No se encontraron resultados",
	infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
	loadingRecords: "Cargando...",
	paginate: {
		first: '<i class="fas fa-angle-double-left"></i>',
		last: '<i class="fas fa-angle-double-right"></i>',
		next: '<i class="fas fa-angle-right"></i>',
		previous: '<i class="fas fa-angle-left"></i>',
	},
	autoFill: {
		cancel: "Cancelar",
		fill: "Llenar las celdas con <i>%d<i></i></i>",
		fillHorizontal: "Llenar las celdas horizontalmente",
		fillVertical: "Llenar las celdas verticalmente",
	},
	decimal: ",",
	emptyTable: "No hay datos disponibles en la Tabla",
	infoFiltered: ". Filtrado de _MAX_ registros totales",
	infoThousands: ".",
	processing: "Procesando...",
	search: "Busqueda:",
	datetime: {
		previous: "Anterior",
		next: "Siguiente",
		hours: "Hora",
		minutes: "Minuto",
		seconds: "Segundo",
		amPm: ["AM", "PM"],
		months: {
			0: "Enero",
			1: "Febrero",
			2: "Marzo",
			3: "Abril",
			4: "Mayo",
			5: "Junio",
			6: "Julio",
			7: "Agosto",
			8: "Septiembre",
			9: "Octubre",
			10: "Noviembre",
			11: "Diciembre",
		},
		unknown: "-",
		weekdays: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
	},
	info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
};

const datatableButtonsConfig = [
    // {
	// buttons: [
		{
			extend: "pageLength",
			className: "btn bg-secondary-subtle text-dark",
		},
		{
			extend: "colvis",
			className: "btn bg-secondary-subtle text-dark",
			text: '<i class="fas fa-filter fa-xl"></i>',
			titleAttr: "Mostrar/Ocultar columnas",
		},
		{
			extend: "excelHtml5",
			className: "btn btn-success",
			text: '<i class="fas fa-file-excel fa-xl"></i>',
			titleAttr: "Exportar datos a Excel",
		},
		{
			extend: "pdfHtml5",
			className: "btn btn-danger",
			text: '<i class="fas fa-file-pdf fa-xl"></i>',
			titleAttr: "Exportar datos a PDF",
		},
		{
			extend: "print",
			className: "btn btn-warning",
			text: '<i class="fas fa-print"></i>',
			title: "Movimientos",
			titleAttr: "Imprimir datos",
		},
		{
			extend: "copy",
			className: "btn btn-dark",
			text: '<i class="fas fa-copy"></i>',
			titleAttr: "Copia de datos a portapapeles",
		},
	// ],
// }
];

const datatableDomConfig = {
	dom:
		"<'row mb-2'<'col-md-6'B><'col-md-6'f>>" + // Agregamos contenedor para botones y cont para búsqueda
		"<'row'<'col-md-12'tr>>" + // Agregamos contenedor para tabla
		"<'row mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-end'p>>",
};

export { datatableLanguageConfig, datatableButtonsConfig, datatableDomConfig };