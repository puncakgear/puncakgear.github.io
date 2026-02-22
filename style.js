// Konfigurasi Google Sheet
// Ganti URL di bawah ini dengan Link CSV dari Google Sheet Anda (File > Publish to Web > CSV)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4eGcZ7bKOdRRktktJFBL1tQ-ghBn9W2bK51EljyDDt0210zZ7DTHrmtN8EksD1l5gbR8PjSCHM0o-/pub?gid=0&single=true&output=csv';

let products = []; // Data akan diisi dari Google Sheet

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const bookingForm = document.getElementById('booking-form');
const notesTextarea = document.getElementById('notes');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Cart DOM Elements
const cartFab = document.getElementById('cart-fab');
const cartCounter = document.getElementById('cart-counter');
const cartModal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalEl = document.getElementById('cart-total');

// Product Modal DOM Elements
const productModal = document.getElementById('product-modal');
const closeProductModalBtn = document.getElementById('close-product-modal');
const modalProductImg = document.getElementById('modal-product-img');
const modalProductName = document.getElementById('modal-product-name');
const modalProductCategory = document.getElementById('modal-product-category');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductSpecs = document.getElementById('modal-product-specs');
const modalProductActions = document.getElementById('modal-product-actions');

// Format Mata Uang IDR
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// --- Fitur Keranjang Belanja ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Cart Core Functions ---
const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartState();
};

const changeQuantity = (productId, amount) => {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += amount;

    if (cartItem.quantity <= 0) {
        // Remove item from cart if quantity is 0 or less
        cart = cart.filter(item => item.id !== productId);
    }

    updateCartState();
};

// --- Cart Update & UI Functions ---
const updateCartState = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    updateCartModal();
    updateBookingNotes();
    updateAllProductActions();
    updateModalAction(); // Update tombol di dalam modal detail jika sedang terbuka
};

const updateCartIcon = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCounter.textContent = totalItems;
        cartFab.classList.remove('hidden');
    } else {
        cartFab.classList.add('hidden');
        cartModal.classList.remove('visible'); // Hide modal if cart becomes empty
    }
};

const updateCartModal = () => {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Keranjang Anda masih kosong.</p>';
        cartTotalEl.textContent = formatRupiah(0);
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        total += item.price * item.quantity;

        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${formatRupiah(item.price)} x ${item.quantity} = ${formatRupiah(item.price * item.quantity)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}" data-action="remove">&times;</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalEl.textContent = formatRupiah(total);
};

const updateBookingNotes = () => {
    if (cart.length > 0) {
        const bookingList = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
        notesTextarea.value = `Saya ingin menyewa: ${bookingList}.`;
    } else {
        notesTextarea.value = '';
    }
};

const updateAllProductActions = () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = parseInt(card.dataset.id);
        const actionContainer = card.querySelector('.card-actions-dynamic');
        if (!actionContainer) return;

        const product = products.find(p => p.id === productId);
        if (!product || !product.available) {
            actionContainer.innerHTML = '';
            return;
        }

        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            // Render quantity controller
            actionContainer.innerHTML = `
                <div class="card-quantity-control">
                    <button class="quantity-btn" data-id="${productId}" data-action="decrease-card">-</button>
                    <span class="quantity-display">${cartItem.quantity}</span>
                    <button class="quantity-btn" data-id="${productId}" data-action="increase-card">+</button>
                </div>
            `;
        } else {
            // Render "Sewa" button
            actionContainer.innerHTML = `
                <button class="btn-add-cart" data-id="${productId}" data-action="sewa">Sewa</button>
            `;
        }
    });
};

const updateModalAction = () => {
    if (!productModal.classList.contains('visible')) return;
    
    // Ambil ID produk yang sedang ditampilkan di modal (disimpan di dataset modal atau elemen di dalamnya)
    const productId = parseInt(productModal.dataset.activeId);
    if (!productId) return;

    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        modalProductActions.innerHTML = `
            <div class="card-quantity-control" style="justify-content: center; padding: 10px;">
                <button class="quantity-btn" data-id="${productId}" data-action="decrease-card" style="font-size: 1.5rem;">-</button>
                <span class="quantity-display" style="font-size: 1.2rem; margin: 0 15px;">${cartItem.quantity}</span>
                <button class="quantity-btn" data-id="${productId}" data-action="increase-card" style="font-size: 1.5rem;">+</button>
            </div>
        `;
    } else {
        modalProductActions.innerHTML = `
            <button class="btn btn-primary full-width" data-id="${productId}" data-action="sewa">Sewa Sekarang</button>
        `;
    }
};

const toggleCartModal = () => {
    cartModal.classList.toggle('visible');
};

// --- Render & Event Listeners ---
// Fungsi Render Produk
const renderProducts = (data) => {
    productGrid.innerHTML = ''; // Clear existing content

    if (data.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Produk tidak ditemukan.</p>';
        return;
    }

    data.forEach((product, index) => {
        const statusClass = product.available ? 'status-available' : 'status-unavailable';
        const statusText = product.available ? 'Tersedia' : 'Sedang Disewa';

        // Ubah label "Kapasitas" menjadi "Ukuran" jika kategori adalah sepatu atau baju
        let capacityLabel = 'Kapasitas';
        if (['sepatu', 'baju', 'jaket', 'pakaian'].includes(product.category)) {
            capacityLabel = 'Ukuran';
        }

        // Logika Diskon
        const isDiscounted = product.normalPrice > product.price;
        const discountPercentage = isDiscounted ? Math.round(((product.normalPrice - product.price) / product.normalPrice) * 100) : 0;

        const card = document.createElement('div');
        card.classList.add('product-card');
        card.dataset.id = product.id;
        card.style.cursor = 'pointer'; // Indikator bisa diklik
        card.style.animationDelay = `${index * 0.1}s`; // Efek muncul berurutan (stagger)
        
        card.innerHTML = `
            <div class="card-number ${isDiscounted ? 'pulse-animation' : ''}">${product.id}</div>
            ${isDiscounted ? `<div class="discount-badge">Diskon ${discountPercentage}%</div>` : ''}
            <img src="${product.image}" alt="${product.name}" class="card-image" loading="lazy">
            <div class="card-body">
                <div class="card-header">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="price-wrapper" style="text-align: right;">
                        ${isDiscounted ? `<span class="original-price">${formatRupiah(product.normalPrice)}</span>` : ''}
                        <span class="product-price">${formatRupiah(product.price)}/hari</span>
                    </div>
                </div>
                <ul class="specs-list">
                    ${product.specs.kapasitas && product.specs.kapasitas !== '-' ? `<li><span>${capacityLabel}:</span> <span>${product.specs.kapasitas}</span></li>` : ''}
                    ${product.specs.berat && product.specs.berat !== '-' ? `<li><span>Berat:</span> <span>${product.specs.berat}</span></li>` : ''}
                </ul>
                <div class="card-actions">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <div class="card-actions-dynamic"></div>
                </div>
            </div>
        `;
        
        productGrid.appendChild(card);
    });

    updateAllProductActions();
};

// --- AI Search Logic Helpers ---
const synonyms = {
    'tas': ['carrier', 'daypack', 'ransel', 'backpack', 'keril', 'bag'],
    'tenda': ['dome', 'kemah', 'camp', 'terpal', 'tent'],
    'masak': ['kompor', 'nesting', 'panci', 'cooking', 'bakar', 'gas', 'alat masak'],
    'pakaian': ['baju', 'jaket', 'celana', 'kaos', 'jersey', 'coat', 'jacket'],
    'gunung': ['hiking', 'trekking', 'outdoor'],
    'sepatu': ['shoes', 'boots', 'alas kaki']
};

// Algoritma Levenshtein Distance untuk mendeteksi Typo
const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[b.length][a.length];
};

const getFuzzyMatch = (text, term) => {
    // Cek match persis
    if (text.includes(term)) return true;
    
    // Cek match per kata (untuk typo)
    const words = text.split(' ');
    return words.some(word => {
        const dist = levenshtein(term, word);
        // Toleransi: 1 huruf salah untuk kata > 3 huruf, 2 huruf untuk kata > 5 huruf
        const allowed = word.length > 5 ? 2 : (word.length > 3 ? 1 : 0);
        return dist <= allowed;
    });
};

// Fungsi Filter
let activeCategory = 'all';

const filterProducts = () => {
    let searchTerm = searchInput.value.toLowerCase().trim();
    
    // 1. Perluasan Kata Kunci (Sinonim & Typo)
    let searchKeywords = [searchTerm];
    
    if (searchTerm.length > 2) {
        for (const [category, terms] of Object.entries(synonyms)) {
            const allTerms = [category, ...terms];
            // Jika input user mirip dengan salah satu sinonim (misal: "carier" mirip "carrier")
            if (allTerms.some(t => getFuzzyMatch(t, searchTerm))) {
                searchKeywords.push(category);
                searchKeywords.push(...terms);
            }
        }
    }
    
    // Hapus duplikat
    searchKeywords = [...new Set(searchKeywords)];

    const filtered = products.filter(product => {
        const matchCategory = activeCategory === 'all' || product.category === activeCategory;
        if (!matchCategory) return false;
        
        if (searchTerm === '') return true;

        // Gabungkan semua teks produk untuk dicari
        const productText = `${product.name} ${product.category} ${product.specs.bahan}`.toLowerCase();
        
        // Cek apakah ADA keyword yang cocok dengan teks produk (Fuzzy Match)
        return searchKeywords.some(keyword => getFuzzyMatch(productText, keyword));
    });

    // Sorting Logic
    const sortValue = sortSelect.value;
    if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    renderProducts(filtered);
};

// Event Listeners untuk Filter
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        btn.classList.add('active');
        
        activeCategory = btn.getAttribute('data-category');
        filterProducts();
    });
});

// Event Listener untuk Search
searchInput.addEventListener('input', filterProducts);

// Event Listener untuk Sort
sortSelect.addEventListener('change', filterProducts);

// Helper untuk memformat tanggal agar lebih mudah dibaca di WhatsApp
const formatDateForWA = (dateString) => {
    if (!dateString) return 'Belum diisi';
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
};

// Event Listener untuk Booking Form
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const notes = notesTextarea.value;

    // Ganti dengan nomor WhatsApp admin Anda (format internasional tanpa '+')
    const targetPhoneNumber = "6281927149299"; 

    const message = `Halo *Puncak Gear*,

Saya ingin mengajukan sewa dengan detail berikut:
-----------------------------------
*Nama:* ${name}
*No. WhatsApp:* ${phone}
*Tanggal Mulai:* ${formatDateForWA(startDate)}
*Tanggal Selesai:* ${formatDateForWA(endDate)}
-----------------------------------

*Barang yang disewa:*
${notes.replace('Saya ingin menyewa: ', '')}

Mohon konfirmasi ketersediaan dan total biayanya. Terima kasih!`;
    
    const whatsappURL = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(message)}`;

    // Buka link WhatsApp di tab baru
    window.open(whatsappURL, '_blank');
    
    // Reset form and cart after submission
    bookingForm.reset();
    cart = [];
    updateCartState();
});

// Global Event Listeners
// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    checkHashForReadme(); // Panggil ini duluan agar popup tetap muncul meski ada error di bawahnya
    fetchProducts(); // Panggil fungsi fetch data saat website dimuat
    updateCartState();
    
    const copyrightEl = document.getElementById('copyright-year');
    if (copyrightEl) {
        copyrightEl.textContent = new Date().getFullYear();
    }
});

// --- Google Sheet Fetch Logic ---
async function fetchProducts() {
    try {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Memuat data produk...</p>';
        
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        products = parseCSV(data);
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Gagal memuat data produk. Pastikan link CSV benar.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '')); // Bersihkan header
    
    return lines.slice(1).map(line => {
        // Regex untuk memisahkan koma tapi mengabaikan koma di dalam tanda kutip (misal: "Tas, Merah")
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.trim().replace(/^"|"$/g, ''));
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });

        // Normalisasi Kategori agar sesuai dengan filter (tas, tenda, masak, sepatu)
        let category = row.category ? row.category.toLowerCase().trim() : '';
        if (category.includes('tas') || category.includes('carrier')) category = 'tas';
        else if (category.includes('tenda')) category = 'tenda';
        else if (category.includes('masak')) category = 'masak';
        else if (category.includes('sepatu')) category = 'sepatu';
        else if (category.includes('baju') || category.includes('jaket') || category.includes('pakaian')) category = 'pakaian';

        // Mapping data CSV ke struktur object produk kita
        return {
            id: parseInt(row.id),
            name: row.name ? row.name.replace(/\b\w/g, l => l.toUpperCase()) : '',
            category: category,
            price: (row.price && row.price.trim() !== '' && row.price.trim() !== '-') ? parseInt(row.price) : parseInt(row.normalPrice),
            normalPrice: parseInt(row.normalPrice),
            image: row.image,
            specs: {
                bahan: row.bahan,
                kapasitas: row.kapasitas,
                berat: row.berat
            },
            available: row.available && row.available.trim().toLowerCase() === 'true'
        };
    });
}

cartFab.addEventListener('click', toggleCartModal);
closeModalBtn.addEventListener('click', toggleCartModal);

// --- Product Detail Modal Logic ---
const openProductModal = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Set data ke elemen modal
    productModal.dataset.activeId = id;
    modalProductImg.src = product.image;
    modalProductName.textContent = product.name;
    modalProductCategory.textContent = product.category;
    
    // Update tampilan harga di modal (support diskon)
    const isDiscounted = product.normalPrice > product.price;
    modalProductPrice.innerHTML = isDiscounted 
        ? `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-right: 10px;">${formatRupiah(product.normalPrice)}</span> ${formatRupiah(product.price)}/hari`
        : formatRupiah(product.price) + '/hari';
    
    // Logic label kapasitas/ukuran
    let capacityLabel = 'Kapasitas';
    if (['sepatu', 'baju', 'jaket', 'pakaian'].includes(product.category)) {
        capacityLabel = 'Ukuran';
    }
    
    // Render Spesifikasi (Termasuk Bahan yang dihapus di kartu)
    modalProductSpecs.innerHTML = `
        ${product.specs.bahan && product.specs.bahan !== '-' ? `<li><span>Bahan:</span> <span>${product.specs.bahan}</span></li>` : ''}
        ${product.specs.kapasitas && product.specs.kapasitas !== '-' ? `<li><span>${capacityLabel}:</span> <span>${product.specs.kapasitas}</span></li>` : ''}
        ${product.specs.berat && product.specs.berat !== '-' ? `<li><span>Berat:</span> <span>${product.specs.berat}</span></li>` : ''}
    `;

    updateModalAction();
    productModal.classList.add('visible');
};

closeProductModalBtn.addEventListener('click', () => {
    productModal.classList.remove('visible');
});

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('visible');
    }
});

// Event delegation for product card actions
productGrid.addEventListener('click', (e) => {
    const target = e.target;
    const action = target.dataset.action;
    const card = target.closest('.product-card');

    if (!card) return;
    const productId = parseInt(card.dataset.id);

    if (action) {
        // Jika yang diklik adalah tombol aksi
        switch (action) {
            case 'sewa': addToCart(productId); break;
            case 'increase-card': changeQuantity(productId, 1); break;
            case 'decrease-card': changeQuantity(productId, -1); break;
        }
    } else {
        // Jika yang diklik adalah kartu (bukan tombol), buka modal
        openProductModal(productId);
    }
});

// --- Terms & Conditions Modal ---
const termsData = {
    ktp: {
        title: "Kebijakan Identitas",
        desc: "Sebagai jaminan keamanan, penyewa wajib meninggalkan kartu identitas asli (KTP atau SIM C/A) yang masih berlaku selama masa penyewaan. Identitas akan disimpan dengan aman dan dikembalikan utuh saat pengembalian barang."
    },
    denda: {
        title: "Denda Keterlambatan",
        desc: "Keterlambatan pengembalian barang akan dikenakan denda sebesar harga sewa harian per item untuk setiap hari keterlambatan. Toleransi keterlambatan berlaku hingga jam operasional toko berakhir pada hari pengembalian. Mohon konfirmasi via WhatsApp jika ada kendala."
    },
    rusak: {
        title: "Kerusakan & Kehilangan",
        desc: "Penyewa bertanggung jawab penuh atas keutuhan alat. Kerusakan kecil dapat ditoleransi, namun kerusakan besar akan dikenakan biaya perbaikan. Jika barang hilang, penyewa wajib mengganti dengan harga yang sesuai."
    },
    full: {
        title: "Syarat & Ketentuan Lengkap",
        desc: "<strong>1. Kebijakan Identitas</strong><br>Sebagai jaminan keamanan, penyewa wajib meninggalkan kartu identitas asli (KTP, SIM C/A, atau KTM) yang masih berlaku selama masa penyewaan. Identitas akan disimpan dengan aman dan dikembalikan utuh saat pengembalian barang.<br><br><strong>2. Denda Keterlambatan</strong><br>Keterlambatan pengembalian barang akan dikenakan denda sebesar harga sewa harian per item untuk setiap hari keterlambatan. Toleransi keterlambatan berlaku hingga jam operasional toko berakhir pada hari pengembalian. Mohon konfirmasi via WhatsApp jika ada kendala.<br><br><strong>3. Kerusakan & Kehilangan</strong><br>Penyewa bertanggung jawab penuh atas keutuhan alat. Kerusakan kecil dapat ditoleransi, namun kerusakan besar akan dikenakan biaya perbaikan. Jika barang hilang, penyewa wajib mengganti dengan harga yang sesuai."
    }
};

const termsModal = document.getElementById('terms-modal');
const termLinks = document.querySelectorAll('.term-link');
const termTitle = document.getElementById('term-title');
const termDesc = document.getElementById('term-description');
const closeTermsBtn = document.getElementById('close-terms-btn');
const fullTermsLink = document.getElementById('full-terms-link');

termLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.dataset.id;
        if (termsData[id]) {
            termTitle.textContent = termsData[id].title;
            termDesc.innerHTML = termsData[id].desc;
            termsModal.classList.add('visible');
        }
    });
});

if (fullTermsLink) {
    fullTermsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termTitle.textContent = termsData.full.title;
        termDesc.innerHTML = termsData.full.desc;
        termsModal.classList.add('visible');
    });
}

if (closeTermsBtn) {
    closeTermsBtn.addEventListener('click', () => {
        termsModal.classList.remove('visible');
    });
}

if (termsModal) {
    termsModal.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            termsModal.classList.remove('visible');
        }
    });
}

// --- Scroll Spy ---
const navLinksForScroll = document.querySelectorAll('.nav-links a');
const sectionsForScroll = document.querySelectorAll('header[id], section[id]');
const navbar = document.querySelector('.navbar');
const navIndicator = document.querySelector('.nav-indicator');

function moveIndicator(element) {
    if (!element || !navIndicator) return;
    const parent = element.parentElement;
    navIndicator.style.width = `${parent.offsetWidth}px`;
    navIndicator.style.left = `${parent.offsetLeft}px`;
}

function scrollSpy() {
    const scrollPosition = window.scrollY;

    sectionsForScroll.forEach(section => {
        // Adjust section top based on navbar height to trigger at the right time
        const sectionTop = section.offsetTop - navbar.offsetHeight - 50;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinksForScroll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                    moveIndicator(link);
                }
            });
        }
    });
}

window.addEventListener('scroll', scrollSpy);


// Event delegation for modal actions (increase, decrease, remove)
cartItemsContainer.addEventListener('click', (e) => {
    handleCartAction(e);
});

// Event delegation for product modal actions
modalProductActions.addEventListener('click', (e) => {
    handleCartAction(e);
});

function handleCartAction(e) {
    const target = e.target;
    const action = target.dataset.action;
    const id = parseInt(target.dataset.id);

    if (!action || !id) return;

    switch (action) {
        case 'increase':
        case 'increase-card': // Handle tombol di dalam modal detail
            changeQuantity(id, 1);
            break;
        case 'decrease':
        case 'decrease-card': // Handle tombol di dalam modal detail
            changeQuantity(id, -1);
            break;
        case 'remove':
            cart = cart.filter(item => item.id !== id);
            updateCartState();
            break;
        case 'sewa': // Handle tombol sewa di dalam modal detail
            addToCart(id);
            break;
    }
}

// --- Readme Popup Logic ---
const checkHashForReadme = async () => {
    if (window.location.hash.toLowerCase() === '#readme') {
        let readmeModal = document.getElementById('readme-modal');
        
        if (!readmeModal) {
            // Buat modal secara dinamis
            readmeModal = document.createElement('div');
            readmeModal.id = 'readme-modal';
            readmeModal.className = 'cart-modal visible'; // Reuse style modal yang ada
            readmeModal.style.zIndex = '9999';
            
            readmeModal.innerHTML = `
                <div class="modal-content" style="width: 90%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column;">
                    <div class="modal-header">
                        <h2 style="margin:0;">README.md</h2>
                        <button class="close-modal-btn" id="close-readme-btn">&times;</button>
                    </div>
                    <div class="modal-body" style="overflow-y: auto; padding: 1rem; background: #f9f9f9; border-radius: 4px;">
                        <pre id="readme-text" style="white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; color: #333;"></pre>
                    </div>
                </div>
            `;
            document.body.appendChild(readmeModal);

            const closeBtn = readmeModal.querySelector('#close-readme-btn');
            const removeModal = () => {
                readmeModal.remove();
                // Hapus hash agar bersih
                history.pushState("", document.title, window.location.pathname + window.location.search);
            };
            
            closeBtn.addEventListener('click', removeModal);
            readmeModal.addEventListener('click', (e) => {
                if (e.target === readmeModal) removeModal();
            });

            try {
                const res = await fetch('README.md');
                const text = res.ok ? await res.text() : 'File README.md tidak ditemukan.';
                document.getElementById('readme-text').textContent = text;
            } catch (e) {
                document.getElementById('readme-text').textContent = 'Gagal memuat README.md';
            }
        }
    }
};

window.addEventListener('hashchange', checkHashForReadme);
