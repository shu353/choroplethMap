Promise.all([
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  )
    .then((res) => res.json())
    .then((res) => {
      educationData = res;
      console.log(educationData);
    }),
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  )
    .then((res) => res.json())
    .then((res) => {
      countyData = topojson.feature(res, res.objects.counties).features;
      console.log(countyData);
      drawMap(countyData, educationData);
    }),
]);

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawMap = (countyData, educationData) => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      const veryLow = 15;
      const low = 30;
      const avarage = 45;

      const idCounty = d["id"];
      const county = educationData.find((item) => item["fips"] === idCounty);
      const percentage = county["bachelorsOrHigher"];

      if (percentage <= veryLow) {
        return "tomato";
      } else if (percentage <= low) {
        return "orange";
      } else if (percentage <= avarage) {
        return "lightGreen";
      } else {
        return "green";
      }
    })
    .attr("data-fips", (d) => d["id"])
    .attr("data-education", (d) => {
      const idCounty = d["id"];
      const county = educationData.find((item) => item["fips"] === idCounty);
      const percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      const idCounty = d["id"];
      const county = educationData.find((item) => item["fips"] === idCounty);

      tooltip.text(
        `${county["area_name"]}, ${county["state"]} : ${county["bachelorsOrHigher"]}%  `
      );

      tooltip.attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
};
