import Cat from "./game_obj/Cat.js";
import Greek_Temple from "./game_obj/Greek_Temple.js";
import Chinese_Tower from "./game_obj/Chinese_Tower.js";
import Egyptian_House from "./game_obj/Egyptian_House.js";

class Game_Object
{
  static async Select_Objs(ctx, img_man)
  {
    const objs = await ctx.db.Select_Objs("obj");
    const class_objs = objs.map(obj => Game_Object.To_Class_Obj(obj, img_man, ctx));

    return class_objs;
  }

  static To_Class_Obj(obj, img_man, ctx)
  {
    let res;
    const classes =
    {
      "Cat": Cat,
      "Greek_Temple": Greek_Temple,
      "Chinese_Tower": Chinese_Tower,
      "Egyptian_House": Egyptian_House
    };

    res = new classes[obj.class](img_man, ctx);
    res.To_Class_Object(obj);

    return res;
  }
}

export default Game_Object;