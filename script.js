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
    this.sortFoodItemsByNutrition();
    this.updateFoodListTable();
  }

  sortFoodItemsByNutrition() {
    this.foodItems.sort((a, b) => b.nutrition - a.nutrition);
  }

  getRecommendations(method, targetNutrition) {
    if (method === 'greedy') {
      let remainingNutrition = targetNutrition;
      const selectedItems = [];

      for (let item of this.foodItems) {
        if (remainingNutrition <= 0) break;
        const count = Math.floor(remainingNutrition / item.nutrition);
        if (count > 0) {
          selectedItems.push({ ...item, count });
          remainingNutrition -= count * item.nutrition;
        }
      }

      return selectedItems;
    } else if (method === 'bnb') {
      const bestSolution = {
        totalNutrition: 0,
        totalPrice: 0,
        items: [],
      };

      const processFoodItems = (remainingItems, currentSolution) => {
        if (currentSolution.totalNutrition > targetNutrition) {
          return;
        }
        if (remainingItems.length === 0 || currentSolution.totalNutrition === targetNutrition) {
          if (currentSolution.totalNutrition <= targetNutrition && currentSolution.totalNutrition > bestSolution.totalNutrition) {
            bestSolution.totalNutrition = currentSolution.totalNutrition;
            bestSolution.totalPrice = currentSolution.totalPrice;
            bestSolution.items = [...currentSolution.items];
          }
          return;
        }

        const newItem = remainingItems[0];
        for (let count = Math.floor((targetNutrition - currentSolution.totalNutrition) / newItem.nutrition); count >= 0; count--) {
          const newTotalNutrition = currentSolution.totalNutrition + count * newItem.nutrition;
          const newTotalPrice = currentSolution.totalPrice + count * newItem.price;

          processFoodItems(remainingItems.slice(1), {
            totalNutrition: newTotalNutrition,
            totalPrice: newTotalPrice,
            items: [...currentSolution.items, { ...newItem, count }],
          });
        }
      };

      processFoodItems(this.foodItems, { totalNutrition: 0, totalPrice: 0, items: [] });

      return bestSolution.items.filter((item) => item.count > 0);
    } else {
      return this.foodItems;
    }
  }

  updateFoodListTable() {
    const method = document.getElementById('method').value;
    const foodListHeader = document.querySelector('.food-list h2');
    foodListHeader.textContent = `Daftar Makanan (${method === 'greedy' ? 'Greedy' : 'Branch and Bound'})`;

    const foodListTableBody = document.querySelector('#food-list-table tbody');
    foodListTableBody.innerHTML = '';

    this.foodItems.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${item.name}</td>
          <td>Rp ${item.price.toLocaleString('id-ID')}</td>
          <td>${item.nutrition} kKal</td>
        `;
      foodListTableBody.appendChild(row);
    });
  }
}

const tracker = new NutritionTracker();

// Dummy data
tracker.addFoodItem('Dada Ayam', 30000, 200);
tracker.addFoodItem('Salmon Fillet', 40000, 250);
tracker.addFoodItem('Sereal Gandum', 50000, 180);

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
  const method = document.getElementById('method').value;
  const targetNutrition = parseInt(document.getElementById('target-nutrition-input').value);

  if (isNaN(targetNutrition)) {
    alert('Please enter a valid target nutrition value.');
    return;
  }

  const startTime = performance.now(); // Start timing

  const recommendations = tracker.getRecommendations(method, targetNutrition);

  const endTime = performance.now(); // End timing
  const executionTime = endTime - startTime;

  const solutionsList = document.getElementById('food-solutions-list');
  solutionsList.innerHTML = '';

  if (recommendations.length > 0) {
    const table = document.createElement('table');
    table.classList.add('food-list');

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Nama Makanan</th>
        <th>Jumlah Makanan</th>
        <th>Harga Total</th>
        <th>Nutrisi Makanan</th>
        <th>Execution Time</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    recommendations.forEach((item) => {
      const totalCost = item.price * item.count;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.count}</td>
        <td>Rp ${totalCost.toLocaleString('id-ID')}</td>
        <td>${item.nutrition * item.count} kKal</td>
        <td>${executionTime.toFixed(2)} ms</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    solutionsList.appendChild(table);
  } else {
    const noSolutionMessage = document.createElement('p');
    noSolutionMessage.textContent = 'No solution found for the given target nutrition.';
    solutionsList.appendChild(noSolutionMessage);

    const executionTimeDisplay = document.createElement('div');
    executionTimeDisplay.classList.add('execution-time');
    executionTimeDisplay.innerHTML = `Execution time: ${executionTime.toFixed(2)} ms`;
    solutionsList.appendChild(executionTimeDisplay);
  }

  const foodListHeader = document.querySelector('.food-list h2');
  foodListHeader.textContent = `Daftar Makanan (${method === 'bnb' ? 'BnB' : method})`;
});
