const emailexist = document.getElementById("exampleInputEmail1");

emailexist.addEventListener("input", emailmatching);
async function emailmatching(event) {
  event.preventDefault();
  const value = document.getElementById("exampleInputEmail1").value;

  try {
    const get = await axios.get(`signup/add-user`);
    for (var i = 0; i < get.data.length; i++) {
      checkvalidemail(get.data[i], value);
      
    }
  } catch (err) {
    console.log(err);
  }
}
async function checkvalidemail(obj, value) {
  if (obj.email == value) {
    const email = document.getElementById("already");

    email.style.display = "block";
    setTimeout(() => {
      email.style.display = "none";
    }, 6000);
  }
}

async function signin(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;
  
  const obj = {
    email,
    password,
  };

  try {
    const post = await axios.post(`signin/add-user`, obj);
    console.log(post.data);
   alert(post.data.message)
   window.location.href="/chatapp"
     sessionStorage.setItem("token",post.data.token)
    //  sessionStorage.setItem("login","true")
    //  sessionStorage.setItem("email",email)
  } catch (err) {
   alert(err.response.data.message)
   
    
  }
}

