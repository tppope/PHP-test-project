$(window).on("load", function () {
    loadCategories();
    loadBooks();

    const getCellValueMinutes = (tr, idx) => parseFloat(tr.children[idx].innerText) || parseFloat(tr.children[idx].textContent);
    sortRowsBy(getCellValueMinutes,'#sort-price');
})

function sortRowsBy(getCellValue,id){
    $(id).on("click",function () {
        doSort(getCellValue,this,this.asc = !this.asc);
        arrowSwitch(this.asc,$(this).find("img"));
    });
}

function doSort(getCellValue, th,asc){
    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2,'sk')
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), asc))
        .forEach(tr => tbody.appendChild(tr) );
}

function arrowSwitch(asc,arrows){
    $(".sort-arrows").find("img").css("visibility","visible");
    if (asc)
        $(arrows.get(1)).css("visibility","hidden");
    else
        $(arrows.get(0)).css("visibility","hidden");
}

function showAddInfo(addInfo) {
    let addDiv = $("#add-" + addInfo);
    addDiv.css("top", 0);
    setTimeout(function () {
        addDiv.css("top", "-100px");
    }, 3000)
}


function loadCategories() {
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

function printCategories(categories) {
    let select = document.getElementById("category");
    categories.map(category => {
        select.appendChild(createOptionCategory(category.id, category.name))
    })

}

function loadBooks() {
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


function printBooks(books) {
    let table = document.getElementById("table-body");
    $(table).empty();
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

function createTd(text) {
    let td = document.createElement("td");
    $(td).text(text);
    return td;
}

function createTr() {
    return document.createElement("tr");
}


function createOptionCategory(id, name) {
    let option = document.createElement("option");
    $(option).prop({
        value: id
    })
    $(option).text(name);
    return option;
}

function removeIsInvalid(object) {
    $(object).removeClass("is-invalid");
}

function addIsInvalid(object) {
    $(object).addClass("is-invalid");
}

function addBook() {
    let form = document.getElementById("add-form");
    let request = new Request('/api/add-book/', {
        method: 'POST',
        body: new FormData(form),
    });
    fetch(request)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                showAddInfo('success');
                loadBooks();

            } else {
                showAddInfo('failed')
                if (data.emptyValues)
                    printEmptyError(data.emptyValues);
                else if (data.isbnError)
                    printISBNError();
            }
        });
}

function printEmptyError(emptyValues) {
    $("#isbn-error").text("ISBN nemôže byť prázdne!");
    emptyValues.map(emptyValue => {
        addIsInvalid(document.getElementById(emptyValue))
    })
}

function printISBNError() {
    $("#isbn-error").text("Zadané ISBN už je v databáze!");
    addIsInvalid(document.getElementById('isbn'))
}

function showAutocomplete(input) {
    let request = new Request('/api/load-authors/index.php?name='+input.value, {
        method: 'GET',
    });
    fetch(request)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                console.log(data)

            } else {

            }
        });
}
