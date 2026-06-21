const form = document.getElementById("petForm");
const previewInfo = document.getElementById("previewInfo");
const showPetName = document.getElementById("showPetName");
const petPhotoPreview = document.getElementById("petPhotoPreview");
const addVaccineBtn = document.getElementById("addVaccineBtn");
const vaccinesContainer = document.getElementById("vaccinesContainer");

function setTheme(theme) {
  document.body.className = "";
  document.body.classList.add(`theme-${theme}`);
}

function readImage(input, callback) {
  const file = input.files[0];
  if (!file) {
    callback("");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => callback(e.target.result);
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

addVaccineBtn.addEventListener("click", createVaccineBlock);

vaccinesContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-vaccine")) {
    e.target.closest(".vaccine-block").remove();
  }
});

form.addEventListener("submit", function(e) {
  e.preventDefault();

  showPetName.textContent = petName.value || "Nombre mascota";

  readImage(petPhoto, function(src) {
    petPhotoPreview.innerHTML = src
      ? `<img src="${src}" alt="Foto mascota">`
      : "🐶";

    buildVaccinesPreview();
  });
});

function buildVaccinesPreview() {
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
          ${certSrc ? `<img class="certificate" src="${certSrc}" alt="Certificado vacunación">` : ""}
        </div>
      `;

      pendingImages--;

      if (pendingImages === 0) {
        renderPreview(vaccineResults.join(""));
      }
    });
  });
}

function renderPreview(vaccinesHtml) {
  previewInfo.innerHTML = `
    <div class="preview-layout" id="pdfLayout">

      <div class="preview-title">
        <h2>Carnet digital de mascota</h2>
      </div>

      <div class="preview-grid">
        <div class="pdf-box">
          <h3>Datos del propietario</h3>
          <p><strong>Nombre:</strong> ${ownerName.value}</p>
          <p><strong>RUT:</strong> ${ownerRut.value}</p>
          <p><strong>Dirección:</strong> ${ownerAddress.value}</p>
          <p><strong>Ciudad:</strong> ${ownerCity.value}</p>
          <p><strong>Teléfono:</strong> ${ownerPhone.value}</p>
        </div>

        <div class="pdf-box">
          <h3>Datos de la mascota</h3>
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

        <div class="pdf-box identification-box">
          <h3>Identificación</h3>
          <div class="preview-photo">${petPhotoPreview.innerHTML}</div>
          <h2>${petName.value || "Mascota"}</h2>
          <p>Carnet digital de mascota</p>
        </div>

        <div class="pdf-box">
          <h3>Vacunación</h3>
          ${vaccinesHtml || "<p>No se registraron vacunas.</p>"}
        </div>

        <div class="pdf-box">
          <h3>Médico veterinario</h3>
          <p><strong>Nombre:</strong> ${vetName.value}</p>
          <p><strong>RUN N°:</strong> ${vetRun.value}</p>
          <p><strong>Dirección:</strong> ${vetAddress.value}</p>
          <p><strong>Ciudad:</strong> ${vetCity.value}</p>
          <p><strong>Teléfono:</strong> ${vetPhone.value}</p>
        </div>
      </div>
    </div>
  `;
}
async function exportPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const primary = "#cb408c";
  const soft = "#ffeaf6";
  const border = "#f3b8d9";
  const text = "#222222";

  function fileToImage(input) {
    const file = input.files[0];
    if (!file) return Promise.resolve(null);

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  function box(x, y, w, h, title) {
    doc.setDrawColor(border);
    doc.setFillColor(soft);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");

    doc.setTextColor(primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title.toUpperCase(), x + 6, y + 10);

    doc.setDrawColor(border);
    doc.line(x + 6, y + 14, x + w - 6, y + 14);
  }

  function field(label, value, x, y, maxWidth = 52) {
    doc.setTextColor(text);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", maxWidth);
    doc.text(lines, x + 25, y);

    return y + 6 + ((lines.length - 1) * 4);
  }

  const petImg = await fileToImage(petPhoto);

  doc.setFillColor("#ffffff");
  doc.rect(0, 0, 297, 210, "F");

  doc.setFillColor(soft);
  doc.setDrawColor(border);
  doc.roundedRect(8, 8, 281, 36, 5, 5, "FD");

  if (petImg) {
    doc.addImage(petImg, "JPEG", 17, 12, 28, 28);
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.text(petName.value || "Mascota", 55, 25);

  doc.setTextColor(text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Carnet digital de mascota", 56, 35);

  box(8, 50, 88, 63, "Datos del propietario");
  let y = 70;
  y = field("Nombre", ownerName.value, 14, y);
  y = field("RUT", ownerRut.value, 14, y);
  y = field("Dirección", ownerAddress.value, 14, y);
  y = field("Ciudad", ownerCity.value, 14, y);
  y = field("Teléfono", ownerPhone.value, 14, y);

  box(104, 50, 88, 63, "Datos de la mascota");
  y = 70;
  y = field("Sexo", petSex.value, 110, y);
  y = field("Especie", petSpecies.value, 110, y);
  y = field("Color", petColor.value, 110, y);
  y = field("Raza", petBreed.value, 110, y);
  y = field("Tatuaje", petTattoo.value, 110, y);
  y = field("Microchip", petMicrochip.value, 110, y);
  y = field("Fecha chip", petMicrochipDate.value, 110, y);
  y = field("Edad", petAge.value, 110, y);
  y = field("Peso", petSizeWeight.value, 110, y);

  box(200, 50, 89, 63, "Identificación");
  if (petImg) {
    doc.addImage(petImg, "JPEG", 226, 57, 36, 36);
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(petName.value || "Mascota", 244, 102, { align: "center" });

  doc.setTextColor(text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Carnet digital de mascota", 244, 109, { align: "center" });

  box(8, 121, 138, 80, "Vacunación");
  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  let vy = 141;

  if (vaccineBlocks.length > 0) {
    const block = vaccineBlocks[0];

    vy = field("Vacuna", block.querySelector(".vaccines").value, 14, vy, 48);
    vy = field("Laboratorio", block.querySelector(".lab").value, 14, vy, 48);
    vy = field("Importador", block.querySelector(".importer").value, 14, vy, 48);
    vy = field("Fecha", block.querySelector(".vaccinationDate").value, 14, vy);
    vy = field("Serie N°", block.querySelector(".serie").value, 14, vy);
    vy = field("Próxima", block.querySelector(".nextVaccinationDate").value, 14, vy);

    const certImg = await fileToImage(block.querySelector(".certificatePhoto"));
    if (certImg) {
      doc.addImage(certImg, "JPEG", 82, 141, 54, 36);
    }
  } else {
    field("Vacunas", "No se registraron vacunas", 14, vy);
  }

  box(154, 121, 135, 80, "Médico veterinario");
  y = 141;
  y = field("Nombre", vetName.value, 160, y, 70);
  y = field("RUN N°", vetRun.value, 160, y);
  y = field("Dirección", vetAddress.value, 160, y, 70);
  y = field("Ciudad", vetCity.value, 160, y);
  y = field("Teléfono", vetPhone.value, 160, y);

  doc.save("carnet-mascota.pdf");
}
