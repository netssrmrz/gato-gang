class Utils
{
  static appendParam(params, paramName, paramValue)
  {
    return Utils.appendStr(params, paramName + "=" + paramValue, "&");
  }

  static Add_Param(url, param_name, param_Value)
  {
    if (param_Value)
    {
      let sep = "&";

      if (!url.includes("?"))
      {
        sep = "?";
      }
      url = Utils.appendStr(url, param_name + "=" + param_Value, sep);
    }

    return url;
  }

  static appendStr(a, b, sep)
  {
    let res = null;

    if (sep == null || sep == undefined)
    {
      sep = "";
    }
    if (a && b && a.length > 0 && b.length > 0)
    {
      res = a + sep + b;
    } else if (a && !b && a.length > 0)
    {
      res = a;
    } else if (!a && b && b.length > 0)
    {
      res = b;
    }

    return res;
  }

  static toArray(str)
  {
    let res = null;

    if (str)
    {
      const strObj = JSON.parse(str);
      if (strObj && Array.isArray(strObj) && strObj.length > 0)
      {
        res = strObj;
      }
    }

    return res;
  }

  static toValueArray(str)
  {
    let res = null;
    const strArray = Utils.toArray(str);

    if (strArray)
    {
      res = strArray.map(item => item.value);
    }

    return res;
  }

  static toJSONArray(obj)
  {
    let res;

    if (obj)
    {
      res = JSON.stringify(obj);
    }

    return res;
  }
  
  static fetchPostJson(url, xApiKey, bodyObj, auth)
  {
    let body;

    if (bodyObj)
    {
      body = JSON.stringify(bodyObj);
    }

    return Utils.fetchJson(url, "POST", xApiKey, body, auth);
  }
  
  static fetchGetJson(url, xApiKey)
  {
    return Utils.fetchJson(url, "GET", xApiKey);
  }
  
  static async fetchJson(url, method, xApiKey, body, auth)
  {
    let res = null;
    const options =
    {
      method,
      headers: 
      {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey
      }
    };

    if (body)
    {
      options.body = body;
    }
    if (auth)
    {
      options.headers.Authorization = auth;
    }
    
    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      const textRes = await httpRes.text();
      res = JSON.parse(textRes);
    }

    return res;
  }
  
  static async fetch(url, method, xApiKey, body)
  {
    let res = null;
    const options =
    {
      method,
      headers: 
      {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey
      }
    };

    if (body)
    {
      options.body = body;
    }
    
    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      res = await httpRes.text();
    }

    return res;
  }

  static toDateStr(date)
  {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = year + "-" + Utils.to2DigitStr(month) + "-" + Utils.to2DigitStr(day);

    return dateStr;
  }

  static to2DigitStr(number)
  {
    let res;

    if (number < 10)
    {
      res = "0" + number;
    }
    else
    {
      res = "" + number;
    }

    return res;
  }

  static addDays(date, days)
  {
    const res = new Date(date);
    res.setDate(res.getDate() + days);

    return res;
  }

  static nullIfEmpty(items)
  {
    let res = items;

    if (Utils.isEmpty(items))
    {
      res = null;
    }

    return res;
  }

  static isEmpty(items)
  {
    let res = false;

    if (items == null || items == undefined)
    {
      res = true;
    }
    else if (Array.isArray(items))
    {
      if (items.length == 0)
      {
        res = true;
      }
    }
    else if (typeof items == "string")
    {
      const str = items.trim();
      if (str.length == 0 || str == "")
      {
        res = true;
      }
    }
    else if (items.length == 0)
    {
      res = true;
    }

    return res;
  }

  static toBoolean(valStr)
  {
    let res = false;

    if (valStr)
    {
      valStr = valStr.toLowerCase();
      if (valStr == "true" || valStr == "yes" || valStr == "t")
      {
        res = true;
      }
    }

    return res;
  }

  static toDocument(html) 
  {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
  }

  static toElement(html) 
  {
    return Utils.toDocument(html).firstChild;
  }

  static toElements(html) 
  {
    return Utils.toDocument(html).childNodes;
  }

  static getFromLocalStorgeInt(key, defaultValue)
  {
    return parseInt(Utils.getFromLocalStorge(key, defaultValue));
  }

  static getFromLocalStorgeJson(key, defaultValue)
  {
    return JSON.parse(Utils.getFromLocalStorge(key, defaultValue));
  }

  static getFromLocalStorge(key, defaultValue)
  {
    let res = defaultValue;

    const storageStr = localStorage.getItem(key);
    if (!Utils.isEmpty(storageStr))
    {
      res = storageStr;
    }

    return res;
  }

  static toEmptyStr(value)
  {
    let res = value;
    
    if (value == null || value == undefined)
    {
      res = "";
    }

    return res;
  }
  
  static Show(id, parent_elem)
  {
    if (!parent_elem)
    {
      parent_elem = document;
    }

    const elem = parent_elem.querySelector("#" + id);
    if (elem)
    {
      elem.style.removeProperty("display");
      const def_display = getComputedStyle(elem).getPropertyValue("--def-display");
      if (def_display)
      {
        elem.style.display = def_display;
      }
    }
  }

  static Hide(id, parent_elem)
  {
    if (!parent_elem)
    {
      parent_elem = document;
    }

    const elem = parent_elem.querySelector("#" + id);
    if (elem)
    {
      elem.style.display = "none";
    }
  }

  static Disable(id)
  {
    const elem = document.getElementById(id);
    if (elem)
    {
      elem.disabled = true;
    }
  }

  static Get_Param(param_name)
  {
    const urlParams = new URLSearchParams(window.location.search);
    const res = urlParams.get(param_name);
    return res;
  }

  static To_Class_Obj(obj, class_obj)
  {
    if (obj)
    {
      for (const key in obj)
      {
        class_obj[key] = obj[key];
      }
    }
  }

  static To_Obj(class_obj)
  {
    const obj = {};

    for (const key in class_obj)
    {
      obj[key] = class_obj[key];
    }

    return obj;
  }

  static Handle_Errors(db)
  {
    if (db.last_error)
    {
      if (db.last_error.code == "permission-denied")
      {
        alert("You do not have permission.");
      }
      else
      {
        alert("There was a problem.");
      }
    }
  }
  
  static hasValue(data)
  {
    let res = true;
    
    if (data == undefined || data == null)
    {
      res = false;
    }

    return res;
  }

  static Abbreviate(str)
  {
    const MAX_LENGTH = 200;
    let res;

    if (!Utils.isEmpty(str))
    {
      if (str.length > MAX_LENGTH)
      {
        res = str.substring(0, MAX_LENGTH) + "...";
      }
      else
      {
        res = str;
      }
    }

    return res;
  }

  static Calc_Arrival_Time(x1, y1, t1, x2, y2, v)
  {
    const d = Utils.Calc_Distance(x1, y1, x2, y2);
    const t2 = t1 + d/v;

    return t2;
  }

  static Calc_Distance(x1, y1, x2, y2)
  {
    return Math.hypot(x2-x1, y2-y1);
  }

  static Calc_Position(path, t)
  {
    let x = path.x1;
    let y = path.y1;

    if (t > path.t2)
    {
      x = path.x2;
      y = path.y2;
    }
    else if (t > path.t1)
    {
      x = path.mx * t + path.bx;
      y = path.my * t + path.by;
    }

    return {x, y};
  }

  static Calc_Path(x1, y1, t1, x2, y2, t2)
  {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dt = t2 - t1;

    let mx = 0, my = 0;
    if (dt!=0)
    {
      mx = dx / dt;
      my = dy / dt;
    }

    const bx = x1 - mx*t1;
    const by = y1 - my*t1;

    const dir = Utils.Calc_Direction(mx, my);
    const path = 
    {
      mx, bx, my, by, dir,
      x1, y1, t1,
      x2, y2, t2
    };

    return path
  }

  static Calc_Direction(vx, vy)
  {
    let res = 0;

    const m1 = 0.41421356237;
    const m2 = 2.41421356237;
    const m3 = -2.41421356237;
    const m4 = -0.41421356237;

    const m1y = m1 * vx;
    const m2y = m2 * vx;
    const m3y = m3 * vx;
    const m4y = m4 * vx;

    if (vy < m2y && vy < m3y)
    {
      res = 0
    }
    else if (vy < m1y && vy > m2y)
    {
      res = 1
    }
    else if (vy < m4y && vy > m1y)
    {
      res = 2
    }
    else if (vy < m3y && vy > m4y)
    {
      res = 3
    }
    else if (vy > m2y && vy > m3y)
    {
      res = 4
    }
    else if (vy > m1y && vy < m2y)
    {
      res = 5
    }
    else if (vy > m4y && vy < m1y)
    {
      res = 6
    }
    else if (vy > m3y && vy < m4y)
    {
      res = 7
    }

    return res;
  }

  static Line_Circle_Intersection(x1, y1, x2, y2, cx, cy, r)
  {
    let res;

    x1 = x1-cx;
    y1 = y1-cy;
    x2 = x2-cx;
    y2 = y2-cy;

    const dx = x2-x1;
    const dy = y2-y1;
    const dr = dx*dx+dy*dy;
    const D = x1*y2-x2*y1;
    const i = r*r*dr-D*D;

    if (i>=0)
    {
      const sy = Utils.Sign(dy);
      const si = Math.sqrt(i);
      const ay = Math.abs(dy);

      const col_x1 = ( D*dy+sy*dx*si)/dr;
      const col_y1 = (-D*dx+ay*si)/dr;
      let col_x2 = col_x1;
      let col_y2 = col_y1;
      if (i>0)
      {
        col_x2 = ( D*dy-sy*dx*si)/dr;
        col_y2 = (-D*dx-ay*si)/dr;
      }

      res = 
      [
        {x: col_x1+cx, y: col_y1+cy}, 
        {x: col_x2+cx, y: col_y2+cy}
      ];
    }
    
    return res;
  }

  static Path_Circle_Intersection(x1, y1, x2, y2, cx, cy, r)
  {
    let res;

    const has_collision = Utils.Is_Line_Circle_Collision(x1, y1, x2, y2, cx, cy, r);
    if (has_collision)
    {
      const buffer = 1;
      let pts = Utils.Line_Circle_Intersection(x1, y1, x2, y2, cx, cy, r+buffer);
      pts[0].d = Utils.Calc_Distance(x1, y1, pts[0].x, pts[0].y);
      pts[1].d = Utils.Calc_Distance(x1, y1, pts[1].x, pts[1].y);
      pts = pts.sort((p1, p2) => p1.d-p2.d);
      res = {x: pts[0].x, y: pts[0].y};
    }

    return res;
  }

  static Sign(x)
  {
    return x<0 ? -1 : 1;
  }

  static Is_Line_Circle_Collision(x1, y1, x2, y2, cx, cy, r)
  {
    // is either end INSIDE the circle?
    // if so, return true immediately
    const inside1 = Utils.Is_Point_Circle_Collision(x1,y1, cx,cy,r);
    const inside2 = Utils.Is_Point_Circle_Collision(x2,y2, cx,cy,r);
    if (inside1 || inside2) return true;

    // get length of the line
    const len = Utils.Calc_Distance(x1, y1, x2, y2);

    // get dot product of the line and circle
    const dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

    // find the closest point on the line
    const closestX = x1 + (dot * (x2-x1));
    const closestY = y1 + (dot * (y2-y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    const onSegment = Utils.Is_Line_Point_Collision(x1,y1,x2,y2, closestX,closestY);
    if (!onSegment) return false;

    // get distance to closest point
    const distance = Utils.Calc_Distance(closestX, closestY, cx, cy);
    return (distance <= r);
  }

  static Is_Point_Circle_Collision(px, py, cx, cy, r) 
  {
    const distance = Utils.Calc_Distance(px,py, cx,cy);
    return distance <= r;
  }

  static Is_Line_Point_Collision(x1, y1, x2, y2, px, py) 
  {
    const d1 = Utils.Calc_Distance(px,py, x1,y1);
    const d2 = Utils.Calc_Distance(px,py, x2,y2);
    const dp = Utils.Calc_Distance(x1,y1, x2,y2);
    const buffer = 0.1;    // higher # = less accurate
    return (d1+d2 >= dp-buffer && d1+d2 <= dp+buffer);
  }
}

export default Utils;
