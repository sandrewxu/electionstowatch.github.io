// Wait for the document to be ready before running jQuery code
$(document).ready(function() {
  const tooltip = $('#tooltip');

  fetch('elections.json')
    .then(response => response.json())
    .then(data => {
      const electionData = data.electionData;
      const stateSpecificStyles = {};
      const stateSpecificHoverStyles = {};
      const stateSpecificLabelBackingStyles = {};
      const stateSpecificLabelBackingHoverStyles = {};

      // Populate footer
      const lastUpdated = new Date(data.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      $('#last-updated').text(lastUpdated);
      $('#contact-link').attr('href', `mailto:${data.contactEmail}`);

      // Prepare state-specific styles for states and their labels
      for (const state in electionData) {
        if (electionData.hasOwnProperty(state)) {
          const highlightColor = '#FDB813';
          const hoverColor = '#ffD700';
          stateSpecificStyles[state] = { fill: highlightColor };
          stateSpecificHoverStyles[state] = { fill: hoverColor };
          stateSpecificLabelBackingStyles[state] = { 
            fill: highlightColor,
            stroke: '#333333',
            'stroke-width': 1,
            'fill-opacity': 0.9
          };
          stateSpecificLabelBackingHoverStyles[state] = { 
            fill: hoverColor,
            stroke: '#333333',
            'stroke-width': 1,
            'fill-opacity': 0.9
          };
        }
      }

      $('#map').usmap({
        stateStyles: {
          fill: '#d3d3d3',
          "stroke-width": 1,
          'stroke' : '#ffffff'
        },
        stateHoverStyles: {
          fill: '#b0b0b0'
        },
        labelBackingStyles: {
          fill: '#d3d3d3'
        },
        labelBackingHoverStyles: {
          fill: '#b0b0b0'
        },
        
        // Apply all state-specific styles
        stateSpecificStyles: stateSpecificStyles,
        stateSpecificHoverStyles: stateSpecificHoverStyles,
        stateSpecificLabelBackingStyles: stateSpecificLabelBackingStyles,
        stateSpecificLabelBackingHoverStyles: stateSpecificLabelBackingHoverStyles,
        
        showLabels: true,
        labelWidth: 20,
        labelHeight: 15,
        labelGap: 6,
        labelRadius: 3,
        labelTextStyles: {
            fill: "#222",
            'font-size': '10px',
            'font-weight': 'bold',
            'text-anchor': 'middle'
        },
        labelBackingStyles: {
            fill: '#ffffff',
            stroke: '#cccccc',
            'stroke-width': 1,
            'fill-opacity': 0.85
        },
        labelBackingHoverStyles: {
            fill: '#f0f0f0',
            stroke: '#999999',
            'stroke-width': 1
        },

        click: function(event, data) {
          const stateElections = electionData[data.name];
          openModal(data.name, stateElections);
        },
        
        // Hover functionality
        mouseover: function(event, data) {
            const stateElections = electionData[data.name];
            let tooltipText = `<strong>${data.name}</strong><br>`;
            if (stateElections) {
                tooltipText += `${stateElections.elections.length} upcoming election(s)`;
            } else {
                tooltipText += "No upcoming elections";
            }
            tooltip.html(tooltipText).css({
                top: event.pageY - 40, // Position tooltip above cursor
                left: event.pageX + 10  // Position tooltip to the right of the cursor
            }).show();
        },
        mouseout: function(event, data) {
            tooltip.hide();
        },
        mousemove: function(event, data) {
            tooltip.css({
                top: event.pageY - 40, // Position tooltip above cursor
                left: event.pageX + 10  // Position tooltip to the right of the cursor
            });
        }
      });
    })
    .catch(error => console.error('Error loading election data:', error));

  // Modal functionality
  const modal = $('#info-modal');
  const closeBtn = $('.close-btn');

  function openModal(stateName, stateData) {
    $('#modal-state-name').text(`Upcoming Elections in ${stateName}`);
    const electionsList = $('#modal-elections-list');
    electionsList.empty();

    if (stateData && stateData.elections.length > 0) {
      stateData.elections.forEach(election => {
        const electionItem = `
          <div class="election-item">
            <h4>${election.title}</h4>
            <p><strong>Date:</strong> ${election.date}</p>
            <p><strong>Candidates:</strong> ${election.candidates}</p>
            <p><strong>At Stake:</strong> ${election.stakes}</p>
          </div>
        `;
        electionsList.append(electionItem);
      });
    } else {
      electionsList.append('<p>There are no major upcoming elections to display for this state.</p>');
    }

    modal.show();
  }

  function closeModal() {
    modal.hide();
  }

  closeBtn.on('click', closeModal);
  $(window).on('click', function(event) {
    if ($(event.target).is(modal)) {
      closeModal();
    }
  });
});

// --- Side Panel Logic ---

// Store the detailed information for each state
const stateDetails = {
    'CA': {
        title: 'California',
        content: 'California is a western U.S. state, stretching from the Mexican border along the Pacific for nearly 900 miles...'
    },
    'CO': {
        title: 'Colorado',
        content: 'Colorado, a western U.S. state, has a diverse landscape of arid desert, river canyons and snow-covered Rocky Mountains...'
    },
    'FL': {
        title: 'Florida',
        content: 'Florida is the southeasternmost U.S. state, with the Atlantic on one side and the Gulf of Mexico on the other...'
    },
    'NY': {
        title: 'New York',
        content: 'New York is a state in the northeastern U.S., known for New York City and the iconic Statue of Liberty...'
    }
    // ... add details for all other states you want to be interactive
};

function openPanel(stateAbbr) {
    const details = stateDetails[stateAbbr];
    if (details) {
        // Populate the panel with the state's information
        $('#panel-title').text(details.title);
        $('#panel-content').text(details.content);

        // Open the panel using jQuery's .css() method
        $('#side-panel').css('width', '350px');
    }
}

function closePanel() {
    // Close the panel
    $('#side-panel').css('width', '0');
}
