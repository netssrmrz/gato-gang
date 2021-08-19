import Cat from "./Cat.js";

class Game_Object
{
  static async Select_Objs(db)
  {
    const objs = await db.Select_Objs("obj");
    const class_objs = objs.map(Game_Object.To_Class_Obj);

    return class_objs;
  }

  static To_Class_Obj(obj)
  {
    let res;

    if (obj.class == "Cat")
    {
      res = new Cat();
      res.To_Class_Object(obj);
    }

    return res;
  }
}

export default Game_Object;