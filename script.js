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

  const primary = getComputedStyle(document.body).getPropertyValue("--primary").trim() || "#cb408c";
  const soft = getComputedStyle(document.body).getPropertyValue("--soft").trim() || "#ffeaf6";
  const border = getComputedStyle(document.body).getPropertyValue("--border").trim() || "#f3b8d9";
  const text = "#222222";

  function fileToImage(input) {
    const file = input.files[0];

    if (!file) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  async function imageUrlToBase64(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  }

  function makeCircularImage(imageData, size = 400) {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = soft;
        ctx.fillRect(0, 0, size, size);

        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const scale = Math.max(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;

        ctx.drawImage(img, x, y, width, height);
        ctx.restore();

        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };

      img.src = imageData;
    });
  }

  function box(x, y, w, h, title) {
    doc.setLineWidth(1.8);
    doc.setDrawColor(border);
    doc.setFillColor(soft);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");

    doc.setTextColor(primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), x + 5, y + 9);

    doc.setLineWidth(1.2);
    doc.setDrawColor(border);
    doc.line(x + 5, y + 12, x + w - 5, y + 12);

    doc.setLineWidth(1.2);
  }

  function field(label, value, x, y, maxWidth = 50) {
    doc.setTextColor(text);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", maxWidth);
    doc.text(lines, x + 23, y);

    return y + 5 + ((lines.length - 1) * 3.5);
  }

  const petImgOriginal = await fileToImage(petPhoto);
  const petImg = petImgOriginal ? await makeCircularImage(petImgOriginal) : null;

  const bgBase64 = await imageUrlToBase64("fondo.png");

  doc.setFillColor("#ffffff");
  doc.rect(0, 0, 297, 210, "F");

  if (bgBase64) {
    for (let x = 0; x < 297; x += 42) {
      for (let y = 0; y < 210; y += 42) {
        doc.addImage(bgBase64, "PNG", x, y, 18, 18);
      }
    }
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Carnet digital de mascota", 148.5, 18, { align: "center" });

  box(8, 28, 88, 75, "Datos del propietario");
  let y = 48;
  y = field("Nombre", ownerName.value, 14, y);
  y = field("RUT", ownerRut.value, 14, y);
  y = field("Dirección", ownerAddress.value, 14, y);
  y = field("Ciudad", ownerCity.value, 14, y);
  y = field("Teléfono", ownerPhone.value, 14, y);

  box(104, 28, 88, 75, "Datos de la mascota");
  y = 48;
  y = field("Sexo", petSex.value, 110, y);
  y = field("Especie", petSpecies.value, 110, y);
  y = field("Color", petColor.value, 110, y);
  y = field("Raza", petBreed.value, 110, y);
  y = field("Tatuaje", petTattoo.value, 110, y);
  y = field("Microchip", petMicrochip.value, 110, y);
  y = field("Fecha chip", petMicrochipDate.value, 110, y);
  y = field("Edad", petAge.value, 110, y);
  y = field("Peso", petSizeWeight.value, 110, y);

  box(200, 28, 89, 75, "Identificación");

  if (petImg) {
    doc.addImage(petImg, "JPEG", 226.5, 41, 36, 36);

    doc.setLineWidth(2);
    doc.setDrawColor(border);
    doc.circle(244.5, 59, 18, "S");

    doc.setLineWidth(1.2);
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(petName.value || "Mascota", 244.5, 90, { align: "center" });

  box(8, 112, 138, 72, "Vacunación");

  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  let vy = 132;

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
      doc.addImage(certImg, "JPEG", 82, 132, 54, 38);
    }
  } else {
    field("Vacunas", "No se registraron vacunas", 14, vy);
  }

  box(154, 112, 135, 72, "Médico veterinario");
  y = 132;
  y = field("Nombre", vetName.value, 160, y, 72);
  y = field("RUN N°", vetRun.value, 160, y);
  y = field("Dirección", vetAddress.value, 160, y, 72);
  y = field("Ciudad", vetCity.value, 160, y);
  y = field("Teléfono", vetPhone.value, 160, y);

  doc.save("carnet-mascota.pdf");
}
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

  const primary = getComputedStyle(document.body).getPropertyValue("--primary").trim() || "#cb408c";
  const soft = getComputedStyle(document.body).getPropertyValue("--soft").trim() || "#ffeaf6";
  const border = getComputedStyle(document.body).getPropertyValue("--border").trim() || "#f3b8d9";
  const text = "#222222";

  function fileToImage(input) {
    const file = input.files[0];

    if (!file) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

function makeCircularImage(imageData, size = 400) {
  return new Promise(resolve => {
    const img = new Image();

    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = soft;
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const scale = Math.max(size / img.width, size / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (size - width) / 2;
      const y = (size - height) / 2;

      ctx.drawImage(img, x, y, width, height);
      ctx.restore();

      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    img.src = imageData;
  });
}

  function box(x, y, w, h, title) {
    doc.setLineWidth(0.25);
    doc.setDrawColor(border);
    doc.setFillColor(soft);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");
  
    doc.setTextColor(primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), x + 5, y + 9);
  
    doc.setLineWidth(0.25);
    doc.setDrawColor(border);
    doc.line(x + 5, y + 12, x + w - 5, y + 12);
  }

  function field(label, value, x, y, maxWidth = 50) {
    doc.setTextColor(text);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", maxWidth);
    doc.text(lines, x + 23, y);

    return y + 5 + ((lines.length - 1) * 3.5);
  }

  const petImgOriginal = await fileToImage(petPhoto);
  const petImg = petImgOriginal ? await makeCircularImage(petImgOriginal) : null;

  doc.setFillColor("#ffffff");
  doc.rect(0, 0, 297, 210, "F");

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Carnet digital de mascota", 148.5, 18, { align: "center" });

  box(8, 28, 88, 75, "Datos del propietario");
  let y = 48;
  y = field("Nombre", ownerName.value, 14, y);
  y = field("RUT", ownerRut.value, 14, y);
  y = field("Dirección", ownerAddress.value, 14, y);
  y = field("Ciudad", ownerCity.value, 14, y);
  y = field("Teléfono", ownerPhone.value, 14, y);

  box(104, 28, 88, 75, "Datos de la mascota");
  y = 48;
  y = field("Sexo", petSex.value, 110, y);
  y = field("Especie", petSpecies.value, 110, y);
  y = field("Color", petColor.value, 110, y);
  y = field("Raza", petBreed.value, 110, y);
  y = field("Tatuaje", petTattoo.value, 110, y);
  y = field("Microchip", petMicrochip.value, 110, y);
  y = field("Fecha chip", petMicrochipDate.value, 110, y);
  y = field("Edad", petAge.value, 110, y);
  y = field("Peso", petSizeWeight.value, 110, y);

  box(200, 28, 89, 75, "Identificación");

  if (petImg) {
    doc.addImage(petImg, "JPEG", 226.5, 41, 36, 36);
  
    doc.setLineWidth(1.2);
    doc.setDrawColor(border);
    doc.circle(244.5, 59, 18, "S");
  
    doc.setLineWidth(0.25);
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(petName.value || "Mascota", 244.5, 90, { align: "center" });

  box(8, 112, 138, 72, "Vacunación");

  const vaccineBlocks = document.querySelectorAll(".vaccine-block");
  let vy = 132;

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
      doc.addImage(certImg, "JPEG", 82, 132, 54, 38);
    }
  } else {
    field("Vacunas", "No se registraron vacunas", 14, vy);
  }

  box(154, 112, 135, 72, "Médico veterinario");
  y = 132;
  y = field("Nombre", vetName.value, 160, y, 72);
  y = field("RUN N°", vetRun.value, 160, y);
  y = field("Dirección", vetAddress.value, 160, y, 72);
  y = field("Ciudad", vetCity.value, 160, y);
  y = field("Teléfono", vetPhone.value, 160, y);

  doc.save("carnet-mascota.pdf");
}
