const form = document.getElementById("petForm");
const previewInfo = document.getElementById("previewInfo");
const showPetName = document.getElementById("showPetName");
const petPhotoPreview = document.getElementById("petPhotoPreview");
const addVaccineBtn = document.getElementById("addVaccineBtn");
const vaccinesContainer = document.getElementById("vaccinesContainer");

const $ = id => document.getElementById(id);
const val = id => $(id)?.value || "";

function setTheme(theme) {
  document.body.className = "";
  document.body.classList.add(`theme-${theme}`);
}

function readImage(input) {
  return new Promise(resolve => {
    const file = input?.files?.[0];
    if (!file) return resolve("");

    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
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
    <input class="certificatePhoto" type="file" accept="image/*" capture="environment">

    <button type="button" class="remove-vaccine">Eliminar vacuna</button>
  `;

  vaccinesContainer.appendChild(vaccineBlock);
}

addVaccineBtn.addEventListener("click", createVaccineBlock);

vaccinesContainer.addEventListener("click", e => {
  if (e.target.classList.contains("remove-vaccine")) {
    e.target.closest(".vaccine-block").remove();
  }
});

form.addEventListener("submit", async e => {
  e.preventDefault();

  const petImg = await readImage($("petPhoto"));
  petPhotoPreview.innerHTML = petImg
    ? `<img src="${petImg}" alt="Foto mascota">`
    : "🐶";

  showPetName.textContent = val("petName") || "Nombre mascota";

  await buildVaccinesPreview();
});

async function buildVaccinesPreview() {
  const vaccineBlocks = document.querySelectorAll(".vaccine-block");

  if (vaccineBlocks.length === 0) {
    renderPreview("");
    return;
  }

  const vaccineResults = [];

  for (const block of vaccineBlocks) {
    const certSrc = await readImage(block.querySelector(".certificatePhoto"));

    vaccineResults.push(`
      <div class="vaccine-preview">
        <p><strong>Vacuna:</strong> ${block.querySelector(".vaccines").value}</p>
        <p><strong>Laboratorio fabricante:</strong> ${block.querySelector(".lab").value}</p>
        <p><strong>Importador:</strong> ${block.querySelector(".importer").value}</p>
        <p><strong>Fecha vacunación:</strong> ${block.querySelector(".vaccinationDate").value}</p>
        <p><strong>Serie N°:</strong> ${block.querySelector(".serie").value}</p>
        <p><strong>Próxima vacunación:</strong> ${block.querySelector(".nextVaccinationDate").value}</p>
        ${certSrc ? `<img class="certificate" src="${certSrc}" alt="Certificado vacunación">` : ""}
      </div>
    `);
  }

  renderPreview(vaccineResults.join(""));
}

function renderPreview(vaccinesHtml) {
  previewInfo.innerHTML = `
    <div class="preview-layout">
      <div class="preview-title">
        <h2>Carnet digital de mascota</h2>
      </div>

      <div class="preview-grid">
        <div class="pdf-box">
          <h3>Datos del propietario</h3>
          <p><strong>Nombre:</strong> ${val("ownerName")}</p>
          <p><strong>RUT:</strong> ${val("ownerRut")}</p>
          <p><strong>Dirección:</strong> ${val("ownerAddress")}</p>
          <p><strong>Ciudad:</strong> ${val("ownerCity")}</p>
          <p><strong>Teléfono:</strong> ${val("ownerPhone")}</p>
        </div>

        <div class="pdf-box">
          <h3>Datos de la mascota</h3>
          <p><strong>Sexo:</strong> ${val("petSex")}</p>
          <p><strong>Especie:</strong> ${val("petSpecies")}</p>
          <p><strong>Color:</strong> ${val("petColor")}</p>
          <p><strong>Raza:</strong> ${val("petBreed")}</p>
          <p><strong>Tatuaje:</strong> ${val("petTattoo")}</p>
          <p><strong>N° microchip:</strong> ${val("petMicrochip")}</p>
          <p><strong>Fecha microchip:</strong> ${val("petMicrochipDate")}</p>
          <p><strong>Edad:</strong> ${val("petAge")}</p>
          <p><strong>Tamaño / Peso:</strong> ${val("petSizeWeight")}</p>
        </div>

        <div class="pdf-box identification-box">
          <h3>Identificación</h3>
          <div class="preview-photo">${petPhotoPreview.innerHTML}</div>
          <h2>${val("petName") || "Mascota"}</h2>
        </div>

        <div class="pdf-box">
          <h3>Vacunación</h3>
          ${vaccinesHtml || "<p>No se registraron vacunas.</p>"}
        </div>

        <div class="pdf-box">
          <h3>Médico veterinario</h3>
          <p><strong>Nombre:</strong> ${val("vetName")}</p>
          <p><strong>RUN:</strong> ${val("vetRun")}</p>
          <p><strong>Dirección:</strong> ${val("vetAddress")}</p>
          <p><strong>Ciudad:</strong> ${val("vetCity")}</p>
          <p><strong>Teléfono:</strong> ${val("vetPhone")}</p>
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

  const primary = getComputedStyle(document.body).getPropertyValue("--primary").trim();
  const soft = getComputedStyle(document.body).getPropertyValue("--soft").trim();
  const border = getComputedStyle(document.body).getPropertyValue("--border").trim();
  const text = "#222222";

  function field(label, value, x, y, maxWidth = 50) {
    doc.setTextColor(text);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "-", maxWidth);
    doc.text(lines, x + 24, y);

    return y + 5 + ((lines.length - 1) * 3.5);
  }

  function box(x, y, w, h, title) {
    doc.setLineWidth(1.2);
    doc.setDrawColor(border);
    doc.setFillColor(soft);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");

    doc.setTextColor(primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), x + 5, y + 9);

    doc.setLineWidth(0.8);
    doc.line(x + 5, y + 12, x + w - 5, y + 12);
  }

  async function imageUrlToBase64(url) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }

  function makeCircularImage(imageData, size = 400) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = soft;
        ctx.fillRect(0, 0, size, size);

        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
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

  const bgBase64 = await imageUrlToBase64("fondo.png");
  const petImgOriginal = await readImage($("petPhoto"));
  const petImg = petImgOriginal ? await makeCircularImage(petImgOriginal) : "";

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
  y = field("Nombre", val("ownerName"), 14, y);
  y = field("RUT", val("ownerRut"), 14, y);
  y = field("Dirección", val("ownerAddress"), 14, y);
  y = field("Ciudad", val("ownerCity"), 14, y);
  y = field("Teléfono", val("ownerPhone"), 14, y);

  box(104, 28, 88, 75, "Datos de la mascota");
  y = 48;
  y = field("Sexo", val("petSex"), 110, y);
  y = field("Especie", val("petSpecies"), 110, y);
  y = field("Color", val("petColor"), 110, y);
  y = field("Raza", val("petBreed"), 110, y);
  y = field("Tatuaje", val("petTattoo"), 110, y);
  y = field("Microchip", val("petMicrochip"), 110, y);
  y = field("Fecha chip", val("petMicrochipDate"), 110, y);
  y = field("Edad", val("petAge"), 110, y);
  y = field("Peso", val("petSizeWeight"), 110, y);

  box(200, 28, 89, 75, "Identificación");

  if (petImg) {
    doc.addImage(petImg, "JPEG", 226.5, 41, 36, 36);
    doc.setLineWidth(2);
    doc.setDrawColor(border);
    doc.circle(244.5, 59, 18, "S");
  }

  doc.setTextColor(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(val("petName") || "Mascota", 244.5, 90, { align: "center" });

  box(8, 112, 138, 72, "Vacunación");

  const block = document.querySelector(".vaccine-block");
  y = 132;

  if (block) {
    y = field("Vacuna", block.querySelector(".vaccines").value, 14, y, 48);
    y = field("Laboratorio", block.querySelector(".lab").value, 14, y, 48);
    y = field("Importador", block.querySelector(".importer").value, 14, y, 48);
    y = field("Fecha", block.querySelector(".vaccinationDate").value, 14, y);
    y = field("Serie N°", block.querySelector(".serie").value, 14, y);
    y = field("Próxima", block.querySelector(".nextVaccinationDate").value, 14, y);

    const certImg = await readImage(block.querySelector(".certificatePhoto"));
    if (certImg) {
      doc.addImage(certImg, "JPEG", 82, 132, 54, 38);
    }
  }

  box(154, 112, 135, 72, "Médico veterinario");
  y = 132;
  y = field("Nombre", val("vetName"), 160, y, 72);
  y = field("RUN", val("vetRun"), 160, y);
  y = field("Dirección", val("vetAddress"), 160, y, 72);
  y = field("Ciudad", val("vetCity"), 160, y);
  y = field("Teléfono", val("vetPhone"), 160, y);

  doc.save("carnet-mascota.pdf");
}
