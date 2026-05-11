const serviceBtn = document.querySelector(".service-btn");
const logoBtn = document.querySelector(".logo");
const addItems = document.querySelectorAll(".add-item-btn");
const totalCount = document.querySelector(".count-total");
const itemDetails = document.querySelector(".item-detail");
const noSelecteditem = document.querySelector(".no-selected-item")
const email = document.getElementById("email")
const form = document.querySelector("#myForm")
const username = document.querySelector("#name")
const success = document.querySelector(".success")
const bookNowbtn = document.getElementById("btn-book-now")
const list = document.querySelectorAll(".nav-btn-list")
const fieldset=document.querySelector(".fieldset")
// adding active class
list.forEach((item) => {
  item.addEventListener("click", () => {
    list.forEach(nav => nav.classList.remove("active"));
    item.classList.add("active")
  })
})

// smooth scroll service
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
  { id: 6, name: "wedding dress cleaning", price: 999.00 }
]
let cart = [];
// checking is form edited
fieldset.disabled = false
let isEdited = false
const fields = form.querySelectorAll("input")
if (cart.length === 0) {
  fields.forEach(field => {
    field.addEventListener("click", () => {
      isEdited = true
      fieldset.disabled = true
      onNoItem()
    })
  })
} else {
  fields.forEach(field => {
    field.addEventListener("click", () => {
      isEdited = false
      fieldset.disabled = false
      onNoItem()
    })
  })
}

isItemAdded();
onNoItem();
function isItemAdded() {
  if (cart.length === 0) {
    noSelecteditem.classList.remove("hidden");
    bookNowbtn.disabled = true
  } else {
    noSelecteditem.classList.add("hidden");
    bookNowbtn.disabled = false
  }
}

function onNoItem() {
  if (isEdited && cart.length === 0) {
    success.innerHTML = `<ion-icon name="alert-circle-outline"></ion-icon> Add the item to the cart to book`
    success.classList.add("noItem")
  } else {
    isEdited = false
    success.innerHTML = ""
  }
}



addItems.forEach((btn, id) => {
  btn.addEventListener("click", () => {
    const service = services[id];
    const exists = cart.find(item => item.id === service.id);
    if (!exists) {
      cart.push(service);
      btn.innerHTML = `
      <span>Remove Item</span><span><ion-icon name="remove-circle-outline"></ion-icon></span></span>
      `;
      btn.classList.remove("add-item")
      btn.classList.add("remove-item")
      success.innerHTML = ""
      fieldset.disabled = false
    } else {
      cart = cart.filter(item => item.id !== service.id);
      if (cart.length === 0) {
        success.innerHTML = `<ion-icon name="alert-circle-outline"></ion-icon> Add the item to the cart to book`
        success.classList.add("noItem")
      }
      btn.innerHTML = `
        <span>Add Item</span><span><ion-icon name="add-circle-outline"></ion-icon></span>
      `;
      btn.classList.remove("remove-item")
      btn.classList.add("add-item")

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
      success.innerHTML = `<ion-icon name="alert-circle-outline"></ion-icon> Email has been sent successfully ✅`
      success.classList.remove("noItem")
      success.classList.add("email-confirmation")
      form.reset();
    })
    .catch((error) => {
      alert("Failed to send ❌");
      console.log(error);
    });
})

