import De_Game from "../De_Game.js";
import Game_Object from "../Game_Object.js";
import Cat_Sprite from "../Cat_Sprite.js";
import De_Db_Realtime from "../De_Db_Realtime.js";

class Gato_Gang extends De_Game
{
  constructor()
  {
    super();

    this.On_Obj_Changed = this.On_Obj_Changed.bind(this);
    this.On_Auth_State_Changed = this.On_Auth_State_Changed.bind(this);
    
    this.cat_sprite = new Cat_Sprite();
    this.objs = null;
    this.player = null;
    this.db = new De_Db_Realtime();
    this.db.auth.onAuthStateChanged(this.On_Auth_State_Changed);
  }

  async Init_Game()
  {
    this.objs = await Game_Object.Select_Objs(this.db);
    for (const obj of this.objs)
    {
      obj.sprite = this.cat_sprite;
    }
  }

  async On_Auth_State_Changed(user)
  {
    if (user)
    {
      await this.Init_Game();
      this.player = this.objs.find(o => o.uid == user.uid);
      this.Un_Watch = this.db.Watch("obj", "child_changed", this.On_Obj_Changed);
    }
    else
    {
      if (this.Un_Watch)
      {
        this.Un_Watch();
      }
      this.objs = null;
      this.player = null;
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
      this.player.Move_To(this.db, canvas_pt.x, canvas_pt.y, this.now);
    }
  }

  On_Obj_Changed(obj)
  {
    if (!this.player || obj.id != this.player.id)
    {
      const local_obj = this.objs.find(o => o.id == obj.id);
      if (local_obj)
      {
        local_obj.pos(obj.pos);
      }
    }
  }
}

export default Gato_Gang;