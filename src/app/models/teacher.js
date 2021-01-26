const {age, date, academic_level} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM teachers`, function(err, results) {
      if (err) throw `DATABASE ERROR! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback) {
    {
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
        data.avatar_url,
        data.name,
        date(data.birth).iso,
        data.academic_level,
        data.class_type,
        data.disciplines,
        date(Date.now()).iso
      ]

      db.query(query, values, function(err, results) {
        if (err) throw `DATABASE ERROR! ${err}`

        callback(results.rows[0])
      })
    }
  },

  find(id, callback) {
    db.query(`SELECT * FROM teachers WHERE id = $1`,
    [id], function(err, results) {
      if (err) throw `DATABASE ERROR! ${err}`

      callback(results.rows[0])
    })
  },

  update(data, callback) {
    const query = `
    UPDATE teachers SET
      avatar_url=($1),
      name=($2),
      birth=($3),
      academic_level=($4),
      class_type=($5),
      disciplines=($6),
      created_at=($7)
    WHERE id = $8
    `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.academic_level,
      data.class_type,
      data.disciplines,
      date(Date.now()).iso,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if (err) throw `DATABASE ERROR! ${err}`

      callback()
    })
  },

  delete(id, callback) {
    db.query(`DELETE FROM teachers WHERE id = $1`,
    [id], function(err) {
      if (err) throw `DATABASE ERROR! ${err}`

      return callback()
    })
  }
}
