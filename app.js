const byId = (id) => document.getElementById(id);

const uid = () =>
  (globalThis.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const state = {
  ingredients: [
    { id: uid(), name: "Đậu", unit: "miếng", stock: 20, batchYield: 200, batchMinutes: 12 },
    { id: uid(), name: "Bò", unit: "kg", stock: 0.3, batchYield: 2, batchMinutes: 10 },
    { id: uid(), name: "Nước dùng", unit: "nồi", stock: 0.3, batchYield: 1, batchMinutes: 40 },
  ],
  dishes: [
    { id: uid(), name: "Bún đầy đủ", quantity: 300, recipe: [] },
  ],
};
state.dishes[0].recipe = [
  { id: uid(), ingredientId: state.ingredients[0].id, perBowl: 5 },
  { id: uid(), ingredientId: state.ingredients[1].id, perBowl: 0.035 },
];

function n(value) {
  return Number(value || 0);
}

function f(value, digits = 2) {
  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function addMinutes(startHHMM, minutes) {
  const [h, m] = startHHMM.split(":").map(Number);
  const total = h * 60 + m + Math.ceil(minutes);
  const normalized = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
  const mm = String(normalized % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function ingredientOptions(selected) {
  return state.ingredients
    .map((i) => `<option value="${i.id}" ${i.id === selected ? "selected" : ""}>${i.name || "(Chưa đặt tên)"}</option>`)
    .join("");
}

function renderIngredients() {
  const root = byId("ingredientsContainer");
  root.innerHTML = state.ingredients
    .map((i) => `
      <div class="card-item" data-ingredient-id="${i.id}">
        <div class="row-grid">
          <label>Tên nguyên vật liệu
            <input data-field="name" type="text" value="${i.name}" placeholder="Ví dụ: Đậu" />
          </label>
          <label>Tồn hiện có
            <input data-field="stock" type="number" inputmode="decimal" min="0" step="0.01" value="${i.stock}" />
          </label>
          <label>Đơn vị
            <input data-field="unit" type="text" value="${i.unit}" placeholder="miếng/kg/nồi" />
          </label>
          <div class="actions">
            <button type="button" class="btn btn-danger" data-action="delete">Xóa nguyên liệu</button>
          </div>
        </div>
      </div>
    `)
    .join("");

  root.querySelectorAll("[data-ingredient-id]").forEach((el) => {
    const id = el.dataset.ingredientId;
    const item = state.ingredients.find((x) => x.id === id);
    el.querySelector("[data-field='name']").addEventListener("input", (e) => {
      item.name = e.target.value;
      renderDishes();
      renderCapacity();
    });
    el.querySelector("[data-field='stock']").addEventListener("input", (e) => {
      item.stock = n(e.target.value);
    });
    el.querySelector("[data-field='unit']").addEventListener("input", (e) => {
      item.unit = e.target.value;
      renderDishes();
      renderCapacity();
    });
    el.querySelector("[data-action='delete']").addEventListener("click", () => {
      if (state.ingredients.length === 1) return;
      state.ingredients = state.ingredients.filter((x) => x.id !== id);
      state.dishes.forEach((d) => {
        d.recipe = d.recipe.filter((r) => r.ingredientId !== id);
      });
      renderAll();
    });
  });
}

function renderDishes() {
  const root = byId("dishesContainer");
  root.innerHTML = state.dishes
    .map((d) => `
      <div class="card-item" data-dish-id="${d.id}">
        <div class="row-grid">
          <label>Tên món dự báo
            <input data-field="name" type="text" value="${d.name}" placeholder="Ví dụ: Tô ngon miệng" />
          </label>
          <label>Số lượng tô/bát dự kiến bán
            <input data-field="quantity" type="number" inputmode="numeric" min="0" step="1" value="${d.quantity}" />
          </label>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-action="add-recipe">+ Thêm định mức</button>
            <button type="button" class="btn btn-danger" data-action="delete-dish">Xóa món</button>
          </div>
        </div>
        <div class="stack">
          ${d.recipe
            .map((r) => `
              <div class="recipe-item" data-recipe-id="${r.id}">
                <div class="row-grid">
                  <label>Nguyên vật liệu
                    <select data-field="ingredient">${ingredientOptions(r.ingredientId)}</select>
                  </label>
                  <label>Định mức cho 1 tô/bát
                    <input data-field="perBowl" type="number" inputmode="decimal" min="0" step="0.01" value="${r.perBowl}" />
                  </label>
                  <div class="actions">
                    <button type="button" class="btn btn-danger" data-action="delete-recipe">Xóa định mức</button>
                  </div>
                </div>
              </div>
            `)
            .join("")}
        </div>
      </div>
    `)
    .join("");

  root.querySelectorAll("[data-dish-id]").forEach((el) => {
    const dish = state.dishes.find((x) => x.id === el.dataset.dishId);
    el.querySelector("[data-field='name']").addEventListener("input", (e) => {
      dish.name = e.target.value;
    });
    el.querySelector("[data-field='quantity']").addEventListener("input", (e) => {
      dish.quantity = n(e.target.value);
    });
    el.querySelector("[data-action='add-recipe']").addEventListener("click", () => {
      dish.recipe.push({ id: uid(), ingredientId: state.ingredients[0]?.id, perBowl: 0 });
      renderDishes();
    });
    el.querySelector("[data-action='delete-dish']").addEventListener("click", () => {
      if (state.dishes.length === 1) return;
      state.dishes = state.dishes.filter((x) => x.id !== dish.id);
      renderDishes();
    });

    el.querySelectorAll("[data-recipe-id]").forEach((row) => {
      const recipe = dish.recipe.find((x) => x.id === row.dataset.recipeId);
      row.querySelector("[data-field='ingredient']").addEventListener("change", (e) => {
        recipe.ingredientId = e.target.value;
      });
      row.querySelector("[data-field='perBowl']").addEventListener("input", (e) => {
        recipe.perBowl = n(e.target.value);
      });
      row.querySelector("[data-action='delete-recipe']").addEventListener("click", () => {
        dish.recipe = dish.recipe.filter((x) => x.id !== recipe.id);
        renderDishes();
      });
    });
  });
}

function renderCapacity() {
  const root = byId("capacityContainer");
  root.innerHTML = state.ingredients
    .map((i) => `
      <div class="card-item" data-capacity-id="${i.id}">
        <div class="row-grid">
          <label>Nguyên vật liệu
            <input type="text" value="${i.name}" disabled />
          </label>
          <label>Năng suất 1 mẻ (${i.unit || "đơn vị"})
            <input data-field="batchYield" type="number" inputmode="decimal" min="0" step="0.01" value="${i.batchYield}" />
          </label>
          <label>Thời gian 1 mẻ (phút)
            <input data-field="batchMinutes" type="number" inputmode="decimal" min="0" step="0.1" value="${i.batchMinutes}" />
          </label>
        </div>
      </div>
    `)
    .join("");

  root.querySelectorAll("[data-capacity-id]").forEach((el) => {
    const item = state.ingredients.find((x) => x.id === el.dataset.capacityId);
    el.querySelector("[data-field='batchYield']").addEventListener("input", (e) => {
      item.batchYield = n(e.target.value);
    });
    el.querySelector("[data-field='batchMinutes']").addEventListener("input", (e) => {
      item.batchMinutes = n(e.target.value);
    });
  });
}

function calculate() {
  const useMap = new Map(state.ingredients.map((i) => [i.id, 0]));

  state.dishes.forEach((d) => {
    d.recipe.forEach((r) => {
      if (!r.ingredientId) return;
      useMap.set(r.ingredientId, (useMap.get(r.ingredientId) || 0) + d.quantity * r.perBowl);
    });
  });

  const resultRows = state.ingredients.map((i) => {
    const required = useMap.get(i.id) || 0;
    const need = Math.max(0, required - i.stock);
    const batches = i.batchYield > 0 ? need / i.batchYield : 0;
    const minutes = batches * i.batchMinutes;
    return { i, required, need, batches, minutes };
  });

  const totalMinutes = resultRows.reduce((sum, r) => sum + r.minutes, 0);
  const start = byId("startTime").value;
  const finish = addMinutes(start, totalMinutes);

  const dishHTML = state.dishes
    .map((d) => `<li><strong>${d.name || "(Chưa đặt tên)"}</strong>: ${f(d.quantity, 0)} tô/bát</li>`)
    .join("");
  const ingredientHTML = resultRows
    .map(
      (r) => `<li><strong>${r.i.name || "(Chưa đặt tên)"}</strong>: cần ${f(r.required)} ${r.i.unit}, tồn ${f(r.i.stock)} ${r.i.unit}, chuẩn bị thêm <strong>${f(r.need)} ${r.i.unit}</strong>. Số mẻ ${f(r.batches, 2)} (${f(r.minutes, 1)} phút).</li>`,
    )
    .join("");

  byId("resultContent").innerHTML = `
    <p><strong>Sản lượng dự báo theo món:</strong></p>
    <ul>${dishHTML}</ul>
    <p><strong>Tổng hợp nguyên liệu cần chuẩn bị:</strong></p>
    <ul>${ingredientHTML}</ul>
    <div class="summary">
      <p><strong>Tổng thời gian chế biến:</strong> ${f(totalMinutes, 1)} phút (${f(totalMinutes / 60, 2)} giờ).</p>
      <p><strong>Giờ bắt đầu:</strong> ${start} → <strong>Mốc cần hoàn thành:</strong> ${finish}.</p>
    </div>
  `;

  byId("resultPanel").hidden = false;
}

function renderAll() {
  renderIngredients();
  renderDishes();
  renderCapacity();
}

byId("addIngredientBtn").addEventListener("click", () => {
  state.ingredients.push({ id: uid(), name: "", unit: "", stock: 0, batchYield: 1, batchMinutes: 10 });
  renderAll();
});

byId("addDishBtn").addEventListener("click", () => {
  state.dishes.push({
    id: uid(),
    name: "",
    quantity: 0,
    recipe: [{ id: uid(), ingredientId: state.ingredients[0]?.id, perBowl: 0 }],
  });
  renderDishes();
});

byId("calculateBtn").addEventListener("click", calculate);
window.addEventListener("DOMContentLoaded", () => {
  renderAll();
  calculate();
});
