const request = require('request');
const cheerio = require('cheerio');
const d3 = require('d3');

// URL for the Google Trends page for the user's query
const googleTrendsUrl = 'https://trends.google.com/trends/trendingsearches/daily?q=';

// Function to scrape the Google Trends page for the user's query
const scrapeGoogleTrends = query => {
    request(googleTrendsUrl + query, (err, res, html) => {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            let mainQueries = [];
            let risingQueries = [];
            let regions = [];
            // Scrape the main query data
            $('.main-queries-list li').each((index, element) => {
                mainQueries.push($(element).text());
            });
            // Scrape the rising query data
            $('.rising-queries-list li').each((index, element) => {
                risingQueries.push($(element).text());
            });
            // Scrape the region data
            $('.region-list li').each((index, element) => {
                regions.push($(element).text());
            });
            // Pass the scraped data to the drawChart function
            drawChart(mainQueries, risingQueries, regions);
        }
    });
};

// Function to draw the chart using D3.js
const drawChart = (mainQueries, risingQueries, regions) => {
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', 800)
        .attr('height', 500);
    // Create a group element to hold the main and rising query data
    const mainGroup = svg.append('g')
        .attr('transform', 'translate(50, 50)');
    const risingGroup = svg.append('g')
        .attr('transform', 'translate(50, 150)');
    // Create a group element to hold the region data
    const regionGroup = svg.append('g')
        .attr('transform', 'translate(50, 250)');
    // Create a scale to map the data to the chart
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(mainQueries.concat(risingQueries).concat(regions))])
        .range([0, 600]);
    // Draw the main query bars
    mainGroup.selectAll('rect')
        .data(mainQueries)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 25)
        .attr('width', d => xScale(d))
        .attr('height', 20)
        .attr('fill', '#0099cc');
    // Draw the rising query bars
    risingGroup.selectAll('rect')
        .data(risingQueries)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 25)
        .attr('width', d => xScale(d))
        .attr('height', 20)
        .attr('fill', '#ff9900');
    // Draw the region bars
    regionGroup.selectAll('rect')
        .data(regions)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 25)
        .attr('width', d => xScale(d))
        .attr('height', 20)
        .attr('fill', '#00ccff');
};

// Function to update the chart data when the user enters a new query
const updateData = () => {
    let query = document.getElementById('query').value;
    scrapeGoogleTrends(query);
};
