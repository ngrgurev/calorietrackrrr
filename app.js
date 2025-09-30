// Application Data - Using in-memory storage
let appData = {
    userProfile: {
        currentWeight: 56.85,
        height: 183,
        targetCalories: 2163,
        targetProtein: 91,
        targetCarbs: 315,
        targetFat: 60
    },
    dailyLog: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        foods: []
    },
    weightHistory: [
        { date: '2025-09-28', weight: 56.85 }
    ],
    exerciseLog: {
        stretching: {},
        movement: {},
        muscle: {},
        cardio: {}
    },
    recipes: [
        {
            name: "Protein Oat Breakfast",
            ingredients: "80g oats, 300ml milk, 30g whey protein, 1 banana",
            calories: 650,
            protein: 45,
            carbs: 75,
            fat: 12,
            prepTime: 5
        },
        {
            name: "Chicken Rice Bowl",
            ingredients: "150g chicken breast, 100g rice, vegetables",
            calories: 520,
            protein: 35,
            carbs: 45,
            fat: 8,
            prepTime: 20
        },
        {
            name: "Protein Smoothie",
            ingredients: "200ml milk, 30g whey protein, 1 banana, 20g peanut butter",
            calories: 580,
            protein: 42,
            carbs: 45,
            fat: 20,
            prepTime: 3
        },
        {
            name: "Peanut Butter Toast",
            ingredients: "2 slices bread, 30g peanut butter, 1 banana",
            calories: 490,
            protein: 18,
            carbs: 55,
            fat: 18,
            prepTime: 2
        },
        {
            name: "Post-Workout Shake",
            ingredients: "300ml milk, 30g whey protein, 20g oats",
            calories: 380,
            protein: 32,
            carbs: 35,
            fat: 8,
            prepTime: 2
        },
        {
            name: "High-Cal Pasta",
            ingredients: "100g pasta, olive oil, parmesan cheese",
            calories: 450,
            protein: 12,
            carbs: 65,
            fat: 15,
            prepTime: 15
        },
        {
            name: "Banana Protein Pancakes",
            ingredients: "2 eggs, 1 banana, 30g oats, protein powder",
            calories: 420,
            protein: 28,
            carbs: 40,
            fat: 12,
            prepTime: 10
        }
    ],
    shoppingList: [
        { item: "Oats (zobene pahuljice) 1.5kg", price: 1.19, store: "Lidl", checked: false },
        { item: "Eggs (20 pieces)", price: 3.78, store: "Plodine", checked: false },
        { item: "Chicken breast 800g", price: 4.00, store: "Various", checked: false },
        { item: "Whey protein powder 200g", price: 7.50, store: "Lidl", checked: false },
        { item: "Milk lactose-free 5L", price: 6.95, store: "Free Zone", checked: false },
        { item: "Rice 1.5kg", price: 1.79, store: "SPAR", checked: false },
        { item: "Pasta 1kg", price: 0.99, store: "Konzum", checked: false },
        { item: "Bananas 3kg", price: 4.50, store: "Various", checked: false },
        { item: "Peanut butter 750g", price: 6.00, store: "Various", checked: false },
        { item: "Bread whole grain 1.5kg", price: 3.00, store: "Various", checked: false },
        { item: "Greek yogurt high protein 1.4kg", price: 6.93, store: "Lidl", checked: false },
        { item: "Olive oil 500ml", price: 4.00, store: "Various", checked: false },
        { item: "Almonds 200g", price: 3.00, store: "Various", checked: false },
        { item: "Protein bars (7 pieces)", price: 9.45, store: "Plodine", checked: false }
    ],
    exercisePlan: {
        dailyStretching: [
            "Cat-cow stretch: 30s",
            "Hip flexor stretch: 30s each leg",
            "Shoulder rolls: 10 forward, 10 backward",
            "Neck side stretch: 15s each side",
            "Forward fold: 30s"
        ],
        officeMovement: [
            "Walking in place: 1 min",
            "Desk push-ups: 10 reps",
            "Chair squats: 10 reps",
            "Calf raises: 15 reps",
            "Arm circles: 10 each direction"
        ],
        muscleBuilding: [
            "Push-ups: 2-3 sets of 5-10",
            "Bodyweight squats: 2-3 sets of 10-15",
            "Plank hold: 2-3 sets of 15-30s",
            "Lunges: 2-3 sets of 8-12 each leg",
            "Glute bridges: 2-3 sets of 10-15"
        ],
        cardioProgression: [
            "Week 1-2: 10-min walks",
            "Week 3-4: 15-min brisk walks",
            "Week 5-6: 20-min walks with stairs",
            "Week 7-8: Light jogging intervals"
        ]
    }
};

let weightChart = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateDashboard();
    renderRecipes();
    renderShoppingList();
    renderExercises();
    updateProgressStats();
    initializeWeightChart();
    
    // Set up recipe search
    document.getElementById('recipe-search').addEventListener('input', function(e) {
        filterRecipes(e.target.value);
    });
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.app-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav button
    event.target.classList.add('active');
}

// Weight management
function updateWeight() {
    const weightInput = document.getElementById('weight-input');
    const newWeight = parseFloat(weightInput.value);
    
    if (newWeight > 0) {
        appData.userProfile.currentWeight = newWeight;
        
        // Add to weight history
        const today = new Date().toISOString().split('T')[0];
        const existingEntry = appData.weightHistory.find(entry => entry.date === today);
        
        if (existingEntry) {
            existingEntry.weight = newWeight;
        } else {
            appData.weightHistory.push({ date: today, weight: newWeight });
        }
        
        updateProgressStats();
        updateWeightChart();
    }
}

// Dashboard functions
function updateDashboard() {
    // Update current values
    document.getElementById('calories-current').textContent = Math.round(appData.dailyLog.calories);
    document.getElementById('protein-current').textContent = Math.round(appData.dailyLog.protein);
    document.getElementById('carbs-current').textContent = Math.round(appData.dailyLog.carbs);
    document.getElementById('fat-current').textContent = Math.round(appData.dailyLog.fat);
    
    // Update progress bars
    updateProgressBar('calories', appData.dailyLog.calories, appData.userProfile.targetCalories);
    updateProgressBar('protein', appData.dailyLog.protein, appData.userProfile.targetProtein);
    updateProgressBar('carbs', appData.dailyLog.carbs, appData.userProfile.targetCarbs);
    updateProgressBar('fat', appData.dailyLog.fat, appData.userProfile.targetFat);
    
    // Update food list
    updateFoodList();
}

function updateProgressBar(type, current, target) {
    const progressBar = document.getElementById(`${type}-progress`);
    const percentage = Math.min((current / target) * 100, 100);
    progressBar.style.width = percentage + '%';
}

// Food logging functions
function addManualFood() {
    const name = document.getElementById('food-name').value.trim();
    const calories = parseFloat(document.getElementById('food-calories').value) || 0;
    const protein = parseFloat(document.getElementById('food-protein').value) || 0;
    const carbs = parseFloat(document.getElementById('food-carbs').value) || 0;
    const fat = parseFloat(document.getElementById('food-fat').value) || 0;
    
    if (name && calories > 0) {
        addFoodToLog({ name, calories, protein, carbs, fat });
        
        // Clear form
        document.getElementById('food-name').value = '';
        document.getElementById('food-calories').value = '';
        document.getElementById('food-protein').value = '';
        document.getElementById('food-carbs').value = '';
        document.getElementById('food-fat').value = '';
    }
}

function addFoodToLog(food) {
    appData.dailyLog.foods.push({
        ...food,
        id: Date.now()
    });
    
    // Update daily totals
    appData.dailyLog.calories += food.calories;
    appData.dailyLog.protein += food.protein;
    appData.dailyLog.carbs += food.carbs;
    appData.dailyLog.fat += food.fat;
    
    updateDashboard();
}

function removeFoodFromLog(foodId) {
    const foodIndex = appData.dailyLog.foods.findIndex(food => food.id === foodId);
    if (foodIndex > -1) {
        const food = appData.dailyLog.foods[foodIndex];
        
        // Subtract from daily totals
        appData.dailyLog.calories -= food.calories;
        appData.dailyLog.protein -= food.protein;
        appData.dailyLog.carbs -= food.carbs;
        appData.dailyLog.fat -= food.fat;
        
        // Remove from array
        appData.dailyLog.foods.splice(foodIndex, 1);
        
        updateDashboard();
    }
}

function updateFoodList() {
    const foodListEl = document.getElementById('food-list');
    
    if (appData.dailyLog.foods.length === 0) {
        foodListEl.innerHTML = '<p>No foods logged today.</p>';
        return;
    }
    
    foodListEl.innerHTML = appData.dailyLog.foods.map(food => `
        <div class="food-item">
            <div>
                <div class="food-name">${food.name}</div>
                <div class="food-details">
                    ${Math.round(food.calories)}cal | P: ${Math.round(food.protein)}g | C: ${Math.round(food.carbs)}g | F: ${Math.round(food.fat)}g
                </div>
            </div>
            <button class="btn btn--sm" onclick="removeFoodFromLog(${food.id})">REMOVE</button>
        </div>
    `).join('');
}

// Recipe functions
function renderRecipes() {
    const recipeListEl = document.getElementById('recipe-list');
    recipeListEl.innerHTML = appData.recipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-ingredients">${recipe.ingredients}</div>
            <div class="recipe-macros">
                <div class="recipe-macro">${recipe.calories}cal</div>
                <div class="recipe-macro">${recipe.protein}g P</div>
                <div class="recipe-macro">${recipe.carbs}g C</div>
                <div class="recipe-macro">${recipe.fat}g F</div>
            </div>
            <button class="btn btn--primary" onclick="addRecipeToLog('${recipe.name}')">ADD TO LOG</button>
        </div>
    `).join('');
}

function addRecipeToLog(recipeName) {
    const recipe = appData.recipes.find(r => r.name === recipeName);
    if (recipe) {
        addFoodToLog({
            name: recipe.name,
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fat: recipe.fat
        });
    }
}

function filterRecipes(searchTerm) {
    const filteredRecipes = appData.recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const recipeListEl = document.getElementById('recipe-list');
    recipeListEl.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-ingredients">${recipe.ingredients}</div>
            <div class="recipe-macros">
                <div class="recipe-macro">${recipe.calories}cal</div>
                <div class="recipe-macro">${recipe.protein}g P</div>
                <div class="recipe-macro">${recipe.carbs}g C</div>
                <div class="recipe-macro">${recipe.fat}g F</div>
            </div>
            <button class="btn btn--primary" onclick="addRecipeToLog('${recipe.name}')">ADD TO LOG</button>
        </div>
    `).join('');
}

// Shopping list functions
function renderShoppingList() {
    const shoppingListEl = document.getElementById('shopping-list');
    const totalCost = appData.shoppingList.reduce((sum, item) => sum + item.price, 0);
    
    document.getElementById('total-cost').textContent = totalCost.toFixed(2);
    
    shoppingListEl.innerHTML = appData.shoppingList.map((item, index) => `
        <div class="shopping-item ${item.checked ? 'checked' : ''}">
            <div class="item-info">
                <input type="checkbox" ${item.checked ? 'checked' : ''} 
                       onchange="toggleShoppingItem(${index})">
                <span>${item.item}</span>
                <div class="item-store">${item.store}</div>
            </div>
            <div class="item-price">€${item.price.toFixed(2)}</div>
        </div>
    `).join('');
}

function toggleShoppingItem(index) {
    appData.shoppingList[index].checked = !appData.shoppingList[index].checked;
    renderShoppingList();
}

// Exercise functions
function renderExercises() {
    renderExerciseCategory('morning-stretches', appData.exercisePlan.dailyStretching, 'stretching');
    renderExerciseCategory('office-movements', appData.exercisePlan.officeMovement, 'movement');
    renderExerciseCategory('muscle-building', appData.exercisePlan.muscleBuilding, 'muscle');
    renderExerciseCategory('cardio', appData.exercisePlan.cardioProgression, 'cardio');
}

function renderExerciseCategory(elementId, exercises, category) {
    const categoryEl = document.getElementById(elementId);
    categoryEl.innerHTML = exercises.map((exercise, index) => {
        const exerciseId = `${category}-${index}`;
        const isCompleted = appData.exerciseLog[category][exerciseId] || false;
        
        return `
            <div class="exercise-item ${isCompleted ? 'completed' : ''}">
                <input type="checkbox" ${isCompleted ? 'checked' : ''} 
                       onchange="toggleExercise('${category}', '${exerciseId}')">
                <span>${exercise}</span>
            </div>
        `;
    }).join('');
}

function toggleExercise(category, exerciseId) {
    appData.exerciseLog[category][exerciseId] = !appData.exerciseLog[category][exerciseId];
    renderExercises();
}

// Progress functions
function updateProgressStats() {
    document.getElementById('current-weight-display').textContent = `${appData.userProfile.currentWeight} kg`;
    document.getElementById('days-tracked').textContent = appData.weightHistory.length;
}

function initializeWeightChart() {
    const ctx = document.querySelector('#weight-chart canvas').getContext('2d');
    
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: appData.weightHistory.map(entry => entry.date),
            datasets: [{
                label: 'Weight (kg)',
                data: appData.weightHistory.map(entry => entry.weight),
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#000000',
                pointBorderColor: '#000000',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#000000',
                        font: {
                            family: 'Courier New, monospace'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 55,
                    max: 70,
                    ticks: {
                        color: '#000000',
                        font: {
                            family: 'Courier New, monospace'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#000000',
                        font: {
                            family: 'Courier New, monospace'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function updateWeightChart() {
    if (weightChart) {
        weightChart.data.labels = appData.weightHistory.map(entry => entry.date);
        weightChart.data.datasets[0].data = appData.weightHistory.map(entry => entry.weight);
        weightChart.update();
    }
}

// Reset functions
function resetDay() {
    if (confirm('Are you sure you want to reset today\'s data?')) {
        appData.dailyLog = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            foods: []
        };
        
        appData.exerciseLog = {
            stretching: {},
            movement: {},
            muscle: {},
            cardio: {}
        };
        
        updateDashboard();
        renderExercises();
    }
}