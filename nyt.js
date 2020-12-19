const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; //setting the URL as a variable name for the NYT API access point
const key = 'FgpEAjKl1FsUxHkCApkoGAERomx2Q7JX'; //Specific user key
let url; // WHY?

//fixed elements declarations
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');
//19-21 cause the previsous and next button to disappear
//place holders
nav.style.display = 'none';  // Removes the buttons until the something else happens
let pageNumber = 0;
let displayNav = false;

// const searchForm = document.querySelector('form');
// event listeners are waiting for user input then an action happens
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

//funtion that grabs the results and jsonifys it to interpret
function fetchResults(e) {
    // console.log(e); 
    e.preventDefault(); // WHY THE "e", keeps the page from refreshing
    // Assemble the full URL
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value;
    // you get the info for the url from the API site READ THE DOCS inorder to right the code 
    // url = `${baseURL}?api-key=${key}&page${pageNumber}&q${searchTerm.value}`;
    //   console.log(url); //4
    // Dates are not required for the code to run but they will limit the search parms 
    // sent to the API to return a more specific search
    if (startDate.value !== '') {
        console.log(startDate.value)
        url += '&begin_date=' + startDate.value; //added to URL
    };
    if (endDate.value !== '') {
        url += '&end_date=' + endDate.value; //added to URL
    };
    // use url to get the promise and response
    fetch(url)  //This function gets the data from the url
        .then(function (result) {
            console.log(result)
            return result.json(); //2
        }).then(function (json) {  // uses promise returned by 
            console.log(json); //3
        });

    //There might be a problem here...

    fetch(url).then(function (result) {
        return result.json();
    }).then(function (json) {
        displayResults(json); //1 & //3
    });
}

// create the rules for what display using json data
function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild); //create a place holder to take in the results
    }
    console.log("DisplayResults", json);
    console.log(json.response.docs);
    let articles = json.response.docs;  // defines articles for json data
    console.log(articles);
    if (articles.length >= 10) {
        nav.style.display = 'block'; //shows the nav display if 10 items are in the array
    } else {
        nav.style.display = 'none'; //hides the nav display if less than 10 items are in the array
    }
    if (articles.length === 0) {
        console.log("No results");
    } else {
        for (let i = 0; i < articles.length; i++) { //iterating through the NYT articles and creating an object for each individual result
            console.log(i);
            let article = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');
            let para = document.createElement('p');
            let clearfix = document.createElement('div');

            let current = articles[i]; // creating a var to reference what is inside the article's array
            console.log("Current:", current);
            // link created a tag, adding the current url for display
            link.href = current.web_url;
            link.textContent = current.headline.main;
            para.textContent = 'Keywords: '; //text content
            // span used to contain the keywords pulled inside a set area
            for (let j = 0; j < current.keywords.length; j++) {
                let span = document.createElement('span');
                span.textContent += current.keywords[j].value + ' ';
                para.appendChild(span);
            }
            // pull the first image from the current object to display on the website
            if (current.multimedia.length > 0) {
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;  //display the headline tag from "current" object
            }
            clearfix.setAttribute('class', 'clearfix');

            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(img);
            article.appendChild(para);
            article.appendChild(clearfix);
            section.appendChild(article);
        }
    }
};
function nextPage(e) {
    pageNumber++;
    fetchResults(e);
    console.log("Page number:", pageNumber);
};
function previousPage(e) {
    if (pageNumber > 0) {
        pageNumber--;
    } else {
        return;
    }
    fetchResults(e);
    console.log("Page:", pageNumber);
};