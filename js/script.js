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
    optTitleListSelector = '.titles';

  const generateTitleLinks = function(){
    /* Remove link list content */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* For each article:
      - get ID and write to const
      - get title element and write to const
      - generate link HTML and write to const
      - append generated HTML to link list
    */
    const articles = document.querySelectorAll(optArticleSelector);
    console.log(articles);
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
}