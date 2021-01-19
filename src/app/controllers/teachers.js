const {age, date, academic_level} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {

  index(req, res) {

    db.query(`SELECT * FROM teachers`, function(err, results) {
      if (err) return res.send("DATABASE ERROR!")

      return res.render("teachers/index", {teachers: results.rows})
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

    const query = `
      INSERT INTO teachers (
        avatar_url,
        name,
        birth,
        academic_level,
        class_type,
        disciplines,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `

    const values = [
      req.body.avatar_url,
      req.body.name,
      date(req.body.birth).iso,
      req.body.academic_level,
      req.body.class_type,
      req.body.disciplines,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results) {
      if (err) return res.send("DATABASE ERROR!")

      return res.redirect(`/teachers/${results.rows[0].id}`)
    })
  },

  show(req, res) {
    return
  },

  edit(req, res) {
    return
  },

  update(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] =="") {
        return res.send('Please, fill in all fields!')
      }
    }

    return
  },

  delete(req, res) {
    return
  }

}
