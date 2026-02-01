const serviceBtn = document.querySelector(".service-btn");
const logoBtn = document.querySelector(".logo");
const addItems = document.querySelectorAll(".add-item");
const totalCount = document.querySelector(".count-total");
const itemDetails = document.querySelector(".item-detail");
const noSelecteditem = document.querySelector(".no-selected-item")
const email = document.getElementById("email")
const form = document.querySelector("#myForm")
const username = document.querySelector("#name")
const emailConfirmation = document.querySelector(".email-confirmation")
const bookNowbtn = document.querySelector(".btn-book-now")
const noItem = document.querySelector(".noItem")
const fieldset = document.querySelector("fieldset")

serviceBtn.addEventListener("click", () => {
  document.getElementById("booking-service").scrollIntoView({
    behavior: "smooth"
  });
});
logoBtn.addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
});
let count = 0;
let total = 0;
let totalPrice = 0;
const services = [
  { name: "dry cleaning", price: 200.00, id: 1 },
  { name: "Wash & fold", price: 100, id: 2 },
  { id: 3, name: "Ironing", price: 30.00 },
  { id: 4, name: "stain removal", price: 50.00 },
  { id: 5, name: "leather & suede cleaning", price: 999.00 },
  { id: 6, name: "weather dress cleaning", price: 999.00 }
]
let cart = [];
bookNowbtn.disabled = true;
function isItemAdded() {
  if (cart.length === 0) {
    noSelecteditem.classList.remove("hidden");
    bookNowbtn.disabled = true;
    bookNowbtn.style.backgroundColor = "rgb(121, 110, 219)"
    fieldset.disabled = true;
  } else {
    noSelecteditem.classList.add("hidden");
    bookNowbtn.disabled = false;
    fieldset.disabled = false;
    bookNowbtn.style.backgroundColor = "rgb(62, 43, 235)"
  }
}

function onNoItem() {
  if (fieldset.disabled) {
    noItem.innerHTML = `<ion-icon name="alert-circle-outline"></ion-icon> Add the item to the cart to book`
  } else {
    noItem.innerHTML = ""
  }
}


addItems.forEach((btn, id) => {
  btn.addEventListener("click", () => {
    const service = services[id];
    const exists = cart.find(item => item.id === service.id);

    if (!exists) {
      cart.push(service);
      btn.style.backgroundColor = "#FFE6E6";
      btn.innerHTML = `Remove item
        <ion-icon name="remove-circle-outline"></ion-icon>`;
      btn.style.padding = "10px 20px";
    } else {
      cart = cart.filter(item => item.id !== service.id);
      btn.style.backgroundColor = "#f2f2f2";
      btn.style.padding = "10px 20px";
      btn.innerHTML = `
        Add-item
        <ion-icon name="add-circle-outline"></ion-icon>
      `;
    }
    isItemAdded()
    onNoItem()
    executeCart();
    totalPrice = calculateTotal();
  });
});

function calculateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalCount.textContent = `₹${total.toFixed(2)}`;
  return total
}

function executeCart() {
  itemDetails.innerHTML = "";
  cart.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${i + 1}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>
    `
    itemDetails.appendChild(tr);
  })
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const serviceDetails = cart
    .map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`)
    .join("\n");
  emailjs.send(
    "service_koszrg5",
    "template_9cfifcu",
    {
      name: username.value,
      customer_email: email.value,
      message: serviceDetails,
      total: totalPrice,
      order_id: "ORD-" + Date.now(),
    }
  )
    .then(() => {
      emailConfirmation.innerHTML = `<ion-icon name="alert-circle-outline"></ion-icon> Email has been sent successfully ✅`
      form.reset();
    })
    .catch((error) => {
      alert("Failed to send ❌");
      console.log(error);
    });
})

