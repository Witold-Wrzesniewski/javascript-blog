'use strict';
{
  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    /*console.log('clickedElement (with plus): ' + clickedElement);
    console.log('clickedElement:', clickedElement);*/

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleID = clickedElement.getAttribute('href');
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleID);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list';

  const generateTitleLinks = function(customSelector = ''){
    /* Remove link list content */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* For each article:
      - get ID and write to const
      - get title element and write to const
      - generate link HTML and write to const
      - append generated HTML to link list
    */
    const articles = document.querySelectorAll(optArticleSelector +  customSelector);

    for(let article of articles){
      const articleID = article.getAttribute('id');
      const articleTitle = article.querySelector(optTitleSelector).innerText;
      const listElement = document.createElement('li');
      listElement.innerHTML = `<a href="#${articleID}"><span>${articleTitle}</span></a>`;
      //titleList.appendChild(listElement);
      titleList.insertAdjacentElement('beforeend', listElement);
    }

    const links = document.querySelectorAll('.titles a');
    //console.log(links);
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  const generateTags = function(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles){
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let tagsWrapperHtml = '';
      /* get tags from data-tags attribute */
      const tagsString = article.getAttribute('data-tags');
      /* split tags into array */
      const tagsArray = tagsString.split(' ');

      /* START LOOP: for each tag */
      for (let tag of tagsArray){
        /* generate HTML of the link */
        const linkHtml = `<li><a href="#tag-${tag}">${tag}</a></li>\n`;
        /* add generated code to html variable */
        tagsWrapperHtml += linkHtml;
      }/* END LOOP: for each tag */

      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = tagsWrapperHtml;
    }/* END LOOP: for every article: */
  };
  generateTags();

  const tagClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for(let activeTag of activeTagLinks){
      /* remove class active */
      activeTag.classList.remove('active');
    }/* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */
    const equalHrefTagLinks = document.querySelectorAll('[href = "' + href + '"]');

    /* START LOOP: for each found tag link */
    for(let equalHrefTag of equalHrefTagLinks){
      /* add class active */
      equalHrefTag.classList.add('active');
    }/* END LOOP: for each found tag link */

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  const addClickListenersToTags = function(){
    /* find all links to tags */
    const allTAgs = document.querySelectorAll('a[href^="#tag-"]');

    console.log(allTAgs);
    /* START LOOP: for each link */
    for(let tag of allTAgs){
      /* add tagClickHandler as event listener for that link */
      tag.addEventListener('click', tagClickHandler);
    }/* END LOOP: for each link */
  }
  addClickListenersToTags();
}