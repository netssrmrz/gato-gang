import De_Game from "../De_Game.js";
import Cat from "../Cat.js";
import Cat_Sprite from "../Cat_Sprite.js";
import De_Db_Realtime from "../De_Db_Realtime.js";

class Gato_Gang extends De_Game
{
  constructor()
  {
    super();
    
    this.cat_sprite = new Cat_Sprite();

    this.objs = [];
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
    const cmds = await this.db.Select_Objs("cmd", "params/t2");

    const obj1 = new Cat(1, this.cat_sprite, 100, 100, "BpgDmoBBZahhgNscgzDd50kggm52");
    this.Update_Obj(cmds, obj1);
    this.objs.push(obj1);

    const obj2 = new Cat(2, this.cat_sprite, 0, 100, "i4lIQKprt5goIGTbMxoogfMrpCZ2");
    this.Update_Obj(cmds, obj2);
    this.objs.push(obj2);

    const obj3 = new Cat(3, this.cat_sprite, 0, 0, "1gYmk3hgKtSAxvnt40tlzzJMLFj2");
    this.Update_Obj(cmds, obj3);
    this.objs.push(obj3);

    if (this.uid)
    {
      this.player = this.objs.find(o => o.uid == this.uid);
    }
  }

  Update_Obj(cmds, obj)
  {
    for (let i = cmds.length-1; i >= 0; i--)
    {
      const cmd = cmds[i];
      if (cmd.obj_id == obj.id)
      {
        obj.Apply_Cmd(cmd);
        break;
      }
    }
  }

  On_Auth_State_Changed(user)
  {
    this.player = null;
    if (user)
    {
      this.uid = user.uid;
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
      const cmd = this.player.Move_To(canvas_pt.x, canvas_pt.y, this.now);

      cmd.obj_id = this.player.id;
      this.db.Insert("cmd", cmd);
    }
  }

  On_Cmd_Added(cmd)
  {
    if (!this.player || cmd.obj_id != this.player.id)
    {
      const obj = this.objs.find(o => o.id == cmd.obj_id);
      if (obj)
      {
        obj.Apply_Cmd(cmd);
      }
    }
  }
}

export default Gato_Gang;