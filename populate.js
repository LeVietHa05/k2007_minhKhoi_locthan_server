
const mongoose = require('mongoose');
const Account = require("./models/Account");
const filterInfo = require("./models/filterInfo");
const PatientInfo = require('./models/patientInfo');
require("dotenv").config()

mongoose.connect(process.env.DB_URI)
    .then(async (result) => {
        console.log("db connected")
        // for (acc of userAccounts) {
        //     //create newacc from userAccount
        //     let newAcc = await Account.create(acc)
        //     console.log(newAcc)
        //     let res = await newAcc.save()
        // }
        // for (filter of filterListData) {
        //     let newFilter = await filterInfo.create(filter)
        //     console.log(newFilter)
        //     let res = await newFilter.save()
        // }
        for (patient of patientData) {
            let newPat = await PatientInfo.create(patient)
            console.log(newPat)
            let res = await newPat.save();
        }
        process.exit(0)
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    });

const userAccounts = [
    {
        accountID: 1,
        email: "doctor1@gmail.com",
        password: "doctor1",
        role: "doctor",
    },
    {
        accountID: 2,
        email: "nurse1@gmail.com",
        password: "nurse1",
        role: "nurse",
    },
    {
        accountID: 3,
        email: "patient1@gmail.com",
        password: "patient1",
        role: "patient",
    },
];

const patientData = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        age: 35,
        phone: "0987654321",
        schedule: [
            {
                time: "08:00",
                dayOfWeek: "monday",
            },
            {
                time: "09:00",
                dayOfWeek: "friday",
            },
            {
                time: "08:00",
                dayOfWeek: "sunday",
            },
        ],
    },
    {
        id: 2,
        name: "Trần Thị B",
        age: 28,
        phone: "0912345678",
        schedule: [
            {
                time: "12:00",
                dayOfWeek: "monday",
            },
            {
                time: "14:00",
                dayOfWeek: "wednesday",
            },
            {
                time: "15:00",
                dayOfWeek: "saturday",
            },
        ],
    },
    {
        id: 3,
        name: "Lê Văn C",
        age: 40,
        phone: "0908765432",
        schedule: [
            {
                time: "08:00",
                dayOfWeek: "monday",
            },
            {
                time: "09:00",
                dayOfWeek: "friday",
            },
            {
                time: "08:00",
                dayOfWeek: "sunday",
            },
        ],
    },
    {
        id: 4,
        name: "Phạm Thị D",
        age: 25,
        phone: "0934567890",
        schedule: [
            {
                time: "08:00",
                dayOfWeek: "monday",
            },
            {
                time: "09:00",
                dayOfWeek: "friday",
            },
            {
                time: "08:00",
                dayOfWeek: "sunday",
            },
        ],
    },
    {
        id: 5,
        name: "Hoàng Văn E",
        age: 50,
        phone: "0923456789",
        schedule: [
            {
                time: "08:00",
                dayOfWeek: "monday",
            },
            {
                time: "09:00",
                dayOfWeek: "friday",
            },
            {
                time: "08:00",
                dayOfWeek: "sunday",
            },
        ],
    },
];


const filterListData = [
    {
        id: 1,
        used: 5,
        description: "HEPA filter for air purification in operating rooms ",
        isFinished: false,
        forPatient: [],
    },
    {
        id: 2,
        used: 3,
        description: "Activated carbon filter for removing odors in patient rooms",
        isFinished: true,
        forPatient: [],
    },
    {
        id: 3,
        used: 7,
        description: "UV-C light filter for sterilizing medical equipment",
        isFinished: false,
        forPatient: [],
    },
    {
        id: 4,
        used: 2,
        description: "Reverse osmosis filter for dialysis machines",
        isFinished: true,
        forPatient: [],
    },
    {
        id: 5,
        used: 4,
        description: "Membrane filter for intravenous solutions",
        isFinished: false,
        forPatient: [],
    },
    {
        id: 6,
        used: 6,
        description: "Ceramic filter for water purification in hospitals",
        isFinished: true,
        forPatient: [],
    },
];
