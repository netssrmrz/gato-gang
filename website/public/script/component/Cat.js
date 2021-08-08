
class Cat
{
  constructor(sprite, x, y)
  {
    this.x = x;
    this.y = y;
    this.max_v = 0.05;
    this.sprite = sprite;
  }

  Move_To(params, t)
  {
    const dx = params.x - this.x;
    const dy = params.y - this.y;
    const d = Math.sqrt(dx*dx + dy*dy);

    if (d < this.max_v*t)
    {
      this.cmd = null;
      //this.vx = 0;
      //this.vy = 0;
    }
    else
    {
      this.vx = this.max_v * dx/d;
      this.vy = this.max_v * dy/d;
      this.x += this.vx*t;
      this.y += this.vy*t;
    }
  }

  Draw(gfx, t)
  {
    let frames;

    const dir = this.Calc_Direction();
    if (this.cmd)
    {
      frames = this.sprite.dir_to_frames[dir];
      this.sprite.Animate(gfx, 0, 0, frames, t);
    }
    else
    {
      const frame_idx = this.sprite.dir_to_frame[dir];
      frames = this.sprite.stand;
      this.sprite.Draw(gfx, 0, 0, frames, frame_idx);
    }
  }

  Calc_Direction()
  {
    let res = 0;

    const m1 = 0.41421356237;
    const m2 = 2.41421356237;
    const m3 = -2.41421356237;
    const m4 = -0.41421356237;

    const m1y = m1 * this.vx;
    const m2y = m2 * this.vx;
    const m3y = m3 * this.vx;
    const m4y = m4 * this.vx;

    if (this.vy < m2y && this.vy < m3y)
    {
      res = 0
    }
    else if (this.vy < m1y && this.vy > m2y)
    {
      res = 1
    }
    else if (this.vy < m4y && this.vy > m1y)
    {
      res = 2
    }
    else if (this.vy < m3y && this.vy > m4y)
    {
      res = 3
    }
    else if (this.vy > m2y && this.vy > m3y)
    {
      res = 4
    }
    else if (this.vy > m1y && this.vy < m2y)
    {
      res = 5
    }
    else if (this.vy > m4y && this.vy < m1y)
    {
      res = 6
    }
    else if (this.vy > m3y && this.vy < m4y)
    {
      res = 7
    }

    return res;
  }
}

export default Cat;