function addMeal() {
  const day = document.getElementById('day').value;
  const meal = document.getElementById('meal').value;

  if (meal.trim() !== '') {
      const mealPlanList = document.getElementById('mealPlan');
      const listItem = document.createElement('li');
      listItem.textContent = `${day.charAt(0).toUpperCase() + day.slice(1)}: ${meal}`;
      mealPlanList.appendChild(listItem);

      // Clear input fields
      document.getElementById('day').value = 'monday';
      document.getElementById('meal').value = '';
  } else {
      alert('Please enter a meal before adding to the plan.');
  }
}