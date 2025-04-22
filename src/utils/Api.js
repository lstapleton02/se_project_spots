export class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      throw new Error(`Too many requests. Please try again in ${retryAfter} seconds.`);
      }
    return res.json().then((err) => {
      err.statusCode = res.status;
      throw err;
    });
  }

  _request(url, options) {
    return fetch(url, options)
 .catch(error => {
   if (error.name === 'TypeError' && !navigator.onLine) {
     throw new Error('Network offline. Please check your internet connection.');
   }
   throw error;
 })
 .then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  async getUserInfo() {
    try {
      return await this._request(`${this._baseUrl}/users/me`, {
        headers: this._headers,
      });
    } catch (error) {
      if (error.statusCode === 401) {
        console.error('Authorization failed. Please log in again');
      } else if (error.statusCode === 404) {
        console.error('User information not found');
      } else {
        console.error('Failed to fetch user information:', error.message);
      }
      throw error;
    }
  }

  async editUserInfo({ name, about }) {
    try {
      if (!name || !about) {
        throw new Error('Missing required fields');
      }
      return await this._request(`${this._baseUrl}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ name, about }),
      });
    } catch (error) {
      if (error.message === 'Missing required fields') {
        console.error('Please provide both name and about information');
      } else if (error.statusCode === 400) {
        console.error('Invalid user information provided');
      } else if (error.statusCode === 401) {
        console.error('Authorization failed');
      } else {
        console.error('Failed to update user information:', error.message);
      }
      throw error;
    }
  }

  async editAvatar(avatar) {
    try {
      if (!this._isValidUrl(avatar)) {
        throw new Error("Invalid URL format");
      }
      return await this._request(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ avatar }),
      });
    } catch (error) {
      if (error.message === "Invalid URL format") {
        console.error("Please provide a valid image URL");
      } else if (error.statusCode === 400) {
        console.error("Invalid image format or size");
      } else if (error.statusCode === 401) {
        console.error("Authorization failed");
      } else {
        console.error("Failed to update avatar:", error.message);
      }
      throw error;
    }
  }

  async postCard({ name, link }) {
    try {
      if (!name || !link) {
        throw new Error("Missing required fields");
      }
      if (!this._isValidUrl(link)) {
        throw new Error("Invalid image URL");
      }
      return await this._request(`${this._baseUrl}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({ name, link }),
      });
    } catch (error) {
      if (error.message === "Missing required fields") {
        console.error("Please provide both name and link for the card");
      } else if (error.message === "Invalid image URL") {
        console.error("Please provide a valid image URL");
      } else if (error.statusCode === 400) {
        console.error("Invalid card data");
      } else if (error.statusCode === 401) {
        console.error("Authorization failed");
      } else {
        console.error("Failed to create card:", error.message);
      }
      throw error;
    }
  }

  async deleteCard(cardId) {
    try {
      if (!cardId || typeof cardId !== 'string' || !cardId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid card ID format');
      }
      return await this._request(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
      });
    } catch (error) {
      if (error.message === 'Invalid card ID format') {
        console.error('Please provide a valid card ID');
      } else if (error.statusCode === 403) {
        console.error('You do not have permission to delete this card');
      } else if (error.statusCode === 404) {
        console.error('Card not found');
      } else if (error.statusCode === 401) {
        console.error('Authorization failed');
      } else {
        console.error('Failed to delete card:', error.message);
      }
      throw error;
    }
  }

  async getInitialCards() {
    try {
      return await this._request(`${this._baseUrl}/cards`, {
        headers: this._headers,
      });
    } catch (error) {
      if (error.statusCode === 401) {
        console.error('Authorization failed. Please log in again');
      } else if (error.statusCode === 500) {
        console.error('Server error while fetching cards');
      } else {
        console.error('Failed to fetch cards:', error.message);
      }
      throw error;
    }
  }

  async handleLike(cardId, isLiked) {
    try {
      if (!cardId || typeof cardId !== 'string' || !cardId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid card ID format');
      }
      return await this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: isLiked ? "DELETE" : "PUT",
        headers: this._headers,
      });
    } catch (error) {
      if (error.message === 'Invalid card ID format') {
        console.error('Please provide a valid card ID');
      } else if (error.statusCode === 404) {
        console.error('Card not found');
      } else if (error.statusCode === 401) {
        console.error('Authorization failed');
      } else if (error.statusCode === 500) {
        console.error('Server error while processing like/unlike');
      } else {
        console.error('Failed to process like/unlike:', error.message);
      }
      throw error;
    }
  }

_isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

