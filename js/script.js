'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML)
}
const opts = {
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  TitleListSelector: '.titles',
  ArticleTagsSelector: '.post-tags .list',
  ArticleAuthorSelector: '.post-author',
  TagsListSelector: '.tags.list',
  AuthorsListSelector: '.authors.list',
  CloudClassCount: 5,
  CloudClassPrefix: 'tag-size-',
};

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleID = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleID);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

const generateTitleLinks = function (customSelector = '') {
  /* Remove link list content */
  const titleList = document.querySelector(opts.TitleListSelector);
  titleList.innerHTML = '';
  /* For each article:
    - get ID and write to const
    - get title element and write to const
    - generate link HTML and write to const
    - append generated HTML to link list
  */
  const articles = document.querySelectorAll(opts.ArticleSelector + customSelector);

  for (let article of articles) {
    const articleID = article.getAttribute('id');
    const articleTitle = article.querySelector(opts.TitleSelector).innerText;

    const linkHTMLData = {id: articleID, title: articleTitle};
    const listElement = templates.articleLink(linkHTMLData);
    //console.log(listElement);
    //const listElement = document.createElement('li');
    //listElement.innerHTML = `<a href="#${articleID}"><span>${articleTitle}</span></a>`;
    //titleList.appendChild(listElement);
    titleList.insertAdjacentHTML('beforeend', listElement);
  }

  const links = document.querySelectorAll('.titles a');
  //console.log(links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};
generateTitleLinks();

const calculateTagsParams = function(tags){
  const params = {max: 1, min: 999999};
  for (let tag in tags){
    params.max = params.max > tags[tag] ? params.max : tags[tag];
    params.min = params.min < tags[tag] ? params.min : tags[tag];
  }
  return params;
};

const calculateTagClass = function(count, params){
  const tagsRange = params.max - params.min + 1;
  const tagRate = Math.ceil(opts.CloudClassCount * (count - params.min + 1) / tagsRange);
  return opts.CloudClassPrefix + tagRate;
};

const generateTags = function(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);

  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.ArticleTagsSelector);
    /* make html variable with empty string */
    let tagsWrapperHtml = '';
    /* get tags from data-tags attribute */
    const tagsString = article.getAttribute('data-tags');
    /* split tags into array */
    const tagsArray = tagsString.split(' ');

    /* START LOOP: for each tag */
    for(let tag of tagsArray){
      /* generate HTML of the link */
      //const linkHtml = `<li><a href="#tag-${tag}">${tag}</a></li>\n`;
      const tagHTMLData = {tagValue: tag};
      const linkHtml = templates.tagLink(tagHTMLData);
      /* add generated code to html variable */
      tagsWrapperHtml += linkHtml;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      }
      else{
        allTags[tag]++;
      }
    }/* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = tagsWrapperHtml;
  }/* END LOOP: for every article: */

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.TagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
    allTagsHTML += `<li class="inline"><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag}</a></li> `;
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
};
generateTags();

const tagClickHandler = function (event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  //const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  const activeLinks = document.querySelectorAll('a.active');

  /* START LOOP: for each active tag link */
  for (let activeLink of activeLinks) {
    /* remove class active */
    activeLink.classList.remove('active');
  }/* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalHrefTagLinks = document.querySelectorAll('[href = "' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let equalHrefTag of equalHrefTagLinks) {
    /* add class active */
    equalHrefTag.classList.add('active');
  }/* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};

const addClickListenersToTags = function () {
  /* find all links to tags */
  const allTAgs = document.querySelectorAll('a[href^="#tag-"]');

  //console.log(allTAgs);
  /* START LOOP: for each link */
  for (let tag of allTAgs) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
  }/* END LOOP: for each link */
};
addClickListenersToTags();

const generateAuthors = function () {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find author wrapper */
    const authorWrapper = article.querySelector(opts.ArticleAuthorSelector);
    
    /* get author from data-author attribute */
    const authorString = article.getAttribute('data-author');
    /* insert HTML of the author link into the author wrapper */
    //authorWrapper.innerHTML = `<a href="#author-${authorString}">by ${authorString}</a>`;
    const authorHTMLData = {authorValue: authorString};
    authorWrapper.innerHTML = templates.authorLink(authorHTMLData);
    /*[NEW] check if this author is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(authorString)){
      allAuthors[authorString] = 1;
    }
    else{
      allAuthors[authorString]++;
    }
  }/* END LOOP: for every article: */
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(opts.AuthorsListSelector);
  authorList.innerHTML = '';
  /* [NEW] add author link to authorList */
  for(let author in allAuthors){
    let authorLink = document.createElement('li');
    authorLink.innerHTML = `<a href="#author-${author}"><span class="author-name">${author} (${allAuthors[author]})</span></a></li>`;
    authorList.appendChild(authorLink);
  }
};
generateAuthors();

const authorClickHandler = function (event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  //const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  const activeLinks = document.querySelectorAll('a.active');

  /* START LOOP: for each active author link */
  for (let activeLink of activeLinks) {
    /* remove class active */
    activeLink.classList.remove('active');
  }/* END LOOP: for each active author link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalHrefAuthorLinks = document.querySelectorAll('[href = "' + href + '"]');

  /* START LOOP: for each found author link */
  for (let equalHrefAuthor of equalHrefAuthorLinks) {
    /* add class active */
    equalHrefAuthor.classList.add('active');
  }/* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
};

const addClickListenersToAuthors = function () {
  /* find all links to author */
  const allAuthors = document.querySelectorAll('a[href^="#author-"]');
  //console.log(allAuthors);

  /* START LOOP: for each link */
  for (let author of allAuthors) {
    /* add authorClickHandler as event listener for that link */
    author.addEventListener('click', authorClickHandler);
  }/* END LOOP: for each link */
};
addClickListenersToAuthors();