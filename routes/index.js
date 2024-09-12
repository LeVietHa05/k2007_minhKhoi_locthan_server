var express = require('express');
var router = express.Router();
var Account = require('../models/Account.js')
var FilterInfo = require('../models/filterInfo.js')
var PatientInfo = require('../models/patientInfo.js')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/users', async (req, res, next) => {
  try {
    const userAccounts = await Account.find({});
    return res.status(200).json({ msg: "success", data: userAccounts })
  } catch (e) {
    console.log(e)
    return res.status(404).json({ msg: "fail", data: "no data found" })
  }
})

router.post('/users', async (req, res, next) => {
  try {
    const { accountID, email, password, role } = req.body;
    const newUser = new Account({ accountID, email, password, role });
    await newUser.save();
    return res.status(200).json({ msg: "success", data: newUser })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }
})

router.get('/filter', async (req, res, next) => {
  try {
    const filterInfo = await FilterInfo.find({}).populate('forPatient');
    return res.status(200).json({ msg: "success", data: filterInfo })
  } catch (e) {
    console.log(e)
    return res.status(404).json({ msg: "fail", data: "no data found" })
  }
})

router.post('/filter', async (req, res, next) => {
  try {
    const { id, used, description, isFinished, forPatient } = req.body;
    const newFilter = new FilterInfo({ id, used, description, isFinished, forPatient });
    await newFilter.save();
    return res.status(200).json({ msg: "success", data: newFilter })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }
})

router.get('/patient', async (req, res, next) => {
  try {
    const patientInfo = await PatientInfo.find({}).populate('filterInfo');
    return res.status(200).json({ msg: "success", data: patientInfo })
  } catch (e) {
    console.log(e)
    return res.status(404).json({ msg: "fail", data: "no data found" })
  }
})

router.post('/patient', async (req, res, next) => {
  try {
    const { id, name, age, phone, filterInfo, schedule } = req.body;
    const newPatient = new PatientInfo({ id, name, age, phone, filterInfo, schedule });
    await newPatient.save();
    return res.status(200).json({ msg: "success", data: newPatient })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. check data" })
  }
})

module.exports = router;
