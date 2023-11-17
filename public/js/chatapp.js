const button = document.getElementById("button1");
const token = localStorage.getItem("token");
const decodeToken = parseJwt(token);
button.addEventListener("click", showmessage);
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
async function showmessage(event) {
  event.preventDefault();
  const message = document.getElementById("input1").value;
  console.log(message);
  try {
    const post = await axios.post(
      `message`,
      {
        message: message,
      },
      { headers: { Authorization: token } }
    );
  } catch (err) {
    alert(err.response.data.message);
  }
}
window.addEventListener("DOMContentLoaded", async function () {
  chatmessagerefresh();
});
let product;
let item = [];
async function chatmessagerefresh() {
  try {
    const get = await axios.get(`getAllmessage`, {
      headers: { Authorization: token },
    });
    product = get.data.data;
    const getdata = get.data.data;
    getdata.sort((a, b) => a.id - b.id);
    getdata.map((ele) => {
      const existingindex = item.findIndex((it) => it.id == ele.id);

      if (existingindex == -1) {
        item.push({ id: ele.id, message: ele.message, name: ele.name });
        showmessageonscreen(ele);
      }
    });
  } catch (err) {}
}
async function showmessageonscreen(obj) {
  if (decodeToken.userId == obj.userId) {
    const div1 = document.getElementById("div1");
    const span = document.createElement("span");
    span.style.display = "flex";
    span.style.justifyContent = "right";
   
    const li = document.createElement("li");

    li.append(document.createTextNode(obj.message ));
    li.style.listStyle = "none";
    li.style.width = "fit-content";
    li.style.backgroundColor = "white";
    li.style.padding = "2vw";
    li.style.marginRight = "5vw";
    li.style.marginBottom = "1vw";
    span.appendChild(li);
    div1.appendChild(span);
    div1.scrollTop = div1.scrollHeight;
  } else {
    const div2 = document.getElementById("div1");
    const span = document.createElement("span");
    span.style.display = "flex";
    span.style.justifyContent = "left";
    
    const li = document.createElement("li");

    li.append(document.createTextNode(obj.message + " => by  " + obj.name));
    li.style.listStyle = "none";
    li.style.width = "fit-content";
    li.style.backgroundColor = "violet";
    li.style.padding = "2vw";
    li.style.marginLeft = "5vw";
    li.style.marginBottom = "1vw";
    span.appendChild(li);
    div2.appendChild(span);
    div2.scrollTop = div2.scrollHeight;
   
  }
  
}
setInterval(async () => {
  try {
    const get = await axios.get(`getAllmessage`, {
      headers: { Authorization: token },
    });

    const getdata = get.data.data;
    
    if(getdata.length!=product.length){
      chatmessagerefresh();
    }else{
      for (var i = 0; i < getdata.length; i++) {
        if (getdata[i].id != product[i].id ) {
          chatmessagerefresh();
          
        }
      }
    }
    
    
    
  } catch (err) {
    ///alert(err.response.data.message)
  }
}, 1000);
