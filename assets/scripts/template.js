import { closeModal, saveBook, showModal } from './action.js';
import bookshelfData from './bookshelfData.js';
import { renderItemEvent } from './customEvent.js';
import { saveStorageData } from './storage.js';

function bookForm({ id = '', isComplete, title, writer, year, lastReadPage }) {
  const form = document.createElement('form');
  const pageCountlabel = document.createElement('label');
  const titleInput = document.createElement('input');
  const writerInput = document.createElement('input');
  const yearInput = document.createElement('input');
  const pageCountInput = document.createElement('input');
  const inputGroup = document.createElement('div');
  const pageCountContainer = document.createElement('div');

  titleInput.value = title || '';
  writerInput.value = writer || '';
  yearInput.value = year || '';
  pageCountInput.value = lastReadPage || 1;

  titleInput.placeholder = 'Title';
  writerInput.placeholder = 'Writer';
  yearInput.placeholder = 'Year';

  pageCountInput.type = 'number';
  pageCountInput.min = 1;
  yearInput.type = 'number';

  pageCountlabel.innerText = 'Start Page : ';

  pageCountInput.classList = 'modal__quantity-input';
  inputGroup.classList = 'input-group';
  form.classList = 'modal__form';

  pageCountContainer.append(pageCountlabel, pageCountInput);
  inputGroup.append(yearInput, pageCountContainer);
  form.append(titleInput, writerInput, inputGroup, modalConfirmAction());

  form.addEventListener('submit', (event) => { 
    event.preventDefault();

    const book = {
      title: titleInput.value,
      writer: writerInput.value,
      year: yearInput.value,
      lastReadPage: pageCountInput.value,
      isComplete,
      updateId: id
    };
    saveBook(book);
  });

  return form;
}

function modalConfirmAction() {
  const container = document.createElement('div');
  const confirmButton = document.createElement('button');
  const cancelButton = document.createElement('button');

  container.classList = 'modal__action';
  cancelButton.classList = 'modal_action-cancel';
  confirmButton.classList = 'button--add';

  cancelButton.innerText = 'Cancel';
  confirmButton.innerText = 'Submit';
  container.append(confirmButton, cancelButton);

  confirmButton.type = 'submit';
  cancelButton.addEventListener('click', closeModal);

  return container;
}

function bookItem(book) {
  const container = document.createElement('div');
  const coverImage = document.createElement('div');
  const image = document.createElement('img');
  const bookDetail = document.createElement('div');
  const detail = document.createElement('div');
  const titleLabel = document.createElement('p');
  const writerLabel = document.createElement('p');
  const yearLabel = document.createElement('p');
  const lastReadPageLabel = document.createElement('p');
  const pageCounter = document.createElement('div');
  const decreseButton = document.createElement('button');
  const counter = document.createElement('input');
  const increaseButton = document.createElement('button');
  const actionList = document.createElement('div');
  const markedButton = document.createElement('button');
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const doneReadingButton = document.createElement('button');

  container.classList = 'bookshelf__book';
  coverImage.classList = 'bookshelf__book-placeholder';
  bookDetail.classList = 'bookshelf__book-detail';
  actionList.classList = 'bookshelf__book-action';
  markedButton.classList = 'book-action--page';
  editButton.classList = 'button--add';
  deleteButton.classList = 'book-action--delete';
  doneReadingButton.classList = 'book-action--done';

  image.src = './assets/images/book-placeholder.jpg';
  image.classList = 'bookshelf__book-img';
  editButton.tabIndex = -1;

  titleLabel.innerText = `Title : ${book.title}`;
  writerLabel.innerText = `Writer : ${book.writer}`;
  yearLabel.innerText = `Year : ${book.year}`;
  lastReadPageLabel.innerText = `Last Read Page : ${book.lastReadPage}`;
  decreseButton.innerHTML = '<i class="fa-solid fa-caret-left"></i>';
  increaseButton.innerHTML = '<i class="fa-solid fa-caret-right"></i>';
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

  if (book.marked) {
    markedButton.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
  } else {
    markedButton.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
  }

  if (book.isComplete) {
    doneReadingButton.innerText = 'Undo Reading';
  } else {
    doneReadingButton.innerText = 'Done Reading';
  }

  detail.append(titleLabel, writerLabel, yearLabel, lastReadPageLabel);
  pageCounter.append(decreseButton, counter, increaseButton);
  actionList.append(markedButton, editButton, deleteButton);
  coverImage.append(image);
  bookDetail.append(detail, actionList, doneReadingButton);
  container.append(coverImage, bookDetail);

  doneReadingButton.addEventListener('click', () => {
    const index = bookshelfData.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      bookshelfData[index] = {
        ...bookshelfData[index],
        isComplete: !(book.isComplete)
      };
      saveStorageData();
      alert('Book Status Updated!');
      document.dispatchEvent(renderItemEvent);    
    } else {
      alert('Book Status Failed to Updated!');
    }
  });

  editButton.addEventListener('click', () => {
    showModal('Edit Book', book);
  });

  deleteButton.addEventListener('click', () => {
    const confirm = window.confirm('Are you Sure Want to Delete?');
    if (confirm) {
      const index = bookshelfData.findIndex((b) => b.id === book.id);
      if (index !== -1) {
        bookshelfData.splice(index, 1);
        saveStorageData();
        alert('Book Deleted!');
        document.dispatchEvent(renderItemEvent);    
      } else {
        alert('Book Failed to Deleted!');
      }
    }
  });

  markedButton.addEventListener('click', () => {
    const index = bookshelfData.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      bookshelfData[index] = {
        ...bookshelfData[index],
        marked: !(book.marked)
      };
      saveStorageData();
      document.dispatchEvent(renderItemEvent);    
    } else {
      alert('Book Failed to Mark!');
    }
  })

  return container;
}

export { bookForm, bookItem };