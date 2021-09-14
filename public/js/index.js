const formShortener = document.getElementById("form-shortener");
const linkShortener = document.getElementById("link-shortener");
const results = document.getElementById("form-shortener-results");
const loader = document.getElementById("loader");

const callApiShortLinkFunction = async (url) => {
  return axios
    .get("https://api.shrtco.de/v2/shorten", {
      params: {
        url,
      },
    })
    .then((res) => {
      const object = {
        shortLink: res.data.result.short_link,
        originalLink: res.data.result.original_link,
      };
      return object;
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

    body.classList.remove("hidden");
    loader.classList.remove("loader--show");

    createItemLink(objectLink);
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
