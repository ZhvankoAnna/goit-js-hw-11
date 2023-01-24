import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { getImages } from './js/get-images';
import { gallaryEl, craeteMarkup } from './js/create-markup';

let searchReq = null;
let pageCount = null;
let totalImgCount = null;
let imgArray = [];

const formEl = document.querySelector('.search-form');

formEl.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', debounce(handleWindowScroll, 300));

async function handleFormSubmit(e) {
  e.preventDefault();

  if (e.target.elements.searchQuery.value.trim() === '') {
    gallaryEl.innerHTML = '';
    e.target.elements.searchQuery.value = '';
    searchReq = null;
    return Notify.failure('Input some text for search');
  }

  if (searchReq === e.target.elements.searchQuery.value.trim()) {
    return;
  }
  searchReq = e.target.elements.searchQuery.value.trim();

  gallaryEl.innerHTML = '';
  pageCount = 1;

  const data = await getImages(searchReq, pageCount);
  imgArray = data.hits;
  totalImgCount = data.totalHits;

  if (totalImgCount === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (pageCount === 1) {
    Notify.success(`Hoorey! We found ${totalImgCount} images`);
  }
  pageCount++;

  craeteMarkup(imgArray);
}

async function handleWindowScroll(e) {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight > scrollHeight - clientHeight) {
    const data = await getImages(searchReq, pageCount);
    imgArray = data.hits;

    craeteMarkup(imgArray);

    if (imgArray < 40) {
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    pageCount++;
  }
}
