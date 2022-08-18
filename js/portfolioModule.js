const STORAGE_PROJECT_KEY = 'portfolio_projects';

function removePortfolioItems () {
    document.querySelectorAll('#portfolio-items .portfolio-item').forEach(item => item.remove());
}

function renderProjects (category = '') {
    removePortfolioItems();

    const portfolioWrapper = document.querySelector('#portfolio-items');
    const portfolioTemplate = portfolioWrapper.querySelector('template');
    let projects = JSON.parse(localStorage.getItem(STORAGE_PROJECT_KEY));

    projects = projects.filter(item => category.length ? item.category === category : true);

    projects.forEach((project, index) => {
        const newProject = portfolioTemplate.content.cloneNode(true);

        newProject.querySelector('.portfolio-item__picture').src = project.image;
        newProject.querySelector('.portfolio-item__name').innerText = project.name;

        if (index >= 6) {
            newProject.querySelector('.portfolio-item').classList.add('portfolio-item_hidden');
        }

        portfolioWrapper.appendChild(newProject);
    });

    const browseAllButton = document.querySelector('.button__show-all');

    if (projects.length <= 6) {
        browseAllButton.style.display = 'none';
    } else {
        browseAllButton.style.display = 'inline-block';
        browseAllButton.classList.remove('active');
        browseAllButton.innerText = 'Browse All';
    }
}

function initBrowseAllButton () {
    const browseAllButton = document.querySelector('.button__show-all');

    browseAllButton.onclick = function () {
        const hiddenProjects = document.querySelectorAll('.portfolio-item_hidden');

        if (browseAllButton.classList.contains('active')) {
            [...hiddenProjects].forEach(project => project.style.display = 'none');

            browseAllButton.classList.remove('active');
            browseAllButton.innerText = 'Browse All';
        } else {
            [...hiddenProjects].forEach(project => project.style.display = 'block');

            browseAllButton.classList.add('active');
            browseAllButton.innerText = 'Hide projects';
        }
    };
}

function filterClickHandler (e) {
    const filterButton = e.target;
    const filterName = filterButton.innerText;
    const allFilterButtons = document.querySelectorAll('#portfolio-filters button');

    [...allFilterButtons]
        .filter(item => item !== filterButton)
        .forEach(btn => btn.classList.remove('active'));

    if (filterButton.classList.contains('active')) {
        filterButton.classList.remove('active');
        renderProjects();
    } else {
        filterButton.classList.add('active');
        renderProjects(filterName);
    }
}

function renderFilters () {
    const filtersWrapper = document.querySelector('#portfolio-filters');
    const filtersTemplate = filtersWrapper.querySelector('template');

    let projects = JSON.parse(localStorage.getItem(STORAGE_PROJECT_KEY));
    const filters = projects.map(item => item.category).filter(function (filter, index, filters) {
        return filters.indexOf(filter) === index;
    });

    filters.forEach(filter => {
        const newFilter = filtersTemplate.content.cloneNode(true);

        newFilter.querySelector('button').innerText = filter;
        newFilter.querySelector('button').addEventListener('click', filterClickHandler);

        filtersWrapper.appendChild(newFilter);
    });
}

function portfolioModule () {
    renderProjects();
    initBrowseAllButton();
}

function initPortfolioFilters () {
    renderFilters();
}

function loadPortfolio () {
    fetch('https://raw.githubusercontent.com/thesidorenko/final-project/main/json/portfolio.json')
    .then(response => response.json())
    .then(response => {
            localStorage.setItem(STORAGE_PROJECT_KEY, JSON.stringify(response));
            portfolioModule();
            initPortfolioFilters();
        })
        .catch(response => alert('Error in loading projects: ' + response));
}

loadPortfolio();
