const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.sold)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const payButton = document.createElement("button");
payButton.innerText = "Pay Now";
payButton.style.marginTop = "10px";
document.body.appendChild(payButton);

let ticketPrice = +movieSelect.value;

function getMovieKey() {
    return `selectedSeats_${movieSelect.value}`;
}

function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem("selectedMovieIndex", movieIndex);
    localStorage.setItem("selectedMoviePrice", moviePrice);
}

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
    localStorage.setItem(getMovieKey(), JSON.stringify(seatsIndex));
    
    count.innerText = selectedSeats.length;
    total.innerText = selectedSeats.length * ticketPrice;
}

function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem(getMovieKey())) || [];
    
    seats.forEach((seat, index) => {
        seat.classList.remove("selected");
        seat.classList.remove("sold");
        if (selectedSeats.includes(index)) {
            seat.classList.add("sold");
        }
    });
}

movieSelect.addEventListener("change", (e) => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    populateUI();
    updateSelectedCount();
});

container.addEventListener("click", (e) => {
    if (e.target.classList.contains("seat") && !e.target.classList.contains("sold")) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});

payButton.addEventListener("click", () => {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    if (selectedSeats.length === 0) {
        alert("Please select a seat before paying.");
        return;
    }
    
    if (confirm("Confirm your payment?")) {
        selectedSeats.forEach(seat => seat.classList.replace("selected", "sold"));
        localStorage.setItem(getMovieKey(), JSON.stringify([...document.querySelectorAll(".row .seat.sold")].map(seat => [...seats].indexOf(seat))));
        updateSelectedCount();
        alert("Payment successful! Your seats are now booked.");
    }
});

populateUI();
updateSelectedCount();