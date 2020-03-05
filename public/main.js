window.onload = function() {
  var controlButton = document.getElementById('controlbutton');
  var source = new EventSource('/stream');
  var lockstatus = document.getElementById('lockstatus');
  var data = {
    data: ''
  };

  source.onmessage = function(event) {
    console.log(event);
    lockstatus.innerText = event.data;
    controlButton.style.display = 'inline';
  };

  controlButton.addEventListener('click', e => {
    var action = controlButton.innerText.toLowerCase();
    controlButton.style.display = 'none';
    console.log('sending request to ' + action + ' locks');
    data.data = action === 'deactivate' ? '1' : '0';

    fetch('/lockcontrol', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.text())
      .then(data => {
        console.log('Success:', data);
        // controlButton.style.display = 'block';
      })
      .catch(error => {
        controlButton.style.display = 'inline';
        console.error('Error:', error);
      });
  });
};
