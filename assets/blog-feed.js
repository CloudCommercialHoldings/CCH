(function () {
  var grid = document.getElementById("blogGrid");
  if (!grid) return;

  var feedUrl = grid.getAttribute("data-feed-url");
  var blogHome = grid.getAttribute("data-blog-home") || "https://cloudcommercialholdings.github.io/CCH-BLOGS/";
  var fallbackAuthor = "CCH";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function textOf(node, selector) {
    var el = node.querySelector(selector);
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function linkOf(entry) {
    var alt = entry.querySelector('link[rel="alternate"]') || entry.querySelector("link");
    return alt ? alt.getAttribute("href") || "" : "";
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function authorOf(entry) {
    var name = textOf(entry, "author > name") || textOf(entry, "author name");
    if (!name || name.toLowerCase() === "cotes") return fallbackAuthor;
    return name;
  }

  function tagsOf(entry) {
    return Array.prototype.map.call(entry.querySelectorAll("category"), function (cat) {
      return cat.getAttribute("term") || cat.textContent.trim();
    }).filter(Boolean);
  }

  function truncate(text, words) {
    var parts = text.split(/\s+/).filter(Boolean);
    if (parts.length <= words) return text;
    return parts.slice(0, words).join(" ") + "…";
  }

  function showError(message) {
    grid.innerHTML =
      '<div class="error-state">' +
        "<h3>Couldn’t load posts</h3>" +
        "<p>" + escapeHtml(message) + "</p>" +
        '<a class="retry-btn" href="' + escapeHtml(blogHome) + '">Open the blog</a>' +
      "</div>";
  }

  function render(entries) {
    if (!entries.length) {
      grid.innerHTML =
        '<div class="empty-state">' +
          "<h3>No Blog Posts Yet</h3>" +
          "<p>Check back soon for insights on cloud technology and digital transformation!</p>" +
        "</div>";
      return;
    }

    grid.innerHTML = entries.map(function (entry) {
      var title = textOf(entry, "title");
      var href = linkOf(entry);
      var summary = truncate(textOf(entry, "summary") || textOf(entry, "content"), 25);
      var date = formatDate(textOf(entry, "published") || textOf(entry, "updated"));
      var author = authorOf(entry);
      var tags = tagsOf(entry).slice(0, 3);
      var tagHtml = tags.map(function (tag) {
        return '<span class="blog-tag">' + escapeHtml(tag) + "</span>";
      }).join("");

      return (
        '<a class="blog-tile" href="' + escapeHtml(href) + '">' +
          '<div class="external-link" title="Read on CCH Blogs">↗</div>' +
          '<div class="blog-tile-image placeholder" aria-hidden="true">CCH</div>' +
          '<div class="blog-tile-content">' +
            '<div class="blog-tile-meta">' +
              (date ? '<span class="blog-tile-date">' + escapeHtml(date) + "</span>" : "") +
              '<span class="blog-tile-author">' + escapeHtml(author) + "</span>" +
            "</div>" +
            '<h3 class="blog-tile-title">' + escapeHtml(title) + "</h3>" +
            (summary ? '<p class="blog-tile-excerpt">' + escapeHtml(summary) + "</p>" : "") +
            (tagHtml ? '<div class="blog-tile-tags">' + tagHtml + "</div>" : "") +
          "</div>" +
          '<div class="blog-tile-footer">' +
            '<span class="read-more">Read Full Article</span>' +
          "</div>" +
        "</a>"
      );
    }).join("");
  }

  fetch(feedUrl, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("Feed request failed (" + res.status + ")");
      return res.text();
    })
    .then(function (xmlText) {
      var doc = new DOMParser().parseFromString(xmlText, "application/xml");
      if (doc.querySelector("parsererror")) throw new Error("Feed was not valid XML");
      render(Array.prototype.slice.call(doc.querySelectorAll("entry")));
    })
    .catch(function (err) {
      showError(err.message || "Please try again in a moment.");
    });
})();
