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

  const primary = getComputedStyle(document.body).getPropertyValue("--primary").trim();
  const soft = getComputedStyle(document.body).getPropertyValue("--soft").trim();
  const border = getComputedStyle(document.body).getPropertyValue("--border").trim();

  function box(x, y, w, h, title) {
    doc.setDrawColor(border);
    doc.setFillColor(soft);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");

    doc.setTextColor(primary);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), x + 5, y + 9);

    doc.setDrawColor(border);
    doc.line(x + 5, y + 12, x + w - 5, y + 12);
  }

  function field(label, value, x, y) {
    doc.setTextColor("#222222");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", 55);
    doc.text(lines, x + 22, y);
    return y + 6 + (lines.length - 1) * 4;
  }

  async function fileToImage(input) {
    const file = input.files[0];
    if (!file) return null;

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // Datos superiores
  box(8, 8, 86, 78, "🐾 Datos del propietario");
  let y = 27;
  y = field("Nombre", ownerName.value, 13, y);
  y = field("RUT", ownerRut.value, 13, y);
  y = field("Dirección", ownerAddress.value, 13, y);
  y = field("Ciudad", ownerCity.value, 13, y);
  y = field("Teléfono", ownerPhone.value, 13, y);

  box(99, 8, 86, 78, "🐾 Datos de la mascota");
  y = 27;
  y = field("Nombre", petName.value, 104, y);
  y = field("Sexo", petSex.value, 104, y);
  y = field("Especie", petSpecies.value, 104, y);
  y = field("Color", petColor.value, 104, y);
  y = field("Raza", petBreed.value, 104, y);
  y = field("Tatuaje", petTattoo.value, 104, y);
  y = field("Microchip", petMicrochip.value, 104, y);
  y = field("Fecha chip", petMicrochipDate.value, 104, y);
  y = field("Edad", petAge.value, 104, y);
  y = field("Peso", petSizeWeight.value, 104, y);

  box(190, 8, 99, 78, "");
  const petImg = await fileToImage(petPhoto);

  if (petImg) {
    doc.addImage(petImg, "JPEG", 221, 15, 38, 38);
  }

  doc.setTextColor(primary);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(petName.value || "Mascota", 239, 62, { align: "center" });

  doc.setTextColor("#333333");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Carnet digital de mascota", 239, 70, { align: "center" });

  // Vacunación
  box(8, 92, 138, 108, "🐾 Vacunación");

  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  let vy = 111;

  for (let i = 0; i < vaccineBlocks.length; i++) {
    const block = vaccineBlocks[i];

    vy = field("Vacuna", block.querySelector(".vaccines").value, 13, vy);
    vy = field("Laboratorio", block.querySelector(".lab").value, 13, vy);
    vy = field("Importador", block.querySelector(".importer").value, 13, vy);
    vy = field("Fecha", block.querySelector(".vaccinationDate").value, 13, vy);
    vy = field("Serie N°", block.querySelector(".serie").value, 13, vy);
    vy = field("Próxima", block.querySelector(".nextVaccinationDate").value, 13, vy);

    const certImg = await fileToImage(block.querySelector(".certificatePhoto"));

    if (certImg) {
      doc.addImage(certImg, "JPEG", 13, vy + 2, 58, 28);
      vy += 35;
    }

    if (i < vaccineBlocks.length - 1 && vy > 175) {
      doc.addPage("a4", "landscape");
      box(8, 8, 138, 190, "🐾 Vacunación continuación");
      vy = 27;
    }
  }

  // Veterinario
  box(151, 92, 138, 108, "🐾 Médico veterinario");
  y = 111;
  y = field("Nombre", vetName.value, 156, y);
  y = field("RUN N°", vetRun.value, 156, y);
  y = field("Dirección", vetAddress.value, 156, y);
  y = field("Ciudad", vetCity.value, 156, y);
  y = field("Teléfono", vetPhone.value, 156, y);

  doc.save("carnet-mascota.pdf");
}
