const byId = (id) => document.getElementById(id);

const state = {
  ingredients: [
    { id: crypto.randomUUID(), name: "Đậu", unit: "miếng", currentQty: 20, batchOutput: 200, batchMinutes: 12 },
    { id: crypto.randomUUID(), name: "Bò", unit: "kg", currentQty: 0.3, batchOutput: 2, batchMinutes: 10 },
    { id: crypto.randomUUID(), name: "Nước dùng", unit: "nồi", currentQty: 0.3, batchOutput: 1, batchMinutes: 40 },
  ],
  dishes: [
    {
      id: crypto.randomUUID(),
      name: "Bún đầy đủ",
      bowls: 300,
      recipe: [
        { id: crypto.randomUUID(), ingredientId: null, amountPerBowl: 5 },
        { id: crypto.randomUUID(), ingredientId: null, amountPerBowl: 0.035 },
      ],
    },
  ],
};

state.dishes[0].recipe[0].ingredientId = state.ingredients[0].id;
state.dishes[0].recipe[1].ingredientId = state.ingredients[1].id;

function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function addMinutesToTime(timeString, minutes) {
  const [h, m] = timeString.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60).toString().padStart(2, "0");
  const minute = Math.floor(normalized % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function numberInput(value, step = "0.01") {
  return `<input type="number" inputmode="decimal" min="0" step="${step}" value="${value}" />`;
}

function renderInventory() {
  const wrapper = byId("inventoryList");
  wrapper.innerHTML = state.ingredients
    .map(
      (ingredient) => `
      <div class="item-row" data-ingredient-id="${ingredient.id}">
        <label>Tên nguyên vật liệu
          <input type="text" value="${ingredient.name}" data-field="name" placeholder="Ví dụ: Đậu" />
        </label>
        <label>Tồn hiện có
          ${numberInput(ingredient.currentQty)}
        </label>
        <label>Đơn vị
          <input type="text" value="${ingredient.unit}" data-field="unit" placeholder="miếng/kg/nồi" />
        </label>
        <button type="button" class="danger-btn" data-action="remove-ingredient">Xóa</button>
      </div>
    `,
    )
    .join("");

  wrapper.querySelectorAll(".item-row").forEach((row) => {
    const ingredient = state.ingredients.find((item) => item.id === row.dataset.ingredientId);
    const inputs = row.querySelectorAll("input");

    inputs[0].addEventListener("input", (event) => {
      ingredient.name = event.target.value;
      renderDishes();
      renderCapacity();
    });

    inputs[1].addEventListener("input", (event) => {
      ingredient.currentQty = Number(event.target.value || 0);
    });

    inputs[2].addEventListener("input", (event) => {
      ingredient.unit = event.target.value;
      renderCapacity();
      renderDishes();
    });

    row.querySelector("[data-action='remove-ingredient']").addEventListener("click", () => {
      if (state.ingredients.length <= 1) return;
      state.ingredients = state.ingredients.filter((item) => item.id !== ingredient.id);
      state.dishes.forEach((dish) => {
        dish.recipe = dish.recipe.filter((entry) => entry.ingredientId !== ingredient.id);
      });
      renderAll();
    });
  });
}

function ingredientOptions(selectedId) {
  return state.ingredients
    .map(
      (ingredient) =>
        `<option value="${ingredient.id}" ${selectedId === ingredient.id ? "selected" : ""}>${ingredient.name || "(Chưa đặt tên)"}</option>`,
    )
    .join("");
}

function renderDishes() {
  const wrapper = byId("dishList");

  wrapper.innerHTML = state.dishes
    .map(
      (dish) => `
      <div class="dish-card" data-dish-id="${dish.id}">
        <div class="grid two-col">
          <label>Tên món dự báo
            <input type="text" value="${dish.name}" data-field="dish-name" placeholder="Ví dụ: Tô ngon miệng" />
          </label>
          <label>Số lượng bát dự kiến bán
            <input type="number" inputmode="numeric" min="0" step="1" value="${dish.bowls}" data-field="dish-bowls" />
          </label>
        </div>

        <div class="recipe-list">
          ${dish.recipe
            .map(
              (recipeEntry) => `
              <div class="recipe-row" data-recipe-id="${recipeEntry.id}">
                <label>Nguyên vật liệu
                  <select data-field="recipe-ingredient">${ingredientOptions(recipeEntry.ingredientId)}</select>
                </label>
                <label>Định mức / 1 bát
                  <input type="number" inputmode="decimal" min="0" step="0.01" value="${recipeEntry.amountPerBowl}" data-field="recipe-amount" />
                </label>
                <button type="button" class="danger-btn" data-action="remove-recipe">Xóa định mức</button>
              </div>
            `,
            )
            .join("")}
        </div>

        <div class="row-actions">
          <button type="button" class="secondary-btn" data-action="add-recipe">+ Thêm định mức nguyên liệu cho món này</button>
          <button type="button" class="danger-btn" data-action="remove-dish">Xóa món</button>
        </div>
      </div>
    `,
    )
    .join("");

  wrapper.querySelectorAll(".dish-card").forEach((dishCard) => {
    const dish = state.dishes.find((item) => item.id === dishCard.dataset.dishId);
    dishCard.querySelector("[data-field='dish-name']").addEventListener("input", (event) => {
      dish.name = event.target.value;
    });
    dishCard.querySelector("[data-field='dish-bowls']").addEventListener("input", (event) => {
      dish.bowls = Number(event.target.value || 0);
    });

    dishCard.querySelectorAll(".recipe-row").forEach((recipeRow) => {
      const recipe = dish.recipe.find((item) => item.id === recipeRow.dataset.recipeId);
      recipeRow.querySelector("[data-field='recipe-ingredient']").addEventListener("change", (event) => {
        recipe.ingredientId = event.target.value;
      });
      recipeRow.querySelector("[data-field='recipe-amount']").addEventListener("input", (event) => {
        recipe.amountPerBowl = Number(event.target.value || 0);
      });
      recipeRow.querySelector("[data-action='remove-recipe']").addEventListener("click", () => {
        dish.recipe = dish.recipe.filter((item) => item.id !== recipe.id);
        renderDishes();
      });
    });

    dishCard.querySelector("[data-action='add-recipe']").addEventListener("click", () => {
      dish.recipe.push({
        id: crypto.randomUUID(),
        ingredientId: state.ingredients[0]?.id || null,
        amountPerBowl: 0,
      });
      renderDishes();
    });

    dishCard.querySelector("[data-action='remove-dish']").addEventListener("click", () => {
      if (state.dishes.length <= 1) return;
      state.dishes = state.dishes.filter((item) => item.id !== dish.id);
      renderDishes();
    });
  });
}

function renderCapacity() {
  const wrapper = byId("capacityList");
  wrapper.innerHTML = state.ingredients
    .map(
      (ingredient) => `
      <div class="item-row" data-capacity-id="${ingredient.id}">
        <label>Nguyên vật liệu
          <input type="text" value="${ingredient.name}" disabled />
        </label>
        <label>Sản lượng mỗi mẻ (${ingredient.unit || "đơn vị"})
          ${numberInput(ingredient.batchOutput, "0.01")}
        </label>
        <label>Thời gian mỗi mẻ (phút)
          ${numberInput(ingredient.batchMinutes, "0.1")}
        </label>
      </div>
    `,
    )
    .join("");

  wrapper.querySelectorAll(".item-row").forEach((row) => {
    const ingredient = state.ingredients.find((item) => item.id === row.dataset.capacityId);
    const inputs = row.querySelectorAll("input");
    inputs[1].addEventListener("input", (event) => {
      ingredient.batchOutput = Number(event.target.value || 0);
    });
    inputs[2].addEventListener("input", (event) => {
      ingredient.batchMinutes = Number(event.target.value || 0);
    });
  });
}

function calculateKpi() {
  const kitchenStartTime = byId("kitchenStartTime").value;
  const usageByIngredient = new Map(state.ingredients.map((item) => [item.id, 0]));

  state.dishes.forEach((dish) => {
    dish.recipe.forEach((entry) => {
      if (!entry.ingredientId) return;
      const current = usageByIngredient.get(entry.ingredientId) || 0;
      usageByIngredient.set(entry.ingredientId, current + dish.bowls * entry.amountPerBowl);
    });
  });

  const ingredientResults = state.ingredients.map((ingredient) => {
    const required = usageByIngredient.get(ingredient.id) || 0;
    const needToPrepare = Math.max(0, required - ingredient.currentQty);
    const batches = ingredient.batchOutput > 0 ? needToPrepare / ingredient.batchOutput : 0;
    const minutes = batches * ingredient.batchMinutes;
    return { ingredient, required, needToPrepare, batches, minutes };
  });

  const totalMinutes = ingredientResults.reduce((sum, item) => sum + item.minutes, 0);
  const finishTime = addMinutesToTime(kitchenStartTime, Math.ceil(totalMinutes));
  const dishSummary = state.dishes
    .map((dish) => `<li>${dish.name || "(Chưa đặt tên)"}: <strong>${formatNumber(dish.bowls, 0)} bát</strong></li>`)
    .join("");

  const ingredientSummary = ingredientResults
    .map(
      (item) => `
      <li>
        <strong>${item.ingredient.name || "(Chưa đặt tên)"}:</strong>
        Cần tổng ${formatNumber(item.required, 2)} ${item.ingredient.unit}, tồn ${formatNumber(item.ingredient.currentQty, 2)} ${item.ingredient.unit},
        cần chuẩn bị thêm <strong>${formatNumber(item.needToPrepare, 2)} ${item.ingredient.unit}</strong>.<br/>
        Số mẻ: ${formatNumber(item.batches, 2)} • Thời gian: ${formatNumber(item.minutes, 1)} phút.
      </li>
    `,
    )
    .join("");

  byId("resultContent").innerHTML = `
    <p><strong>Sản lượng dự kiến theo món:</strong></p>
    <ul>${dishSummary}</ul>
    <p><strong>Nhu cầu nguyên liệu & kế hoạch sơ chế:</strong></p>
    <ul>${ingredientSummary}</ul>
    <div class="kpi-highlight">
      <p><strong>Tổng thời gian chế biến chính:</strong> ${formatNumber(totalMinutes, 1)} phút (${formatNumber(totalMinutes / 60, 2)} giờ).</p>
      <p><strong>Giờ bắt đầu:</strong> ${kitchenStartTime} → <strong>Mốc cần hoàn thành:</strong> ${finishTime}.</p>
    </div>
  `;

  byId("result").hidden = false;
}

function renderAll() {
  renderInventory();
  renderDishes();
  renderCapacity();
}

byId("addInventoryBtn").addEventListener("click", () => {
  state.ingredients.push({
    id: crypto.randomUUID(),
    name: "",
    unit: "",
    currentQty: 0,
    batchOutput: 1,
    batchMinutes: 10,
  });
  renderAll();
});

byId("addDishBtn").addEventListener("click", () => {
  state.dishes.push({
    id: crypto.randomUUID(),
    name: "",
    bowls: 0,
    recipe: [{ id: crypto.randomUUID(), ingredientId: state.ingredients[0]?.id || null, amountPerBowl: 0 }],
  });
  renderDishes();
});

byId("calculateButton").addEventListener("click", calculateKpi);
window.addEventListener("DOMContentLoaded", () => {
  renderAll();
  calculateKpi();
});
