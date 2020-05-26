'use strict'
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const util = require('util');
/*var tv4 = require('tv4'), 
  formats = require('tv4-formats'),
  assert = require('assert'),
  validator = tv4.freshApi(),
  schema = { type: 'string', format: 'email' };//this is an extra plugin for tv4*/
var Ajv = require('ajv');

//the schema and the data path
const students_SCHEMA = require('../data/students-schema.json');
const DATA_PATH = path.join(__dirname, '..', 'data', 'students-data.json');

// some helper functions you can use
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const handlers = {
  getStudents: async (req, res) => {
    try {
      const studentsDataString = await readFile(DATA_PATH, 'utf-8');
      const studentsData = JSON.parse(studentsDataString);

      const studentsRecords = studentsData.students
        .map(entry => ({
          id: entry.id,
          name: entry.name,
          age: entry.age === null ? 0 : entry.age,
          grade_year: entry.grade_year,
          home_address: entry.home_address,
          phone_no: entry.phone_no,
          email_address: entry.email_address,
          join_date: entry.join_date,
          graduated: entry.graduated,
          graduation_year: entry.graduation_year,

        }));

      res.json(studentsRecords)

    } catch (err) {
      console.log(err)

      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }
      next(err);
    }
  },
  studentById: async (req, res) => {
    const studentIdString = req.params.id;
    const studentId = Number(studentIdString);


    try {
      const DataString = await readFile(DATA_PATH, 'utf-8');
      const studentsData = JSON.parse(DataString);

      const entryWithId = studentsData.students
        .find(entry => entry.id === studentId);

      if (entryWithId) {
        res.json(entryWithId);
      } else {
        res.status(404).end();
      }

    } catch (err) {
      console.log(err)

      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }

      next(err);
    }
  },
  addStudent: async (req, res) => {
    const newStudent = req.body;
    newStudent.grade_year = Number(req.body.grade_year);
    newStudent.age = Number(req.body.age);
    newStudent.graduated = Boolean(req.body.graduated);
    newStudent.phone_no = Number(req.body.phone_no);


    try {
      //read db to get nextid
      const DataString = await readFile(DATA_PATH, 'utf-8');
      const studentsData = JSON.parse(DataString);
      //update next id and increment the one in db file
      newStudent.id = Number(studentsData.next_id);
      studentsData.next_id++;

      console.log(newStudent);
      //ajv validation 
      var ajv = Ajv({ allErrors: true, format: 'full' });
      var isValid = ajv.validate(students_SCHEMA, newStudent);


      if (!isValid) {
        const error = ajv.errors;
        console.error(error);
        res.status(400).json(error)
        return;
      }

      studentsData.students.push(newStudent);
      const newDataString = JSON.stringify(studentsData, null, '  ');
      await writeFile(DATA_PATH, newDataString);
      res.json(newStudent);

    } catch (err) {
      console.log(err);

      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }

      next(err);
    }

  },
  updateStudent: async (req, res) => {
    try {
      const idToUpdate = Number(req.params.id);
      const updateStudent = req.body;
      updateStudent.id = idToUpdate;

      updateStudent.grade_year = Number(req.body.grade_year);
      updateStudent.age = Number(req.body.age);
      updateStudent.graduated = Boolean(req.body.graduated);
      updateStudent.phone_no = Number(req.body.phone_no);

      //ajv validation 
      var ajv = Ajv({ allErrors: true });
      var isValid = ajv.validate(students_SCHEMA, updateStudent);


      if (!isValid) {
        const error = ajv.errors;
        console.error(error);
        res.status(400).json(error)
        return;
      }


      const DataString = await readFile(DATA_PATH, 'utf-8');
      const studentsData = JSON.parse(DataString);

      const entryToUpdate = studentsData.students
        .find(student => student.id === idToUpdate);

      if (entryToUpdate) {
        const indexOfFile = studentsData.students
          .indexOf(entryToUpdate);
        studentsData.students[indexOfFile] = updateStudent;
        const DataString = JSON.stringify(studentsData, null, '  ');
        await writeFile(DATA_PATH, DataString);
        res.json(updateStudent);
      } else {
        res.status(404).json(` No entry with id ${idToUpdate}`);
        return;
      }

    } catch (err) {
      console.log(err);

      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }

      next(err);
    }
  },
  deleteStudents: async (req, res) => {
    const idToDeleteStr = req.params.id;
    const idToDelete = Number(idToDeleteStr);

    try {
      const DataString = await readFile(DATA_PATH, 'utf-8');
      const studentData = JSON.parse(DataString);

      const entryToDelete = studentData.students
        .find(file => file.id === idToDelete);
      if (entryToDelete) {

        //delete using filter
        studentData.students = studentData.students
          .filter(student => student.id !== entryToDelete.id);
        studentData.next_id--;
        //write the new data
        const DataString = JSON.stringify(studentData, null, '  ');
        await writeFile(DATA_PATH, DataString);
        //send a response
        res.json(entryToDelete);
      } else {
        res.send(`no entry with id ${idToDelete}`);
      }

    } catch (err) {
      console.log(err);

      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }

      next(err);
    }
  },
};

module.exports = handlers;
