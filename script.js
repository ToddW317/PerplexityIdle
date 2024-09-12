let gold = 0;
let resources = {
    wood: 0,
    stone: 0,
    iron: 0,
    food: 0
};
let gatheringLevel = 1;
let upgradeCost = 50;

let passiveGenerators = {
    wood: 0,
    stone: 0,
    iron: 0,
    food: 0
};

let generatorCosts = {
    woodMill: 100,
    stoneQuarry: 200,
    ironMine: 300,
    farm: 150
};

let resourcePrices = {
    wood: 1.75,
    stone: 5.25,
    iron: 13.125,
    food: 5.25
};

let priceHistory = {
    wood: [],
    stone: [],
    iron: [],
    food: []
};
let countdown = 10;

const goldDisplay = document.getElementById('gold');
const woodDisplay = document.getElementById('wood');
const stoneDisplay = document.getElementById('stone');
const ironDisplay = document.getElementById('iron');
const foodDisplay = document.getElementById('food');

const gatherWoodBtn = document.getElementById('gatherWood');
const gatherStoneBtn = document.getElementById('gatherStone');
const gatherIronBtn = document.getElementById('gatherIron');
const gatherFoodBtn = document.getElementById('gatherFood');
const upgradeGatheringBtn = document.getElementById('upgradeGathering');

const buyWoodMillBtn = document.getElementById('buyWoodMill');
const buyStoneQuarryBtn = document.getElementById('buyStoneQuarry');
const buyIronMineBtn = document.getElementById('buyIronMine');
const buyFarmBtn = document.getElementById('buyFarm');

const sellWoodBtn = document.getElementById('sellWood');
const sellStoneBtn = document.getElementById('sellStone');
const sellIronBtn = document.getElementById('sellIron');
const sellFoodBtn = document.getElementById('sellFood');

const woodPriceDisplay = document.getElementById('woodPrice');
const stonePriceDisplay = document.getElementById('stonePrice');
const ironPriceDisplay = document.getElementById('ironPrice');
const foodPriceDisplay = document.getElementById('foodPrice');

const woodTrendIndicator = document.getElementById('woodTrend');
const stoneTrendIndicator = document.getElementById('stoneTrend');
const ironTrendIndicator = document.getElementById('ironTrend');
const foodTrendIndicator = document.getElementById('foodTrend');

gatherWoodBtn.addEventListener('click', () => {
    resources.wood += gatheringLevel;
    updateDisplay();
});

gatherStoneBtn.addEventListener('click', () => {
    resources.stone += gatheringLevel;
    updateDisplay();
});

gatherIronBtn.addEventListener('click', () => {
    resources.iron += gatheringLevel;
    updateDisplay();
});

gatherFoodBtn.addEventListener('click', () => {
    resources.food += gatheringLevel;
    updateDisplay();
});

function updateCountdown() {
    countdown--;
    if (countdown < 0) {
        countdown = 10;
    }

    ['wood', 'stone', 'iron', 'food'].forEach(resource => {
        const countdownElement = document.getElementById(`${resource}Countdown`);
        const timerCircle = document.getElementById(`${resource}Timer`);
        
        countdownElement.textContent = countdown;
        
        // Update the circle
        const circumference = 2 * Math.PI * 9;
        const offset = circumference * (1 - countdown / 10);
        timerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        timerCircle.style.strokeDashoffset = offset;
    });
}

function startCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function buyGenerator(type, resource) {
    if (gold >= generatorCosts[type]) {
        gold -= generatorCosts[type];
        passiveGenerators[resource] += 1;
        generatorCosts[type] = Math.floor(generatorCosts[type] * 1.5);
        updateDisplay();
        updateGeneratorButtons();
        console.log(`Bought ${type}. New ${resource} generators: ${passiveGenerators[resource]}`);
    } else {
        console.log(`Not enough gold to buy ${type}`);
    }
}

upgradeGatheringBtn.addEventListener('click', () => {
    if (gold >= upgradeCost) {
        gold -= upgradeCost;
        gatheringLevel += 1;
        upgradeCost = Math.floor(upgradeCost * 2);
        updateDisplay();
        upgradeGatheringBtn.textContent = `Upgrade Gathering (Cost: ${upgradeCost} Gold)`;
        console.log(`Upgraded gathering to level ${gatheringLevel}`);
    } else {
        console.log(`Not enough gold to upgrade gathering`);
    }
});

function updateGeneratorButtons() {
    buyWoodMillBtn.textContent = `Buy Wood Mill (${generatorCosts.woodMill} Gold)`;
    buyStoneQuarryBtn.textContent = `Buy Stone Quarry (${generatorCosts.stoneQuarry} Gold)`;
    buyIronMineBtn.textContent = `Buy Iron Mine (${generatorCosts.ironMine} Gold)`;
    buyFarmBtn.textContent = `Buy Farm (${generatorCosts.farm} Gold)`;
}

buyWoodMillBtn.addEventListener('click', () => buyGenerator('woodMill', 'wood'));
buyStoneQuarryBtn.addEventListener('click', () => buyGenerator('stoneQuarry', 'stone'));
buyIronMineBtn.addEventListener('click', () => buyGenerator('ironMine', 'iron'));
buyFarmBtn.addEventListener('click', () => buyGenerator('farm', 'food'));

sellWoodBtn.addEventListener('click', () => sellResource('wood'));
sellStoneBtn.addEventListener('click', () => sellResource('stone'));
sellIronBtn.addEventListener('click', () => sellResource('iron'));
sellFoodBtn.addEventListener('click', () => sellResource('food'));

function sellResource(resource) {
    const amount = resources[resource];
    const price = resourcePrices[resource];
    
    console.log(`Selling ${resource}:`);
    console.log(`Amount: ${amount}`);
    console.log(`Price: ${price}`);
    console.log(`Current gold: ${gold}`);

    if (amount <= 0) {
        console.error(`Insufficient amount for ${resource}: ${amount}`);
        return;
    }

    const saleValue = amount * price;
    
    console.log(`Sale value: ${saleValue}`);

    gold += saleValue;
    resources[resource] = 0; // Reset the resource amount to 0 after selling
    
    console.log(`New gold total: ${gold}`);

    updateDisplay();
}

function updateDisplay() {
    goldDisplay.textContent = gold.toFixed(2);
    woodDisplay.textContent = Math.floor(resources.wood);
    stoneDisplay.textContent = Math.floor(resources.stone);
    ironDisplay.textContent = Math.floor(resources.iron);
    foodDisplay.textContent = Math.floor(resources.food);
    document.getElementById('gatheringLevel').textContent = gatheringLevel;
    updateGeneratorButtons();
    updatePriceDisplays();
}

function updatePriceDisplays() {
    ['wood', 'stone', 'iron', 'food'].forEach(resource => {
        const priceElement = document.getElementById(`${resource}Price`);
        priceElement.textContent = resourcePrices[resource].toFixed(2);
    });
}

function updateTrendIndicator(resource, price) {
    const history = priceHistory[resource];
    const average = history.reduce((a, b) => a + b, 0) / history.length;
    const indicator = document.getElementById(`${resource}Trend`);
    
    if (price > average + 0.16) {
        indicator.textContent = '↑';
        indicator.style.color = 'green';
    } else if (price < average - 0.16) {
        indicator.textContent = '↓';
        indicator.style.color = 'red';
    } else {
        indicator.textContent = '→';
        indicator.style.color = 'yellow';
    }
}

function generateNewPrice() {
    const resources = ['wood', 'stone', 'iron', 'food'];
    
    // Generate wood price (base resource)
    const woodMinPrice = 0.5;
    const woodMaxPrice = 3;
    const newWoodPrice = Math.random() * (woodMaxPrice - woodMinPrice) + woodMinPrice;
    resourcePrices.wood = newWoodPrice;

    // Generate stone price
    const stoneMinPrice = woodMaxPrice;
    const stoneMaxPrice = stoneMinPrice * 2.5;
    const newStonePrice = Math.random() * (stoneMaxPrice - stoneMinPrice) + stoneMinPrice;
    resourcePrices.stone = newStonePrice;

    // Generate iron price
    const ironMinPrice = stoneMaxPrice;
    const ironMaxPrice = ironMinPrice * 2.5;
    const newIronPrice = Math.random() * (ironMaxPrice - ironMinPrice) + ironMinPrice;
    resourcePrices.iron = newIronPrice;

    // Generate food price (using stone's range as it's also a secondary resource)
    const foodMinPrice = stoneMinPrice;
    const foodMaxPrice = stoneMaxPrice;
    const newFoodPrice = Math.random() * (foodMaxPrice - foodMinPrice) + foodMinPrice;
    resourcePrices.food = newFoodPrice;

    resources.forEach(resource => {
        const newPrice = resourcePrices[resource];
        
        priceHistory[resource].push(newPrice);
        if (priceHistory[resource].length > 25) {
            priceHistory[resource].shift();
        }
        
        if (priceHistory[resource].length === 25) {
            updateTrendIndicator(resource, newPrice);
        }
    });

    countdown = 10;
    updatePriceDisplays();
    updateCountdown();

    // Log the new prices for debugging
    console.log('New prices:', resourcePrices);
}

// Generate new prices every 10 seconds
setInterval(generateNewPrice, 10000);

// Passive income generation (keep this part)
setInterval(() => {
    resources.wood += passiveGenerators.wood * gatheringLevel;
    resources.stone += passiveGenerators.stone * gatheringLevel;
    resources.iron += passiveGenerators.iron * gatheringLevel;
    resources.food += passiveGenerators.food * gatheringLevel;
    updateDisplay();
}, 1000);

// Initial setup
generateNewPrice();
updateDisplay();
startCountdown();