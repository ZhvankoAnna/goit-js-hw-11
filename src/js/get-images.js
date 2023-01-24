import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32975717-e5ee65230820405f183c875ea';

export async function getImages(searchReq, pc) {
    try {
        const params = {
            key: `${API_KEY}`,
                q: `${searchReq}`,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                per_page: 40,
                page: `${pc}`,
        }
      const response = await axios.get(`${BASE_URL}?`,{params})
      if (response.data.totalHits === 0) {
        throw new Error();
      } else {
        console.log(response.data)
        return response.data
      }

    //   if (response.data.totalHits === 0) {
    //     throw new Error();
    //   } else {
    //     const { totalHits, hits } = await response.data;
    //     if (hits < 40) {
    //       Notify.info(
    //         "We're sorry, but you've reached the end of search results."
    //       );
    //     }
    //     if (pageCount === 1) {
    //       Notify.success(`Hoorey! We found ${totalHits} images`);
    //     }
    //     pageCount++;
    //     return { totalHits, hits };
    //   }
    } catch (error) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }