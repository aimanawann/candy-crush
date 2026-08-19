document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    let score = 0;

    const candyImages = [
        'images/red-candy.png',
        'images/yellow-candy.png',
        'images/green-candy.png',
        'images/blue-candy.png',
        'images/purple-candy.png',
        'images/orange-candy.png'
    ];

    // Create the 8x8 Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('img');
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            let randomCandy = candyImages[Math.floor(Math.random() * candyImages.length)];
            square.setAttribute('src', randomCandy);
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // Dragging Logic
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));

    function dragStart() {
        colorBeingDragged = this.getAttribute('src');
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) { e.preventDefault(); }
    function dragEnter(e) { e.preventDefault(); }

    function dragDrop() {
        colorBeingReplaced = this.getAttribute('src');
        squareIdBeingReplaced = parseInt(this.id);
        this.src = colorBeingDragged;
        squares[squareIdBeingDragged].src = colorBeingReplaced;
    }

    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].src = colorBeingReplaced;
            squares[squareIdBeingDragged].src = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].src = colorBeingDragged;
        }
    }

    // Check Row of Three
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].src;
            const isBlank = squares[i].src === '';

            let notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notValid.includes(i)) continue;

            if (rowOfThree.every(index => squares[index].src === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach(index => { squares[index].src = ''; });
            }
        }
    }

    // Check Column of Three
    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].src;
            const isBlank = squares[i].src === '';

            if (columnOfThree.every(index => squares[index].src === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach(index => { squares[index].src = ''; });
            }
        }
    }

    // Drop Candies Down & Fill Blank Spaces
    function moveDown() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].src === '') {
                squares[i + width].src = squares[i].src;
                squares[i].src = '';
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].src === '') {
                    let randomCandy = candyImages[Math.floor(Math.random() * candyImages.length)];
                    squares[i].src = randomCandy;
                }
            }
        }
    }

    // Game Loop
    window.setInterval(function () {
        moveDown();
        checkRowForThree();
        checkColumnForThree();
    }, 100);
});