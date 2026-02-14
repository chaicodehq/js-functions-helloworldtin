/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  if (typeof mealType !== "string") return null;
  if (name === undefined || name === "") return null;
  let dailyRate = 0;

  if (mealType === "veg") dailyRate = 80;
  else if (mealType === "nonveg") dailyRate = 120;
  else if (mealType === "jain") dailyRate = 90;
  else return null;

  const totalCost = dailyRate * days;
  return { name, mealType, days, dailyRate, totalCost };
}

export function combinePlans(...plans) {
  if (plans.length === 0) return null;

  const vegCount = plans.reduce((acc, cuu) => {
    if (cuu.mealType === "veg") return acc + 1;
    return acc;
  }, 0);

  const nonVegCount = plans.reduce((acc, cuu) => {
    if (cuu.mealType === "nonveg") return acc + 1;
    return acc;
  }, 0);

  const totalRevenue = plans.reduce((acc, cuu) => {
    return acc + cuu.totalCost;
  }, 0);

  const totalCustomers = plans.length;

  const mealBreakdown = { veg: vegCount, nonveg: nonVegCount }

  const res = { totalCustomers, totalRevenue, mealBreakdown };
  return res;
}

export function applyAddons(plan, ...addons) {
  if (plan === null) return null;

  const new_plan = { ...plan };

  const addPrice = addons.reduce((acc, curr) => curr.price + acc, 0);
  new_plan.dailyRate = plan.dailyRate + addPrice;
  new_plan.totalCost = new_plan.dailyRate * plan.days;

  const addonNames = addons.map((add) => add.name);
  new_plan.addonNames = addonNames;

  return new_plan;
}
