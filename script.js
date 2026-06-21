const form = document.getElementById("petForm");
const previewInfo = document.getElementById("previewInfo");
const showPetName = document.getElementById("showPetName");
const petPhotoPreview = document.getElementById("petPhotoPreview");
const certificatePreview = document.getElementById("certificatePreview");

function readImage(input, callback) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => callback(e.target.result);
  reader.readAsDataURL(file);
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  showPetName.textContent = petName.value || "Nombre mascota";

  previewInfo.innerHTML = `
    <h3>Datos del propietario</h3>
    <p><strong>Nombre:</strong> ${ownerName.value}</p>
    <p><strong>RUT:</strong> ${ownerRut.value}</p>
    <p><strong>Dirección:</strong> ${ownerAddress.value}</p>
    <p><strong>Ciudad:</strong> ${ownerCity.value}</p>
    <p><strong>Teléfono:</strong> ${ownerPhone.value}</p>

    <h3>Datos de la mascota</h3>
    <p><strong>Sexo:</strong> ${petSex.value}</p>
    <p><strong>Especie:</strong> ${petSpecies.value}</p>
    <p><strong>Color:</strong> ${petColor.value}</p>
    <p><strong>Raza:</strong> ${petBreed.value}</p>
    <p><strong>Tatuaje:</strong> ${petTattoo.value}</p>
    <p><strong>Edad:</strong> ${petAge.value}</p>
    <p><strong>Tamaño / Peso:</strong> ${petSizeWeight.value}</p>

    <h3>Vacunación</h3>
    <p><strong>Vacunas:</strong> ${vaccines.value}</p>
    <p><strong>Laboratorio fabricante:</strong> ${lab.value}</p>
    <p><strong>Importador:</strong> ${importer.value}</p>
    <p><strong>Fecha vacunación:</strong> ${vaccinationDate.value}</p>
    <p><strong>Serie N°:</strong> ${serie.value}</p>
    <p><strong>Próxima vacunación:</strong> ${nextVaccinationDate.value}</p>

    <h3>Médico veterinario</h3>
    <p><strong>Nombre:</strong> ${vetName.value}</p>
    <p><strong>RUN N°:</strong> ${vetRun.value}</p>
    <p><strong>Dirección:</strong> ${vetAddress.value}</p>
    <p><strong>Ciudad:</strong> ${vetCity.value}</p>
    <p><strong>Teléfono:</strong> ${vetPhone.value}</p>
  `;

  readImage(petPhoto, src => {
    petPhotoPreview.innerHTML = `<img src="${src}" alt="Foto mascota">`;
  });

  readImage(certificatePhoto, src => {
    certificatePreview.src = src;
    certificatePreview.style.display = "block";
  });
});

function exportPDF() {
  const element = document.getElementById("carnet");

  const options = {
    margin: 8,
    filename: "carnet-mascota.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(options).from(element).save();
}
