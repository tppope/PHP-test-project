$(window).on("load", function () {
    loadCategories();
    loadBooks();
})

function showAddInfo(addInfo) {
    let addDiv = $("#add-" + addInfo);
    addDiv.css("top", 0);
    setTimeout(function () {
        addDiv.css("top", "-100px");
    }, 3000)
}


function loadCategories(){
    let request = new Request('/api/load-categories/', {
        method: 'GET',
    });
    fetch(request)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                printCategories(data.categories)
            }
        });
}

function printCategories(categories){
    let select = document.getElementById("category");
    categories.map(category => {
        select.appendChild(createOptionCategory(category.id, category.name))
    })

}

function loadBooks(){
    let request = new Request('/api/load-books/', {
        method: 'GET',
    });
    fetch(request)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                printBooks(data.books)
            }
        });
}


function printBooks(books){
    let table = document.getElementById("table-body");
    books.map(book => {
        let tr = createTr();
        tr.appendChild(createTd(book.name))
        tr.appendChild(createTd(book.isbn))
        tr.appendChild(createTd(book.price))
        tr.appendChild(createTd(book.categoryName))
        tr.appendChild(createTd(book.authorName))
        table.appendChild(tr);
    })
}

function createTd(text){
    let td = document.createElement("td");
    $(td).text(text);
    return td;
}
function createTr(){
    return document.createElement("tr");
}


function createOptionCategory(id, name){
    let option = document.createElement("option");
    $(option).prop({
        value: id
    })
    $(option).text(name);
    return option;
}

function checkSamePasswords() {
    let password2 = $("#password-repeat");
    if ($("#password").val() !== password2.val())
        password2.get(0).setCustomValidity("Heslá sa musia zhodovať");
    else
        password2.get(0).setCustomValidity("");
}

function removeIsInvalid(email) {
    $(email).removeClass("is-invalid");
}

function checkFormValidation(form) {
    let inputs = $(form).find("input");
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs.get(i).checkValidity())
            return false;
    }
    return true;
}

function submitRegistration() {
    let form = document.getElementById("registration-form");
    if (checkFormValidation(form)) {
        let request = new Request('api/uzivatelia/registracia/', {
            method: 'POST',
            body: new FormData(form),
        });
        fetch(request)
            .then(response => response.json())
            .then(data => {
                let email = $("#email");
                if (!data.error) {
                    sessionStorage.setItem("regStatus", data.status);
                    window.location.replace("index.html");
                } else {
                    if (data.errorCode === 1062)
                        email.addClass("is-invalid");
                    else {
                        sessionStorage.setItem("regStatus", data.status);
                        window.location.replace("index.html");
                    }
                }
            });
    }
}
