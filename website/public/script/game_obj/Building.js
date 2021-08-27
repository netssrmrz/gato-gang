import Utils from "../Utils.js";

class Building
{
  constructor(img_man, ctx)
  {
    this.ctx = ctx;
    this.id = null;
    this.uid = null;
    this.pos = {x: 0, y: 0};
    this.bounds =
    [
      {x: 0, y: 25, r: 50}
    ];

    this.On_Load = this.On_Load.bind(this);

    this.is_ready = false;
    this.img = img_man.Load(this.Get_File_Path(), this.On_Load);
  }

  Get_File_Path()
  {
    return "/image/building-1.png";
  }

  Get_Position(t)
  {
    return this.pos;
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

  On_Load()
  {
    this.is_ready = true;
  }

  Draw(gfx, elapsed_millis, t)
  {
    if (this.is_ready)
    {
      const x = -this.img.width/2;
      const y = -this.img.height/2;
      gfx.drawImage(this.img, 
        0, 0, this.img.width, this.img.height, 
        x, y, this.img.width, this.img.height);
    }

    gfx.fillStyle = "#00ff0088";
    for (const bound of this.bounds)
    {
      gfx.beginPath();
      gfx.arc(bound.x, bound.y, bound.r, 0, Math.PI*2);
      gfx.fill();
    }
  }

  Find_Collision(obj)
  {
    let res;

    const pos = obj.Get_Path();
    for (const bound of this.bounds)
    {
      const bound_x = this.pos.x + bound.x;
      const bound_y = this.pos.y + bound.y;
      const collision = Utils.Path_Circle_Intersection
        (pos.x1, pos.y1, pos.x2, pos.y2, bound_x, bound_y, bound.r);
      if (collision)
      {
        res = collision;
        break;
      }
    }

    return res;
  }
}

export default Building;