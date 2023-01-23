import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32975717-e5ee65230820405f183c875ea';
let pageCount = null;
let searchReq = null;
let totalImgCount = null;
let gallery = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
  showCounter: false,
});

const formEl = document.querySelector('.search-form');
const gallaryEl = document.querySelector('.gallery');

formEl.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', debounce(handleWindowScroll, 300));

async function getImages(searchReq) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchReq}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`
    );
    console.log(response);
    if (response.data.totalHits === 0) {
      throw new Error();
    } else {
      const { totalHits, hits } = await response.data;
      if (pageCount === 1) {
        Notify.success(`Hoorey! We found ${totalHits} images`);
      }
      pageCount++;
      return { totalHits, hits };
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function craeteMarkup(array) {
  const markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a href="${largeImageURL}" class="photo-link"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px" height="200px"/></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>`
    )
    .join('');
  gallaryEl.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

async function handleFormSubmit(e) {
  e.preventDefault();

  gallaryEl.innerHTML = '';
  pageCount = 1;

  searchReq = e.target.elements.searchQuery.value.trim();

  const { totalHits, hits } = await getImages(searchReq);
  totalImgCount = totalHits;
  craeteMarkup(hits);
}

async function handleWindowScroll(e) {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight > scrollHeight - clientHeight) {
    if (totalImgCount < pageCount * 40) {
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    const { hits } = await getImages(searchReq);
    craeteMarkup(hits);
  }
}
