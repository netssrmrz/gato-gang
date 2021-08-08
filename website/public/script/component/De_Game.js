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
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

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

  Draw_Frame(draw_time)
  {
    if (!this.gfx.prev_time)
    {
      this.gfx.prev_time = draw_time;
    }
    const elapsed_time = draw_time - this.gfx.prev_time;
    this.gfx.prev_time = draw_time;

    for (const obj of this.objs)
    {
      if (obj.cmd)
      {
        obj[obj.cmd.name](obj.cmd.params, elapsed_time);
      }
    }

    this.Clear();
    this.gfx.save();
    this.gfx.setTransform(this.cam_tx);

    for (const obj of this.objs)
    {
      this.gfx.save();
      this.gfx.translate(obj.x, obj.y);
      obj.Draw(this.gfx, elapsed_time);
      this.gfx.restore();
    }

    this.gfx.restore();
    window.requestAnimationFrame(t => this.Draw_Frame(t));
  }

  Clear()
  {
    this.gfx.clearRect(0, 0, this.gfx.canvas.width, this.gfx.canvas.height);
  }

  Reset_Transform()
  {
    this.gfx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default De_Game;