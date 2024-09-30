var express = require('express');
var router = express.Router();
var Account = require('../models/Account.js')
var FilterInfo = require('../models/filterInfo.js')
var PatientInfo = require('../models/patientInfo.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile('/index.html', { root: 'public' });
});

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
    const { email, password, role } = req.body;
    //because accountID is string, we need to convert it to int to sort
    const oldAcc = await Account.aggregate([
      {
        $addFields: {
          numericAccountID: {
            $toInt: "$accountID"
          }
        }
      }, {
        $sort: {
          numericAccountID: -1
        }
      }, {
        $limit: 1
      }]);
    const newUser = new Account({ accountID: +oldAcc[0].accountID + 1, email, password, role });
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

router.get('/increaefilterused', async (req, res) => {
  try {
    const { id } = req.query;
    let filter
    if (id) {
      filter = await FilterInfo.findOne({
        id: id
      }).populate('forPatient');
    }
    if (filter) {
      filter.used += 1;
      await filter.save();
      return res.status(200).json({ msg: "success", data: filter });
    }
    return res.status(200).json({ msg: "fail", data: "no data found" });
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }
})

router.get('/filter/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const filterInfo = await FilterInfo.findOne({ id: id }).populate('forPatient');
    return res.status(200).json({ msg: "success", data: filterInfo })
  } catch (e) {
    console.log(e)
    return res.status(404).json({ msg: "fail", data: "no data found" })
  }
})

router.post('/filter/:id', async (req, res, next) => {
  try {
    let { used, description, isFinished, forPatient } = req.body;
    const id = req.params.id;
    const newFilter = await FilterInfo.findOne({ id: id })
    newFilter.used = +used;
    newFilter.description = description;
    newFilter.isFinished = isFinished;
    //check if type of forPatient is array
    if (!Array.isArray(forPatient)) {
      //test case
      //real case is array already
      forPatient = forPatient.split(',');
    }
    console.log(forPatient)
    let newPatient = await getPatientInfo(forPatient); //get patient info from id
    console.log(newPatient)
    newFilter.forPatient = newPatient;

    await newFilter.save();
    await updateFilterInfo(newPatient, newFilter._id);
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
      id: +highestFilterID[0].id + 1,
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

router.get('/patient/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const patientInfo = await PatientInfo.findOne({ id: id }).populate('filterInfo');
    return res.status(200).json({ msg: "success", data: patientInfo })
  } catch (e) {
    console.log(e)
    return res.status(404).json({ msg: "fail", data: "no data found" })
  }
})

router.get('/patientbyaccid/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const patientInfo = await PatientInfo
      .findOne({ accountID: id })
      .populate('filterInfo');

    return res.status(200).json({ msg: "success", data: patientInfo })
  } catch (e) {
    console.log(e)
    return res.status(404).json({ msg: "fail", data: "no data found" })
  }
})

router.post('/patient/:id', async (req, res, next) => {
  try {
    let { name, age, phone, filterInfo, schedule } = req.body;
    filterInfo = await getFilterID(filterInfo.id);
    if (!filterInfo) {
      return res.status(200).json({ msg: "fail", data: "filter ID problem need to be BSON type or it can't be found" })
    }
    const id = req.params.id;
    const newPatient = await
      PatientInfo
        .findOne({ id: id })
    // .populate('filterInfo');
    newPatient.name = name ? name : newPatient.name;
    newPatient.age = age ? age : newPatient.age;
    newPatient.phone = phone ? phone : newPatient.phone;
    newPatient.filterInfo = filterInfo;
    newPatient.schedule = schedule
    await FilterInfo.findOneAndUpdate({ id: filterInfo }, { forPatient: newPatient._id });
    await newPatient.save();
    return res.status(200).json({ msg: "success", data: newPatient })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }
})

router.post('/linkacctofilter', async (req, res) => {
  try {
    const { accountID, patientID } = req.body;
    let patient = await PatientInfo.findOne({ id: patientID });
    patient.accountID = accountID;
    await patient.save();
    return res.status(200).json({ msg: "success", data: patient });
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. Check data" })
  }

})

router.post('/newpatient', async (req, res, next) => {
  try {
    const { name, age, phone, filterID, schedule } = req.body;
    console.log(name, age, phone, filterID, schedule)
    const highestPatientID = await PatientInfo.find({}).sort({ id: -1 }).limit(1);
    const newPatient = new PatientInfo({ id: +highestPatientID[0].id + 1, name, age, phone, schedule });
    const filter = await FilterInfo.findOne({ id: filterID });
    if (filter) {
      console.log(filter)
      newPatient.filterInfo = filter._id;
    }
    await newPatient.save();
    return res.status(200).json({ msg: "success", data: newPatient })
  } catch (e) {
    console.log(e)
    return res.status(200).json({ msg: "fail", data: "Fail to save. check data" })
  }
})


async function getPatientInfo(arrayOfId) {
  try {
    let output = [];
    for (let i = 0; i < arrayOfId.length; i++) {
      let patient = await PatientInfo.findOne({ id: arrayOfId[i] });
      if (patient) {
        output.push(patient._id);
      }
    }
    return output;
  } catch (e) {
    console.log(e)
    return null;
  }
}


async function updateFilterInfo(arrOfPatientID, filterID) {
  try {
    for (let i = 0; i < arrOfPatientID.length; i++) {
      let patient = await PatientInfo.findOne({ _id: arrOfPatientID[i] });
      if (patient) {
        patient.filterInfo = filterID;
        await patient.save();
      }
    }
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }

}
async function getFilterID(id) {
  try {
    let filter = await FilterInfo.findOne({
      id: id
    });
    return filter._id;
  } catch (e) {
    console.log(e)
    return null;
  }
}

module.exports = router;
