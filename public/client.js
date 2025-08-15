document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('testForm');
  const resultDiv = document.getElementById('jsonResult');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const params = new URLSearchParams();
      
      for (const pair of formData.entries()) {
        params.append(pair[0], pair[1]);
      }
      
      fetch('/api/stock-prices?' + params.toString())
        .then(response => response.json())
        .then(data => {
          if (resultDiv) {
            resultDiv.textContent = JSON.stringify(data, null, 2);
          }
        })
        .catch(error => {
          if (resultDiv) {
            resultDiv.textContent = 'Error: ' + error.message;
          }
        });
    });
  }
});