
class Cat
{
  constructor(img_man)
  {
    this.id = null;
    this.uid = null;
    this.max_v = 0.05;
    this.pos = 
    {
      x2: 0,
      y2: 0,
      t2: 0,
      dir: 4
    };

    this.On_Load = this.On_Load.bind(this);

    this.walk_down =
    [
      {x: 0, y: 0, s: 32},
      {x: 32, y: 0, s: 32},
      {x: 64, y: 0, s: 32}
    ];
    this.walk_left =
    [
      {x: 0, y: 33, s: 32},
      {x: 32, y: 33, s: 32},
      {x: 64, y: 33, s: 32}
    ];
    this.walk_right =
    [
      {x: 0, y: 65, s: 32},
      {x: 32, y: 65, s: 32},
      {x: 64, y: 65, s: 32}
    ];
    this.walk_up =
    [
      {x: 0, y: 97, s: 32},
      {x: 32, y: 97, s: 32},
      {x: 64, y: 97, s: 32}
    ];

    this.walk_left_down =
    [
      {x: 96, y: 0, s: 32},
      {x: 128, y: 0, s: 32},
      {x: 160, y: 0, s: 32}
    ];
    this.walk_left_up =
    [
      {x: 96, y: 33, s: 32},
      {x: 128, y: 33, s: 32},
      {x: 160, y: 33, s: 32}
    ];
    this.walk_right_down =
    [
      {x: 96, y: 65, s: 32},
      {x: 128, y: 65, s: 32},
      {x: 160, y: 65, s: 32}
    ];
    this.walk_right_up =
    [
      {x: 96, y: 97, s: 32},
      {x: 128, y: 97, s: 32},
      {x: 160, y: 97, s: 32}
    ];

    this.stand =
    [
      {x: 96, y: 129, s: 32},  // 0 left-down
      {x: 128, y: 129, s: 32}, // 1 down
      {x: 96, y: 161, s: 32},  // 2 left-up
      {x: 128, y: 161, s: 32}, // 3 left
      {x: 96, y: 193, s: 32},  // 4 right-down
      {x: 128, y: 193, s: 32}, // 5 right
      {x: 96, y: 225, s: 32},  // 6 right-up
      {x: 128, y: 225, s: 32}  // 7 up
    ];

    this.dir_to_frames = 
    [
      this.walk_up, 
      this.walk_left_up, 
      this.walk_left, 
      this.walk_left_down, 
      this.walk_down, 
      this.walk_right_down, 
      this.walk_right, 
      this.walk_right_up
    ];

    this.dir_to_frame = [7, 2, 3, 0, 1, 4, 5, 6];

    this.millis_per_frame = 100;
    this.curr_frame = 0;
    this.is_ready = false;
    this.img = img_man.Load("/image/cat2.png", this.On_Load);
  }

  static Create(db, uid)
  {
    const cat = new Cat();
    cat.uid = uid;
    cat.pos.x2 = Math.random()*200-100;
    cat.pos.y2 = Math.random()*200-100;

    cat.Insert(db);
  }

  Move_To(db, x, y, t1)
  {
    const pos = this.Get_Position(t1);
    const dx = x - pos.x;
    const dy = y - pos.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    const t2 = t1 + d/this.max_v;
    const dt = t2 - t1;

    const mx = dx / dt;
    const bx = pos.x - mx*t1;
    const my = dy / dt;
    const by = pos.y - my*t1;
    const dir = this.Calc_Direction(mx, my);
    this.pos = 
    {
      id: "pos",
      mx, bx, my, by, dir,
      x1: pos.x, y1: pos.y, t1,
      x2: x, y2: y, t2
    };

    db.Update("obj/" + this.id, this.pos);
  }

  Get_Position(t)
  {
    let x = this.pos.x1;
    let y = this.pos.y1;

    if (t > this.pos.t2)
    {
      x = this.pos.x2;
      y = this.pos.y2;
    }
    else if (t > this.pos.t1)
    {
      x = this.pos.mx * t + this.pos.bx;
      y = this.pos.my * t + this.pos.by;
    }

    return {x, y};
  }

  Draw(gfx, elapsed_millis, t)
  {
    if (t > this.pos.t2)
    {
      this.Draw_Standing(gfx);
    }
    else if (t > this.pos.t1)
    {
      this.Draw_Walking(gfx, elapsed_millis);
    }
    else
    {
      this.Draw_Standing(gfx);
    }
  }

  Draw_Walking(gfx, elapsed_millis)
  {
    const frames = this.dir_to_frames[this.pos.dir];
    this.Animate(gfx, 0, 0, frames, elapsed_millis);
  }

  Draw_Standing(gfx)
  {
    const frame_idx = this.dir_to_frame[this.pos.dir];
    const frames = this.stand;
    this.Draw_Frame(gfx, 0, 0, frames, frame_idx);
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
      this.max_v = 0.05;
    }
  }

  async Insert(db)
  {
    const db_cat = this.To_Db_Object();
    this.id = await db.Insert("obj", db_cat);

    return this.id;
  }

  On_Load()
  {
    this.is_ready = true;
  }

  Animate(gfx, x, y, frames, t)
  {
    this.curr_frame += t/this.millis_per_frame;
    const frame_idx = parseInt(this.curr_frame) % frames.length;
    this.Draw_Frame(gfx, x, y, frames, frame_idx);
  }

  Draw_Frame(gfx, x, y, frames, frame_idx)
  {
    if (this.is_ready)
    {
      const frame = frames[frame_idx];
      x -= frame.s/2;
      y -= frame.s/2;
      gfx.drawImage(this.img, 
        frame.x, frame.y, frame.s, frame.s, 
        x, y, frame.s, frame.s);
    }
  }
}

export default Cat;