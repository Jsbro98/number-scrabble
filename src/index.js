// TODO tinker with drag n drop

const dragCell = document.querySelector("#drag");
const rows = document.querySelectorAll(".row");
let lastDraggedOver = null;

for (const row of rows) {
  addDragListener(row);
}

function addDragListener(container) {
  if (!container) return;

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const classList = e.target.classList;
    if (classList.contains("cell")) {
      lastDraggedOver = e.target;
    }
  });

  container.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    const rect = lastDraggedOver.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    if (offsetY > rect.height / 2) {
      lastDraggedOver.insertAdjacentElement("afterend", dragCell);
    } else {
      lastDraggedOver.insertAdjacentElement("beforebegin", dragCell);
    }
  });
}
