import De_Game from "./De_Game.js";
import Cat from "./Cat.js";
import Cat_Sprite from "./Cat_Sprite.js";

class Gato_Gang extends De_Game
{
  constructor()
  {
    super();

    this.cat_sprite = new Cat_Sprite();

    this.objs = [];
    this.objs.push(new Cat(this.cat_sprite, 100, 100));
    this.objs.push(new Cat(this.cat_sprite, 0, 100));
    this.objs.push(new Cat(this.cat_sprite, 0, 0));
  }

  On_Connected_Callback() 
  {
    this.addEventListener("click", this.On_Click, false);
  }

  On_Click(event)
  {
    const canvas_pt = this.To_Canvas_Pt(event.clientX, event.clientY);

    const player = this.objs[0];
    player.cmd = {name: "Move_To", params: {x: canvas_pt.x, y: canvas_pt.y} };
  }
}

customElements.define('gato-gang', Gato_Gang);
