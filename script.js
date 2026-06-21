const form = document.getElementById("petForm");
const previewInfo = document.getElementById("previewInfo");
const showPetName = document.getElementById("showPetName");
const petPhotoPreview = document.getElementById("petPhotoPreview");
const addVaccineBtn = document.getElementById("addVaccineBtn");
const vaccinesContainer = document.getElementById("vaccinesContainer");

function readImage(input, callback) {
  const file = input.files[0];
  if (!file) return callback("");

  const reader = new FileReader();
  reader.onload = e => callback(e.target.result);
  reader.readAsDataURL(file);
}

addVaccineBtn.addEventListener("click", () => {
  const vaccineBlock = document.createElement("div");
  vaccineBlock.className = "vaccine-block";

  vaccineBlock.innerHTML = `
    <input class="vaccines" placeholder="Vacuna">
    <input class="lab" placeholder="Laboratorio fabricante">
    <input class="importer" placeholder="Importador">

    <label>Fecha vacunación</label>
    <input class="vaccinationDate" type="date">

    <input class="serie" placeholder="Serie N°">

    <label>Fecha próxima vacunación</label>
    <input class="nextVaccinationDate" type="date">

    <label>Cargar certificado de vacunación</label>
    <input class="certificatePhoto" type="file" accept="image/*">

    <button type="button" class="remove-vaccine">Eliminar vacuna</button>
  `;

  vaccinesContainer.appendChild(vaccineBlock);

  vaccineBlock.querySelector(".remove-vaccine").addEventListener("click", () => {
    vaccineBlock.remove();
  });
});

form.addEventListener("submit", function(e) {
  e.preventDefault();

  showPetName.textContent = petName.value || "Nombre mascota";

  readImage(petPhoto, src => {
    if (src) {
      petPhotoPreview.innerHTML = `<img src="${src}" alt="Foto mascota">`;
    }
  });

  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  let vaccinesHtml = "";

  let pendingImages = vaccineBlocks.length;
  const vaccineResults = [];

  vaccineBlocks.forEach((block, index) => {
    const certificateInput = block.querySelector(".certificatePhoto");

    readImage(certificateInput, certSrc => {
      vaccineResults[index] = `
        <div class="vaccine-preview">
          <p><strong>Vacuna:</strong> ${block.querySelector(".vaccines").value}</p>
          <p><strong>Laboratorio fabricante:</strong> ${block.querySelector(".lab").value}</p>
          <p><strong>Importador:</strong> ${block.querySelector(".importer").value}</p>
          <p><strong>Fecha vacunación:</strong> ${block.querySelector(".vaccinationDate").value}</p>
          <p><strong>Serie N°:</strong> ${block.querySelector(".serie").value}</p>
          <p><strong>Próxima vacunación:</strong> ${block.querySelector(".nextVaccinationDate").value}</p>
          ${certSrc ? `<img class="certificate" src="${certSrc}" alt="Certificado vacunación">` : ""}
        </div>
      `;

      pendingImages--;

      if (pendingImages === 0) {
        vaccinesHtml = vaccineResults.join("");

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
          ${vaccinesHtml}

          <h3>Médico veterinario</h3>
          <p><strong>Nombre:</strong> ${vetName.value}</p>
          <p><strong>RUN N°:</strong> ${vetRun.value}</p>
          <p><strong>Dirección:</strong> ${vetAddress.value}</p>
          <p><strong>Ciudad:</strong> ${vetCity.value}</p>
          <p><strong>Teléfono:</strong> ${vetPhone.value}</p>
        `;
      }
    });
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
