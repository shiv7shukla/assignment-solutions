// Signup
async function signup() {
    try {
        const email = document.querySelector(".signup-email").value;
        const password = document.querySelector(".signup-pwd").value;

        const res = await axios.post("http://localhost:3000/signup", {
            email,
            password
        });

        if (res.data.msg === "you are signed up") {
            document.querySelector(".container-2").style.display = "none";
            document.querySelector(".container-3").style.display = "flex";
        } else {
            alert(res.data.msg);
        }
    } catch (e) {
        alert("Error while signing up");
        console.log(e);
    }
}

// Signin
async function signin() {
    try {
        const email = document.querySelector(".signin-email").value;
        const password = document.querySelector(".signin-pwd").value;

        const res = await axios.post("http://localhost:3000/signin", {
            email,
            password
        });

        if (res.data.msg === "sign in successfully") {
            localStorage.setItem("token", res.data.token);
            document.querySelector(".container-3").style.display = "none";
            document.querySelector(".container").style.display = "flex";
            document.body.style.backgroundcolor=" rgb(25,27,50)";
            gettodos();
        } else {
            alert(res.data.msg);
        }
    } catch (e) {
        alert("Error while signing in");
        console.log(e);
    }
}

// Get Todos
async function gettodos() {
    try {
        const res = await axios.get("http://localhost:3000/my-todos", {
            headers: { token: localStorage.getItem("token") }
        });

        const todosList = document.querySelector(".list-group");
        todosList.innerHTML = "";

        if (res.data.todo && res.data.todo.length) {
            res.data.todo.forEach((todo) => {
                const todoElement = createTodoElement(todo);
                todosList.appendChild(todoElement);
            });
        }
    } catch (e) {
        alert("Failed to load todos");
        console.log(e);
    }
}

// Add Todo
async function addtodo() {
    const inp = document.querySelector(".input-todo");
    if (inp.value.trim() === "") {
        alert("Write something meaningful");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const res = await axios.post("http://localhost:3000/add-todo", {
            title: inp.value
        }, {
            headers: { token: token }
        });

        alert(res.data.msg);
        inp.value = "";
        gettodos();
    } catch (e) {
        alert("Failed to add todo");
        console.log(e);
    }
}

// Toggle Done
async function tododone(id) {
    const token = localStorage.getItem("token");
    try {
        await axios.put(`http://localhost:3000/done/${id}`, {}, {
            headers: { token: token }
        });
        gettodos();
    } catch (e) {
        alert("Failed to mark todo done");
        console.log(e);
    }
}

// Create Todo Element
function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const input = document.createElement("input");
    input.className = "form-check-input me-1";
    input.type = "checkbox";
    input.checked = todo.done;
    input.addEventListener("change", () => {
        tododone(todo.id);
        li.remove();
    });

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.innerText = todo.title;

    li.appendChild(input);
    li.appendChild(label);
    return li;
}

// Optional: attach buttons if you didn’t use onclick in HTML
// window.onload = function () {
//     const signupBtn = document.querySelector(".signup-btn");
//     if (signupBtn) signupBtn.addEventListener("click", signup);

//     const signinBtn = document.querySelector(".signin-btn");
//     if (signinBtn) signinBtn.addEventListener("click", signin);

//     const addTodoBtn = document.querySelector(".input-btn");
//     if (addTodoBtn) addTodoBtn.addEventListener("click", addtodo);
// };
