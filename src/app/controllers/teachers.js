const Teacher = require('../models/teacher')
const {age, date, academic_level} = require('../../lib/utils')

module.exports = {

  index(req, res) {

    Teacher.all(function(teachers) {

      return res.render("teachers/index", {teachers})

    })
  },

  create(req, res) {
    return res.render("teachers/create")
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] =="") {
        return res.send('Please, fill in all fields!')
      }
    }

    Teacher.create(req.body, function(teacher) {
      return res.redirect(`/teachers/${teacher.id}`)
    })
  },

  show(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) return res.send("TEACHER not found!")

      teacher.age = age(teacher.birth)
      teacher.academic_level = academic_level(teacher.academic_level)
      teacher.disciplines = teacher.disciplines.split(",")
      teacher.create_at = new Intl.DateTimeFormat('pt-BR').format(teacher.create_at)

      return res.render("teachers/show", { teacher })
    })
  },

  edit(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) return res.send("TEACHER not found!")

      teacher.birth = date(teacher.birth).iso
      teacher.academic_level = academic_level(teacher.academic_level)
      teacher.disciplines = teacher.disciplines.split(",")
      teacher.create_at = new Intl.DateTimeFormat('pt-BR').format(teacher.create_at)

      return res.render("teachers/edit", { teacher })
    })
  },

  update(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] =="") {
        return res.send('Please, fill in all fields!')
      }
    }

    Teacher.update(req.body, function() {
      return res.redirect(`teachers/${req.body.id}`)
    })
  },

  delete(req, res) {
    Teacher.delete(req.body.id, function() {
      return res.redirect(`/teachers`)
    })
  }

}
