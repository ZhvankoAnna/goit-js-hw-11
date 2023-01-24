import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { getImages } from './js/get-images';
import { gallaryEl, craeteMarkup } from './js/create-markup';
import { smoothScroll } from './js/smooth-scroll';

let searchReq = null;
let pageCount = null;

const formEl = document.querySelector('.search-form');

formEl.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', debounce(handleWindowScroll, 300));

async function handleFormSubmit(e) {
  e.preventDefault();
  if(searchReq === e.target.elements.searchQuery.value.trim()){
    return
  }

  searchReq = e.target.elements.searchQuery.value.trim();

  gallaryEl.innerHTML = '';
  pageCount = 1;

  if (searchReq === '' || e.target.elements.searchQuery.value.trim() === '') {
    return Notify.failure('Input some text for search');
  }

  const data = await getImages(searchReq, pageCount);

    if (pageCount === 1) {
    Notify.success(`Hoorey! We found ${data.totalHits} images`);
  }
  pageCount++;

  craeteMarkup(data.hits);
}

async function handleWindowScroll(e) {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight > scrollHeight - clientHeight) {
    const data = await getImages(searchReq, pageCount);

    craeteMarkup(data.hits);
    smoothScroll();
    if (data.hits < 40) {
      return Notify.info("We're sorry, but you've reached the end of search results.");
    }
    pageCount++;
  }
}
