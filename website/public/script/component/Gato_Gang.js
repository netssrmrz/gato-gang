import De_Game from "./De_Game.js";
import Cat from "./Cat.js";
import Cat_Sprite from "./Cat_Sprite.js";
import De_Db_Realtime from "./De_Db_Realtime.js";

class Gato_Gang extends De_Game
{
  constructor()
  {
    super();
    
    this.cat_sprite = new Cat_Sprite();

    this.objs = [];
    this.objs.push(new Cat(1, this.cat_sprite, 100, 100, "BpgDmoBBZahhgNscgzDd50kggm52"));
    this.objs.push(new Cat(2, this.cat_sprite, 0, 100, "i4lIQKprt5goIGTbMxoogfMrpCZ2"));
    this.objs.push(new Cat(3, this.cat_sprite, 0, 0));
    this.player = null;

    this.On_Cmd_Added = this.On_Cmd_Added.bind(this);
    this.On_Auth_State_Changed = this.On_Auth_State_Changed.bind(this);

    this.db = new De_Db_Realtime();
    this.db.Watch("cmd", "child_added", this.On_Cmd_Added);
    this.db.auth.onAuthStateChanged(this.On_Auth_State_Changed);

    this.Init_Game();
  }

  async Init_Game()
  {
    this.game = await this.db.Select_Obj("game", [{field: "id", op: "equalTo", value: "-MgyS7RfONuN11Y1vT2g"}]);
    if (!this.game)
    {
      this.game = {t: this.Now()};
      await this.db.Insert("game", this.game);
    }
  }

  On_Auth_State_Changed(user)
  {
    this.player = null;
    if (user)
    {
      this.player = this.objs.find(o => o.uid == user.uid);
    }
  }

  On_Connected_Callback() 
  {
    this.addEventListener("click", this.On_Click, false);
  }

  On_Click(event)
  {
    if (this.player)
    {
      const canvas_pt = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      //const cmd = this.player.Move_To(canvas_pt.x, canvas_pt.y, this.Now());
      const cmd = this.player.Move_To(canvas_pt.x, canvas_pt.y, this.now);

      cmd.obj_id = this.player.id;
      //cmd.params.t2 += this.start_millis;
      this.db.Insert("cmd", cmd);
    }
  }

  On_Cmd_Added(cmd)
  {
    if (!this.player || cmd.obj_id != this.player.id)
    {
      const obj = this.objs.find(o => o.id == cmd.obj_id);
      //cmd.params.t2 -= this.start_millis;
      obj.Apply_Cmd(cmd);
    }
  }
}

export default Gato_Gang;