
class Cat_Sprite
{
  constructor()
  {
    this.On_Load = this.On_Load.bind(this);

    this.millis_per_frame = 100;
    this.curr_frame = 0;

    this.img = new Image();
    this.img.onload = this.On_Load;
    this.img.src = "/image/cat.png";

    this.walk_down =
    [
      {x: 0, y: 0, s: 32},
      {x: 32, y: 0, s: 32},
      {x: 64, y: 0, s: 32}
    ];
    this.walk_left =
    [
      {x: 0, y: 32, s: 32},
      {x: 32, y: 32, s: 32},
      {x: 64, y: 32, s: 32}
    ];
    this.walk_right =
    [
      {x: 0, y: 64, s: 32},
      {x: 32, y: 64, s: 32},
      {x: 64, y: 64, s: 32}
    ];
    this.walk_up =
    [
      {x: 0, y: 96, s: 32},
      {x: 32, y: 96, s: 32},
      {x: 64, y: 96, s: 32}
    ];

    this.walk_left_down =
    [
      {x: 96, y: 0, s: 32},
      {x: 128, y: 0, s: 32},
      {x: 160, y: 0, s: 32}
    ];
    this.walk_left_up =
    [
      {x: 96, y: 32, s: 32},
      {x: 128, y: 32, s: 32},
      {x: 160, y: 32, s: 32}
    ];
    this.walk_right_down =
    [
      {x: 96, y: 64, s: 32},
      {x: 128, y: 64, s: 32},
      {x: 160, y: 64, s: 32}
    ];
    this.walk_right_up =
    [
      {x: 96, y: 96, s: 32},
      {x: 128, y: 96, s: 32},
      {x: 160, y: 96, s: 32}
    ];

    this.stand =
    [
      {x: 96, y: 128, s: 32},  // 0 left-down
      {x: 128, y: 128, s: 32}, // 1 down
      {x: 96, y: 160, s: 32},  // 2 left-up
      {x: 128, y: 160, s: 32}, // 3 left
      {x: 96, y: 192, s: 32},  // 4 right-down
      {x: 128, y: 192, s: 32}, // 5 right
      {x: 96, y: 224, s: 32},  // 6 right-up
      {x: 128, y: 224, s: 32}  // 7 up
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
  }

  On_Load()
  {
    this.is_ready = true;
  }

  Animate(gfx, x, y, frames, t)
  {
    this.curr_frame += t/this.millis_per_frame;
    const frame_idx = parseInt(this.curr_frame) % frames.length;
    this.Draw(gfx, x, y, frames, frame_idx);
  }

  Draw(gfx, x, y, frames, frame_idx)
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

export default Cat_Sprite;