  // Use beautifulsoup4 to scrape data from Google Trends
    const scrapeData = async (query) => {
      const response = await fetch(`https://trends.google.com/trends/api/explore?hl=en-US&q=${query}`);
      const html = await response.text();
      const document = new DOMParser().parseFromString(html, 'text/html');
      const scriptText = document.querySelector("script").innerText;
      const jsonString = scriptText.slice(scriptText.indexOf("{"), -2);
      const json = JSON.parse(jsonString);
      const relatedQueries = json.widgets[0].content.relatedQueries;
      const mainQueries = relatedQueries.reduce((acc, curr) => {
        acc.push(curr.query);
        return acc;
      }, []);
      const subregionalData = json.widgets[1].content.subregions;
      const subregionalQueries = subregionalData.reduce((acc, curr) => {
        const region = curr.displayName;
        const queries = curr.subregionValueSets.reduce((acc, curr) => {
          const queries = curr.values.reduce((acc, curr) => {
            acc.push({
              query: curr.name,
              value: curr.value,
            });
            return acc;
          }, []);
          acc[region] = queries;
          return acc;
        }, {});
        acc.push(queries);
        return acc;
      }, []);
      return {
        mainQueries,
        subregionalQueries,
      };
    };

    // Use d3.js v6 to display the data in a chart
    const displayData = (mainQueries, subregionalQueries) => {
      const margin = {
        top: 100,
        right: 20,
        bottom: 30,
        left: 40,
      };
      const width = 800 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const x = d3
        .scaleBand()
        .domain(mainQueries)
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear().range([height, 0]);

      const svg = d3
        .select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      subregionalQueries.forEach((regionData) => {
        const regionName = Object.keys(regionData)[0];
        const regionDataPoints = regionData[regionName].map((d) => d.value);
        y.domain([0, d3.max(regionDataPoints)]);
        svg
          .selectAll(".bar")
          .data(regionData[regionName])
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("fill", `#${Math.random().toString(16).slice(2, 8)}`)
          .attr("x", (d) => x(d.query))
          .attr("width", x.bandwidth())
          .attr("y", (d) => y(d.value))
          .attr("height", (d) => height - y(d.value))
          .append("title")
          .text(regionName);
      });

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y));
    };

    // Update chart with new query
    const updateData = async () => {
      const query = document.getElementById("query").value;
      const data = await scrapeData(query);
      displayData(data.mainQueries, data.subregionalQueries);
    };
