const rackActual = document.querySelector(".rack.actual ul");
let active = false, startX, startY, actualDiv, ctualDivStartX, actualDivStartY, actualDivStartOrder;
let place = 75;


const changeTilePlace = () => {
    if(window.innerWidth <= 720)
       place = 50;
    else
       place = 75;
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
    const actualOrder = convertOrderToInt(tile.style.order);
    const orderIndex = actualDivStartOrder + Math.round((distance)/place);
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

const setStartValueForActiveLetter = (letter, x, y) => {
    active = true;
    startX = x;
    startY = y;
    actualDiv = letter;
    actualDivStartX = convertOrderToInt(letter.style.left);
    actualDivStartY = convertOrderToInt(letter.style.top);
    actualDivStartOrder = convertOrderToInt(letter.style.order);      
    letter.style.zIndex='100';
}

const activateLetter = (e) => {
    if(e.target.classList.contains('old')) return;
    setStartValueForActiveLetter(e.target, e.clientX, e.clientY);
}

const touchActivateLetter = (e) => {
    if(e.target.classList.contains('old')) return;
    setStartValueForActiveLetter(e.target, e.touches[0].clientX, e.touches[0].clientY);
}

const dropLetter = (e) => {
    active = false;
    e.target.style.top = "0";
    e.target.style.left = "0";
    [...document.querySelectorAll('.actual li')].forEach(letter => letter.style.zIndex = 1);
}
changeTilePlace(); 
document.addEventListener('mousemove', dragLetter);
document.addEventListener('touchmove', touchDragLetter);
window.addEventListener('resize', changeTilePlace);

rackActual.addEventListener('mousedown', e => {
    if(e.target.nodeName === 'LI')
      activateLetter(e);
});
rackActual.addEventListener('touchstart', e => {
    if(e.target.nodeName === 'LI')
    touchActivateLetter(e);
});
rackActual.addEventListener('mouseup', e => {
    if(e.target.nodeName === 'LI')
    dropLetter(e);
});
rackActual.addEventListener('touchend', e => {
    if(e.target.nodeName === 'LI')
    dropLetter(e);
});

