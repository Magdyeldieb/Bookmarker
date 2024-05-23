var siteName = document.getElementById('siteName');
var siteURL = document.getElementById('siteURL');
var addBtn = document.getElementById('addBtn');
var tableBody = document.getElementById('tableBody');
var search = document.getElementById('search');
// ------------------sweetalret-------
var name_validaiton = document.querySelector(".name-validaiton");
var name_unique_validation = document.querySelector(".name-unique-validation");
var url_validation = document.querySelector(".url-validation");
// ------------------sweetalret-------
var bookmark;
var currentIndex;
var bookmarksList = [];
if (localStorage.getItem("bookmarksList") === null)
    bookmarksList = [];
else {
    bookmarksList = JSON.parse(localStorage.getItem('bookmarksList'));
    display();
}
addBtn.addEventListener("click", checkStatusBtn);
function checkStatusBtn() {
    if (nameValidation() && urlValidation() && isNameUnique()) {
        if (addBtn.innerHTML === 'Add Bookmark')
            addBookmark();
        else
            addUpdatedBookmark();
        clearIcon();
        localStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
        reset();
        display();
    }
    else {
        showIconNameInput();
        showIconURLInput();
        sweetAlert();
    }
}
function addBookmark() {
 var   bookmark = {
        sName: siteName.value,
        sURL: siteURL.value,
    }
    bookmarksList.push(bookmark);
}
function reset() {
    siteName.value = '';
    siteURL.value = '';
}
function display() {
    var showResult = '';
    for (var i = 0; i < bookmarksList.length; i++) {
        showResult += `
        <tr>
            <td>${i + 1}</td>
            <td>${bookmarksList[i].sName}</td>
            <td><button class="btn btn-visit" id="btn-visit-${i}" onclick="visitBookmark(${i})"><span class="fa-solid fa-eye"></span> Visit</button>
            </td>
            <td><button class="btn btn-update" id="btn-update-${i}" onclick="updateBookmark(${i})"><span class="fa-solid fa-gear"></span> Update</button>
            </td>
            <td><button class="btn btn-delete" id="btn-delete-${i}" onclick="deleteBookmark(${i})"><span class="fa-solid fa-trash"></span> Delete</button>
            </td>
        </tr>
        `;
    }
    document.getElementById("tableBody").innerHTML = showResult;
}
function visitBookmark(index) {
    window.open(bookmarksList[index].sURL, '_blank');
}
function updateBookmark(index) {
    currentIndex = index;
    siteName.value = bookmarksList[index].sName;
    siteURL.value = bookmarksList[index].sURL;
    addBtn.innerHTML = 'Update Bookmark';
}
function addUpdatedBookmark() {
 var   bookmark = {
        sName: siteName.value,
        sURL: siteURL.value,
    }
    bookmarksList[currentIndex] = bookmark;
    document.getElementById("addBtn").innerHTML = 'Add Bookmark';
}
function deleteBookmark(index) {
    bookmarksList.splice(index, 1);
    localStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
    display();
}
siteName.addEventListener('input', nameValidation);
siteName.addEventListener('blur', nameValidation);

function nameValidation() {
    var regexName = /^[A-Za-z]{3}/;
    return regexName.test(siteName.value);
}
siteURL.addEventListener('input', urlValidation);
siteURL.addEventListener('blur', urlValidation);

function urlValidation() {
    var regexURL = /^(?:https?:\/\/)|(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return regexURL.test(siteURL.value);
}
siteName.addEventListener('input', isNameUnique);
siteName.addEventListener('blur', isNameUnique);
function isNameUnique() {
    var newName = siteName.value.trim().toLowerCase();
    return !bookmarksList.some((item, index) => (item.sName.toLowerCase() === newName) && (index !== currentIndex));//so that to check it if it's uniqu & when to use the update method you still can have the same name without asking to be unique
}
siteName.addEventListener('input', showIconNameInput);
siteName.addEventListener('blur', showIconNameInput);
siteURL.addEventListener('input', showIconURLInput);
siteURL.addEventListener('blur', showIconURLInput);
function showIconNameInput() {
    if (nameValidation() && isNameUnique()) {
        siteName.classList.add('valid');
        siteName.classList.remove('invalid');
        siteName.style.borderColor = '#198754';
        siteName.style.boxShadow = '0 0 0 0.25rem rgba(25,135,84,.25)';
        name_validaiton.style.display = "none";
        name_unique_validation.style.display = "none";
    }
    else {
        siteName.classList.add('invalid');
        siteName.classList.remove('valid');
        siteName.style.borderColor = '#dc3545';
        siteName.style.boxShadow = '0 0 0 0.25rem rgba(220,53,69,.25)';
        if (!nameValidation()) {
            name_validaiton.style.display = "block";
            name_unique_validation.style.display = "none";
        }
        else if (!isNameUnique()) {
            name_unique_validation.style.display = "block";
            name_validaiton.style.display = "none";
        }
    }
}
function showIconURLInput() {
    if (urlValidation()) {
        siteURL.classList.add('valid');
        siteURL.classList.remove('invalid');
        siteURL.style.borderColor = '#198754';
        siteURL.style.boxShadow = '0 0 0 0.25rem rgba(25,135,84,.25)';
        url_validation.style.display = "none";
    }
    else {
        siteURL.classList.add('invalid');
        siteURL.classList.remove('valid');
        siteURL.style.borderColor = '#dc3545';
        siteURL.style.boxShadow = '0 0 0 0.25rem rgba(220,53,69,.25)';
        url_validation.style.display = "block";
    }
}
function clearIcon() {
    siteName.classList.remove('valid');
    siteName.style.borderColor = '#d99c39';
    siteName.style.boxShadow = '0 0 0 0.25rem #fec26055';
    siteURL.classList.remove('valid');
    siteURL.style.borderColor = '#d99c39';
    siteURL.style.boxShadow = '0 0 0 0.25rem #fec26055';
}
search.addEventListener('input', searchByName);
function searchByName() {
    var showResult = '';
    for (var i = 0; i < bookmarksList.length; i++) {
        var searchValue = search.value.trim().toLowerCase();
        if (bookmarksList[i].sName.toLowerCase().includes(searchValue)) {
            showResult += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${bookmarksList[i].sName.toLowerCase().replace(searchValue, `<span class="text-danger" style="background-color:yellow">${searchValue}</span>`)}</td>
                    <td><button class="btn btn-visit" id="btn-visit-${i}" onclick="visitBookmark(${i})"><span class="fa-solid fa-eye"></span> Visit</button>
                    </td>
                    <td><button class="btn btn-update" id="btn-update-${i}" onclick="updateBookmark(${i})"><span class="fa-solid fa-gear"></span> Update</button>
                    </td>
                    <td><button class="btn btn-delete" id="btn-delete-${i}" onclick="deleteBookmark(${i})"><span class="fa-solid fa-trash"></span> Delete</button>
                    </td>
                </tr>
                `;
        }
    }
    document.getElementById("tableBody").innerHTML = showResult;
}
function sweetAlert() {
    Swal.fire({
        icon: 'error',
        title: 'Site Name or Url is not valid',
        html: `
           <p>Please follow the rules below :</p>
        <div class="sweetAlert-rules">
        <p><span class="fa fa-arrow-right"></span> Site name must contain at least 3 characters</p>
        <p><span class="fa fa-arrow-right"></span> Site name must be unique</p>
        <p><span class="fa fa-arrow-right"></span> Site URL must be a valid one</p>
         </div>
        `,
    });
}
