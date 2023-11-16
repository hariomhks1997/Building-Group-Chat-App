const button=document.getElementById("button1")
const token = localStorage.getItem("token");
const decodeToken = parseJwt(token);
button.addEventListener("click",showmessage)
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
async function showmessage(event){
    event.preventDefault()
    const message=document.getElementById("input1").value
    try {
        const post = await axios.post(`message`, {
            message:message
        },{ headers: { Authorization: token }});
        console.log(post.data);
       alert(post.data.message)
       
       
      } catch (err) {
       alert(err.response.data.message)
       
        
      }
    
    



}