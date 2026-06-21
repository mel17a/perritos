const form = document.getElementById("petForm");
const previewInfo = document.getElementById("previewInfo");
const showPetName = document.getElementById("showPetName");
const petPhotoPreview = document.getElementById("petPhotoPreview");
const addVaccineBtn = document.getElementById("addVaccineBtn");
const vaccinesContainer = document.getElementById("vaccinesContainer");

function setTheme(theme) {
  document.body.className = "";

  if (theme === "female") document.body.classList.add("theme-female");
  if (theme === "male") document.body.classList.add("theme-male");
  if (theme === "fashion") document.body.classList.add("theme-fashion");
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
    <div class="pdf-layout" id="pdfLayout">

      <div class="pdf-box owner-box">
        <h3>🐾 Datos del propietario</h3>
        <p><strong>Nombre:</strong> ${ownerName.value}</p>
        <p><strong>RUT:</strong> ${ownerRut.value}</p>
        <p><strong>Dirección:</strong> ${ownerAddress.value}</p>
        <p><strong>Ciudad:</strong> ${ownerCity.value}</p>
        <p><strong>Teléfono:</strong> ${ownerPhone.value}</p>
      </div>

      <div class="pdf-box pet-box">
        <h3>🐾 Datos de la mascota</h3>
        <p><strong>Nombre:</strong> ${petName.value}</p>
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

      <div class="pdf-box profile-box">
        <div class="pdf-photo">${petPhotoPreview.innerHTML}</div>
        <h2>${petName.value || "Mascota"}</h2>
        <p>Carnet digital de mascota</p>
      </div>

      <div class="pdf-box vaccine-box">
        <h3>🐾 Vacunación</h3>
        ${vaccinesHtml || "<p>No se registraron vacunas.</p>"}
      </div>

      <div class="pdf-box vet-box">
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

  function field(label, value, x, y) {
    doc.setTextColor(text);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", 54);
    doc.text(lines, x + 24, y);

    return y + 6 + ((lines.length - 1) * 4);
  }

  const petImg = await fileToImage(petPhoto);

  // Fondo general
  doc.setFillColor("#ffffff");
  doc.rect(0, 0, 297, 210, "F");

  // Cabecera
  doc.setFillColor(soft);
  doc.setDrawColor(border);
  doc.roundedRect(8, 8, 281, 38, 5, 5, "FD");

  if (petImg) {
    doc.addImage(petImg, "JPEG", 18, 13, 28, 28);
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(petName.value || "Mascota", 58, 25);

  doc.setTextColor(text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Carnet digital de mascota", 59, 35);

  // Fila superior
  box(8, 52, 88, 62, "Datos del propietario");
  let y = 72;
  y = field("Nombre", ownerName.value, 14, y);
  y = field("RUT", ownerRut.value, 14, y);
  y = field("Dirección", ownerAddress.value, 14, y);
  y = field("Ciudad", ownerCity.value, 14, y);
  y = field("Teléfono", ownerPhone.value, 14, y);

  box(104, 52, 88, 62, "Datos de la mascota");
  y = 72;
  y = field("Sexo", petSex.value, 110, y);
  y = field("Especie", petSpecies.value, 110, y);
  y = field("Color", petColor.value, 110, y);
  y = field("Raza", petBreed.value, 110, y);
  y = field("Tatuaje", petTattoo.value, 110, y);
  y = field("Microchip", petMicrochip.value, 110, y);
  y = field("Fecha chip", petMicrochipDate.value, 110, y);
  y = field("Edad", petAge.value, 110, y);
  y = field("Peso", petSizeWeight.value, 110, y);

  box(200, 52, 89, 62, "Foto de mascota");

  if (petImg) {
    doc.addImage(petImg, "JPEG", 226, 60, 36, 36);
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(petName.value || "Mascota", 244, 105, { align: "center" });

  // Fila inferior
  box(8, 122, 138, 78, "Vacunación");
  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  let vy = 142;

  if (vaccineBlocks.length === 0) {
    field("Vacunas", "No se registraron vacunas", 14, vy);
  } else {
    const block = vaccineBlocks[0];

    vy = field("Vacuna", block.querySelector(".vaccines").value, 14, vy);
    vy = field("Laboratorio", block.querySelector(".lab").value, 14, vy);
    vy = field("Importador", block.querySelector(".importer").value, 14, vy);
    vy = field("Fecha", block.querySelector(".vaccinationDate").value, 14, vy);
    vy = field("Serie N°", block.querySelector(".serie").value, 14, vy);
    vy = field("Próxima", block.querySelector(".nextVaccinationDate").value, 14, vy);

    const certImg = await fileToImage(block.querySelector(".certificatePhoto"));

    if (certImg) {
      doc.addImage(certImg, "JPEG", 82, 142, 54, 36);
    }
  }

  box(154, 122, 135, 78, "Médico veterinario");
  y = 142;
  y = field("Nombre", vetName.value, 160, y);
  y = field("RUN N°", vetRun.value, 160, y);
  y = field("Dirección", vetAddress.value, 160, y);
  y = field("Ciudad", vetCity.value, 160, y);
  y = field("Teléfono", vetPhone.value, 160, y);

  doc.save("carnet-mascota.pdf");
}
