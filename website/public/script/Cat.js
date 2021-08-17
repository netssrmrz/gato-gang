
class Cat
{
  constructor(id, sprite, x, y, uid)
  {
    this.id = id;
    this.x = x;
    this.y = y;
    this.max_v = 0.05;
    this.sprite = sprite;
    this.dir = 4;
    this.uid = uid;
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

    const cmd = {name: "On_Move_To", params};
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
}

export default Cat;