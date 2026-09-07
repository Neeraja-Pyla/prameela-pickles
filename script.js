document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const WHATSAPP_NUMBER = "916301475493";
    const CART_STORAGE_KEY = "prameelaPicklesCart";

    let cart = loadCart();


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const cartOverlay = document.getElementById("cartOverlay");
    const cartDrawer = document.getElementById("cartDrawer");
    const closeCartButton = document.getElementById("closeCart");

    const cartItemsContainer = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");
    const cartTotal = document.getElementById("cartTotal");

    const mobileCartButton =
        document.getElementById("mobileCartButton");

    const mobileCartCount =
        document.getElementById("mobileCartCount");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileNav =
        document.getElementById("mobileNav");

    const contactForm =
        document.getElementById("contactForm");

    const whatsappOrderButton =
        document.getElementById("whatsappOrder");


    /* =========================================================
       CART STORAGE
    ========================================================= */

    function loadCart() {

        try {

            const savedCart =
                localStorage.getItem(CART_STORAGE_KEY);

            if (!savedCart) {
                return [];
            }

            const parsedCart =
                JSON.parse(savedCart);

            return Array.isArray(parsedCart)
                ? parsedCart
                : [];

        } catch (error) {

            console.error(
                "Unable to load cart:",
                error
            );

            return [];

        }

    }


    function saveCart() {

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Unable to save cart:",
                error
            );

        }

    }


    /* =========================================================
       CART HELPERS
    ========================================================= */

    function getCartCount() {

        return cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    }


    function getCartTotal() {

        return cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                ),
            0
        );

    }


    function formatPrice(price) {

        return `₹${Number(price).toLocaleString("en-IN")}`;

    }


    function findCartItem(name) {

        return cart.find(
            item => item.name === name
        );

    }


    /* =========================================================
       ADD NORMAL PRODUCT / COMBO
    ========================================================= */

    function addToCart(
        name,
        price,
        image = ""
    ) {

        const existingItem =
            findCartItem(name);


        if (existingItem) {

            existingItem.quantity += 1;

        } else {

            cart.push({

                name: name,

                price: Number(price),

                image: image,

                quantity: 1

            });

        }


        saveCart();

        updateCart();

        showToast(
            `${name} added to cart 🛒`
        );

    }


    /* =========================================================
       REMOVE FROM CART
    ========================================================= */

    function removeFromCart(name) {

        cart = cart.filter(
            item => item.name !== name
        );

        saveCart();

        updateCart();

        showToast(
            "Item removed from cart"
        );

    }


    /* =========================================================
       CHANGE QUANTITY
    ========================================================= */

    function changeQuantity(
        name,
        change
    ) {

        const item =
            findCartItem(name);


        if (!item) {
            return;
        }


        item.quantity += change;


        if (item.quantity <= 0) {

            removeFromCart(name);

            return;

        }


        saveCart();

        updateCart();

    }


    /* =========================================================
       UPDATE CART
    ========================================================= */

    function updateCart() {

        renderCartItems();

        updateCartCount();

        updateCartTotal();

    }


    function updateCartCount() {

        const count =
            getCartCount();


        document
            .querySelectorAll(
                "#cartCount, .cart-count"
            )
            .forEach(element => {

                element.textContent =
                    count;

            });


        if (mobileCartCount) {

            mobileCartCount.textContent =
                count;

        }

    }


    function updateCartTotal() {

        if (!cartTotal) {
            return;
        }


        cartTotal.textContent =
            formatPrice(
                getCartTotal()
            );

    }


    /* =========================================================
       RENDER CART
    ========================================================= */

    function renderCartItems() {

        if (!cartItemsContainer) {
            return;
        }


        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `

                <div class="cart-empty">

                    <div class="cart-empty-icon">
                        🫙
                    </div>

                    <h3>Your cart is empty</h3>

                    <p>
                        ముందుగా మీకు నచ్చిన
                        ఊరగాయను ఎంచుకోండి!
                    </p>

                    <button
                        type="button"
                        id="startShopping"
                        class="btn btn-primary"
                    >
                        Explore Pickles
                    </button>

                </div>

            `;


            if (cartFooter) {

                cartFooter.style.display =
                    "none";

            }


            const startShopping =
                document.getElementById(
                    "startShopping"
                );


            if (startShopping) {

                startShopping.addEventListener(
                    "click",
                    () => {

                        closeCart();

                        scrollToProducts();

                    }
                );

            }


            return;

        }


        if (cartFooter) {

            cartFooter.style.display = "";

        }


        cartItemsContainer.innerHTML =
            cart.map(item => {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                let discoveryDetails = "";


                if (
                    item.discoveryPickles &&
                    Array.isArray(
                        item.discoveryPickles
                    )
                ) {

                    discoveryDetails = `

                        <p class="cart-discovery-details">

                            ${item.discoveryPickles
                                .map(
                                    pickle =>
                                        escapeHTML(
                                            pickle
                                        )
                                )
                                .join(" • ")}

                            <br>

                            <small>
                                250g each • Total 1kg
                            </small>

                        </p>

                    `;

                }


                return `

                    <div
                        class="cart-item"
                        data-name="${escapeAttribute(item.name)}"
                    >

                        <div class="cart-item-image">

                            ${
                                item.image
                                ? `

                                    <img
                                        src="${escapeAttribute(item.image)}"
                                        alt="${escapeAttribute(item.name)}"
                                    >

                                  `
                                : `

                                    <div class="cart-item-placeholder">
                                        🫙
                                    </div>

                                  `
                            }

                        </div>


                        <div class="cart-item-details">

                            <h4>
                                ${escapeHTML(item.name)}
                            </h4>


                            ${discoveryDetails}


                            <p class="cart-item-price">
                                ${formatPrice(item.price)}
                            </p>


                            <div class="cart-item-bottom">

                                <div class="quantity-controls">

                                    <button
                                        type="button"
                                        class="quantity-btn decrease-quantity"
                                        data-name="${escapeAttribute(item.name)}"
                                    >
                                        −
                                    </button>


                                    <span class="quantity">
                                        ${item.quantity}
                                    </span>


                                    <button
                                        type="button"
                                        class="quantity-btn increase-quantity"
                                        data-name="${escapeAttribute(item.name)}"
                                    >
                                        +
                                    </button>

                                </div>


                                <strong class="cart-item-total">
                                    ${formatPrice(itemTotal)}
                                </strong>

                            </div>


                            <button
                                type="button"
                                class="remove-cart-item"
                                data-name="${escapeAttribute(item.name)}"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


        attachCartItemEvents();

    }


    /* =========================================================
       CART ITEM EVENTS
    ========================================================= */

    function attachCartItemEvents() {

        document
            .querySelectorAll(
                ".increase-quantity"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            button.dataset.name,
                            1
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                ".decrease-quantity"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            button.dataset.name,
                            -1
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                ".remove-cart-item"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            button.dataset.name
                        );

                    }
                );

            });

    }


    /* =========================================================
       OPEN CART
    ========================================================= */

    function openCart() {

        if (cartOverlay) {

            cartOverlay.classList.add(
                "active"
            );

        }


        if (cartDrawer) {

            cartDrawer.classList.add(
                "active"
            );

        }


        document.body.classList.add(
            "cart-open"
        );


        updateCart();

    }


    /* =========================================================
       CLOSE CART
    ========================================================= */

    function closeCart() {

        if (cartOverlay) {

            cartOverlay.classList.remove(
                "active"
            );

        }


        if (cartDrawer) {

            cartDrawer.classList.remove(
                "active"
            );

        }


        document.body.classList.remove(
            "cart-open"
        );

    }


    /* =========================================================
       CART BUTTONS
    ========================================================= */

    document
        .querySelectorAll(
            "#cartButton, .cart-button, [data-cart-open]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                openCart
            );

        });


    if (mobileCartButton) {

        mobileCartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (closeCartButton) {

        closeCartButton.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartDrawer) {

        cartDrawer.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );

    }


    /* =========================================================
       SCROLL TO PRODUCTS
    ========================================================= */

    function scrollToProducts() {

        const productsSection =
            document.getElementById(
                "pickles"
            );


        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =========================================================
       NORMAL PRODUCTS
    ========================================================= */

    document
        .querySelectorAll(
            ".add-cart"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const name =
                        button.dataset.name ||
                        "Pickle";


                    const price =
                        Number(
                            button.dataset.price
                        ) || 0;


                    const image =
                        button.dataset.image ||
                        "";


                    addToCart(
                        name,
                        price,
                        image
                    );


                    const originalText =
                        button.dataset.originalText ||
                        button.textContent.trim();


                    button.dataset.originalText =
                        originalText;


                    button.classList.add(
                        "added"
                    );


                    button.textContent =
                        "✓ Added";


                    setTimeout(
                        () => {

                            button.classList.remove(
                                "added"
                            );

                            button.textContent =
                                originalText;

                        },
                        1200
                    );

                }
            );

        });


    /* =========================================================
       NORMAL COMBOS
       
       IMPORTANT:
       Discovery Box does NOT use combo-order now.
    ========================================================= */

    document
        .querySelectorAll(
            ".combo-order[data-combo]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const comboName =
                        button.dataset.combo ||
                        "Combo Box";


                    const price =
                        Number(
                            button.dataset.price
                        ) || 0;


                    const image =
                        button.dataset.image ||
                        "images/combo-pack.jpg";


                    addToCart(
                        comboName,
                        price,
                        image
                    );


                    openCart();

                }
            );

        });


    /* =========================================================
       PICKLE DISCOVERY BOX
    ========================================================= */

    const discoveryOptions =
        document.querySelectorAll(
            ".discovery-option"
        );


    const discoveryCount =
        document.getElementById(
            "discoveryCount"
        );


    const discoverySelected =
        document.getElementById(
            "discoverySelected"
        );


    const addDiscoveryBox =
        document.getElementById(
            "addDiscoveryBox"
        );


    let selectedDiscoveryPickles = [];


    /* ---------------------------------------------------------
       SELECT PICKLES
    --------------------------------------------------------- */

    discoveryOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const pickleName =
                    option.dataset.discovery;


                if (
                    selectedDiscoveryPickles
                        .includes(pickleName)
                ) {

                    selectedDiscoveryPickles =
                        selectedDiscoveryPickles.filter(
                            name =>
                                name !== pickleName
                        );


                    option.classList.remove(
                        "selected"
                    );

                }

                else {

                    if (
                        selectedDiscoveryPickles.length >= 4
                    ) {

                        showToast(
                            "Please choose only 4 pickles."
                        );

                        return;

                    }


                    selectedDiscoveryPickles.push(
                        pickleName
                    );


                    option.classList.add(
                        "selected"
                    );

                }


                updateDiscoveryBuilder();

            }
        );

    });


    /* ---------------------------------------------------------
       UPDATE DISCOVERY BUILDER
    --------------------------------------------------------- */

    function updateDiscoveryBuilder() {

        const count =
            selectedDiscoveryPickles.length;


        if (discoveryCount) {

            discoveryCount.textContent =
                count;

        }


        if (count === 0) {

            if (discoverySelected) {

                discoverySelected.textContent =
                    "Select 4 pickles to build your box.";

                discoverySelected.classList.remove(
                    "ready"
                );

            }


            if (addDiscoveryBox) {

                addDiscoveryBox.disabled =
                    true;

                addDiscoveryBox.textContent =
                    "Choose 4 Pickles First";

            }


            return;

        }


        if (discoverySelected) {

            discoverySelected.textContent =
                selectedDiscoveryPickles.join(
                    " • "
                );

        }


        if (count === 4) {

            if (discoverySelected) {

                discoverySelected.classList.add(
                    "ready"
                );

            }


            if (addDiscoveryBox) {

                addDiscoveryBox.disabled =
                    false;

                addDiscoveryBox.textContent =
                    "Add Discovery Box — ₹399";

            }

        }

        else {

            if (discoverySelected) {

                discoverySelected.classList.remove(
                    "ready"
                );

            }


            if (addDiscoveryBox) {

                const remaining =
                    4 - count;


                addDiscoveryBox.disabled =
                    true;


                addDiscoveryBox.textContent =
                    `Choose ${remaining} More Pickle${
                        remaining > 1
                            ? "s"
                            : ""
                    }`;

            }

        }

    }


    /* ---------------------------------------------------------
       ADD DISCOVERY BOX
    --------------------------------------------------------- */

    if (addDiscoveryBox) {

        addDiscoveryBox.addEventListener(
            "click",
            () => {

                if (
                    selectedDiscoveryPickles.length !== 4
                ) {

                    showToast(
                        "Please select exactly 4 pickles."
                    );

                    return;

                }


                /*
                 * Sort the names to create a consistent ID.
                 *
                 * Example:
                 * Mango + Garlic + Lemon + Tomato
                 *
                 * is the same combination even if
                 * selected in another order.
                 */

                const sortedPickles =
                    [...selectedDiscoveryPickles]
                        .sort();


                const discoveryId =
                    "discovery-" +
                    sortedPickles
                        .map(
                            name =>
                                name
                                    .toLowerCase()
                                    .replace(
                                        /[^a-z0-9]+/g,
                                        "-"
                                    )
                        )
                        .join("-");


                /*
                 * IMPORTANT:
                 * The price is ALWAYS ₹399.
                 */

                const discoveryPrice =
                    399;


                /*
                 * Find same flavour combination.
                 */

                const existingItem =
                    cart.find(
                        item =>
                            item.id === discoveryId
                    );


                if (existingItem) {

                    existingItem.quantity += 1;

                }

                else {

                    cart.push({

                        id: discoveryId,

                        name:
                            "Pickle Discovery Box",

                        price:
                            discoveryPrice,

                        quantity:
                            1,

                        image:
                            "images/combo-pack.jpg",

                        discoveryPickles:
                            [...selectedDiscoveryPickles],

                        discoverySize:
                            "250g each",

                        discoveryTotal:
                            "1kg"

                    });

                }


                /*
                 * Save updated cart.
                 */

                saveCart();


                /*
                 * Update ₹399 × quantity
                 * and overall cart total.
                 */

                updateCart();


                showToast(
                    "Discovery Box added to cart! 🫙"
                );


                /*
                 * Reset selection.
                 */

                selectedDiscoveryPickles =
                    [];


                discoveryOptions.forEach(
                    option => {

                        option.classList.remove(
                            "selected"
                        );

                    }
                );


                updateDiscoveryBuilder();


                /*
                 * Open cart.
                 */

                openCart();

            }
        );

    }


    /* =========================================================
       PRODUCT FILTERS
    ========================================================= */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter ||
                    "all";


                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                productCards.forEach(card => {

                    const category =
                        card.dataset.category ||
                        "";


                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        card.classList.remove(
                            "hidden"
                        );

                    }

                    else {

                        card.classList.add(
                            "hidden"
                        );

                    }

                });

            }
        );

    });


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    if (
        mobileMenuButton &&
        mobileNav
    ) {

        mobileMenuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileNav.classList.contains(
                        "active"
                    );


                mobileNav.classList.toggle(
                    "active"
                );


                mobileMenuButton.classList.toggle(
                    "active"
                );


                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

            }
        );

    }


    document
        .querySelectorAll(
            ".mobile-nav a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (mobileNav) {

                        mobileNav.classList.remove(
                            "active"
                        );

                    }


                    if (mobileMenuButton) {

                        mobileMenuButton.classList.remove(
                            "active"
                        );


                        mobileMenuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        });


    /* =========================================================
       FAQ
    ========================================================= */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach(item => {

        const question =
            item.querySelector(
                ".faq-question"
            );


        if (!question) {
            return;
        }


        question.addEventListener(
            "click",
            () => {

                const wasActive =
                    item.classList.contains(
                        "active"
                    );


                faqItems.forEach(faq => {

                    faq.classList.remove(
                        "active"
                    );

                });


                if (!wasActive) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );

    });


    /* =========================================================
       WHATSAPP ORDER
    ========================================================= */

    if (whatsappOrderButton) {

        whatsappOrderButton.addEventListener(
            "click",
            sendWhatsAppOrder
        );

    }


    function sendWhatsAppOrder() {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty 🫙"
            );

            return;

        }


        let message =
            "Namaste Prameela Pickles! 🙏\n\n";


        message +=
            "I would like to order:\n\n";


        cart.forEach(
            (item, index) => {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                message +=
                    `${index + 1}. ${item.name}\n`;


                /*
                 * Discovery Box flavours
                 */

                if (
                    item.discoveryPickles &&
                    Array.isArray(
                        item.discoveryPickles
                    )
                ) {

                    message +=
                        `   Pickles: ${item.discoveryPickles.join(", ")}\n`;

                    message +=
                        "   Size: 250g each × 4 = 1kg\n";

                }


                message +=
                    `   Qty: ${item.quantity}\n`;


                message +=
                    `   Price: ${formatPrice(item.price)}\n`;


                message +=
                    `   Subtotal: ${formatPrice(itemTotal)}\n\n`;

            }
        );


        message +=
            `Total: ${formatPrice(
                getCartTotal()
            )}\n\n`;


        message +=
            "Please let me know the availability and delivery details. 😊\n";


        message +=
            "ధన్యవాదాలు! ❤️";


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                message
            )}`;


        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =========================================================
       CONTACT FORM
    ========================================================= */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "name"
                    );


                const phoneInput =
                    document.getElementById(
                        "phone"
                    );


                const messageInput =
                    document.getElementById(
                        "message"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";


                const message =
                    messageInput
                        ? messageInput.value.trim()
                        : "";


                if (
                    !name ||
                    !phone ||
                    !message
                ) {

                    showToast(
                        "Please fill in all details."
                    );

                    return;

                }


                let whatsappMessage =
                    "Namaste Prameela Pickles! 🙏\n\n";


                whatsappMessage +=
                    `Name: ${name}\n`;


                whatsappMessage +=
                    `Phone: ${phone}\n\n`;


                whatsappMessage +=
                    `Message:\n${message}\n\n`;


                whatsappMessage +=
                    "ధన్యవాదాలు! ❤️";


                const whatsappURL =
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        whatsappMessage
                    )}`;


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );


                contactForm.reset();


                showToast(
                    "Opening WhatsApp... 📲"
                );

            }
        );

    }


    /* =========================================================
       ESCAPE KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            closeCart();


            if (mobileNav) {

                mobileNav.classList.remove(
                    "active"
                );

            }


            if (mobileMenuButton) {

                mobileMenuButton.classList.remove(
                    "active"
                );


                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =========================================================
       IMAGE ERROR HANDLING
    ========================================================= */

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-load-error"
                    );

                    image.onerror = null;

                }
            );

        });


    /* =========================================================
       TOAST
    ========================================================= */

    let toastTimeout;


    function showToast(message) {

        let toast =
            document.getElementById(
                "siteToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "siteToast";


            toast.setAttribute(
                "role",
                "status"
            );


            toast.setAttribute(
                "aria-live",
                "polite"
            );


            Object.assign(
                toast.style,
                {
                    position: "fixed",
                    left: "50%",
                    bottom: "30px",
                    transform:
                        "translate(-50%, 20px)",
                    zIndex: "99999",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    background: "#54170e",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.18)",
                    opacity: "0",
                    transition:
                        "all 0.25s ease",
                    maxWidth:
                        "calc(100vw - 32px)",
                    textAlign: "center"
                }
            );


            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        clearTimeout(
            toastTimeout
        );


        requestAnimationFrame(
            () => {

                toast.style.opacity =
                    "1";

                toast.style.transform =
                    "translate(-50%, 0)";

            }
        );


        toastTimeout =
            setTimeout(
                () => {

                    toast.style.opacity =
                        "0";

                    toast.style.transform =
                        "translate(-50%, 20px)";

                },
                2200
            );

    }


    /* =========================================================
       HTML SAFETY
    ========================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }


    /* =========================================================
       SMOOTH ANCHOR SCROLL
    ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetID =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetID ||
                        targetID === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetID
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =========================================================
       INITIALIZE
    ========================================================= */

    updateDiscoveryBuilder();

    updateCart();


    console.log(
        "🌶️ Prameela Pickles website ready!"
    );

});