function placeButtons() {
    let btns = Array.from(document.querySelectorAll('.button-num'));
    
    btns.map( btn => {
        btn.style.gridArea = btn.getAttribute('data-key');
    });
}

placeButtons();