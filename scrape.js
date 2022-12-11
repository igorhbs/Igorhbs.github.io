// Use beautifulsoup4 to scrape text data from Google Trends
const scrapeTextData = async (query) => {
  const response = await fetch(`https://trends.google.com/trends/explore?q=${query}`);
  const html = await response.text();
  const document = new DOMParser().parseFromString(html, 'text/html');
  const relatedQueries = document.querySelectorAll(".related-query");
  const mainQueries = [...relatedQueries].map((query) => query.innerText.trim());
  const subregions = document.querySelectorAll(".subregion-percentage-container");
  const subregionalQueries = [...subregions].map((region) => {
    const regionName = region.querySelector(".subregion-name").innerText.trim();
    const queries = [...region.querySelectorAll("div.related-query")].map(
      (query) => query.innerText.trim()
    );
    return {
      regionName,
      queries,
    };
  });
  return {
    mainQueries,
    subregionalQueries,
  };
};
