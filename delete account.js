<button id="deleteAccountBtn" onclick="deleteAccount()">Delete Account</button>

<script>
function deleteAccount() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "delete_account.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    var userId = 123; // Replace with actual user ID (session or hidden field)
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText == "success") {
                alert("Account deleted.");
                window.location.href = "goodbye.php"; // Redirect after delete
            } else {
                alert("Error deleting account.");
            }
        }
    };
    
    xhr.send("user_id=" + userId);
}
</script>
