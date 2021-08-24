class Img_Man
{
  constructor()
  {
    this.imgs = {};
  }

  Load(file_path, On_Load_Fn)
  {
    let img = this.imgs[file_path];
    if (img)
    {
      On_Load_Fn();
    }
    else
    {
      img = new Image();
      img.onload = On_Load_Fn;
      img.src = file_path;
      this.imgs[file_path] = img;
    }

    return img;
  }
}

export default Img_Man;