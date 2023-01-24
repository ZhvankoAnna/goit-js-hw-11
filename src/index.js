import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import {pageCount, getImages} from "./js/get-images"
import {gallaryEl, craeteMarkup} from "./js/create-markup"
import {smoothScroll} from "./js/smooth-scroll"

let searchReq = null;

const formEl = document.querySelector('.search-form');

formEl.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', debounce(handleWindowScroll, 500));

async function handleFormSubmit(e) {
  e.preventDefault();

  gallaryEl.innerHTML = '';
  pageCount = 1;

  searchReq = e.target.elements.searchQuery.value.trim();

  if(searchReq === "") {
    return Notify.failure("Input some text for search")
  }

  const { totalHits, hits } = await getImages(searchReq);
  totalImgCount = totalHits;

  craeteMarkup(hits);
}

async function handleWindowScroll(e) {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight > scrollHeight - clientHeight) {
    const { hits } = await getImages(searchReq);

    craeteMarkup(hits);
    smoothScroll();
  }
}
