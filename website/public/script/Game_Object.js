import Cat from "./game_obj/Cat.js";
import Building from "./game_obj/Building.js";
import Chinese_Tower from "./game_obj/Chinese_Tower.js";
import Egyptian_House from "./game_obj/Egyptian_House.js";

class Game_Object
{
  static async Select_Objs(db, img_man)
  {
    const objs = await db.Select_Objs("obj");
    const class_objs = objs.map(obj => Game_Object.To_Class_Obj(obj, img_man));

    return class_objs;
  }

  static To_Class_Obj(obj, img_man)
  {
    let res;
    const classes =
    {
      "Cat": Cat,
      "Building": Building,
      "Chinese_Tower": Chinese_Tower,
      "Egyptian_House": Egyptian_House
    };

    res = new classes[obj.class](img_man);
    res.To_Class_Object(obj);

    return res;
  }
}

export default Game_Object;