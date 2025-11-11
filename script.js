// Wait for the page to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    
    const predictionForm = document.getElementById("prediction-form");
    const resultElement = document.getElementById("prediction-result");
    const submitButton = document.getElementById("submit-button");
// Listen for the form to be submitted
    predictionForm.addEventListener("submit", (event) => {
        
        // 1. Stop the default form submission (which reloads the page)
        event.preventDefault();
        // Show a "loading" state
        submitButton.disabled = true;
        submitButton.innerText = "Getting prediction...";
        resultElement.innerText = "...";
        // 2. Grab the data from the form
        // (You must match these IDs to your HTML)
        const medInc = document.getElementById("med-inc").value;
        const houseAge = document.getElementById("house-age").value;
        const avgRooms = document.getElementById("avg-rooms").value;
        // Create the JSON payload to send to our "brain"
        // The structure of this JSON must match what your Vertex AI endpoint expects!
        const payload = {
            // This 'instances' key is often required by Vertex AI
            instances: [
                {
                    // Ensure the feature names here match your model's training
                    "MedInc": parseFloat(medInc),
                    "HouseAge": parseFloat(houseAge),
                    "AveRooms": parseFloat(avgRooms)
                    //... add all other features
                }
            ]
        };
        // 3. Send the data to our /predict endpoint
        // This endpoint doesn't exist *yet*. We will build it tomorrow inside
        // our Cloud Run app.
        fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            // 'data' is the JSON response from our "brain"
            // We'll format the prediction (e.g., $250,000.00)
            const prediction = data.predictions[0]; // Adjust based on your brain's response
            const formattedPrice = (prediction * 100000).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            
            resultElement.innerText = formattedPrice;
            submitButton.disabled = false;
            submitButton.innerText = "Get Prediction";
        })
        .catch(error => {
            console.error("Error:", error);
            resultElement.innerText = "Error getting prediction.";
            submitButton.disabled = false;
            submitButton.innerText = "Get Prediction";
        });
    });
});
