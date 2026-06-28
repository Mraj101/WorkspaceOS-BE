const pool = require('../config/db');

/**
 * BaseEntity - A generic data access class that handles common CRUD operations.
 * It automatically manages soft deletes and ensures audit fields (created_at, 
 * updated_at, deleted_at) are handled internally and never manually inserted.
 */
class BaseEntity {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return rows[0] ?? null;
  }

  async findMany(whereClause = '', params = []) {
    const baseWhere = 'deleted_at IS NULL';
    const where = whereClause ? ` WHERE ${baseWhere} AND (${whereClause})` : ` WHERE ${baseWhere}`;
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName}${where} ORDER BY id DESC`,
      params
    );
    return rows;
  }

  async create(data) {
    // Ensure audit fields are never manually inserted by stripping them from the input
    const cleanData = { ...data };
    delete cleanData.id;
    delete cleanData.created_at;
    delete cleanData.updated_at;
    delete cleanData.deleted_at;

    const columns = Object.keys(cleanData);
    const values = Object.values(cleanData);
    
    if (columns.length === 0) {
      throw new Error('No valid data provided for insertion');
    }

    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const { rows } = await pool.query(
      `INSERT INTO ${this.tableName} (${columns.join(', ')})
       VALUES (${placeholders})
       RETURNING *`,
      values
    );
    return rows[0];
  }

  async updateById(id, data) {
    // Strip audit fields from the update payload
    const cleanData = { ...data };
    delete cleanData.id;
    delete cleanData.created_at;
    delete cleanData.updated_at;
    delete cleanData.deleted_at;

    const columns = Object.keys(cleanData);
    const values = Object.values(cleanData);

    if (columns.length === 0) {
      return this.findById(id); // Nothing to update
    }

    const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
    
    const { rows } = await pool.query(
      `UPDATE ${this.tableName} 
       SET ${setClause} 
       WHERE id = $1 AND deleted_at IS NULL 
       RETURNING *`,
      [id, ...values]
    );
    return rows[0] ?? null;
  }

  async deleteById(id) {
    // Soft delete implementation
    const { rows } = await pool.query(
      `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0] ?? null;
  }
}

module.exports = BaseEntity;
