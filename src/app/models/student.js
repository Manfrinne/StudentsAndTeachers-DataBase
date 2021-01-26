const {date, grade} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM students
    ORDER by name ASC`, function(err, results) {
      if (err) throw `DATABASE ERROR! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback) {
    {
      const query = `
        INSERT INTO students (
          avatar_url,
          name,
          birth,
          email,
          school_year,
          hours_week
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `

      const values = [
        data.avatar_url,
        data.name,
        date(data.birth).iso,
        data.email,
        grade(data.school_year),
        data.hours_week
      ]

      db.query(query, values, function(err, results) {
        if (err) throw `DATABASE ERROR! ${err}`

        callback(results.rows[0])
      })
    }
  },

  find(id, callback) {
    db.query(`SELECT * FROM students WHERE id = $1`,
    [id], function(err, results) {
      if (err) throw `DATABASE ERROR! ${err}`

      callback(results.rows[0])
    })
  },

  update(data, callback) {
    const query = `
    UPDATE students SET
      avatar_url=($1),
      name=($2),
      birth=($3),
      email=($4),
      school_year=($5),
      hours_week=($6)
    WHERE id = $7
    `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.email,
      grade(data.school_year),
      data.hours_week,
      data.id
    ]

    db.query(query, values, function(err) {
      if (err) throw `DATABASE ERROR! ${err}`

      callback()
    })
  },

  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id = $1`,
    [id], function(err) {
      if (err) throw `DATABASE ERROR! ${err}`

      return callback()
    })
  }
}
