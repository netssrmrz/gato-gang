import Utils from "../Utils.js";

class De_Header extends HTMLElement 
{
  // Lifecycle ====================================================================================

  constructor() 
  {
    super();

    this.On_Auth_State_Changed = this.On_Auth_State_Changed.bind(this);
    this.On_Sign_In_Clicked = this.On_Sign_In_Clicked.bind(this);
    this.On_Sign_Out_Clicked = this.On_Sign_Out_Clicked.bind(this);
    this.On_Acc_Clicked = this.On_Acc_Clicked.bind(this);

    this.Render();
  }

  connectedCallback()
  {
    this.auth.onAuthStateChanged(this.On_Auth_State_Changed);
  }

  disconnectedCallback()
  {
  }

  adoptedCallback()
  {
  }

  static observedAttributes = ["title", "app-name"];
  attributeChangedCallback(attr_name, old_value, new_value)
  {
    if (attr_name == "title")
    {
      const title_span = this.querySelector("#title_span");
      title_span.innerText = new_value;
    }
    else if (attr_name == "app-name")
    {
      this.Init(new_value);
    }
  }

  // Misc =========================================================================================

  Init(app_name) 
  {
    this.app = firebase.app(app_name);
    this.auth = firebase.auth(this.app);
    this.ui = new firebaseui.auth.AuthUI(this.auth);
  }

  // API ==========================================================================================

  Sign_In(signin_fn)
  {
    let signInSuccessWithAuthResult = (auth_result, redirect_url) => false;
    if (signin_fn)
    {
      signInSuccessWithAuthResult = function (auth_result, redirect_url)
      {
        const display_name = auth_result.user.displayName;
        this.Render_Signed_In(display_name);
      };
      signInSuccessWithAuthResult = signInSuccessWithAuthResult.bind(this);
    }

    const auth_ui_config = 
    {
      callbacks:
      {
        signInSuccessWithAuthResult,
        uiShown: this.On_User_Is_Signing_In
      },
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };

    let auth_div = document.getElementById("firebaseui-auth-container");
    if (!auth_div)
    {
      auth_div = document.createElement("div");
      auth_div.id = "firebaseui-auth-container";
      document.body.append(auth_div);
    }
    this.ui.start('#firebaseui-auth-container', auth_ui_config);
  }
  
  // Events =======================================================================================

  On_Auth_State_Changed(user)
  {
    if (user)
    {
      this.On_User_Has_Signed_In(user);
    }
    else
    {
      this.On_User_Has_Signed_Out();
    }
  }

  On_User_Has_Signed_In(user)
  {
    this.Render_Signed_In(user.displayName);
  }

  On_User_Has_Signed_Out()
  {
    Utils.Show("signin_info", this);
    Utils.Hide("user_info", this);
  }

  On_Sign_In_Clicked()
  {
    this.Sign_In();
  }

  On_Sign_Up_Clicked()
  {
    window.open("user.html", "_self");
  }

  async On_Sign_Out_Clicked()
  {
    await this.auth.signOut();
  }

  On_User_Is_Signing_In() 
  {
    Utils.Hide("signin_info", this);
    Utils.Hide("user_info", this);
  }

  On_Acc_Clicked()
  {
    const uid = this.auth.currentUser.uid;
    window.open("user.html?uid=" + uid, "_self");
  }

  // Rendering ====================================================================================

  Render_Signed_In(display_name)
  {
    const elem = this.querySelector("#user_name");
    elem.innerText = display_name;

    Utils.Hide("signin_info", this);
    Utils.Show("user_info", this);
  }

  Render()
  {
    const html =
      `<span id="title" class="de-header-title">
        <span id="title_span"></span>
      </span>
      <div id="firebaseui-auth-container"></div>
      <div id="btn_bar" class="de-header-action">
        <div id="user_info" class="de-header-user">
          <span></span>
          <span id="user_name"></span>
          <button id="acc_btn">Account</button>
          <button id="sign_out_btn">Sign Out</button>
        </div>
        <div id="signin_info" class="de-header-signin">
          <button id="sign_up_btn">Sign Up</button>
          <button id="sign_in_btn">Sign In</button>
        </div>
      </div>`;
    this.innerHTML = html;
    this.classList.add("de-header");

    const sign_in_btn = document.getElementById("sign_in_btn");
    sign_in_btn.auth = this.auth;
    sign_in_btn.addEventListener("click", this.On_Sign_In_Clicked);

    const sign_up_btn = document.getElementById("sign_up_btn");
    sign_up_btn.addEventListener("click", this.On_Sign_Up_Clicked);

    const sign_out_btn = document.getElementById("sign_out_btn");
    sign_out_btn.addEventListener("click", this.On_Sign_Out_Clicked);

    const acc_btn = this.querySelector("#acc_btn");
    acc_btn.addEventListener("click", this.On_Acc_Clicked);
  }
}

export default De_Header;