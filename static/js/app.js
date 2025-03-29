// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const selection = metadata.find(item => item.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(selection).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("p").html(`${key.toUpperCase()}: ${value}`)
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples
    
    // Filter the samples for the object with the desired sample number
    selectedSample = samples.find(item => item.id == sample)

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = selectedSample.otu_ids
    const otu_labels = selectedSample.otu_labels
    const sample_values = selectedSample.sample_values

    // Build a Bubble Chart
    const trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:'markers',
      marker:{
        size: sample_values,
        color: otu_ids
      },
    };

    const chartData = [trace]

    const layout = {
      title: {
        text: "Bacteria Cultures Per Sample"
      },
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      }
    }

    // Render the Bubble Chart
    Plotly.newPlot("bubble", chartData, layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const new_ids = otu_ids.map(item => `OTU ${item}`)
    

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const xVals = sample_values.slice(0,10).reverse();
    const yVals = new_ids.slice(0,10).reverse();
    const labels = otu_labels.slice(0,10).reverse();

    const barChart = {
      x: xVals,
      y: yVals,
      text: labels,
      type: "bar",
      orientation: "h"
    };

    barData = [barChart]

    const barLayout = {
      title: "Top 10 OTUs Present",
      xaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      },
    }

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((id) => {
      console.log("ID: ", id)

      dropdown.append("option")
      .text(id)
      .property("value", id)
    });

    // Get the first sample from the list
    const firstSample = names[0]

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample)
    buildMetadata(firstSample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)

}

// Initialize the dashboard
init();