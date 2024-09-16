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

router.post('/filter/:id', async (req, res, next) => {
  try {
    const { used, description, isFinished, forPatient } = req.body;
    const id = req.params.id;
    const newFilter = await FilterInfo.findOne({ id: id })
    newFilter.used = used;
    newFilter.description = description;
    newFilter.isFinished = isFinished;
    newFilter.forPatient = forPatient

    await newFilter.save();
    return res.status(200).json({ msg: "success", data: newFilter })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }
})
router.post('/newFilter', async (req, res, next) => {
  try {
    let highestFilterID = await FilterInfo.find({}).sort({ id: -1 }).limit(1);
    let newFilter = new FilterInfo({
      id: highestFilterID[0].id + 1,
      used: 0,
      description: "new filter",
      isFinished: false,
      forPatient: []
    });
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

router.post('/patient/:id', async (req, res, next) => {
  try {
    const { name, age, phone, filterInfo, schedule } = req.body;
    const id = req.params.id;
    const newPatient = await
      Patient
        .findOne({ id: id })
        .populate('filterInfo');
    newPatient.name = name;
    newPatient.age = age;
    newPatient.phone = phone;
    newPatient.filterInfo = filterInfo;
    newPatient.schedule = schedule;
    await newPatient.save();
    return res.status(200).json({ msg: "success", data: newPatient })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }
})

router.post('/newpatient', async (req, res, next) => {
  try {
    const { name, age, phone, filterID, schedule } = req.body;
    const newPatient = new PatientInfo({ id, name, age, phone, schedule });
    const filter = await FilterInfo.findOne({ id: filterID });
    newPatient.filterInfo = filter._id;
    const highestPatientID = await PatientInfo.find({}).sort({ id: -1 }).limit(1);
    newPatient.id = highestPatientID[0].id + 1;
    await newPatient.save();
    return res.status(200).json({ msg: "success", data: newPatient })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. check data" })
  }
})

module.exports = router;
