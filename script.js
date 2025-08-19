const typeChart = [
    { type: "Normal", nameZh: "一般", icon: "icons/normal.svg" },
    { type: "Fire", nameZh: "火", icon: "icons/fire.svg" },
    { type: "Water", nameZh: "水", icon: "icons/water.svg" },
    { type: "Electric", nameZh: "电", icon: "icons/electric.svg" },
    { type: "Grass", nameZh: "草", icon: "icons/grass.svg" },
    { type: "Ice", nameZh: "冰", icon: "icons/ice.svg" },
    { type: "Fighting", nameZh: "格斗", icon: "icons/fighting.svg" },
    { type: "Poison", nameZh: "毒", icon: "icons/poison.svg" },
    { type: "Ground", nameZh: "地面", icon: "icons/ground.svg" },
    { type: "Flying", nameZh: "飞行", icon: "icons/flying.svg" },
    { type: "Psychic", nameZh: "超能力", icon: "icons/psychic.svg" },
    { type: "Bug", nameZh: "虫", icon: "icons/bug.svg" },
    { type: "Rock", nameZh: "岩石", icon: "icons/rock.svg" },
    { type: "Ghost", nameZh: "幽灵", icon: "icons/ghost.svg" },
    { type: "Dragon", nameZh: "龙", icon: "icons/dragon.svg" },
    { type: "Dark", nameZh: "恶", icon: "icons/dark.svg" },
    { type: "Steel", nameZh: "钢", icon: "icons/steel.svg" },
    { type: "Fairy", nameZh: "妖精", icon: "icons/fairy.svg" }
  ];
  
  const effectiveness = {
    Normal:   { Rock:0.5, Steel:0.5, Ghost:0 },
    Fire:     { Grass:2, Ice:2, Bug:2, Steel:2, Fire:0.5, Water:0.5, Rock:0.5, Dragon:0.5 },
    Water:    { Fire:2, Ground:2, Rock:2, Water:0.5, Grass:0.5, Dragon:0.5 },
    Electric: { Water:2, Flying:2, Ground:0, Electric:0.5, Grass:0.5, Dragon:0.5 },
    Grass:    { Water:2, Ground:2, Rock:2, Fire:0.5, Grass:0.5, Poison:0.5, Flying:0.5, Bug:0.5, Dragon:0.5, Steel:0.5 },
    Ice:      { Grass:2, Ground:2, Flying:2, Dragon:2, Fire:0.5, Water:0.5, Ice:0.5, Steel:0.5 },
    Fighting: { Normal:2, Rock:2, Steel:2, Ice:2, Dark:2, Ghost:0, Flying:0.5, Poison:0.5, Psychic:0.5, Bug:0.5, Fairy:0.5 },
    Poison:   { Grass:2, Fairy:2, Poison:0.5, Ground:0.5, Rock:0.5, Ghost:0.5, Steel:0 },
    Ground:   { Fire:2, Electric:2, Poison:2, Rock:2, Steel:2, Grass:0.5, Bug:0.5, Flying:0 },
    Flying:   { Grass:2, Fighting:2, Bug:2, Electric:0.5, Rock:0.5, Steel:0.5 },
    Psychic:  { Fighting:2, Poison:2, Psychic:0.5, Steel:0.5, Dark:0 },
    Bug:      { Grass:2, Psychic:2, Dark:2, Fire:0.5, Fighting:0.5, Flying:0.5, Ghost:0.5, Poison:0.5, Steel:0.5, Fairy:0.5 },
    Rock:     { Fire:2, Ice:2, Flying:2, Bug:2, Fighting:0.5, Ground:0.5, Steel:0.5 },
    Ghost:    { Psychic:2, Ghost:2, Dark:0.5, Normal:0 },
    Dragon:   { Dragon:2, Steel:0.5, Fairy:0 },
    Dark:     { Psychic:2, Ghost:2, Fighting:0.5, Dark:0.5, Fairy:0.5 },
    Steel:    { Rock:2, Ice:2, Fairy:2, Fire:0.5, Water:0.5, Electric:0.5, Steel:0.5 },
    Fairy:    { Fighting:2, Dragon:2, Dark:2, Fire:0.5, Poison:0.5, Steel:0.5 }
  };

  function getTypeData(type) {
    return typeChart.find(t => t.type === type);
  }
  
  function calculate(types) {
    const result = {};
    typeChart.forEach(atk => {
      let multiplier = 1;
      types.forEach(def => {
        const eff = effectiveness[atk.type]?.[def] ?? 1;
        multiplier *= eff;
      });
      result[atk.type] = multiplier;
    });
    return result;
  }
  
  function groupResults(result) {
    const groups = {
      "无效果 (0)": [],
      "效果不好 (1/4)": [],
      "效果不好 (1/2)": [],
      "有效果 (1)": [],
      "效果绝佳 (2)": [],
      "效果绝佳 (4)": []
    };
  
    for (const [atk, mult] of Object.entries(result)) {
      const t = getTypeData(atk);
      let key;
      if (mult === 0) key = "无效果 (0)";
      else if (mult === 0.25) key = "效果不好 (1/4)";
      else if (mult === 0.5) key = "效果不好 (1/2)";
      else if (mult === 1) key = "有效果 (1)";
      else if (mult === 2) key = "效果绝佳 (2)";
      else if (mult === 4) key = "效果绝佳 (4)";
      else continue;
  
      groups[key].push(`<li class="flex items-center gap-1"><img src="${t.icon}" class="w-5 h-5"> ${t.nameZh}</li>`);
    }
  
    return groups;
  }
  

function updateUI() {
    const selected = Array.from(document.querySelectorAll("input[name='defending-pokemon-type']:checked"))
      .map(el => el.value);
  
    const instruction = document.getElementById("instruction-field");
    const resultContainer = document.getElementById("result-container");
  
    if (selected.length === 0) {
      instruction.textContent = "请选择一个或两个防御属性！";
      resultContainer.innerHTML = "";
      return;
    }
    if (selected.length > 2) {
      instruction.textContent = "最多只能选择两个属性！";
      return;
    }
  
    instruction.textContent = `已选择: ${selected.map(s => getTypeData(s).nameZh).join(" + ")}`;
  
    const calc = calculate(selected);
    const groups = groupResults(calc);
  
    let html = "";
    for (const [title, items] of Object.entries(groups)) {
      html += `<h3 class="font-bold mt-3">${title}</h3><ul class="mb-2">${items.length ? items.join("") : "<li>-</li>"}</ul>`;
    }
    resultContainer.innerHTML = html;
  }
  
  document.querySelectorAll(".type-container li").forEach(li => {
    li.addEventListener("click", function() {
      const checkbox = this.querySelector("input[name='defending-pokemon-type']");

      const selectedCount = document.querySelectorAll("input[name='defending-pokemon-type']:checked").length;
      if (!checkbox.checked && selectedCount >= 2) {
        return;
      }
  
      checkbox.checked = !checkbox.checked;
      this.classList.toggle("selected", checkbox.checked);
  
      updateUI();
    });
  });
  