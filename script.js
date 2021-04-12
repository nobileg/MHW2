// Funzioni di caricamento dinamico dei contenuti
function showDetails(event) {
    const link = event.currentTarget;
    const details = link.parentNode.querySelector('p');
    
    details.classList.remove('hidden');
    link.textContent = 'Nascondi dettagli';
    link.removeEventListener('click', showDetails);
    link.addEventListener('click', hideDetails);
}

function hideDetails(event) {
    const link = event.currentTarget;
    const details = link.parentNode.querySelector('p');
    
    details.classList.add('hidden');
    link.textContent = 'Mostra dettagli';
    link.removeEventListener('click', hideDetails);
    link.addEventListener('click', showDetails);
}

function generateElement(product, typeOrder = false) {
    const article = document.createElement('article');
    const image = document.createElement('img');
    const title = document.createElement('h1');
    const orderImage = document.createElement('img');

    article.dataset.product = product.name.toLowerCase();
    image.src = product.image;
    title.textContent = product.name;
    orderImage.classList.add('icon', 'clickable');
    orderImage.dataset.product = product.name.toLowerCase();

    article.appendChild(image);
    article.appendChild(title);
    article.appendChild(orderImage);

    if(!typeOrder) {
        const content = document.createElement('p');
        const link = document.createElement('a');

        orderImage.src = 'img/order.png';
        orderImage.addEventListener('click', addOrder);
        content.innerHTML = product.content;
        content.classList.add('hidden');
        link.textContent = 'Mostra dettagli';
        link.addEventListener('click', showDetails);
        article.appendChild(content);
        article.appendChild(link);
        
        return article;
    }
    else {
        article.classList.add('hidden');
        orderImage.src = 'img/order_remove.png';
        orderImage.addEventListener('click', removeOrder);

        return article;
    }
}

// Funzioni di gestione ordini
function addOrder(event) {
    const image = event.currentTarget;
    const product = image.dataset.product;

    image.src = 'img/order_added.png';
    image.classList.remove('clickable');
    image.removeEventListener('click', addOrder);
    for(orderElement of orderElements) {
        if(orderElement.dataset.product === product) {
            orderElement.classList.remove('hidden');
            break;
        }
    }
    ordersCount++;
    if(ordersContainer.classList.contains('hidden')) {
        ordersContainer.classList.remove('hidden');
    }
}

function removeOrder(event) {
    const image = event.currentTarget;
    const product = image.dataset.product;
    const article = image.parentNode;
    
    article.classList.add('hidden');
    for(productElement of productElements) {
        if(productElement.dataset.product === product) {
            const image = productElement.querySelector('article .icon');
            image.src = 'img/order.png';
            image.classList.add('clickable');
            image.addEventListener('click', addOrder);
            break;
        }
    }
    ordersCount--;
    if(ordersCount <= 0) {
        ordersContainer.classList.add('hidden');
    }
}

// Funzione di ricerca
function searchProduct(event) {
    const text = event.currentTarget.value.toLowerCase();
    let hiddenCount = 0;
    
    if(text) {
        for(productElement of productElements) {
            if(productElement.dataset.product.search(text) === -1) {
                productElement.classList.add('hidden');
                hiddenCount++;
            }
            else {
                productElement.classList.remove('hidden');
            }
        }
    }
    else {
        for(productElement of productElements) {
            productElement.classList.remove('hidden');
        }
    }

    if(hiddenCount >= productElements.length) {
        noResults.classList.remove('hidden');
    }
    else {
        noResults.classList.add('hidden');
    }
}

// Main
const productsSection = document.querySelector('#products');
const ordersSection = document.querySelector('#orders');
for(product of products) {
    productsSection.appendChild(generateElement(product));
    ordersSection.appendChild(generateElement(product, true));
}

const productElements = document.querySelectorAll('#products article');
const orderElements = document.querySelectorAll('#orders article');

const ordersContainer = document.querySelector('#orders_container');
let ordersCount = 0;

const noResults = document.querySelector('#noresults');
const searchInput = document.querySelector('#section_header input');
searchInput.addEventListener('keyup', searchProduct);
