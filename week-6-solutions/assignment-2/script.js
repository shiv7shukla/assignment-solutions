async function signup()
{
    try{
        const res=await axios.post("http://localhost:300/signup",{
            email:document.getElementById("exampleFormControlInput1"),
            password:document.getElementById("inputPassword5")
        })
        if(res.data.msg==="you are signed up")
        {
            document.getElementsByClassName("container").style.display="none";
            document.getElementsByClassName("container-2").style.display="block";
        }
        else
            alert(res.data.msg);
    }
    catch(e)
    {
        alert("error while signing up");
        console.log(e);
    }
}
async function signin()
{
    try{
            const res=await axios.post("http://localhost:300/signin",{
            email:document.getElementsByClassName("email"),
            password:document.getElementsByClassName("password")
        })
        if(res.data.msg==="sign in successfully")
        {
            localStorage.setItem("token",res.data.token);
            document.getElementsByClassName("container-2").style.display="none";
            document.getElementsByClassName("container").style.display="block";
        }
        else
            alert(res.data.msg);
    }
    catch(e)
    {
        alert("error while signing in");
        console.log(e);
    }
}
async function gettodos()
{
    try{
        const res=await axios.get("http://localhost:3000/my-todos",{
            headers:{token:localStorage.getItem("token")}
        })
        const todosList = document.getElementById("todo-list");
        todosList.innerHTML = "";
        if (response.data.length) 
        {
            response.data.forEach((todo) => {
                const todoElement = createTodoElement(todo);
                todosList.appendChild(todoElement);
            });
        }
    }
    catch(e)
    {
        alert("error while getting todos");
        console.log(e);
    }    
}
