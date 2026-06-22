const CHILE_CITIES = [
  "Arica", "Camarones", "Putre", "General Lagos",
  "Alto Hospicio", "Iquique", "Huara", "Camiña", "Colchane", "Pica", "Pozo Almonte",
  "Tocopilla", "María Elena", "Calama", "Ollagüe", "San Pedro de Atacama", "Antofagasta", "Mejillones", "Sierra Gorda", "Taltal",
  "Chañaral", "Diego de Almagro", "Copiapó", "Caldera", "Tierra Amarilla", "Vallenar", "Freirina", "Huasco", "Alto del Carmen",
  "La Serena", "La Higuera", "Coquimbo", "Andacollo", "Vicuña", "Paihuano", "Ovalle", "Río Hurtado", "Monte Patria", "Combarbalá", "Punitaqui", "Illapel", "Salamanca", "Los Vilos", "Canela",
  "La Ligua", "Petorca", "Cabildo", "Zapallar", "Papudo", "Los Andes", "San Esteban", "Calle Larga", "Rinconada", "San Felipe", "Putaendo", "Santa María", "Panquehue", "Llaillay", "Catemu", "Quillota", "La Cruz", "Calera", "Nogales", "Hijuelas", "Limache", "Olmué", "Valparaíso", "Viña del Mar", "Quintero", "Puchuncaví", "Quilpué", "Villa Alemana", "Casablanca", "Concón", "Juan Fernández", "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo", "Santo Domingo", "Isla de Pascua",
  "Rancagua", "Graneros", "Mostazal", "Codegua", "Machalí", "Olivar", "Requinoa", "Rengo", "Malloa", "Quinta de Tilcoco", "San Vicente", "Pichidegua", "Peumo", "Coltauco", "Coinco", "Doñihue", "Las Cabras", "San Fernando", "Chimbarongo", "Placilla", "Nancagua", "Chépica", "Santa Cruz", "Lolol", "Pumanque", "Palmilla", "Peralillo", "Pichilemu", "Navidad", "Litueche", "La Estrella", "Marchihue", "Paredones",
  "Curicó", "Teno", "Romeral", "Molina", "Sagrada Familia", "Hualañé", "Licantén", "Vichuquén", "Rauco", "Talca", "Pelarco", "Río Claro", "San Clemente", "Maule", "San Rafael", "Empedrado", "Pencahue", "Constitución", "Curepto", "Linares", "Yerbas Buenas", "Colbún", "Longaví", "Parral", "Retiro", "Villa Alegre", "San Javier", "Cauquenes", "Pelluhue", "Chanco",
  "Chillán", "San Carlos", "Ñiquén", "San Fabián", "Coihueco", "Pinto", "San Ignacio", "El Carmen", "Yungay", "Pemuco", "Bulnes", "Quillón", "Ránquil", "Portezuelo", "Coelemu", "Treguaco", "Cobquecura", "Quirihue", "Ninhue", "San Nicolás", "Chillán Viejo",
  "Alto Biobío", "Los Ángeles", "Cabrero", "Tucapel", "Antuco", "Quilleco", "Santa Bárbara", "Quilaco", "Mulchén", "Negrete", "Nacimiento", "Laja", "San Rosendo", "Yumbel", "Concepción", "Talcahuano", "Penco", "Tomé", "Florida", "Hualpén", "Hualqui", "Santa Juana", "Lota", "Coronel", "San Pedro de la Paz", "Chiguayante", "Lebu", "Arauco", "Curanilahue", "Los Álamos", "Cañete", "Contulmo", "Tirúa",
  "Angol", "Renaico", "Collipulli", "Lonquimay", "Curacautín", "Ercilla", "Victoria", "Traiguén", "Lumaco", "Purén", "Los Sauces", "Temuco", "Lautaro", "Perquenco", "Vilcún", "Cholchol", "Cunco", "Melipeuco", "Curarrehue", "Pucón", "Villarrica", "Freire", "Pitrufquén", "Gorbea", "Loncoche", "Toltén", "Teodoro Schmidt", "Saavedra", "Carahue", "Nueva Imperial", "Galvarino", "Padre Las Casas",
  "Valdivia", "Mariquina", "Lanco", "Máfil", "Corral", "Los Lagos", "Panguipulli", "Paillaco", "La Unión", "Futrono", "Río Bueno", "Lago Ranco",
  "Osorno", "San Pablo", "Puyehue", "Puerto Octay", "Purranque", "Río Negro", "San Juan de la Costa", "Puerto Montt", "Puerto Varas", "Cochamó", "Calbuco", "Maullín", "Los Muermos", "Fresia", "Llanquihue", "Frutillar", "Castro", "Ancud", "Quemchi", "Dalcahue", "Curaco de Vélez", "Quinchao", "Puqueldón", "Chonchi", "Queilén", "Quellón", "Chaitén", "Hualaihué", "Futaleufú", "Palena",
  "Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Chile Chico", "Río Ibáñez", "Cochrane", "O'Higgins", "Tortel",
  "Natales", "Torres del Paine", "Punta Arenas", "Río Verde", "Laguna Blanca", "San Gregorio", "Porvenir", "Primavera", "Timaukel", "Cabo de Hornos", "Antártica",
  "Santiago", "Independencia", "Conchalí", "Huechuraba", "Recoleta", "Providencia", "Vitacura", "Lo Barnechea", "Las Condes", "Ñuñoa", "La Reina", "Macul", "Peñalolén", "La Florida", "San Joaquín", "La Granja", "La Pintana", "San Ramón", "San Miguel", "La Cisterna", "El Bosque", "Pedro Aguirre Cerda", "Lo Espejo", "Estación Central", "Cerrillos", "Maipú", "Quinta Normal", "Lo Prado", "Pudahuel", "Cerro Navia", "Renca", "Quilicura", "Colina", "Lampa", "Tiltil", "Puente Alto", "San José de Maipo", "Pirque", "San Bernardo", "Buin", "Paine", "Calera de Tango", "Melipilla", "María Pinto", "Curacaví", "Alhué", "San Pedro", "Talagante", "Peñaflor", "Isla de Maipo", "El Monte", "Padre Hurtado"
].sort();

function loadCitySelects() {
  const citySelects = [
    document.getElementById("ownerCity"),
    document.getElementById("vetCity")
  ];

  citySelects.forEach(select => {
    if (!select) return;

    select.innerHTML = `<option value="">Seleccione ciudad / comuna</option>`;

    CHILE_CITIES.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      select.appendChild(option);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadCitySelects);
