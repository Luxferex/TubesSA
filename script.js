class FoodItem {
  constructor(name, price, nutrition) {
    this.name = name;
    this.price = price;
    this.nutrition = nutrition;
  }
}

class NutritionTracker {
  constructor() {
    this.foodItems = [];
  }

  addFoodItem(name, price, nutrition) {
    const foodItem = new FoodItem(name, price, nutrition);
    this.foodItems.push(foodItem);
  }

  getRecommendations(targetNutrition) {
    // Basic recommendation logic (for simplicity, just return all items)
    return this.foodItems;
  }
}

const tracker = new NutritionTracker();

document.getElementById('add-food-button').addEventListener('click', () => {
  const name = document.getElementById('food-name').value;
  const price = parseFloat(document.getElementById('food-price').value);
  const nutrition = parseInt(document.getElementById('food-nutrition').value);

  if (name && !isNaN(price) && !isNaN(nutrition)) {
    tracker.addFoodItem(name, price, nutrition);
    alert(`Food item '${name}' added successfully!`);
    document.getElementById('food-name').value = '';
    document.getElementById('food-price').value = '';
    document.getElementById('food-nutrition').value = '';
  } else {
    alert('Please fill in all fields correctly.');
  }
});

document.getElementById('calculate-button').addEventListener('click', () => {
  const targetNutrition = parseInt(document.getElementById('target-nutrition-input').value);

  if (!isNaN(targetNutrition)) {
    const recommendations = tracker.getRecommendations(targetNutrition);
    const solutionsList = document.getElementById('food-solutions-list');
    solutionsList.innerHTML = '';

    recommendations.forEach((item) => {
      const foodItem = document.createElement('div');
      foodItem.classList.add('food-item');
      foodItem.innerHTML = `${item.name} (${item.nutrition} kKal)`;
      solutionsList.appendChild(foodItem);
    });
  } else {
    alert('Please enter a valid target nutrition value.');
  }
});

function greedyFoodSolution(foods, targetNutrition) {
  const selectedFoods = [];
  let remainingNutrition = { ...targetNutrition };

  while (remainingNutrition.calories > 0 || remainingNutrition.protein > 0 || remainingNutrition.fat > 0) {
    let bestFood = null;
    let minDistance = Infinity;

    for (const food of foods) {
      const distance = Math.abs(food.calories - remainingNutrition.calories) + Math.abs(food.protein - remainingNutrition.protein) + Math.abs(food.fat - remainingNutrition.fat);

      if (distance < minDistance) {
        minDistance = distance;
        bestFood = food;
      }
    }

    selectedFoods.push(bestFood);
    remainingNutrition.calories -= bestFood.calories;
    remainingNutrition.protein -= bestFood.protein;
    remainingNutrition.fat -= bestFood.fat;
  }

  return selectedFoods;
}

function calculateSolution() {
  const methodSelect = document.getElementById('method');
  const selectedMethod = methodSelect.value;

  // Contoh daftar makanan dan target nutrisi
  const foods = [
    { name: 'Sop Buah', calories: 120, protein: 2, fat: 1 },
    { name: 'Vitamin', calories: 100, protein: 1, fat: 0 },
    // Tambahkan makanan lain jika diperlukan
  ];

  // Ambil target nutrisi dari input pengguna
  const targetCalories = parseInt(document.getElementById('target-calories').value);
  const targetProtein = parseInt(document.getElementById('target-protein').value);
  const targetFat = parseInt(document.getElementById('target-fat').value);

  const targetNutrition = { calories: targetCalories, protein: targetProtein, fat: targetFat };

  let selectedFoods;

  if (selectedMethod === 'greedy') {
    selectedFoods = greedyFoodSolution(foods, targetNutrition);
  }
  // Tambahkan blok if untuk metode lain jika ada

  displaySolution(selectedFoods);
}

function displaySolution(foods) {
  const foodSolutionsList = document.getElementById('food-solutions-list');
  foodSolutionsList.innerHTML = ''; // Kosongkan daftar makanan sebelum menambahkan solusi baru

  foods.forEach((food) => {
    const foodItem = document.createElement('div');
    foodItem.classList.add('food-item');
    const img = document.createElement('img');
    img.src = `${food.name.toLowerCase().replace(' ', '-')}.jpg`; // Ubah nama makanan menjadi lowercase dan ganti spasi dengan tanda "-"
    img.alt = food.name;
    const p = document.createElement('p');
    p.textContent = `${food.name}\n${food.calories} kKal`;
    foodItem.appendChild(img);
    foodItem.appendChild(p);
    foodSolutionsList.appendChild(foodItem);
  });
}
