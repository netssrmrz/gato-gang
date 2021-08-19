
class Cmd
{
  constructor()
  {
    this.id = null;
    this.obj_id = null;
    this.name = null;
    this.params = null;
  }

  To_Db_Object()
  {
    return {
      class: "Cat",
      id: this.id,
      x: this.x,
      y: this.y,
      dir: this.dir,
      uid: this.uid
    };
  }

  To_Class_Object(db_object)
  {
    if (db_object)
    {
      this.id = db_object.id;
      this.x = db_object.x;
      this.y = db_object.y;
      this.dir = db_object.dir;
      this.uid = db_object.uid;
      this.max_v = 0.05;
    }
  }

  async Insert(db)
  {
    const db_cat = this.To_Db_Object();
    this.id = await db.Insert("obj", db_cat);

    return this.id;
  }

  async Update(db)
  {
    this.id = await db.Update("obj/" + this.obj_id, this);

    return this.id;
  }
}

export default Cmd;