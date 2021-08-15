import Utils from "./Utils.js";

class De_Db_Realtime
{
  constructor()
  {
    this.app = firebase.app("gato-gang");
    this.auth = firebase.auth(this.app);
    this.db = this.app.database();
    this.last_error = null;
  }

  // General data access ==========================================================================

  async Select_Value()
  {

  }

  async Select_Values()
  {

  }

  // where: [{field, op, value}]
  async Select_Obj(table_name, where)
  {
    let res;

    const table = this.db.ref(table_name);
    const query = this.Add_Where(table, where).limitToFirst(1);
    const query_res = await query.once('value');
    if (query_res.exists())
    {
      const res_items = De_Db_Realtime.To_Array(query_res);
      res = res_items[0];
    }
      
    return res;
  }

  async Select_Objs(table_name, order_by)
  {
    var res;

    const table = this.db.ref(table_name);
    const query = this.Add_Sort(table, order_by);
    const query_res = await query.once('value');
    if (query_res.exists())
    {
      const res_items = De_Db_Realtime.To_Array(query_res);
      res = res_items;
    }
      
    return res;
  }

  async Save()
  {

  }

  Insert(path, obj)
  {
    //console.log("Db.Insert(): path, obj =", path, obj);
    obj.id = this.db.ref(path).push().key;
    this.db.ref(path + "/" + obj.id).set(obj);
  }

  Update(path, obj, on_success_fn)
  {
    var ref, promise;

    try
    {
      ref = this.conn.ref(path + "/" + obj.id);
      promise = ref.set(obj);
      promise.then(on_success_fn, on_success_fn);
    }
    catch (err)
    {
      on_success_fn(err);
    }
  }

  async Delete()
  {

  }

  Watch(path, watch_type, watch_callback)
  {
    const ref = this.db.ref(path);
    ref.on(watch_type, On_Change);
    function On_Change(snapshot)
    {
      const data = snapshot.val();
      if (watch_callback)
      {
        watch_callback(data);
      }
    }  
  }

  Add_Sort(table, order_by)
  {
    if (!Utils.isEmpty(order_by))
    {
      table = table.orderByChild(order_by);
    }

    return table;
  }

  Add_Where(table, where_filters)
  {
    if (!Utils.isEmpty(where_filters))
    {
      for (const filter of where_filters)
      {
        if (filter.op == "equalTo")
        {
          table = table.orderByChild(filter.field).equalTo(filter.value);
        }
      }
    }

    return table;
  }

  static To_Obj(query_res)
  {
    return query_res.val();
  }

  static To_Array(query_res, success_fn)
  {
    var val, vals = null, keys, c;

    val = query_res.val();
    if (val != null)
    {
      if (val.constructor === Array)
        vals = val;
      else
      {
        vals = new Array();
        keys = Object.keys(val);
        for (c = 0; c < keys.length; c++)
        {
          vals.push(val[keys[c]]);
        }
      }
    }

    if (success_fn != null)
      success_fn(vals);
    else
      return vals;
  }

  static Get_Table(obj)
  {
    return obj.constructor.name.toLowerCase();
  }
}

export default De_Db_Realtime;