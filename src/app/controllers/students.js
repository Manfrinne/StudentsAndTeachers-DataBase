const Student = require('../models/student')
const {age, date, grade} = require('../../lib/utils')

module.exports = {

  index(req, res) {

    Student.all(function(students) {

      return res.render("students/index", {students})

    })
  },

  create(req, res) {
    Student.teacherSelectOption(function(options) {
      return res.render("students/create", {teacherOptionName: options})
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] =="") {
        return res.send('Please, fill in all fields!')
      }
    }

    Student.create(req.body, function(student) {
      return res.redirect(`/students/${student.id}`)
    })
  },

  show(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) return res.send("student not found!")

      student.age = age(student.birth)
      student.birthDay = date(student.birth).birthDay
      student.school_year = grade(student.school_year)

      return res.render("students/show", { student })
    })
  },

  edit(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) return res.send("student not found!")

      student.birth = date(student.birth).iso
      student.school_year = grade(student.school_year)

      Student.teacherSelectOption(function(options) {
        return res.render("students/edit", {student, teacherOptionName: options})
      })
    })
  },

  update(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] =="") {
        return res.send('Please, fill in all fields!')
      }
    }

    Student.update(req.body, function() {
      return res.redirect(`students/${req.body.id}`)
    })
  },

  delete(req, res) {
    Student.delete(req.body.id, function() {
      return res.redirect(`/students`)
    })
  }

}
