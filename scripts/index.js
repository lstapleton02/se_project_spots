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
];

const modals = document.getElementsByClassName("modal");
const pageAll = document.querySelector(".page-all");
const modalContainer = document.querySelector(".modal__container");
const modalContainerImg = document.querySelector(".modal__image-container");

//Profile Elements
//const profileEditButton = document.querySelector(".profile__edit-btn");
const editModalButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Modal Form Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//Card Modal Elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//Preview modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  //event handler open and close the preview mode of each image
  cardImage.addEventListener("click", (modal) => {
    openModal(previewModal);

    previewModalImgEl.src = cardImage.src;
    previewModalImgEl.alt = cardImage.name;
    previewModalCaptionEl.textContent = cardNameEl.textContent;
  });

  return cardElement;
}

//Open and close the Edit profile Modal
function openModal(modal) {
  //editModalNameInput.value = profileName.textContent;
  //editModalDescriptionInput.value = profileDescription.textContent;
  modal.classList.add("modal_opened");
  handleEscKey(modal);
  //handleClickOutside(modal);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

//handle close with esc
function handleEscKey(modal) {
  document.addEventListener("keydown", function (evt) {
    if (evt.key === "Escape" || evt.keyCode === 27) {
      closeModal(modal);
      evt.preventDefault();
    }
  });
}

const myElement = document.getElementsByClassName(
  "modal_container modal__image-container"
);
document.addEventListener("dblclick", function () {
  console.log("clicked");
});

const overlay = document.getElementsByClassName("modal");

document.addEventListener("click", function (event) {
  if (!overlay.contains(event.target) && event.target !== overlay) {
    event.stopPropagation();
    closeModal(overlay);
  }
});

/*
function isClickInsideElement(event, element) {
  const rect = element.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

document.addEventListener("click", function (event) {
  const myElement = document.getElementsByClassName(
    "modal_container modal__image-container"
  );

  if (isClickInsideElement(event, myElement)) {
    // Click inside the element
    console.log("Clicked inside the element");
  } else {
    // Click outside the element
    console.log("Clicked outside the element");
  }
});

/*
//handle close with click outside
function handleClickOutside(modal) {
  modalContainer.addEventListener("click", function (evt) {
    if (evt.target !== modalContainer) {
      closeModal(modal);
      evt.preventDefault();
    }
  });
}


//close modal with click outside
document.addEventListener("click", function (event, modal) {
  if (pageAll.contains(event.target) && event.target !== modals) {
    closeModal(modal);
  }
});

*/

editModalButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});
//profileEditButton.addEventListener("click", openModal);
editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

//profile modal submit
function handleEditFormSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;

  closeModal(editModal);
}

//card modal submit
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  evt.target.reset();
  disableButton(cardSubmitBtn, settings);

  closeModal(cardModal);
}

// Connect the handler to the form, so it will watch for the submit event.
editFormElement.addEventListener("submit", handleEditFormSubmit);
//submit handler for adding new post
cardForm.addEventListener("submit", handleAddCardSubmit);

//Open and Close the New Post - Card Modal
cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

//Initial Posts
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
