const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

//router.get('/', controllers.hello);
// write your routes
// add routes to router
router.get('/students', controllers.getStudents);
// read a file
//  called by action: fetchAndLoadFile
router.get('/students/:id', controllers.studentById);
//post a course
router.post('/students', controllers.addStudent);
//update a course
router.put('/students/:id', controllers.updateStudent);
//http delete request 
router.delete('/students/:id', controllers.deleteStudents);


module.exports = router;
