var first = document.getElementById("first");
var second = document.getElementById("second");
var nick1 = document.getElementsByName("player1");
var nick2 = document.getElementsByName("player2");
var odd = document.getElementsByClassName("odd");
var even = document.getElementsByClassName("even");
var ok = document.getElementById("ok");
var classes = document.getElementsByClassName("move");
var moves = classes.length / 2;
var view2 = document.getElementById("view2");
var x;
var words = [];

function setNicks() {
    for (let i = 0; i < moves; i++) {
        even[i].innerHTML = nick2[0].value + ":";
        odd[i].innerHTML = nick1[0].value + ":";
    }
}

function deleteOpponent() {
    let letters = document.getElementsByName("letters");
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].parentElement.className == "move second") {
            letters[i].value = "-------";
        } else letters[i].value = "";
    }
}

function addMove() {
    let content = document.getElementById("moves");
    x = document.createElement("div");
    x.setAttribute("class", "move first");
    let span = document.createElement("span");
    span.setAttribute("class", "odd");
    span.innerHTML = odd[0].innerHTML;
    let br = document.createElement("br");
    let inp = document.createElement("input");
    inp.setAttribute("type", "text");
    inp.setAttribute("name", "letters");
    if (document.getElementsByName("letters")[0].value.indexOf("-") > -1) inp.value = "-------";
    let inp2 = document.createElement("input");
    inp2.setAttribute("type", "text");
    inp2.setAttribute("name", "coordinates");
    inp2.setAttribute("maxlength", "3");
    let inp3 = document.createElement("input");
    inp3.setAttribute("type", "text");
    inp3.setAttribute("name", "word");
    let inp4 = document.createElement("input");
    inp4.setAttribute("type", "number");
    inp4.setAttribute("name", "points");
    inp4.setAttribute("maxlength", "3");

    x.appendChild(span);
    x.appendChild(br);
    x.appendChild(inp);
    x.appendChild(inp2);
    x.appendChild(inp3);
    x.appendChild(inp4);
    content.appendChild(x);

    x = document.createElement("div");
    x.setAttribute("class", "move second");
    span = document.createElement("span");
    span.setAttribute("class", "even");
    span.innerHTML = even[0].innerHTML;
    br = document.createElement("br");
    inp = document.createElement("input");
    inp.setAttribute("type", "text");
    inp.setAttribute("name", "letters");
    if (document.getElementsByName("letters")[1].value.indexOf("-") > -1) inp.value = "-------";
    inp2 = document.createElement("input");
    inp2.setAttribute("type", "text");
    inp2.setAttribute("name", "coordinates");
    inp2.setAttribute("maxlength", "3");
    inp3 = document.createElement("input");
    inp3.setAttribute("type", "text");
    inp3.setAttribute("name", "word");
    inp4 = document.createElement("input");
    inp4.setAttribute("type", "number");
    inp4.setAttribute("name", "points");
    inp4.setAttribute("maxlength", "3");
    x.appendChild(span);
    x.appendChild(br);
    x.appendChild(inp);
    x.appendChild(inp2);
    x.appendChild(inp3);
    x.appendChild(inp4);
    content.appendChild(x);
    moves += 2;
    last.removeEventListener("click", addMove);
    last = x.lastChild;
    last.addEventListener("click", addMove);

}


var last = classes[moves * 2 - 1];
last.addEventListener("click", addMove);
first.addEventListener("click", setNicks);
first.addEventListener("click", deleteOpponent);
second.addEventListener("click", setNicks);
second.addEventListener("click", function () {
    let letters = document.getElementsByName("letters");
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].parentElement.className == "move first") {
            letters[i].value = "-------";
        } else letters[i].value = "";

    }
});
let opt1 = document.getElementById("completeGame");
let opt2 = document.getElementById("toCreate");

opt1.addEventListener("click", function () {
    let content = document.getElementById("view2");
    if (content.style.display == "block") content.style.display = "none";
    else content.style.display = "block";
    document.getElementById("view1").style.display = "none";
    opt1.style.display = "none";
    opt2.style.display = "none";
})
opt2.addEventListener("click", function () {
    let content = document.getElementById("view1");
    if (content.style.display == "block") content.style.display = "none";
    else content.style.display = "block";
    document.getElementById("view2").style.display = "none";
    opt1.style.display = "none";
    opt2.style.display = "none";
})
