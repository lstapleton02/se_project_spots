//import { enableValidation, validationconfig } from "./validation";

import {
  settings,
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { Api } from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import "./index.css";

// Modals
const modals = document.querySelectorAll(".modal");

// Close buttons
const closeButtons = document.querySelectorAll(".modal__close-btn");

// Profile Elements
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileEditButton = document.querySelector(".profile__edit-btn");

/*
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant Terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain House",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];*/

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c6481afd-8d2a-4407-bd56-fbcacf9b0f0c",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    /*console.log("Full userInfo object:", userInfo);
  console.log("Avatar URL specifically:", userInfo.avatar);

  if (!Array.isArray(cards)) {
    console.log("Cards is not an array:", typeof cards);
    return;
  }*/
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });

    const { about, avatar, name } = userInfo;

    profileAvatar.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch(console.error);

// Modal Form Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const nameInput = editModal.querySelector("#profile-name-input");
const jobInput = editModal.querySelector("#profile-description-input");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescription = editModal.querySelector(
  "#profile-description-input"
);
const modalSubmitButton = editModal.querySelector("modal__submit-btn");

//Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//Card Modal Elements
//const cardModalBtn = document.querySelector(".profile__add-btn");
const addCardModal = document.querySelector("#add-card-modal");
//const cardForm = addCardModal.querySelector(".modal__form");
const newPostImageLink = addCardModal.querySelector("#add-card-link-input");
const newPostCaption = addCardModal.querySelector("#add-card-name-input");
const newPostOpenButton = document.querySelector(".profile__add-btn");
const newPostForm = document.forms["add-card-form"];
//const cardSubmitBtn = addCardModal.querySelector(".modal__submit-btn");
//const cardModalCloseBtn = addCardModal.querySelector(".modal__close-btn");

//Preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImg = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarForm = document.forms["edit-avatar-form"];
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");

//Delete Form Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["delete-card-form"];
const modalCancelButton = deleteModal.querySelector(".modal__cancel-btn");

let selectedCard, selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
  //document.addEventListener("keydown", closeModalEsc);
  //modal.addEventListener("mousedown", closeModalOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
  //document.removeEventListener("keydown", closeModalEsc);
  //modal.removeEventListener("mousedown", closeModalOverlay);
}

/*
function closeModalEsc(event) {
  if (event.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened");
    closeModal(modalOpened);
  }
}

function closeModalOverlay(event) {
  if (event.target.classList.contains("modal_opened")) {
    closeModal(event.target);
  }
}
*/

/*
editModalButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  resetValidation(editFormElement, [nameInput, jobInput], settings);
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});
*/
//profile modal submit
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const profileSubmitButton = evt.submitter;
  setButtonText(profileSubmitButton, true);

  api
    .editUserInfo({
      name: nameInput.value,
      about: jobInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      evt.target.reset();
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(profileSubmitButton, false, "Save", "Saving...");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarSubmitButton = evt.submitter;
  setButtonText(avatarSubmitButton, true);

  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      evt.target.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitButton, false, "Save", "Saving...");
    });
}

function handlePostCard(evt) {
  evt.preventDefault();
  const postCardSubmitBtn = evt.submitter;
  setButtonText(postCardSubmitBtn, true);

  api
    .postCard({ name: newPostCaption.value, link: newPostImageLink.value })
    .then((data) => {
      const newCard = getCardElement(data);

      cardsList.prepend(newCard);

      closeModal(addCardModal);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(postCardSubmitBtn, false, "Save", "Saving...");
    });
}
/*
function handlePostCard(evt) {
  evt.preventDefault();
  const postCardSubmitBtn = evt.submitter;
  setButtonText(postCardSubmitBtn, true);

  api
    .postCard({ name: newPostCaption.value, link: newPostImageLink.value })
    .then((data) => {
      const newCard = getCardElement(data);

      cardsList.prepend(newCard);

      closeModal(addCardModal);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(postCardSubmitBtn, false, "Save", "Saving...");
    });
}*/

function handleLike(evt, cardId) {
  evt.preventDefault();
  const likeButton = evt.target;
  const isLikedEl = likeButton.classList.contains("card__like-btn_liked");

  api
    .handleLike(cardId, isLikedEl)
    .then(() => {
      likeButton.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteButton = evt.submitter;
  setButtonText(deleteButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteButton, false, "Delete", "Deleting...");
      deleteButton.disabled = false;
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
/*
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;

  closeModal(editModal);*/

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-btn_liked");
  }

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });
  /*
    cardLikeBtn.addEventListener("click", () => {
      cardLikeBtn.classList.toggle("card__like-btn_liked");
    });*/

  //event handler open and close the preview mode of each image
  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);

    previewModalImg.src = cardImgEl.src;
    previewModalImg.alt = cardImgEl.name;
    previewModalCaption.textContent = cardImgEl.alt;
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  return cardElement;
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescription.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescription],
    settings
  );
});

modals.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
  });
});

newPostOpenButton.addEventListener("click", () => {
  openModal(addCardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

modalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

/* Connect the handler to the form, so it will watch for the submit event.
editFormElement.addEventListener("submit", handleEditFormSubmit);
//submit handler for adding new post
cardForm.addEventListener("submit", handleAddCardSubmit);
/*
//Open and Close the New Post - Card Modal
cardModalBtn.addEventListener("click", () => {
  openModal(addCardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(addCardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

/*Initial Posts
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});

//card modal submit
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaption.value,
    link: newPostImageLink.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  evt.target.reset();

  closeModal(addCardModal);
}
*/

avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
newPostForm.addEventListener("submit", handlePostCard);

enableValidation(settings);
