import { student } from "./model.js";


window.onload = () => {

  fetch('/api/students/', {
    method: 'GET'
  })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      console.log(res);
      return res.json();
    })
    .then(records => {
      const container = document.getElementById('container');
      console.log(records);

      if (records.length > 1) {
        records.forEach(element => {
          container.innerHTML += '<li>' + JSON.stringify(element) + '</li>';
        })
      } else { container.innerHTML = JSON.stringify(records); }

      if (records.length <= 0) {
        container.innerHTML = 'No entries yet stored in db..';
      }
    })
    .catch(err => console.error(err));

  document.getElementById('save-button')
    .addEventListener('click', (e) => {

      student.id = document.getElementById('id').value;
      student.name = document.getElementById('name').value;
      student.grade_year = document.getElementById('grade_year').value;
      student.home_address = document.getElementById('home_address').value;
      student.phone_no = document.getElementById('phone_no').value;
      student.email_address = document.getElementById('email_address').value;
      student.join_date = document.getElementById('join_date').value;
      student.graduated = document.getElementById('graduated').checked;
      student.graduation_year = document.getElementById('graduation_year').value;
      student.age = document.getElementById('age').value;
      if (!checkProperties(student))
        saveStudent(student);
      else
        alert("Fill in missing fields before submission ..")

      e.preventDefault();
    });
  document.getElementById('update-button')
    .addEventListener('click', (e) => {

      student.id = document.getElementById('id').value;
      student.name = document.getElementById('name').value;
      student.grade_year = document.getElementById('grade_year').value;
      student.home_address = document.getElementById('home_address').value;
      student.phone_no = document.getElementById('phone_no').value;
      student.email_address = document.getElementById('email_address').value;
      student.join_date = document.getElementById('join_date').value;
      student.graduated = document.getElementById('graduated').checked;
      student.graduation_year = document.getElementById('graduation_year').value;
      student.age = document.getElementById('age').value;

      if (student.id != "")
        updateStudent(student);
      else
        alert("Fill in missing fields before update and Id..");

      e.preventDefault();
    });
  document.getElementById('delete-button')
    .addEventListener('click', (e) => {
      const id = document.getElementById('id').value;
      if (id != "")
        deleteStudent(id);
      else
        alert("Please enter the id of the student you want to delete ..");

      e.preventDefault();
    });
}
function checkProperties(obj) {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] != "")
      return false;
  }
  return true;
}

