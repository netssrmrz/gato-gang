import Cmd from "./Cmd.js";

class Cat
{
  constructor(init_values)
  {
    this.To_Class_Object(init_values);
  }

  Move_To(x, y, t1)
  {
    const dx = x - this.x;
    const dy = y - this.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    const t2 = t1 + d/this.max_v;
    const dt = t2 - t1;

    const mx = dx / dt;
    const bx = this.x - mx*t1;
    const my = dy / dt;
    const by = this.y - my*t1;
    const params = 
    {
      mx, bx, my, by, 
      x1: this.x, y1: this.y, t1,
      x2: x, y2: y, t2
    };

    const cmd = new Cmd();
    cmd.id = "cmd";
    cmd.obj_id = this.id;
    cmd.name = "On_Move_To";
    cmd.params = params;
    this.Apply_Cmd(cmd);

    return cmd;
  }

  Apply_Cmd(cmd)
  {
    if (cmd.name == "On_Move_To")
    {
      this.dir = this.Calc_Direction(cmd.params.mx, cmd.params.my);
    }
    this.cmd = cmd;
  }

  On_Move_To(params, t)
  {
    if (t > params.t2)
    {
      t = params.t2;
      this.cmd = null;
      this.x = params.x2;
      this.y = params.y2;
    }
    else if (t > params.t1)
    {
      this.x = params.mx * t + params.bx;
      this.y = params.my * t + params.by;
    }
  }

  Draw(gfx, elapsed_millis)
  {
    let frames;

    if (this.cmd)
    {
      frames = this.sprite.dir_to_frames[this.dir];
      this.sprite.Animate(gfx, 0, 0, frames, elapsed_millis);
    }
    else
    {
      const frame_idx = this.sprite.dir_to_frame[this.dir];
      frames = this.sprite.stand;
      this.sprite.Draw(gfx, 0, 0, frames, frame_idx);
    }
  }

  Calc_Direction(vx, vy)
  {
    let res = 0;

    const m1 = 0.41421356237;
    const m2 = 2.41421356237;
    const m3 = -2.41421356237;
    const m4 = -0.41421356237;

    const m1y = m1 * vx;
    const m2y = m2 * vx;
    const m3y = m3 * vx;
    const m4y = m4 * vx;

    if (vy < m2y && vy < m3y)
    {
      res = 0
    }
    else if (vy < m1y && vy > m2y)
    {
      res = 1
    }
    else if (vy < m4y && vy > m1y)
    {
      res = 2
    }
    else if (vy < m3y && vy > m4y)
    {
      res = 3
    }
    else if (vy > m2y && vy > m3y)
    {
      res = 4
    }
    else if (vy > m1y && vy < m2y)
    {
      res = 5
    }
    else if (vy > m4y && vy < m1y)
    {
      res = 6
    }
    else if (vy > m3y && vy < m4y)
    {
      res = 7
    }

    return res;
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
}

export default Cat;