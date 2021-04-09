let leftBtn = document.getElementById("left-btn");
let rightBtn = document.getElementById("right-btn");

leftBtn.addEventListener('click', () => {
    let invisLeft = document.getElementById("invisible-left");
    let card1 = document.getElementById("img1");
    let card2 = document.getElementById("img2");
    let card3 = document.getElementById("img3");
    let invisRight = document.getElementById("invisible-right");

    invisLeft.setAttribute("id", "invisible-right");
    card1.setAttribute("id", "invisible-left");
    card2.setAttribute("id", "img1");
    card3.setAttribute("id", "img2");
    invisRight.setAttribute("id", "img3");
});

rightBtn.addEventListener('click', () => {
    let invisLeft = document.getElementById("invisible-left");
    let card1 = document.getElementById("img1");
    let card2 = document.getElementById("img2");
    let card3 = document.getElementById("img3");
    let invisRight = document.getElementById("invisible-right");

    invisLeft.setAttribute("id", "img1");
    card1.setAttribute("id", "img2");
    card2.setAttribute("id", "img3");
    card3.setAttribute("id", "invisible-right");
    invisRight.setAttribute("id", "invisible-left");
});