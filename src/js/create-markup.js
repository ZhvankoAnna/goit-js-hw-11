import SimpleLightbox from 'simplelightbox';
import '../../node_modules/simplelightbox/dist/simple-lightbox.min.css'

export const gallaryEl = document.querySelector('.gallery');
let gallery = new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
  });

export function craeteMarkup(array) {
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