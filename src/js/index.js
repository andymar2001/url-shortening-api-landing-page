const formShortener = document.getElementById("form-shortener");
const linkShortener = document.getElementById("link-shortener");
const results = document.getElementById("form-shortener-results");
const loader = document.getElementById("loader");
const body = document.getElementsByTagName("body")[0];

const createNotification = (type, message) => {
  const notification = document.createElement("DIV");
  notification.classList.add("notification");

  const notificationIcon = document.createElement("DIV");
  notificationIcon.classList.add("notification__icon");

  const notificationData = document.createElement("DIV");
  notificationData.classList.add("notification__data");

  let title = "Info";

  switch (type) {
    case "error":
      {
        title = "Error";
        notificationIcon.innerHTML = '<i class="fas fa-times"></i>';
        notification.classList.add("notification--error");
        notificationIcon.classList.add("notification__icon--error");
      }
      break;
    default: {
    }
  }
  notificationData.innerHTML = `<span class="notification__title">${title}</span><span class="notification__text">${message}</span>`;
  notification.append(notificationIcon);
  notification.append(notificationData);
  body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add("notification--fadeout");
  }, 2500);
  setTimeout(() => {
    notification.remove();
  }, 4000);
};

const callApiShortLinkFunction = async (url) => {
  return fetch(
    "https://api.shrtco.de/v2/shorten?" +
      new URLSearchParams({
        url,
      })
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        return {
          error: res.error,
        };
      }
      return {
        shortLink: res.result.short_link,
        originalLink: res.result.original_link,
      };
    });
};

const createItemLink = (objectLink) => {
  const fragment = document.createDocumentFragment();

  const item = document.createElement(`DIV`);
  item.classList.add("search-result");
  item.innerHTML = `
  <span class="search-result__link">${objectLink.originalLink}</span>
  <span class="search-result__shortenedlink">
    ${objectLink.shortLink}</span>
    <button class="search-result__button btn">Copy</button>`;

  fragment.appendChild(item);

  results.appendChild(fragment);
};

const validateLink = (linkText) => {
  const itemNote = document.createElement("SPAN");
  itemNote.classList.add("input-wrap__note");
  itemNote.classList.add("input-wrap__note--danger");
  itemNote.textContent = "Please add a link";

  linkShortener.addEventListener("input", () => {
    linkShortener.classList.remove("input-wrap__input--danger");
    itemNote.classList.remove("input-wrap__note--danger");
    itemNote.remove();
  });

  if (!linkText) {
    linkShortener.classList.add("input-wrap__input--danger");
    if (!linkShortener.nextElementSibling) {
      linkShortener.after(itemNote);
    }
    return false;
  }

  linkShortener.classList.remove("input-wrap__input--danger");
  if (linkShortener.nextElementSibling) {
    linkShortener.nextElementSibling.remove();
  }

  return true;
};

formShortener.addEventListener("submit", async (e) => {
  e.preventDefault();

  let linkText = linkShortener.value;

  if (validateLink(linkText)) {
    body.classList.add("hidden");
    loader.classList.add("loader--show");

    const objectLink = await callApiShortLinkFunction(linkText);

    if (objectLink.error) {
      createNotification("error", objectLink.error);
    } else {
      createItemLink(objectLink);
    }

    body.classList.remove("hidden");
    loader.classList.remove("loader--show");
    linkShortener.value = "";
  }
});

results.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    const button = e.target;
    let textCopied = e.target.previousElementSibling.textContent.trim();
    navigator.clipboard
      .writeText(textCopied)
      .then(() => {
        button.textContent = "Copied!";
        button.classList.add("btn--copied");
      })
      .catch((err) => console.log("Error al copiar", err));
  }
});
