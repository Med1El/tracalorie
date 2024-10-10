class CaloriesTracker {
  constructor() {
    this.dailyLimit = 2000;
    this.consumed = 0;
    this.burned = 0;
    this.gainLoss = 0;
    this.remaining = this.dailyLimit;
    this.meals = [];
    this.workouts = [];
    this.initStorage();
  }

  initStorage() {
    let caloriesTracker = localStorage.getItem('calories-tracker');
    if (!caloriesTracker) {
      localStorage.setItem('calories-tracker', JSON.stringify(this));
      return;
    }
    caloriesTracker = JSON.parse(caloriesTracker);
    this.dailyLimit = caloriesTracker.dailyLimit;
    this.consumed = caloriesTracker.consumed;
    this.burned = caloriesTracker.burned;
    this.gainLoss = caloriesTracker.gainLoss;
    this.remaining = caloriesTracker.remaining;
    this.meals = caloriesTracker.meals;
    this.workouts = caloriesTracker.workouts;
  }

  reset() {
    this.consumed = 0;
    this.burned = 0;
    this.gainLoss = 0;
    this.remaining = this.dailyLimit;
    this.meals = [];
    this.workouts = [];
  }

  addMeal(mealName, mealCalories) {
    const meal = new Meal(mealName, mealCalories);
    this.meals.push(meal);
    this.consumed += parseFloat(meal.calories);
    return meal.id;
  }

  addWorkout(workoutName, workoutCalories) {
    const workout = new Workout(workoutName, workoutCalories);
    this.workouts.push(workout);
    this.burned += parseFloat(workout.calories);
    return workout.id;
  }

  removeMeal(mealId) {
    const removedMeal = this.meals.filter((meal) => meal.id === mealId)[0];
    this.meals = this.meals.filter((meal) => meal.id !== mealId);
    console.log(removedMeal, removedMeal.calories);
    this.consumed -= parseFloat(removedMeal.calories);
  }

  removeWorkout(workoutId) {
    const removedWorkout = this.workouts.filter(
      (workout) => workout.id === workoutId
    )[0];
    this.workouts = this.workouts.filter((workout) => workout.id !== workoutId);
    console.log(removedWorkout, removedWorkout.calories);
    this.burned -= parseFloat(removedWorkout.calories);
  }

  compute() {
    localStorage.setItem('calories-tracker', JSON.stringify(this));
    this.gainLoss = this.consumed - this.burned;
    this.remaining = this.dailyLimit - this.gainLoss;
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
//
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class AppDOM {
  constructor() {
    this.caloriesTracker = new CaloriesTracker();
    this.init();
    console.log('initialised');
  }

  init() {
    document
      .querySelector('.save-daily')
      .addEventListener('click', this.setDaily.bind(this));
    document
      .querySelector('.reset-day')
      .addEventListener('click', this.resetDay.bind(this));
    document
      .querySelector('.filter-meal')
      .addEventListener('keyup', (e) => this.filterItem(e, 'meal'));
    document
      .querySelector('.filter-workout')
      .addEventListener('keyup', (e) => this.filterItem(e, 'workout'));
    document
      .querySelector('.meal-btn')
      .addEventListener('click', (e) => this.addItem(e, 'meal'));
    document
      .querySelector('.workout-btn')
      .addEventListener('click', (e) => this.addItem(e, 'workout'));

    document
      .querySelector('.meal-list')
      .addEventListener('click', (e) => this.deleteItem(e, 'meal'));
    document
      .querySelector('.workout-list')
      .addEventListener('click', (e) => this.deleteItem(e, 'workout'));
    document.querySelector('.meal-list').innerHTML = '';
    document.querySelector('.workout-list').innerHTML = '';
    this.load();
    this.render();
  }

  load() {
    this.caloriesTracker.meals.forEach((meal) => {
      const ul = document.querySelector('.meal-list');
      const li = document.createElement('li');
      li.setAttribute('id', meal.id);
      li.innerHTML = `
                  <span class="meal-name">${meal.name}</span>
                  <span class="calories-in">${meal.calories}</span>
                  <span
                  ><button class="delete">
                  <i class="fa-solid fa-xmark"></i></button
                  ></span>
                  `;
      ul.appendChild(li);
    });

    //
    this.caloriesTracker.workouts.forEach((workout) => {
      const ul = document.querySelector('.workout-list');
      const li = document.createElement('li');
      li.setAttribute('id', workout.id);
      li.innerHTML = `
                      <span class="workout-name">${workout.name}</span>
                      <span class="calories-out">${workout.calories}</span>
                      <span
                      ><button class="delete">
                      <i class="fa-solid fa-xmark"></i></button
                      ></span>
                      `;
      ul.appendChild(li);
    });
  }

  setDaily() {
    const val = document.querySelector('.daily-limit-input').value;
    if (val) {
      overlay.classList.remove('show');
      this.caloriesTracker.dailyLimit = val;
      this.render();
    }
  }

  resetDay() {
    this.caloriesTracker.reset();
    document.querySelector('.meal-list').innerHTML = '';
    document.querySelector('.workout-list').innerHTML = '';
    this.render();
  }

  addItem(e, itemType) {
    const itemName = document.querySelector(`.add-${itemType}`).children[0]
      .value;
    const itemCalories = document.querySelector(`.add-${itemType}`).children[1]
      .value;

    if (itemName && itemCalories && !isNaN(itemCalories)) {
      if (itemType === 'meal') {
        const id = this.caloriesTracker.addMeal(itemName, itemCalories);
        const ul = document.querySelector('.meal-list');
        const li = document.createElement('li');
        li.setAttribute('id', id);
        li.innerHTML = `
                      <span class="meal-name">${itemName}</span>
                <span class="calories-in">${itemCalories}</span>
                <span
                  ><button class="delete">
                    <i class="fa-solid fa-xmark"></i></button
                ></span>
        `;
        ul.appendChild(li);
      } else if (itemType === 'workout') {
        const id = this.caloriesTracker.addWorkout(itemName, itemCalories);
        const ul = document.querySelector('.workout-list');
        const li = document.createElement('li');
        li.setAttribute('id', id);
        li.innerHTML = `
                      <span class="meal-name">${itemName}</span>
                <span class="calories-out">${itemCalories}</span>
                <span
                  ><button class="delete">
                    <i class="fa-solid fa-xmark"></i></button
                ></span>
        `;
        ul.appendChild(li);
      }
      this.render();
      e.target.parentElement.classList.remove('show');
      e.target.parentElement.style.height = '0';
      document.querySelector(`.add-${itemType}`).children[0].value = '';
      document.querySelector(`.add-${itemType}`).children[1].value = '';
    } else {
      alert('wrong data format, please enter correct format');
    }
  }

  filterItem(e, itemType) {
    const list = document.querySelector(`.${itemType}-list`);
    Array.from(list.children).forEach((element) => {
      if (
        !element
          .querySelector(`.${itemType}-name`)
          .innerText.toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
        element.style.display = 'none';
      else {
        element.style.display = 'flex';
      }
    });
  }

  deleteItem(e, itemType) {
    if (e.target.classList.contains('delete'))
      if (confirm('are you sure you want to delete the selected item ?')) {
        e.target.parentElement.parentElement.remove();
        if (itemType === 'meal')
          this.caloriesTracker.removeMeal(
            e.target.parentElement.parentElement.getAttribute('id')
          );
        else if (itemType === 'workout')
          this.caloriesTracker.removeWorkout(
            e.target.parentElement.parentElement.getAttribute('id')
          );
        this.render();
      }
  }

  render() {
    this.caloriesTracker.compute();

    document.querySelector('.daily-limit-value').innerText =
      this.caloriesTracker.dailyLimit;
    document.querySelector('.gain-loss-value').innerText =
      this.caloriesTracker.gainLoss;
    if (this.caloriesTracker.gainLoss < 0) {
      document.querySelector('.gain-loss').style.backgroundColor =
        'rgb(235 13 13)';
    } else {
      document.querySelector('.gain-loss').style.backgroundColor =
        'var(--green)';
    }
    document.querySelector('.consumed-value').innerText =
      this.caloriesTracker.consumed;
    document.querySelector('.burned-value').innerText =
      this.caloriesTracker.burned;
    document.querySelector('.remaining-value').innerText =
      this.caloriesTracker.remaining;
  }
}

const appDOM = new AppDOM();
