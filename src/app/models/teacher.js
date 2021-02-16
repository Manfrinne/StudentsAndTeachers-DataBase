const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM teachers
    ORDER by name ASC`, function(err, results) {
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

  findBy(filter, callback) {
    db.query(`SELECT teachers.*,
    count(students) AS total_students
    FROM teachers
    LEFT JOIN students ON (students.teacher_id = teachers.id)
    WHERE teachers.name ILIKE '%${filter}%'
    OR teachers.disciplines ILIKE '%${filter}%'
    GROUP BY teachers.id`, function(err, results) {

      if (err) throw `Database Error! ${err}`

      callback(results.rows)

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
  },

  paginate(params) {
    const { filter, limit, offset, callback } = params

    let query = "",
        filterQuery = "",
        totalQuery = `(
          SELECT count(*) FROM teachers
        ) AS total`

    if (filter) {

      filterQuery = `
      WHERE teachers.name ILIKE '%${filter}%'
      OR teachers.disciplines ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM teachers
        ${filterQuery}
      ) AS total`
    }

    query = `
    SELECT teachers.*, ${totalQuery}, count(students) AS total_students
    FROM teachers
    LEFT JOIN students ON (teachers.id = students.teacher_id)
    ${filterQuery}
    GROUP BY teachers.id LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], function(err, results) {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })

  }
}
