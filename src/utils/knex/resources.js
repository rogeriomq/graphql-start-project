const { parsePagination } = require('./utils')
const { map, isEmpty } = require('lodash')

const queryFactory = (db, resourceConfig, filters = {}, pagination = {}) => {
  const { table, applyWhere } = resourceConfig
  const query = db(table)

  if (!isEmpty(applyWhere)) {
    query.where(applyWhere)
  }

  if (!isEmpty(filters)) {
    query.where(filters)
  }

  if (!isEmpty(pagination)) {
    const { limit, page } = parsePagination(pagination)

    query.limit(limit)
      .offset(limit * (page - 1))
  }

  return query
}

const normalizeResources = tables => {
  return map(tables, row => {
    return {
      ...row,
      resource: row.resource || row.table,
      applyWhere: row.applyWhere || {}
    }
  })
}

module.exports = { normalizeResources, queryFactory }
