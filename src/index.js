import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { getImages } from './js/get-images';
import { gallaryEl, craeteMarkup } from './js/create-markup';
import { smoothScroll } from './js/smooth-scroll';

let searchReq = null;
let pageCount = null;

const formEl = document.querySelector('.search-form');

formEl.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', debounce(handleWindowScroll, 500));

async function handleFormSubmit(e) {
  e.preventDefault();
  if(searchReq === e.target.elements.searchQuery.value.trim()){
    return
  }

  gallaryEl.innerHTML = '';
  pageCount = 1;

  searchReq = e.target.elements.searchQuery.value.trim();

  if (searchReq === '') {
    return Notify.failure('Input some text for search');
  }

  const { totalHits, hits } = await getImages(searchReq, pageCount);
  totalImgCount = totalHits;

    if (pageCount === 1) {
    Notify.success(`Hoorey! We found ${totalHits} images`);
  }
  pageCount++;

  craeteMarkup(hits);
}

async function handleWindowScroll(e) {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight > scrollHeight - clientHeight) {
    const { totalHits, hits } = await getImages(searchReq, pageCount);

    craeteMarkup(hits);
    smoothScroll();
    if (hits < 40) {
      return Notify.info("We're sorry, but you've reached the end of search results.");
    }
    pageCount++;
    console.log(pageCount)
  }
}
