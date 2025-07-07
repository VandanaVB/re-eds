export default function decorate(block) {
  const [titleRow, imageRow, artistRow, descriptionRow] = block.children

  const card = document.createElement("section")
  card.className = "featured-card"

  const title = document.createElement("h2")
  title.className = "featured-title"
  title.textContent = titleRow?.textContent || "DOODLE OF THE WEEK"

  const imageContainer = document.createElement("div")
  imageContainer.className = "featured-image-container"

  const image = imageRow?.querySelector("img")
  if (image) {
    image.className = "featured-image"
    imageContainer.appendChild(image)
  }

  const info = document.createElement("div")
  info.className = "featured-info"

  const artist = document.createElement("h3")
  artist.className = "featured-artist"
  artist.textContent = artistRow?.textContent || ""

  const description = document.createElement("p")
  description.className = "featured-description"
  description.textContent = descriptionRow?.textContent || ""

  const shareButton = document.createElement("button")
  shareButton.className = "share-button"
  shareButton.textContent = "Share Now"
  shareButton.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: "Doodle of the Week",
        text: description.textContent,
        url: window.location.href,
      })
    }
  })

  info.appendChild(artist)
  info.appendChild(description)
  info.appendChild(shareButton)

  card.appendChild(title)
  card.appendChild(imageContainer)
  card.appendChild(info)

  block.replaceWith(card)
}
