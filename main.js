console.log("main.js loaded");

document.getElementById('generate-btn').addEventListener('click', () => {
    console.log("Generate button clicked!");
    const numbersDiv = document.getElementById('numbers');
    const bonusNumberDiv = document.getElementById('bonus-number');

    numbersDiv.innerHTML = '';
    bonusNumberDiv.innerHTML = '';

    const lottoNumbers = generateLottoNumbers();
    const bonusNumber = lottoNumbers.pop();

    lottoNumbers.forEach(number => {
        const circle = document.createElement('div');
        circle.classList.add('number-circle');
        circle.textContent = number;
        numbersDiv.appendChild(circle);
    });

    const bonusCircle = document.createElement('div');
    bonusCircle.classList.add('bonus-circle');
    bonusCircle.textContent = bonusNumber;
    bonusNumberDiv.appendChild(bonusCircle);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}
