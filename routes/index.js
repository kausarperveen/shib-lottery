var express = require('express');
var router = express.Router();
var db = require('../models');
var Lottery=db.lottery
var User=db.user
const { isAdmin } = require('../middlewares/isAdmin');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// In your router file:


// Start lottery function
// In your router file:


// Start lottery function
router.get('/start_lottery',  async (req, res) => {
  try {
    // Set a start date for the lottery
    const startDate = new Date();

    // Set the start date for all users who have not played in the current lottery
    await User.update({ last_played: startDate }, { where: { last_played: null } });

    // Create a new lottery with the current start date
    const newLottery = await Lottery.create({ purchase_date: startDate });

    return res.status(200).json({ message: 'Lottery started successfully', lottery: newLottery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong while starting the lottery' });
  }
});

// Close lottery function
router.get('/close_lottery', async (req, res) => {
  try {
    // Set an end date for the lottery
    const endDate = new Date();

    // Get the latest lottery and set the end date
    const latestLottery = await Lottery.findOne({ order: [['purchase_date', 'DESC']] });
    await latestLottery.update({ end_date: endDate });

    // Get all users who played in the latest lottery
    const users = await User.findAll({
      include: [
        {
          model: Lottery,
          where: { id: latestLottery.id }
        }
      ]
    });

    // Randomly select a winner from the users who played in the latest lottery
    const winner = users[Math.floor(Math.random() * users.length)];

    return res.status(200).json({ message: 'Lottery closed successfully', winner });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong while closing the lottery' });
  }
});





module.exports = router;
