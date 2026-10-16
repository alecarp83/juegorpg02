"use strict";

/* Datos editoriales de demostración, no estadísticas oficiales. */
const personajes = [
  {
    id: "princesa", nombre: "Princesa", categoria: "Realeza",
    rol: "Precisión a larga distancia", tipo: "Arquera", elixir: 3,
    color: "#c1a4ff", piel: "#efbd9c", ropa: "#416bd0", pelo: "#292330",
    descripcion: "Una pequeña princesa con una gran puntería. Su corona, su arco y su uniforme azul definen una silueta elegante y reconocible.",
    rasgos: ["Ataque a distancia", "Arco", "Precisión"]
  },
  {
    id: "caballero", nombre: "Caballero", categoria: "Guerreros",
    rol: "La primera línea de defensa", tipo: "Espadachín", elixir: 3,
    color: "#f2cb75", piel: "#efb18c", ropa: "#416bd0", pelo: "#efc54e",
    descripcion: "Un guerrero de confianza, de bigote dorado y espada siempre lista. Su armadura ligera le permite mantener una presencia firme en la arena.",
    rasgos: ["Cuerpo a cuerpo", "Espada", "Resistencia"]
  },
  {
    id: "rey", nombre: "Rey", categoria: "Realeza",
    rol: "El corazón del reino", tipo: "Líder", elixir: null,
    color: "#83b6ff", piel: "#e8ac89", ropa: "#315bbb", pelo: "#272632",
    descripcion: "Corona dorada, barba imponente y una sonrisa de confianza. El rey encarna el espíritu de su equipo y el carácter de la colección.",
    rasgos: ["Corona", "Liderazgo", "Defensa"]
  },
  {
    id: "principe", nombre: "Príncipe", categoria: "Realeza",
    rol: "Una carga imparable", tipo: "Jinete", elixir: 5,
    color: "#f3cf70", piel: "#e7b18c", ropa: "#d4a438", pelo: "#62402a",
    descripcion: "Un jinete con armadura dorada y lanza de torneo. Su montura y su penacho azul convierten cada entrada en una declaración de intenciones.",
    rasgos: ["Montura", "Lanza", "Carga"]
  },
  {
    id: "arquera", nombre: "Arquera", categoria: "Guerreros",
    rol: "Siempre en el blanco", tipo: "Arquera", elixir: 3,
    color: "#f497cd", piel: "#efbd9c", ropa: "#78a542", pelo: "#df3c96",
    descripcion: "Cabello rosa, túnica verde y una mirada decidida. La arquera combina una silueta compacta con el alcance de su arco.",
    rasgos: ["Ataque a distancia", "Arco", "Agilidad"]
  },
  {
    id: "montapuercos", nombre: "Montapuercos", categoria: "Guerreros",
    rol: "Directo a la acción", tipo: "Jinete", elixir: 4,
    color: "#e8aa83", piel: "#80503b", ropa: "#805132", pelo: "#261e1b",
    descripcion: "Un jinete de energía desbordante acompañado por su inseparable cerdo. El martillo y la cresta completan su aspecto inconfundible.",
    rasgos: ["Montura", "Martillo", "Velocidad"]
  },
  {
    id: "barbaro", nombre: "Bárbaro", categoria: "Guerreros",
    rol: "Fuerza sin complicaciones", tipo: "Luchador", elixir: 5,
    color: "#edcc73", piel: "#eeb18a", ropa: "#9c6332", pelo: "#f0c53e",
    descripcion: "Cabello rubio, brazaletes oscuros y una expresión de batalla. El bárbaro aporta fuerza y personalidad a la primera línea.",
    rasgos: ["Cuerpo a cuerpo", "Fuerza", "Valentía"]
  },
  {
    id: "mago", nombre: "Mago", categoria: "Especiales",
    rol: "El poder entre tus manos", tipo: "Hechicero", elixir: 5,
    color: "#8ed6ef", piel: "#e8ae89", ropa: "#367ca8", pelo: "#51342b",
    descripcion: "Bajo su capucha azul, el mago prepara una esfera de fuego. Una figura de líneas sencillas que combina misterio, color y poder.",
    rasgos: ["Magia", "Fuego", "Ataque a distancia"]
  },
  {
    id: "duende", nombre: "Duende", categoria: "Especiales",
    rol: "Pequeño, rápido y travieso", tipo: "Pícaro", elixir: 2,
    color: "#b5e877", piel: "#86bc49", ropa: "#927244", pelo: "#86bc49",
    descripcion: "Orejas puntiagudas, sonrisa pícara y una daga diminuta. El duende demuestra que el tamaño no limita la personalidad.",
    rasgos: ["Daga", "Agilidad", "Astucia"]
  }
];

const grid = document.querySelector("#grid");
const search = document.querySelector("#search");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const dialog = document.querySelector("#detail-dialog");
const views = [];
let filtro = "Todos";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const normalizar = text =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function mostrarFicha(personaje) {
  document.querySelector("#detail-category").textContent = personaje.categoria;
  document.querySelector("#detail-name").textContent = personaje.nombre;
  document.querySelector("#detail-description").textContent = personaje.descripcion;

  const traits = document.querySelector("#detail-traits");
  traits.replaceChildren();

  personaje.rasgos.forEach(rasgo => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = rasgo;
    traits.append(tag);
  });

  dialog.showModal();
}

dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left || event.clientX > rect.right ||
    event.clientY < rect.top || event.clientY > rect.bottom
  ) dialog.close();
});

function aplicarFiltros() {
  const query = normalizar(search.value.trim());
  let total = 0;

  views.forEach(view => {
    const p = view.personaje;
    const coincideCategoria = filtro === "Todos" || p.categoria === filtro;
    const coincideTexto = normalizar(
      `${p.nombre} ${p.tipo} ${p.rol} ${p.rasgos.join(" ")}`
    ).includes(query);

    view.card.hidden = !(coincideCategoria && coincideTexto);
    if (!view.card.hidden) total++;
  });

  count.textContent = `${total} ${total === 1 ? "personaje disponible" : "personajes disponibles"}`;
  empty.hidden = total !== 0;
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    filtro = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    aplicarFiltros();
  });
});

search.addEventListener("input", aplicarFiltros);

/* Modelado procedural: figuras tipo juguete con materiales suaves. */
function crearPersonaje(p) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const materials = new Map();

  function material(color, metal = false) {
    const key = `${color}-${metal}`;
    if (!materials.has(key)) {
      materials.set(key, new THREE.MeshStandardMaterial({
        color,
        roughness: metal ? 0.32 : 0.72,
        metalness: metal ? 0.65 : 0.04
      }));
    }
    return materials.get(key);
  }

  function add(geometry, color, x, y, z, parent = body, metal = false) {
    const mesh = new THREE.Mesh(geometry, material(color, metal));
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  function ball(color, x, y, z, sx, sy = sx, sz = sx, parent = body) {
    const mesh = add(new THREE.SphereGeometry(1, 24, 18), color, x, y, z, parent);
    mesh.scale.set(sx, sy, sz);
    return mesh;
  }

  function box(color, x, y, z, w, h, d, parent = body, metal = false) {
    return add(new THREE.BoxGeometry(w, h, d), color, x, y, z, parent, metal);
  }

  function tube(color, x, y, z, top, bottom, height, parent = body, metal = false) {
    return add(
      new THREE.CylinderGeometry(top, bottom, height, 24),
      color, x, y, z, parent, metal
    );
  }

  const gold = "#efc34c";
  const blue = "#416bd0";
  const dark = "#302b2b";
  const steel = "#c7d5de";
  const mounted = ["principe", "montapuercos"].includes(p.id);
  const bare = ["barbaro", "montapuercos"].includes(p.id);
  const lady = ["princesa", "arquera"].includes(p.id);

  if (mounted) body.position.y = 0.48;
  if (p.id === "duende") body.scale.setScalar(0.88);

  // Piernas y botas.
  [-1, 1].forEach(side => {
    tube(p.piel, side * 0.23, 0.43, 0, 0.12, 0.13, 0.38);
    box(dark, side * 0.23, 0.23, 0.09, 0.29, 0.2, 0.42);
  });

  tube(bare ? p.piel : p.ropa, 0, 1.03, 0, 0.37, 0.45, 0.86);

  if (lady || p.id === "mago") {
    tube(p.ropa, 0, 0.67, 0, 0.34, 0.52, 0.38);
  }

  // Cinturón y hebilla.
  tube("#49392d", 0, 0.78, 0, 0.446, 0.446, 0.13);
  box(gold, 0, 0.79, 0.44, 0.23, 0.2, 0.08, body, true);
  box("#403831", 0, 0.79, 0.49, 0.1, 0.09, 0.025);

  [-1, 1].forEach(side => {
    ball(bare ? p.piel : p.ropa, side * 0.44, 1.22, 0, 0.21, 0.24, 0.23);
    const arm = tube(p.piel, side * 0.53, 1.01, 0.04, 0.13, 0.15, 0.43);
    arm.rotation.z = side * 0.23;
    ball(p.piel, side * 0.58, 0.84, 0.09, 0.16);
    if (bare) tube(dark, side * 0.56, 0.91, 0.05, 0.157, 0.157, 0.1);
  });

  // Cabeza, orejas y cabello.
  if (p.id === "mago") {
    ball(p.ropa, 0, 1.88, -0.07, 0.59, 0.65, 0.48);
    ball("#9bc5d7", 0, 1.89, 0.13, 0.52, 0.57, 0.35);
  } else if (lady) {
    ball(p.pelo, 0, 1.88, -0.08, 0.57, 0.62, 0.43);
  }

  ball(p.piel, 0, 1.85, 0.04, 0.48, 0.53, 0.42);

  [-1, 1].forEach(side => {
    if (p.id === "duende") {
      const ear = add(
        new THREE.ConeGeometry(0.21, 0.57, 3),
        p.piel, side * 0.57, 1.92, 0
      );
      ear.rotation.z = -side * 1.05;
      ear.scale.z = 0.48;
    } else {
      ball(p.piel, side * 0.47, 1.83, 0, 0.12, 0.17, 0.1);
    }
  });

  if (!["mago", "duende", "principe"].includes(p.id)) {
    ball(p.pelo, 0, 2.17, 0, 0.49, 0.25, 0.4);
    if (lady) {
      [-1, 1].forEach(side => {
        ball(p.pelo, side * 0.43, 1.84, 0, 0.15, 0.45, 0.35);
      });
    }
  }

  // Ojos grandes, pupilas, cejas y nariz.
  [-1, 1].forEach(side => {
    ball("#fff8ef", side * 0.19, 1.91, 0.408, 0.145, 0.17, 0.065);
    ball("#24232b", side * 0.19, 1.90, 0.466, 0.058, 0.082, 0.027);
    ball("#ffffff", side * 0.19 - 0.018, 1.93, 0.489, 0.018);
    const brow = box(p.pelo, side * 0.19, 2.09, 0.435, 0.26, 0.065, 0.06);
    brow.rotation.z = side * (p.id === "duende" ? 0.25 : -0.1);
  });

  ball(p.piel, 0, 1.78, 0.46, 0.095, 0.115, 0.11);
  ball("#5e302a", 0, 1.61, 0.421, 0.18, 0.075, 0.035);
  box("#fff4df", 0, 1.64, 0.455, 0.24, 0.047, 0.02);

  function bigote(color) {
    [-1, 1].forEach(side => {
      const m = ball(color, side * 0.15, 1.72, 0.47, 0.19, 0.08, 0.075);
      m.rotation.z = side * 0.18;
    });
  }

  function corona(y, radius) {
    tube(gold, 0, y, 0, radius, radius, 0.15, body, true);
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const point = box(gold, x, y + 0.14, z, 0.15, 0.23, 0.12, body, true);
      point.rotation.y = angle;
      ball(gold, x, y + 0.27, z, 0.06);
    }
    ball(blue, 0, y, radius, 0.085, 0.075, 0.035);
  }

  function espada(x) {
    box("#6e4930", x, 1.02, 0.14, 0.1, 0.32, 0.1);
    box(gold, x, 1.21, 0.14, 0.37, 0.09, 0.15, body, true);
    box(steel, x, 1.72, 0.14, 0.16, 0.94, 0.06, body, true);
    const tip = add(new THREE.ConeGeometry(0.115, 0.22, 4), steel, x, 2.3, 0.14, body, true);
    tip.scale.z = 0.35;
  }

  function arco() {
    const bow = add(
      new THREE.TorusGeometry(0.38, 0.035, 8, 32, Math.PI),
      "#bb8641", -0.64, 1.05, 0.24
    );
    bow.rotation.z = -Math.PI / 2;
    box("#eee0bd", -0.64, 1.05, 0.24, 0.014, 0.76, 0.014);
  }

  if (lady) arco();
  if (p.id === "princesa") corona(2.39, 0.2);

  if (p.id === "caballero") {
    bigote(gold);
    ball(steel, 0, 2.25, -0.05, 0.43, 0.21, 0.32);
    box(gold, 0, 2.28, 0.25, 0.12, 0.19, 0.1, body, true);
    espada(0.65);
  }

  if (p.id === "rey") {
    ball(p.pelo, 0, 1.51, 0.15, 0.43, 0.32, 0.35);
    // Boca visible sobre la barba.
    ball("#5e302a", 0, 1.64, 0.472, 0.19, 0.09, 0.035);
    box("#fff4df", 0, 1.68, 0.503, 0.25, 0.055, 0.02);
    bigote(p.pelo);
    corona(2.37, 0.5);
    box(blue, 0, 1.01, -0.37, 0.91, 1.11, 0.12);
  }

  if (p.id === "barbaro") {
    bigote(p.pelo);
    box(p.pelo, 0, 2.26, 0.13, 0.72, 0.16, 0.48);
    espada(0.68);
  }

  if (p.id === "mago") {
    bigote(p.pelo);
    ball(p.pelo, 0, 1.51, 0.37, 0.14, 0.23, 0.1);
    ball("#ff7b27", 0.72, 1.27, 0.15, 0.19, 0.25, 0.18);
    ball("#ffdf76", 0.72, 1.29, 0.27, 0.11, 0.16, 0.07);
    const flame = add(
      new THREE.ConeGeometry(0.13, 0.38, 8),
      "#ff9d2f", 0.72, 1.53, 0.15
    );
    flame.rotation.z = -0.2;
    const light = new THREE.PointLight("#ff9b46", 1.6, 2.5);
    light.position.set(0.72, 1.4, 0.4);
    body.add(light);
  }

  if (p.id === "duende") {
    box("#5a3829", 0.64, 0.99, 0.16, 0.09, 0.24, 0.09);
    const dagger = add(
      new THREE.ConeGeometry(0.1, 0.52, 4),
      steel, 0.64, 1.35, 0.16, body, true
    );
    dagger.scale.z = 0.35;
    box(gold, 0.64, 1.10, 0.16, 0.23, 0.07, 0.12);
  }

  if (p.id === "montapuercos") {
    box(p.pelo, 0, 2.40, 0, 0.19, 0.29, 0.43);
    ball(p.pelo, 0, 1.52, 0.24, 0.32, 0.23, 0.25);
    bigote(p.pelo);
    box("#79532e", -0.67, 1.48, 0.05, 0.1, 1.3, 0.1);
    box(steel, -0.67, 2.16, 0.05, 0.59, 0.31, 0.32, body, true);
    box(gold, -0.67, 2.16, 0.05, 0.13, 0.34, 0.35, body, true);
  }

  if (p.id === "principe") {
    bigote(p.pelo);
    ball(gold, 0, 2.22, -0.01, 0.51, 0.31, 0.44);
    box(gold, 0, 2.13, 0.43, 0.12, 0.36, 0.1, body, true);
    [-1, 1].forEach(side => {
      box(gold, side * 0.44, 1.93, 0.09, 0.13, 0.48, 0.4, body, true);
    });
    ball(blue, 0, 2.5, -0.12, 0.16, 0.29, 0.18);
    box("#9e703e", -0.66, 1.55, 0.05, 0.075, 1.8, 0.075);
    add(new THREE.ConeGeometry(0.14, 0.4, 4), steel, -0.66, 2.61, 0.05, body, true);
  }

  if (mounted) {
    const horse = p.id === "principe";
    const animal = new THREE.Group();
    root.add(animal);

    const fur = horse ? "#b48a55" : "#d78f7e";
    ball(fur, 0, 0.6, 0.17, 0.5, 0.38, 0.7, animal);
    ball(fur, 0, 0.79, 0.72, 0.38, 0.39, 0.35, animal);
    ball(horse ? "#d6a77b" : "#ecaa98", 0, 0.65, 1, 0.35, 0.21, 0.15, animal);

    [-1, 1].forEach(side => {
      [-1, 1].forEach(front => {
        tube(fur, side * 0.31, 0.3, front * 0.36 + 0.12, 0.09, 0.1, 0.36, animal);
        box(dark, side * 0.31, 0.14, front * 0.36 + 0.15, 0.18, 0.14, 0.22, animal);
      });
      ball("#29232b", side * 0.26, 0.88, 0.95, 0.04, 0.055, 0.025, animal);
      ball("#704039", side * 0.14, 0.66, 1.14, 0.045, 0.065, 0.02, animal);
      const ear = add(new THREE.ConeGeometry(0.12, 0.25, 3), fur, side * 0.24, 1.11, 0.64, animal);
      ear.rotation.z = -side * 0.25;
    });

    if (horse) {
      ball(gold, 0, 1.02, 0.75, 0.4, 0.21, 0.35, animal);
      box(blue, 0, 0.91, 1.03, 0.62, 0.08, 0.06, animal);
    }
  }

  return root;
}

function crearVista(stage, p) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power"
  });

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  stage.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40);
  camera.position.set(3.5, 2.8, 6.7);
  camera.lookAt(0, 1.35, 0);

  scene.add(new THREE.HemisphereLight("#e7efff", "#55516a", 2.7));

  const key = new THREE.DirectionalLight("#fff2d9", 3.5);
  key.position.set(3, 5, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(p.color, 2.8);
  rim.position.set(-3, 3, -3);
  scene.add(rim);

  const model = crearPersonaje(p);
  scene.add(model);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.03, 0.12, 64),
    new THREE.MeshStandardMaterial({
      color: "#35394c",
      roughness: 0.55,
      metalness: 0.25
    })
  );
  pedestal.position.y = 0;
  scene.add(pedestal);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.013, 8, 64),
    new THREE.MeshBasicMaterial({ color: p.color })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.04;
  scene.add(ring);

  const view = {
    renderer, scene, camera, model,
    visible: false, dragging: false,
    angle: -0.2, lastX: 0, dirty: true
  };

  const resize = new ResizeObserver(() => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view.dirty = true;
  });
  resize.observe(stage);

  const observer = new IntersectionObserver(entries => {
    view.visible = entries[0].isIntersecting;
    view.dirty = true;
  }, { rootMargin: "80px" });
  observer.observe(stage);

  stage.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    view.dragging = true;
    view.lastX = event.clientX;
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", event => {
    if (!view.dragging) return;
    view.angle += (event.clientX - view.lastX) * 0.012;
    view.lastX = event.clientX;
    view.dirty = true;
  });

  const stop = () => { view.dragging = false; };
  stage.addEventListener("pointerup", stop);
  stage.addEventListener("pointercancel", stop);
  stage.addEventListener("lostpointercapture", stop);

  stage.tabIndex = 0;
  stage.setAttribute("role", "img");
  stage.setAttribute(
    "aria-label",
    `Modelo 3D de ${p.nombre}. Arrastra o usa las flechas izquierda y derecha para girar.`
  );

  stage.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    view.angle += event.key === "ArrowLeft" ? -0.2 : 0.2;
    view.dirty = true;
  });

  renderer.domElement.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    view.visible = false;
    stage.querySelector(".rotate-hint").textContent =
      "Vista 3D pausada. Recarga la página para recuperarla.";
  });

  return view;
}

personajes.forEach((p, index) => {
  const card = document.createElement("article");
  card.className = "card";
  card.style.setProperty("--character", p.color);
  card.style.setProperty("--glow", `${p.color}26`);

  // Solo se interpolan datos locales definidos en este archivo.
  card.innerHTML = `
    <div class="stage">
      <span class="badge">${p.categoria}</span>
      <span class="number">${String(index + 1).padStart(2, "0")} / 09</span>
      <span class="rotate-hint">↔ Arrastra para girar</span>
    </div>
    <div class="card-body">
      <div class="card-heading">
        <h2>${p.nombre}</h2>
        ${p.elixir === null ? "" : `
          <span class="elixir" aria-label="${p.elixir} de elixir, valor ilustrativo">
            <span class="drop" aria-hidden="true"></span>${p.elixir}
          </span>
        `}
      </div>
      <p class="role">${p.rol}</p>
      <div class="card-bottom">
        <span class="tag">${p.tipo}</span>
        <button class="details" aria-label="Explorar ficha de ${p.nombre}">
          Explorar ficha <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  `;

  grid.append(card);
  card.querySelector(".details").addEventListener("click", () => mostrarFicha(p));

  let view = {};
  try {
    if (!window.THREE) throw new Error("Three.js no disponible");
    view = crearVista(card.querySelector(".stage"), p);
  } catch (error) {
    const stage = card.querySelector(".stage");
    stage.querySelector("canvas")?.remove();
    const hint = stage.querySelector(".rotate-hint");
    hint.textContent = "No se pudo iniciar la vista 3D. Revisa la conexión y WebGL.";
    hint.style.bottom = "45%";
    hint.style.padding = "0 25px";
    console.error(error);
  }

  Object.assign(view, { card,    personaje: p });
views.push(view);


aplicarFiltros();

/*
 * Una única animación para todas las tarjetas.
 * Solo renderiza modelos visibles y respeta movimiento reducido.
 */
let lastTime = 0;

function animate(time) {
  requestAnimationFrame(animate);

  if (document.hidden || time - lastTime < 33) return;
  lastTime = time;

  views.forEach(view => {
    if (!view.renderer || !view.visible || view.card.hidden) return;

    const idle = !reduceMotion.matches && !view.dragging;
    if (!idle && !view.dirty) return;

    view.model.rotation.y =
      view.angle + (idle ? Math.sin(time * 0.00055) * 0.12 : 0);

    view.renderer.render(view.scene, view.camera);
    view.dirty = false;
  });
}

requestAnimationFrame(animate);
