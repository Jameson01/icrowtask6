var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const { checkAttr } = require('./utils');
const Student = require("./modules/student");

router.get('/', async (req, res) => {
    try {
        const list = await Student.find();
        res.json({
            status: 200,
            data: list
        })
    } catch (error) {
        res.json({
            status: 500,
            data: e.message
        })
    }

})

router.post('/', function(req, res) {
    const temp = checkAttr(req.body);
    if(temp) {
        Student.create(req.body)
        .then(async (data) => {
            console.log(data)
            res.json({
                status: 200,
                data
            })
        })
        .catch((err) => {
          res.json({
            status: 400,
            msg: 'register error, plz check mongoDb'
          })
        });
    } else {
        res.json({
            status: 400,
            msg: 'register error, checked the field'
          })
    }

});

router.put('/:id', async function(req, res) {
    console.log(req.params)
    const { id } = req.params;
    const temp = checkAttr(req.body);
    if(temp) {
        Student.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { ...req.body }, { new: true })
        .then(async (data) => {
            console.log(data)
            res.json({
                status: 200,
                data
            })
        })
        .catch((err) => {
          res.json({
            status: 400,
            msg: 'register error, plz check mongoDb'
          })
        });
    } else {
        res.json({
            status: 400,
            msg: 'register error, checked the field'
          })
    }
});
router.patch('/:id', function(req, res) {
    const { id } = req.params;
    const { body } = req;
    if (body.password >= 8 && body.password === body.rePassword) {
        Student.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { password: body.password }, { new: true })
        .then(async (data) => {
            console.log(data)
            res.json({
                status: 200,
                data
            })
        })
        .catch((err) => {
          res.json({
            status: 400,
            msg: 'register error, plz check mongoDb'
          })
        }); 
    }
});

router.delete('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const data = await Student.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) });
        res.json({
            status: 200,
            data
        });
    } catch (e) {
        res.json({
            status: 500,
            data: e.message
        })
    }

});

module.exports = router;
