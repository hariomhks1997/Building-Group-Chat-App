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

    getdata.map((ele) => {
      const existingindex = item.findIndex((it) => it.id == ele.id);

      if (existingindex == -1) {
        item.push({ id: ele.id, message: ele.message ,name:ele.name});
        showmessageonscreen(ele);
      }
    });
  } catch (err) {
    
  }
}
async function showmessageonscreen(obj) {
  const div = document.getElementById("div1");
  const li = document.createElement("li");
  li.append(document.createTextNode(obj.message+"    "+obj.name));
  li.style.listStyle = "none";
  div.appendChild(li);
}
setInterval(async () => {
  try {
    const get = await axios.get(`getAllmessage`, {
      headers: { Authorization: token },
    });

    const getdata = get.data.data;

    if (getdata.length != product.length) {
      chatmessagerefresh();
    }
  } catch (err) {
    ///alert(err.response.data.message)
  }
}, 1000);
