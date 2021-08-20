import Cat from "./Cat.js";

class User
{
  constructor()
  {
    this.email = null;
    this.password = null;
    this.displayName = null;
  }

  async Insert(db)
  {
    let res = "ok", info;

    try
    {
      info = await db.auth.createUserWithEmailAndPassword(this.email, this.password);
      await info.user.updateProfile(this);
    }
    catch (error)
    {
      res = error.message;
    }

    if (res == "ok")
    {
      await Cat.Create(db, info.user.uid);
    }

    return res;
  }
}

export default User;