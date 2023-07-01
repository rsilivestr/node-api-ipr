import db from 'db';

export class TagModel {
  static async create(name: string) {
    const existingTags = await db.query('SELECT * FROM tags WHERE name=$1', [name]);

    if (existingTags.rowCount > 0) return false;

    const { rows } = await db.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [name]);

    return rows[0].id;
  }

  static async findOne(id: string) {
    const { rows } = await db.query('SELECT * FROM tags WHERE id=$1', [id]);
    return rows[0];
  }

  static async findMany() {
    const { rows } = await db.query('SELECT * FROM tags ORDER BY id');
    return rows;
  }

  static async update(id: string, newName: string) {
    const { rowCount } = await db.query('UPDATE tags SET name=$2 WHERE id=$1 RETURNING *', [id, newName]);
    return rowCount === 1;
  }

  static async delete(id: string) {
    const { rowCount } = await db.query('DELETE FROM tags WHERE id=$1', [id]);
    return rowCount === 1;
  }
}
