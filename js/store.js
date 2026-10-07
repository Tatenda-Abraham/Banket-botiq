/*
  EDIT YOUR CATALOGUE HERE:
  - Add or remove product objects in the products list.
  - Put photos in the images folder, then set image to e.g. "images/zim_dress1.jpg".
  - Change each product's name, category, price, and availability.
  - Change currency below if needed (examples: "USD", "BWP", "ZAR").
*/
const currency = "USD";
const contactDetails = {
  address: "Shop no2, Bevetech Building, Kuwadzana Township Banket"
};

const products = [
  {
    name: "The Sunday Floral Dress",
    category: "Dresses",
    price: 13,
    availability: "Available",
    image: "images/dress1.jpeg"
  },
  {
    name: "The Sunday Floral Dress",
    category: "Dresses",
    price: 13,
    availability: "Available",
    image: "images/dress2.jpeg"
  },
  {
    name: "Tailored Utility Cargo Trousers",
    category: "Trousers",
    price: 13,
    availability: "Available",
    image: "images/cargo.jpeg"
  },
  {
    name: "Urban Fleece Tracksuit Set",
    category: "Knitwear",
    price: 28,
    availability: "Available",
    image: "images/tracksuit.jpeg"
  },
  {
    name: "Classic AirMax Sneakers",
    category: "Shoes",
    price: 22,
    availability: "Available",
    image: "images/Airmax2.jpeg"
  },
  {
    name: "Dress",
    category: "Dresses",
    price: 7,
    availability: "Available",
    image: "images/zim_acc.jpg"
  },
  {
    name: "Linen Wrap Summer Dress",
    category: "Dresses",
    price: 12,
    availability: "Available",
    image: "images/zim_dress1.jpg"
  },
  {
    name: "Formal Trousers",
    category: "Trousers",
    price: 10,
    availability: "Available",
    image: "images/formal.jpeg"
  },
  {
    name: "T-Shirt",
    category: "Knitwear",
    price: 8,
    availability: "Available",
    image: "images/tshirt.jpeg"
  },
  {
    name: "Retro Athletic Sneakers",
    category: "Shoes",
    price: 25,
    availability: "Out of stock",
    image: "images/retro.jpeg"
  },
  {
    name: "Boho Chiffon Maxi Dress",
    category: "Dresses",
    price: 12,
    availability: "Available",
    image: "images/chiffond2.jpeg"
  },
  {
    name: "Boutique Leather Belt & Accessories",
    category: "Accessories",
    price: 6,
    availability: "Available",
    image: "images/belts.jpeg"
  }
];

const placeholderImage = "images/Airmax2.jpeg";
const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#productSearch");
const categorySelect = document.querySelector("#categoryFilter");
const categoryPillsContainer = document.querySelector("#categoryPills");
const productModal = document.querySelector("#productModal");
const modalContent = document.querySelector("#modalContent");

const formatPrice = (price) => new Intl.NumberFormat(undefined, {
  style: "currency",
  currency,
  maximumFractionDigits: 2
}).format(Number(price));

function renderCategories() {
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  categorySelect.innerHTML = '<option value="All">All pieces</option>';

  if (categoryPillsContainer) {
    categoryPillsContainer.replaceChildren();

    const createPill = (name, value) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `category-pill ${value === categorySelect.value ? "is-active" : ""}`;
      btn.textContent = name;
      btn.dataset.category = value;
      btn.addEventListener("click", () => {
        categorySelect.value = value;
        updatePillStates();
        renderProducts();
      });
      return btn;
    };

    categoryPillsContainer.append(createPill("All pieces", "All"));

    categories.forEach((category) => {
      categoryPillsContainer.append(createPill(category, category));
    });
  }

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
}

function updatePillStates() {
  if (!categoryPillsContainer) return;
  const currentCategory = categorySelect.value;
  categoryPillsContainer.querySelectorAll(".category-pill").forEach((pill) => {
    if (pill.dataset.category === currentCategory) {
      pill.classList.add("is-active");
    } else {
      pill.classList.remove("is-active");
    }
  });
}

function makeProductCard(product, index) {
  const card = document.createElement("article");
  card.className = "product-card";

  const openButton = document.createElement("button");
  openButton.className = "product-card-button";
  openButton.type = "button";
  openButton.setAttribute("aria-label", `View ${product.name} details`);
  openButton.addEventListener("click", () => openProduct(product));

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap live-photo-container";
  const image = document.createElement("img");
  image.src = product.image || placeholderImage;
  image.alt = product.name;
  image.className = "live-photo";
  image.loading = "lazy";
  image.onerror = () => {
    image.onerror = null;
    image.src = placeholderImage;
  };
  imageWrap.append(image);

  const number = document.createElement("span");
  number.className = "product-number";
  number.textContent = String(index + 1).padStart(2, "0");
  imageWrap.append(number);

  const quickViewBadge = document.createElement("span");
  quickViewBadge.className = "quick-view-badge";
  quickViewBadge.textContent = "Quick View ↗";
  imageWrap.append(quickViewBadge);

  const details = document.createElement("div");
  details.className = "product-details";
  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category || "Fashion";
  const name = document.createElement("h3");
  name.textContent = product.name;
  const footer = document.createElement("div");
  footer.className = "product-footer";
  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);
  const availability = document.createElement("span");
  const available = product.availability !== "Out of stock";
  availability.className = `availability ${available ? "is-available" : "is-unavailable"}`;
  availability.textContent = available ? "Available" : "Out of stock";
  footer.append(price, availability);
  details.append(category, name, footer);
  openButton.append(imageWrap, details);
  card.append(openButton);
  return card;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(query);
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  productGrid.replaceChildren();
  if (!filteredProducts.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = products.length ? "No pieces match your search." : "Our collection is being updated. Please check back soon.";
    productGrid.append(emptyMessage);
    return;
  }

  filteredProducts.forEach((product, index) => {
    productGrid.append(makeProductCard(product, index));
  });
}

function openProduct(product) {
  modalContent.replaceChildren();

  const image = document.createElement("img");
  image.className = "modal-image live-photo";
  image.src = product.image || placeholderImage;
  image.alt = product.name;
  image.onerror = () => {
    image.onerror = null;
    image.src = placeholderImage;
  };

  const info = document.createElement("div");
  info.className = "modal-info";
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = product.category || "Fashion";
  const name = document.createElement("h2");
  name.id = "modalProductName";
  name.textContent = product.name;
  const price = document.createElement("p");
  price.className = "modal-price";
  price.textContent = formatPrice(product.price);
  
  const availability = document.createElement("p");
  const available = product.availability !== "Out of stock";
  availability.className = `modal-availability ${available ? "is-available" : "is-unavailable"}`;
  availability.textContent = available ? "● Currently Available in Store" : "○ Currently Out of Stock";
  
  const note = document.createElement("p");
  note.className = "modal-note";
  note.textContent = `Visit our boutique at ${contactDetails.address} to view and purchase this piece.`;
  
  const contactLink = document.createElement("a");
  contactLink.className = "button button-primary";
  contactLink.href = "#contact";
  contactLink.textContent = "View Our Address";
  contactLink.addEventListener("click", closeProduct);

  info.append(category, name, price, availability, note, contactLink);
  modalContent.append(image, info);
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  productModal.querySelector(".modal-close").focus();
}

function closeProduct() {
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function setContactLinks() {
  const addressElement = document.querySelector("[data-contact-address]");
  if (addressElement && contactDetails.address) {
    addressElement.innerHTML = `<strong>We are available at this address:</strong><br>${contactDetails.address}`;
  }
}

document.querySelector(".nav-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const nav = document.querySelector("#mainNav");
  const isOpen = nav.classList.toggle("is-open");
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll("#mainNav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#mainNav").classList.remove("is-open");
    document.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
    document.querySelector(".nav-toggle").setAttribute("aria-label", "Open navigation");
  });
});

searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", () => {
  updatePillStates();
  renderProducts();
});
productModal.querySelector(".modal-close").addEventListener("click", closeProduct);
productModal.querySelector("[data-close-modal]").addEventListener("click", closeProduct);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal.classList.contains("is-open")) closeProduct();
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();
renderCategories();
renderProducts();
setContactLinks();
