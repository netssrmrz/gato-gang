class De_Game extends HTMLElement
{
  constructor()
  {
    super();
  }

  connectedCallback() 
  {
    this.canvas = document.createElement("canvas");
    this.append(this.canvas);

    this.Init_Canvas();
    window.onresize = () => this.Init_Canvas();
    window.requestAnimationFrame(t => this.Draw_Frame(t));

    if (this.On_Connected_Callback)
    {
      this.On_Connected_Callback();
    }
  }

  Init_Canvas()
  {
    this.canvas.width = this.offsetWidth;
    this.canvas.height = this.offsetHeight;

    this.gfx = this.canvas.getContext('2d');
    this.gfx.strokeStyle = "#000";
    this.gfx.fillStyle = "#000";
    this.gfx.lineWidth = 3;
    this.gfx.lineCap = "round";
    this.gfx.font = '30px sans-serif';

    const x = this.canvas.width/2;
    const y = this.canvas.height/2;
    this.Set_Camera(x, y);
  }

  Set_Camera(x, y)
  {
    const tx = new DOMMatrixReadOnly();
    this.cam_tx = tx.translate(x, y);
  }

  To_Canvas_Pt(x, y)
  {
    const tx = this.cam_tx.inverse();
    const screen_pt = new DOMPointReadOnly(x, y);
    const canvas_pt = screen_pt.matrixTransform(tx);
    return canvas_pt;
  }

  Draw_Frame(t)
  {
    const elapsed = this.Update_Time();

    this.Clear();
    //this.gfx.fillText("start: " + this.start_millis, 50, 50);
    //this.gfx.fillText("frame now: " + t, 50, 85);
    //this.gfx.fillText(this.now, 50, 120);
    //this.gfx.fillText(Date.now(), 50, 155);

    if (this.objs)
    {
      for (const obj of this.objs)
      {
        if (obj.cmd)
        {
          obj[obj.cmd.name](obj.cmd.params, this.now);
        }
      }

      this.gfx.save();
      this.gfx.setTransform(this.cam_tx);

      for (const obj of this.objs)
      {
        if (obj.Draw)
        {
          this.gfx.save();

          if (obj.Get_Position)
          {
            const pos = obj.Get_Position(this.now);
            this.gfx.translate(pos.x, pos.y);
          }

          obj.Draw(this.gfx, elapsed, this.now);
          this.gfx.restore();
        }
      }

      this.gfx.restore();
    }
    window.requestAnimationFrame(t => this.Draw_Frame(t));
  }

  Update_Time()
  {
    let elapsed;

    if (this.start_millis)
    {
      const new_now = Date.now();
      elapsed = new_now - this.now;
      this.now = new_now;
    }
    else
    {
      this.start_millis = Date.now();
      this.now = this.start_millis;
      elapsed = 0;
    }

    return elapsed;
  }

  Get_Millis(t)
  {
    const now = this.start_millis + t;
    const elapsed = t - this.prev_millis;
    this.prev_millis = t;

    return {now, elapsed};
  }

  Clear()
  {
    this.gfx.clearRect(0, 0, this.gfx.canvas.width, this.gfx.canvas.height);
  }

  Now()
  {
    return Date.now();
  }

  Reset_Transform()
  {
    this.gfx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default De_Game;