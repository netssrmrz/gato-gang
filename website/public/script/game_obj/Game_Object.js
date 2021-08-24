
class Game_Object
{
  constructor()
  {
    this.id = null;
    this.uid = null;
    this.sprite = null;
    this.pos = 
    {
      x: 0,
      y: 0
    };
  }

  Get_Position(t)
  {
    return this.pos;
  }

  Draw(gfx, elapsed_millis, t)
  {
    this.sprite.Draw(gfx, 0, 0, frames, frame_idx);
  }

  To_Db_Object()
  {
    return {
      class: "Building",
      id: this.id,
      uid: this.uid,
      pos: this.pos
    };
  }

  To_Class_Object(db_object)
  {
    if (db_object)
    {
      this.id = db_object.id;
      this.pos = db_object.pos;
      this.uid = db_object.uid;
    }
  }

  async Insert(db)
  {
    const db_obj = this.To_Db_Object();
    this.id = await db.Insert("obj", db_obj);

    return this.id;
  }
}

export default Game_Object;