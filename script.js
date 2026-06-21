const form = document.getElementById("petForm");
const previewInfo = document.getElementById("previewInfo");
const showPetName = document.getElementById("showPetName");
const petPhotoPreview = document.getElementById("petPhotoPreview");
const addVaccineBtn = document.getElementById("addVaccineBtn");
const vaccinesContainer = document.getElementById("vaccinesContainer");

function setTheme(theme) {
  document.body.className = "";

  if (theme === "female") {
    document.body.classList.add("theme-female");
  }

  if (theme === "male") {
    document.body.classList.add("theme-male");
  }

  if (theme === "fashion") {
    document.body.classList.add("theme-fashion");
  }
}

function readImage(input, callback) {
  const file = input.files[0];

  if (!file) {
    callback("");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    callback(e.target.result);
  };

  reader.readAsDataURL(file);
}

function createVaccineBlock() {
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
}

addVaccineBtn.addEventListener("click", function() {
  createVaccineBlock();
});

vaccinesContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-vaccine")) {
    e.target.closest(".vaccine-block").remove();
  }
});

form.addEventListener("submit", function(e) {
  e.preventDefault();

  showPetName.textContent = petName.value || "Nombre mascota";

  readImage(petPhoto, function(src) {
    if (src) {
      petPhotoPreview.innerHTML = `<img src="${src}" alt="Foto mascota">`;
    } else {
      petPhotoPreview.innerHTML = "🐶";
    }
  });

  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  const vaccineResults = [];

  if (vaccineBlocks.length === 0) {
    renderPreview("");
    return;
  }

  let pendingImages = vaccineBlocks.length;

  vaccineBlocks.forEach(function(block, index) {
    const certificateInput = block.querySelector(".certificatePhoto");

    readImage(certificateInput, function(certSrc) {
      vaccineResults[index] = `
        <div class="vaccine-preview">
          <p><strong>Vacuna:</strong> ${block.querySelector(".vaccines").value}</p>
          <p><strong>Laboratorio fabricante:</strong> ${block.querySelector(".lab").value}</p>
          <p><strong>Importador:</strong> ${block.querySelector(".importer").value}</p>
          <p><strong>Fecha vacunación:</strong> ${block.querySelector(".vaccinationDate").value}</p>
          <p><strong>Serie N°:</strong> ${block.querySelector(".serie").value}</p>
          <p><strong>Próxima vacunación:</strong> ${block.querySelector(".nextVaccinationDate").value}</p>
          ${
            certSrc
              ? `<img class="certificate" src="${certSrc}" alt="Certificado vacunación">`
              : ""
          }
        </div>
      `;

      pendingImages--;

      if (pendingImages === 0) {
        renderPreview(vaccineResults.join(""));
      }
    });
  });
});

function renderPreview(vaccinesHtml) {
  previewInfo.innerHTML = `
    <div class="pdf-layout">

      <div class="pdf-box">
        <h3>🐾 Datos del propietario</h3>
        <p><strong>Nombre:</strong> ${ownerName.value}</p>
        <p><strong>RUT:</strong> ${ownerRut.value}</p>
        <p><strong>Dirección:</strong> ${ownerAddress.value}</p>
        <p><strong>Ciudad:</strong> ${ownerCity.value}</p>
        <p><strong>Teléfono:</strong> ${ownerPhone.value}</p>
      </div>

      <div class="pdf-box">
        <h3>🐾 Datos de la mascota</h3>
        <p><strong>Sexo:</strong> ${petSex.value}</p>
        <p><strong>Especie:</strong> ${petSpecies.value}</p>
        <p><strong>Color:</strong> ${petColor.value}</p>
        <p><strong>Raza:</strong> ${petBreed.value}</p>
        <p><strong>Tatuaje:</strong> ${petTattoo.value}</p>
        <p><strong>N° microchip:</strong> ${petMicrochip.value}</p>
        <p><strong>Fecha microchip:</strong> ${petMicrochipDate.value}</p>
        <p><strong>Edad:</strong> ${petAge.value}</p>
        <p><strong>Tamaño / Peso:</strong> ${petSizeWeight.value}</p>
      </div>

      <div class="pdf-profile">
        <div class="pdf-photo">${petPhotoPreview.innerHTML}</div>
        <h2>${petName.value}</h2>
        <p>Carnet digital de mascota</p>
      </div>

      <div class="pdf-box pdf-wide">
        <h3>🐾 Vacunación</h3>
        ${vaccinesHtml || "<p>No se registraron vacunas.</p>"}
      </div>

      <div class="pdf-box">
        <h3>🐾 Médico veterinario</h3>
        <p><strong>Nombre:</strong> ${vetName.value}</p>
        <p><strong>RUN N°:</strong> ${vetRun.value}</p>
        <p><strong>Dirección:</strong> ${vetAddress.value}</p>
        <p><strong>Ciudad:</strong> ${vetCity.value}</p>
        <p><strong>Teléfono:</strong> ${vetPhone.value}</p>
      </div>

    </div>
  `;
}

function exportPDF() {
  const element = document.getElementById("previewInfo");

  const options = {
    margin: 6,
    filename: "carnet-mascota.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
  };

  html2pdf().set(options).from(element).save();
}
