let rowData = $("#rowData");
let searchContainer = $('#searchContainer');

//side bar

let sidebar = $('.side-nav-menu');

function closeSidebar() {
    let boxWidth = $('.side-nav-menu .nav-tab').outerWidth();

    sidebar.css('left', -boxWidth);

    $('.open-close-icon').removeClass('fa-x').addClass('fa-align-justify');

    for (let i = 0; i < 5; i++) {
        $('.links ul li').eq(i).animate({
            top: '300px'
        }, (i + 5) * 100)
    }
}
closeSidebar();

function openSidebar() {
    sidebar.css('left', '0');

    $('.open-close-icon').removeClass('fa-align-justify').addClass('fa-x');

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

$('.nav-header > i').click(() => {

    if (sidebar.css('left') === '0px') {
        closeSidebar();
    } else {
        openSidebar();
    }
});

// display meals

function displayMeals(arr) {

    let showMeals = "";

    for (let i = 0; i < arr.length; i++) {
        showMeals +=
            `<div class="col-md-3">
            <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${arr[i].strMealThumb}" alt="meal pic" srcset="">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${arr[i].strMeal}</h3>
        </div>
    </div>
</div>`
    }

    rowData.html(showMeals);
}

async function searchByName(name) {

    $(".inner-loading-screen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let finalRes = await res.json();
    displayMeals(finalRes.meals);

    $(".inner-loading-screen").fadeOut(300)
}

// load screen
$(document).ready(() => {
    searchByName('').then(() => {
        $(".inner-loading-screen").fadeOut(300);
        $('.loading-screen').fadeOut(500, () => {
            $('body').css('overflow', 'visible');
        });
    });
});

async function searchByLetter(letter) {

    $(".inner-loading-screen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let finalRes = await res.json();
    displayMeals(finalRes.meals);

    $(".inner-loading-screen").fadeOut(300)
}

$('.links li:nth-child(1)').click(() => {
    closeSidebar();

    searchContainer.html(`
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`);

    rowData.html('');
})

function displayMealDetails(meal) {

    searchContainer.html('');

    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags ?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let showMealDetails = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.html(showMealDetails);
}

async function getMealDetails(ID) {
    closeSidebar();
    rowData.html('');
    $(".inner-loading-screen").fadeIn(300);

    searchContainer.html('');
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ID}`);
    finalRes = await res.json();

    displayMealDetails(finalRes.meals[0]);

    $(".inner-loading-screen").fadeOut(300);
}

// Categories

function displayCategories(arr) {

    let showMeals = '';

    for (let i = 0; i < arr.length; i++) {
        showMeals += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>`
    }

    rowData.html(showMeals);
}

async function getCategories() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let finalRes = await res.json();
    displayCategories(finalRes.categories);
}

$('.links li:nth-child(2)').click(() => {
    $(".inner-loading-screen").fadeIn(300)
    closeSidebar();
    searchContainer.html('');
    getCategories();

    $(".inner-loading-screen").fadeOut(300)
})

async function getCategoryMeals(category) {
    rowData.html('');
    $(".inner-loading-screen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    finalRes = await res.json()


    displayMeals(finalRes.meals.slice(0, 20))

    $(".inner-loading-screen").fadeOut(300)
}

// area

function displayArea(arr) {
    let showArea = "";

    for (let i = 0; i < arr.length; i++) {
        showArea += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }
    rowData.html(showArea);
}

async function getArea() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let finalRes = await res.json();

    displayArea(finalRes.meals)

}

$('.links li:nth-child(3)').click(() => {
    $(".inner-loading-screen").fadeIn(300)

    closeSidebar();
    searchContainer.html('');
    getArea();

    $(".inner-loading-screen").fadeOut(300)
})

async function getAreaMeals(area) {
    rowData.html('');
    $(".inner-loading-screen").fadeIn(300)

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    finalRes = await res.json();

    displayMeals(finalRes.meals.slice(0, 20))

    $(".inner-loading-screen").fadeOut(300)

}

// Ingredients

function displayIngredients(arr) {

    let showIngredients = "";

    for (let i = 0; i < arr.length; i++) {
        showIngredients += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.html(showIngredients);

}

async function getIngredients() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let finalRes = await res.json();
    displayIngredients(finalRes.meals.slice(0, 20))
}

$('.links li:nth-child(4)').click(() => {
    $(".inner-loading-screen").fadeIn(300);

    closeSidebar();
    searchContainer.html('');
    getIngredients();

    $(".inner-loading-screen").fadeOut(300);
})

async function getIngredientsMeals(ingredients) {
    rowData.html('');
    $(".inner-loading-screen").fadeIn(300);

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    finalRes = await res.json();

    displayMeals(finalRes.meals.slice(0, 20));

    $(".inner-loading-screen").fadeOut(300);
}

// contacts

// regex
function nameValidation() {
    return (/^[a-zA-Z ]+$/.test($("#nameInput").val()));
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()));
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()));
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val()));
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val()));
}

function repasswordValidation() {
    return ($("#repasswordInput").val() == $("#passwordInput").val());
}

function inputsValidation() {

    if (nameValidation()) {
        $('#nameAlert').removeClass('d-block').addClass('d-none');
    } else {
        $('#nameAlert').removeClass('d-none').addClass('d-block');
    }

    if (emailValidation()) {
        $('#emailAlert').removeClass('d-block').addClass('d-none');
    } else {
        $('#emailAlert').removeClass('d-none').addClass('d-block');
    }

    if (phoneValidation()) {
        $('#phoneAlert').removeClass('d-block').addClass('d-none');
    } else {
        $('#phoneAlert').removeClass('d-none').addClass('d-block');
    }

    if (ageValidation()) {
        $('#ageAlert').removeClass('d-block').addClass('d-none');
    } else {
        $('#ageAlert').removeClass('d-none').addClass('d-block');
    }

    if (passwordValidation()) {
        $('#passwordAlert').removeClass('d-block').addClass('d-none');
    } else {
        $('#passwordAlert').removeClass('d-none').addClass('d-block');
    }

    if (repasswordValidation()) {
        $('#repasswordAlert').removeClass('d-block').addClass('d-none');
    } else {
        $('#repasswordAlert').removeClass('d-none').addClass('d-block');
    }

    if (
        nameValidation() && emailValidation() && phoneValidation() &&
        ageValidation() && repasswordValidation() && passwordValidation()
    ) {
        $('#submitBtn').removeAttr('disabled');
    } else {
        $('#submitBtn').attr('disabled');
    }

}

$('.links li:nth-child(5)').click(() => {
    $(".inner-loading-screen").fadeIn(300)

    closeSidebar();
    searchContainer.html('');

    rowData.html(
        `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    );

    $(".inner-loading-screen").fadeOut(300);
});