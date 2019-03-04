
let active = false, startX, startY, actualDiv, ctualDivStartX, actualDivStartY, actualDivStartOrder;
// const place = 600/7;
let place = 75;
if(window.innerWidth <= 720) {
place = 50;
}
const convertOrderToInt = (order) => {
    return parseInt(order.replace('px', ''));
}

const dragLetter =  (e) => {
    if(active){
        if(!actualDivStartX) actualDivStartX = 0;
        if(!actualDivStartY) actualDivStartY = 0;
        actualDiv.style.left =`${e.clientX-startX + actualDivStartX - (convertOrderToInt(actualDiv.style.order)-actualDivStartOrder)*place}px`;
        actualDiv.style.top =`${e.clientY-startY + actualDivStartY}px`;
        reorganizeTiles(actualDiv, e.clientX-startX + parseInt(actualDivStartX));
    }
}

const touchDragLetter =  (e) => {
    if(active){
        if(!actualDivStartX) actualDivStartX = 0;
        if(!actualDivStartY) actualDivStartY = 0;
        actualDiv.style.left =`${e.touches[0].clientX-startX + actualDivStartX - (convertOrderToInt(actualDiv.style.order)-actualDivStartOrder)*place}px`;
        actualDiv.style.top =`${e.touches[0].clientY-startY + actualDivStartY}px`;
        reorganizeTiles(actualDiv, e.touches[0].clientX-startX + parseInt(actualDivStartX));
    }
}

const reorganizeTiles = (tile, distance) => {
    let actualOrder = convertOrderToInt(tile.style.order);
    let orderIndex = actualDivStartOrder + Math.round((distance)/place);
    if (orderIndex>=document.querySelectorAll('.actual li').length || orderIndex<0) return;
    if(orderIndex !== actualOrder) {
        tile.style.order = orderIndex;
        [...document.querySelectorAll('.actual li')].forEach(e => {
        if (parseInt(e.style.order) === orderIndex && e!==tile) 
            e.style.order = actualOrder;
    });
    actualDiv.style.left = 0;
    }
}

const activateLetter = (e) => {

    if(e.target.classList.contains('old')) return;
    active = true;
    startX = e.clientX;
    startY = e.clientY;
    actualDiv = e.target;
    actualDivStartX = convertOrderToInt(e.target.style.left);
    actualDivStartY = convertOrderToInt(e.target.style.top);
    actualDivStartOrder = convertOrderToInt(e.target.style.order);      
    e.target.style.zIndex='100';
}

const touchActivateLetter = (e) => {

    if(e.target.classList.contains('old')) return;
    active = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    actualDiv = e.target;
    actualDivStartX = convertOrderToInt(e.target.style.left);
    actualDivStartY = convertOrderToInt(e.target.style.top);
    actualDivStartOrder = convertOrderToInt(e.target.style.order);      
    e.target.style.zIndex='100';
}

const dropLetter = (e) => {
    active = false;
    e.target.style.top = "0";
    e.target.style.left ="0";
    [...document.querySelectorAll('.actual li')].forEach(letter => letter.style.zIndex = 1);
}

// [...letters].forEach((div) => {
//      div.addEventListener('mousedown', activateLetter);
//      div.addEventListener('mouseup', dropLetter);
// });   
document.addEventListener('mousemove', dragLetter);
document.addEventListener('touchmove', touchDragLetter);
