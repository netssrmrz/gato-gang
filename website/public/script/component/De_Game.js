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
    this.start_millis = this.Now();
    this.now = this.start_millis;
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
    this.gfx.lineWidth = 3;
    this.gfx.lineCap = "round";

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
    const elapsed = this.start_millis + t - this.now;
    this.now = this.start_millis + t;

    for (const obj of this.objs)
    {
      if (obj.cmd)
      {
        obj[obj.cmd.name](obj.cmd.params, this.now);
        //obj[obj.cmd.name](obj.cmd.params, t);
      }
    }

    this.Clear();
    this.gfx.save();
    this.gfx.setTransform(this.cam_tx);

    for (const obj of this.objs)
    {
      this.gfx.save();
      this.gfx.translate(obj.x, obj.y);
      obj.Draw(this.gfx, elapsed);
      this.gfx.restore();
    }

    this.gfx.restore();
    window.requestAnimationFrame(t => this.Draw_Frame(t));
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
    return performance.timing.navigationStart + performance.now();
  }

  Reset_Transform()
  {
    this.gfx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default De_Game;