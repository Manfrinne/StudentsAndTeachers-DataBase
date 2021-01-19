const {age, date, academic_level} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM teachers`, function(err, results) {
      if (err) return res.send("DATABASE ERROR!")

      return callback(results.rows)
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
        if (err) return res.send("DATABASE ERROR!")

        return callback(results.rows[0])
      })
    }
  }
}

