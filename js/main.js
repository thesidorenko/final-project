/*
    PRELOADER
*/

document.body.classList.add('loaded_hiding');

setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
}, 5000);

/*
    HAMBURGER MENU
*/

let menuBtn = document.querySelector('.menu-btn');
let nav = document.querySelector('.navigation__inner');

menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
});

/*
    PROGRESS BAR
*/

document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.querySelector('.progress-bar');

    window.addEventListener('scroll', function () {
        let h = document.documentElement;

        let st = h.scrollTop || document.body.scrollTop;
        let sh = h.scrollHeight || document.body.scrollHeight;

        let percent = st / (sh - h.clientHeight) * 100;

        progressBar.style.width = percent + '%';
    });
});

/*
    CHANGE THEME
*/

const btn = document.querySelector('.btn-toggle-theme');
const nowHour = new Date().getHours();

if (nowHour >= 21 || nowHour < 6) {
    document.body.classList.add('dark-theme');
}

btn.addEventListener("click", function () {
    document.body.classList.toggle('dark-theme');
});

/*
    SLIDER
*/

$('.slider').slick({});

/*
    WINDOW CLOSE FEATURE
*/

function initAlert () {
    let timeout;

    function checkActivity () {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            if (!confirm('Ви ще тут?')) {
                window.close();
            }
        }, 60 * 1000); // 1 min
    }

    document.addEventListener('mousemove', checkActivity);
    document.addEventListener('keypress', checkActivity);
}

initAlert();

/*
    CONTACT FORM
*/

let form = document.querySelector('.contact-form');
let formName = form.querySelector('.contact-form__name');
let formEmail = form.querySelector('.contact-form__email');
let formSubject = form.querySelector('.contact-form__subject');
let formMessage = form.querySelector('.contact-form__message');

formName.addEventListener('invalid', function () {
    formName.setCustomValidity('Лише латинські літери, перша літера - велика. Наявність цифр та пробілів – недопустима.');
});
formSubject.addEventListener('invalid', function () {
    formSubject.setCustomValidity('Лише літери.');
});
formMessage.addEventListener('invalid', function () {
    formMessage.setCustomValidity('Напишiть ваше повiдомлення.');
});

[formName, formEmail, formSubject, formMessage]
    .forEach(item => {
        item.addEventListener('invalid', function () {
            item.style.border = '3px solid #e48b6a';
        });
        item.addEventListener('input', function () {
            item.style.border = 'none';
            item.setCustomValidity('');
        });
    });

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
        name: formName.value,
        email: formEmail.value,
        subject: formSubject.value,
        message: formMessage.value
    };

    localStorage.setItem('formData', JSON.stringify(data));

    if (formSubject.value.toLowerCase().includes('зробити замовлення')) {
        const pyro = document.querySelector('.pyro');

        pyro.classList.add('show');
        setTimeout(() => pyro.classList.remove('show'), 1000 * 5); // 5 sec
    }

    form.reset();

    console.log('Data written to storage: ' + localStorage.getItem('formData'));
});

/*
    NEWS SECTION
*/

let btnNews = document.querySelector('.button__show-news');

function renderNews (data) {
    let sectionNews = document.querySelector('.news');
    let template = document.querySelector('.template');

    data.forEach((news, index) => {
        let newItem = template.content.cloneNode(true).querySelector('.news-item');

        newItem.setAttribute('data-wow-delay', index/2 + 's');
        newItem.querySelector('.news-item__title').textContent = news.header;
        newItem.querySelector('.item-description__data').textContent = news.date + ' // ' + news.user + ' // ' + news.tags;
        newItem.querySelector('.item-description__response').textContent = news.responses + ' responses';
        newItem.querySelector('.item-description__text').textContent = news.text;
        newItem.querySelector('.news-item__pic').src = news.img;

        sectionNews.append(newItem);
    });

    if (data.length === 0) {
        btnNews.hidden = true;
    }
}

function loadNews (page) {
    fetch('https://raw.githubusercontent.com/thesidorenko/final-project/main/json/news.json')
        .then(response => response.json())
        .then(response => {
            const pageData = response.find(item => item.page === page);
            const news = pageData ? pageData.data : [];

            renderNews(news);
        })
        .catch(error => alert(error));
}

function initNews () {
    let page = 1;

    loadNews(page);

    btnNews.addEventListener('click', function () {loadNews(++page);});
}

initNews();

/*
    WOW ANIMATE NEWS
*/

new WOW({
    'animateClass': 'animate__animated',
}).init();

/*
    PUBLIC API
*/

function initCurrency () {
    const popup = document.querySelector('#currency-popup');

    // load data
    fetch('https://api.monobank.ua/bank/currency')
        .then(response => response.json())
        .then(data => {
            const usdBuy = data[0].rateBuy;
            const usdSell = data[0].rateSell;
            const eurBuy = data[1].rateBuy;
            const eurSell = data[1].rateSell;
            const eurUsdBuy = data[2].rateBuy;
            const eurUsdSell = data[2].rateSell;

            document.querySelector('.usdRateBuy').textContent = usdBuy;
            document.querySelector('.usdRateSell').textContent = usdSell;
            document.querySelector('.eurRateBuy').textContent = eurBuy;
            document.querySelector('.eurRateSell').textContent = eurSell;
            document.querySelector('.eur-usd-RateBuy').textContent = eurUsdBuy;
            document.querySelector('.eur-usd-RateSell').textContent = eurUsdSell;
        })
        .catch(() => console.log('API Monobank: Too many requests. Try later, please.'));

    popup.addEventListener('click', function (event) {
        event.target.querySelector('.popup__text').classList.toggle('show');
    });
}

initCurrency();
