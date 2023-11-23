const socket=io();
socket.on("message",(message)=>{
  showgroupwisemessage()
showcommonmessage() 
showgroups()
})

const button = document.getElementById("button1");
const token = sessionStorage.getItem("token");
const decodeToken = parseJwt(token);
const create_groupBtn = document.getElementById("create_groupBtn");
const user_list = document.getElementById("user_list");
create_groupBtn.addEventListener('click', showingAllUser)
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
  const groupid = document.getElementById("groupchanger").value;
  console.log(groupid)
  console.log(message);

  try {
    if (groupid == 0) {
      console.log("0")
      const post = await axios.post(
        `common/message`,
        {
          message: message,
          GroupId: groupid
        },
        { headers: { Authorization: token } }
      );
    } else {
      console.log("1")
      const post = await axios.post(
        `message`,
        {
          message: message,
          GroupId: groupid
        },
        { headers: { Authorization: token } }
      );
    }
    socket.emit("usermessage",Math.random().toString())

  } catch (err) {
    alert(err.response.data.message);
  }
}
window.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("groupname").innerHTML = "Commom-Group-Chat"
  showcommongroup()
  showcreatedgroup()
  //ShowGroup();
  commonchatmessagerefresh()
});
let product;
let item = [];
async function chatmessagerefresh() {


  const lastPart = document.getElementById("groupchanger").value;
  console.log(lastPart)
  try {
    const get = await axios.get(`getAllmessage/${lastPart}`, {
      headers: { Authorization: token },
    });
    console.log(get)
    product = get.data.data;
    const getdata = get.data.data;
    getdata.sort((a, b) => a.id - b.id);
    getdata.map((ele) => {
      const existingindex = item.findIndex((it) => it.id == ele.id);

      if (existingindex == -1) {

        item.push({ id: ele.id, message: ele.message, name: ele.name });
        if (lastPart == ele.GroupId) {
          showmessageonscreen(ele);

        }


      }
    });
  } catch (err) { }
}
let commonproduct;
let commonitem = [];
async function commonchatmessagerefresh() {
  console.log("common")
  const id = document.getElementById("groupchanger").value;
  try {
    const get = await axios.get(`getcommon/message`, {
      headers: { Authorization: token },
    });

    commonproduct = get.data.data;
    const getdata = get.data.data;
    getdata.sort((a, b) => a.id - b.id);
    getdata.map((ele) => {
      const existingindex = commonitem.findIndex((it) => it.id == ele.id);

      if (existingindex == -1) {


        commonitem.push({ id: ele.id, message: ele.message, name: ele.name });
        if (id == ele.GroupId) {

          showmessageonscreen(ele);

        }


      }
    });
  } catch (err) { }
}
async function showmessageonscreen(obj) {
  if (decodeToken.userId == obj.userId) {
    const div1 = document.getElementById("div1");
    const span = document.createElement("span");
    span.style.display = "flex";
    span.style.justifyContent = "right";

    const li = document.createElement("li");

    li.append(document.createTextNode(obj.message));
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

async function showgroupwisemessage() {
  const lastPart = document.getElementById("groupchanger").value
  try {
    const get = await axios.get(`getAllmessage/${lastPart}`, {
      headers: { Authorization: token },
    });

    const getdata = get.data.data;
    getdata.sort((a, b) => a.id - b.id);
    if (getdata.length != product.length) {
      chatmessagerefresh();

    } else {
      for (var i = 0; i < getdata.length; i++) {
        if (getdata[i].id != product[i].id) {
          chatmessagerefresh();


        }
      }
    }



  } catch (err) {
    ///alert(err.response.data.message)
  }
}



async function showcommonmessage() {
  try {
    const get = await axios.get(`getcommon/message`, {
      headers: { Authorization: token },
    });

    const getdata = get.data.data;
    getdata.sort((a, b) => a.id - b.id);
    if (getdata.length != commonproduct.length) {
      commonchatmessagerefresh()
      console.log(getdata)
    } else {
      for (var i = 0; i < getdata.length; i++) {
        if (getdata[i].id != commonproduct[i].id) {
          commonchatmessagerefresh()
          console.log(getdata)

        }
      }
    }



  } catch (err) {
    ///alert(err.response.data.message)
  }
}

async function showingEditUser(data) {
  const groupmember = data.map((ele) => ele.id)
  console.log(groupmember)


  try {
    user_list.parentElement.classList.remove('d-none');
    const usersResponse = await axios.get('signup/add-user');

    user_list.innerHTML = "";



    usersResponse.data.forEach((user) => {
      if (user.id != decodeToken.userId) {
        const li1 = document.createElement("li")
        li1.setAttribute("class", "list-group-item  d-flex  justify-content-between")
        const div1 = document.createElement("div")
        div1.setAttribute("class", "d-flex  align-items-center justify-content-between")
        li1.appendChild(div1)
        const img1 = document.createElement("img")
        img1.setAttribute("src", `https://picsum.photos/seed/${user.id}/200`)
        img1.setAttribute("alt", "Profile Picture")
        img1.setAttribute("class", `rounded-circle me-3`)
        img1.setAttribute("style", "width: 35px; height: 35px;")
        div1.appendChild(img1)
        const h61 = document.createElement("h6")
        const strong = document.createElement("strong")
        strong.setAttribute("class", "mb-1")
        strong.append(document.createTextNode(user.name))
        h61.appendChild(strong)
        div1.appendChild(h61)
        const input1 = document.createElement("input")
        input1.setAttribute("type", "checkbox")
        input1.setAttribute("class", "form-check-inline")
        input1.setAttribute("name", "users")
        input1.setAttribute("value", `${user.id}`)
        li1.appendChild(input1)
        //     text += `                                    
        // <li class="list-group-item  d-flex  justify-content-between">
        //     <div class="d-flex  align-items-center justify-content-between">
        //         <img src="https://picsum.photos/seed/${user.id}/200" alt="Profile Picture"
        //             class="rounded-circle me-3" style="width: 35px; height: 35px;">
        //         <h6><strong class="mb-1">${user.name}</strong></h6>
        //     </div>
        //     <input id="userlist" type="checkbox" class="form-check-inline" name="users" value="${user.id}">
        // </li>`

        if (groupmember.includes(user.id)) {
          input1.checked = true
          
          console.log(input1)
        }
        user_list.appendChild(li1)
      }

    })

    // user_list.appendChild(li1)


  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}



async function showingAllUser() {
  document.getElementById("model_submibtn").innerHTML = "Create Group";
  document.getElementById("model_heading").innerHTML = `Create new group`;
  editstatus.value = "false"




  try {
    user_list.parentElement.classList.remove('d-none');
    const usersResponse = await axios.get('signup/add-user');

    user_list.innerHTML = "";
    



    usersResponse.data.forEach((user) => {
      if (user.id != decodeToken.userId) {
        const li1 = document.createElement("li")
        li1.setAttribute("class", "list-group-item  d-flex  justify-content-between")
        const div1 = document.createElement("div")
        div1.setAttribute("class", "d-flex  align-items-center justify-content-between")
        li1.appendChild(div1)
        const img1 = document.createElement("img")
        img1.setAttribute("src", `https://picsum.photos/seed/${user.id}/200`)
        img1.setAttribute("alt", "Profile Picture")
        img1.setAttribute("class", `rounded-circle me-3`)
        img1.setAttribute("style", "width: 35px; height: 35px;")
        div1.appendChild(img1)
        const h61 = document.createElement("h6")
        const strong = document.createElement("strong")
        strong.setAttribute("class", "mb-1")
        strong.append(document.createTextNode(user.name))
        h61.appendChild(strong)
        div1.appendChild(h61)
        const input1 = document.createElement("input")
        input1.setAttribute("type", "checkbox")
        input1.setAttribute("class", "form-check-inline")
        input1.setAttribute("name", "users")
        input1.setAttribute("value", `${user.id}`)
        li1.appendChild(input1)
       

        user_list.appendChild(li1)
     
      }

    })




  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

document.getElementById("search_bar").onkeyup = async (e) => {

  const text = e.target.value.toLowerCase();
  const items = user_list.querySelectorAll('li');
  const usersArr = Array.from(items);

  usersArr.forEach(blockdisplay);

  function blockdisplay(value) {
    console.log(value)

    const userName = value.querySelector('h6').textContent;

    if (userName.toLowerCase().indexOf(text) != -1) {

      value.classList.add('d-flex');
      value.style.display = 'block';
    }
    else {
      value.classList.remove('d-flex');
      value.style.display = 'none';
    }
  }
}
const editstatus = document.getElementById("edit_status")
document.getElementById("model_submibtn").onclick = async (e) => {

  try {
    if (create_group_form.checkValidity()) {
      e.preventDefault();
      const groupName = create_group_form.querySelector('#group_name').value;
      const selectedUsers = Array.from(user_list.querySelectorAll('input[name="users"]:checked'))
        .map(checkbox => checkbox.value);
      const data = {
        name: groupName,
        membersNo: selectedUsers.length + 1,
        membersIds: selectedUsers
      }
      console.log(data)
      console.log(editstatus.value)
      if (editstatus.value == "false") {
        console.log(data)
        await axios.post('user/create-group', data, { headers: { Authorization: token } },);
        alert("Group successfully created")

      } else {
        const groupId =document.getElementById("groupchanger").value
        await axios.post(`user/update-group?groupId=${groupId}`,data,{ headers: { Authorization: token } });

        document.getElementById("model_submibtn").innerHTML = "Create Group";
        document.getElementById("model_heading").innerHTML = `Create new group`;
        editstatus.value = "false"
       
        alert("Group successfully updated")

      }
      // create_group_form.reset();
      // $('#group_model').modal('hide');
      //ShowGroup();
    } else {
      alert('fill all details ')
    }
    socket.emit("usermessage",Math.random().toString())
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }

}


let createdgroup;
const created = []
async function showcreatedgroup() {
  const group_body = document.getElementById("group_body")

  try {
    const groupsResponse = await axios(`get-mygroups`, { headers: { Authorization: token } });

    const { groups } = groupsResponse.data;
    console.log(groups)
    createdgroup = groups
    groups.forEach((ele) => {
      const existingindex = created.findIndex((it) => it.id == ele.id)

      if (existingindex == -1) {
        created.push({ id: ele.id,membersNo:ele.membersNo,name:ele.name })

        const date = new Date(ele.date);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleString('en-US', options);
        const button1 = document.createElement("button")
        button1.classList = "list-group-item list-group-item-action py-2 "
        button1.setAttribute("data-bs-toggle", "list")
        button1.setAttribute("value", `${ele.id}`)


        button1.innerHTML = `<div class="d-flex w-100 align-items-center justify-content-between" id="${ele.id}">
        <img src="https://picsum.photos/seed/${ele.id}/200" alt="Profile Picture" class="rounded-circle"
            style="width: 50px; height: 50px;">
        <strong class="mb-1">${ele.name}</strong>
        <small>${ele.membersNo} Members</small>
        
    </div>`


        if (ele.AdminId == decodeToken.userId) {
          console.log(ele)
          console.log("true")
          const span = document.createElement("span")
          const li = document.createElement("li")
          li.append(document.createTextNode(ele))
          span.append(document.createTextNode("Admin"))
          span.style.fontWeight = "bold"
          span.style.color = "green"
          button1.appendChild(span)


        }


        group_body.appendChild(button1);
        button1.onclick = async (event) => {
          document.getElementById("editgroup").innerHTML = ""
          document.getElementById("deletegroup").innerHTML=""
          event.preventDefault()
          if (ele.AdminId == decodeToken.userId) {

            const edit = document.getElementById("editgroup")
            const button3 = document.createElement("button")
            button3.append(document.createTextNode("Edit"))
            button3.setAttribute("class", "btn btn-light form-control bg-dark text-white")
            button3.setAttribute("data-bs-toggle", "modal")
            button3.setAttribute("data-bs-target", "#group_model")
            button3.setAttribute("aria-controls", "group_model")
            edit.appendChild(button3)
            button3.onclick = async () => {
              const groupId = ele.GroupMembers.GroupId
              document.getElementById("model_submibtn").innerHTML = "Update Details";
              document.getElementById("model_heading").innerHTML =  `Update ${ele.name} Details`;
              editstatus.value=true
              try {
                const memberApi = await axios(`get-group-members?groupId=${groupId}`);
                console.log(memberApi)
                showingEditUser(memberApi.data.users)
              } catch (err) {
                throw new Error(err)
              }

            }
            const deletegroup = document.getElementById("deletegroup")
            const button4 = document.createElement("button")
            button4.append(document.createTextNode("Delete"))
            button4.setAttribute("class", "btn btn-light form-control bg-dark text-white")
           
            deletegroup.appendChild(button4)
            button4.onclick = async () => {
              const groupId = ele.GroupMembers.GroupId
              
              try {
              await axios.delete(`delete-group?groupId=${groupId}`);
              group_body.removeChild(button1)
              } catch (err) {
                throw new Error(err)
              }

            }

          }

          document.getElementById("groupname").innerHTML = `${ele.name}-Chat`
          document.getElementById("groupchanger").value = ele.id
          // window.location.href=`/chatapp?GroupId=${ele.id}`
          document.getElementById("div1").innerHTML = ""

          item = []
          chatmessagerefresh()


        }
      }

    })

  } catch (err) {
console.log(err)
  }

}
async function showcommongroup() {
  const group_body = document.getElementById("group_body")
  group_body.innerHTML = ""
  const button2 = document.createElement("button")
  button2.classList = "list-group-item list-group-item-action py-2 "
  button2.setAttribute("data-bs-toggle", "list")



  button2.innerHTML = `<div class="d-flex w-100 align-items-center justify-content-between" id="0">
<img src="https://picsum.photos/seed/common/200" alt="Profile Picture" class="rounded-circle"
    style="width: 50px; height: 50px;">
<strong class="mb-1">Common-group</strong>
<small>All Members</small>
</div>`
  group_body.appendChild(button2);
  button2.onclick = async (event) => {
    event.preventDefault()
    document.getElementById("deletegroup").innerHTML=""
    document.getElementById("editgroup").innerHTML = ""
    document.getElementById("groupname").innerHTML = "Commom-Group-Chat"
    //window.location.href=`/chatapp`
    document.getElementById("div1").innerHTML = ""
    document.getElementById("groupchanger").value = Number(0)
    commonitem = []


    commonchatmessagerefresh()
  }
}
async function showgroups(){
  try {
    const get = await axios.get(`get-mygroups`, {
      headers: { Authorization: token },
    });

    const getdata = get.data.groups;
    console.log(getdata)

    if (getdata.length != createdgroup.length) {
      showcreatedgroup()


    } else {
      for (var i = 0; i < getdata.length; i++) {
        if (getdata[i].id != createdgroup[i].id || getdata[i].name!=createdgroup[i].name || getdata[i].membersNo
          !=createdgroup[i].membersNo
          ) {
          showcreatedgroup()
console.log("name,member")

        }
      }
    }



  } catch (err) {
    ///alert(err.response.data.message)
  }
}
