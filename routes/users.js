var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const uuidv4 = require('uuid').v4;
var db = require('../models');
var Lottery=db.lottery
var User=db.user
//const { user, Lottery } = require('../models');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); 



router.post('/buy_lottery', async (req, res) => {
  const { wallet_address,lottery_numbers } = req.body;
  let [user, created] = await User.findOrCreate({
    where: { wallet_address },
    defaults: {
      wallet_address,
      checked_status: false
    }
  });
  
  if (!user) {
    return res.status(400).send('Invalid wallet address');
  }
  // Generate a sequence of unique lottery numbers
  const maxLotteryNumber = await Lottery.max('lottery_number');
  const nextLotteryNumber = (maxLotteryNumber || 0) + 1;
  const lotteryNumbers = Array.from({ length: lottery_numbers }, (_, i) => nextLotteryNumber + i);

  // Create Lottery objects for the tickets being purchased
  const lotteryTickets = lotteryNumbers.map(lotteryNumber => ({
    user_id: user.user_id,
    lottery_number: lotteryNumber,
    purchase_date: new Date(),
  }));

  // Save the Lottery objects to the database
  await Lottery.bulkCreate(lotteryTickets);

  return res.status(200).send('Lottery tickets purchased successfully');
});


router.get('/generate-random-winners', async (req, res) => {
  try {
    // Retrieve all the users who have bought lottery tickets
    const lotteryUsers = await User.findAll({ include: Lottery });
    
    // Extract the lottery numbers from each user and combine them into a single array
    const allLotteryNumbers = lotteryUsers.map(user => user.Lotteries.map(lottery => lottery.lottery_number)).flat();
    
    // Shuffle the array of lottery numbers
    const shuffledLotteryNumbers = shuffleArray(allLotteryNumbers);
    
    // Select the first five numbers from the shuffled array to use as the winning numbers
    const winningNumbers = shuffledLotteryNumbers.slice(0, 5);
    
    // Find the users who have these winning numbers and send them in the response
    const winningUsers = await User.findAll({
      include: {
        model: Lottery,
        where: {
          lottery_number: winningNumbers
        }
      }
    });
    
    res.json({ winning_users: winningUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


router.get('/lottery_results', async (req, res) => {
  try {
    // Get the winning lottery numbers
    const winningNumbers = [5, 10, 15, 20, 25];
    
    // Find all the lotteries that match the winning numbers
    const lotteryResults = await Lottery.findAll({
      where: {
        lottery_number: {
          [Op.in]: winningNumbers
        }
      },
      include: {
        model: User,
        attributes: ['wallet_address']
      }
    });
    
    res.json(lotteryResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/check-results', async (req, res) => {
  try {
    // Generate an array of 5 unique winning lottery numbers
function generateWinningNumbers() {
  const winningNumbers = [];
  while (winningNumbers.length < 5) {
    const randomNumber = Math.floor(Math.random() * 500) + 1;
    if (!winningNumbers.includes(randomNumber)) {
      winningNumbers.push(randomNumber);
    }
  }
  return winningNumbers;
}

    // Generate the winning numbers
    const winningNumbers = generateWinningNumbers();

    // Get all the user purchases
    const lotteryPurchases = await User.findAll();

    // Check each purchase for matching numbers
    const results = [];
    for (const purchase of lotteryPurchases) {
      const userNumbers = Array.isArray(purchase.lottery_numbers)
        ? purchase.lottery_numbers
        : Array.from({ length: purchase.lottery_numbers }, (_, i) => i + 1);
      const matchingNumbers = userNumbers.filter(number => winningNumbers.includes(number));
      const result = {
        user_id: purchase.user_id,
        wallet_address: purchase.wallet_address,
        purchase_date: purchase.purchase_date,
        lottery_numbers: purchase.lottery_numbers,
        matching_numbers: matchingNumbers,
      };
      results.push(result);
    }

    res.status(200).json({ winning_numbers: winningNumbers, results: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
