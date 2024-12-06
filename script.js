$(document).ready(function () {
    let userData = []; // Store the fetched data
  
    // Fetch users from JSON
    $.getJSON("users.json", function (data) {
      userData = data; // Cache the data
      displayTable(data);
  
      // Add event listeners for filtering
      $("#search").on("input", applyFilters);
      $("#ageRange").on("change", applyFilters);
      $("#emailDomain").on("input", applyFilters);
      $("#sortBy").on("change", applyFilters); // Add event listener for sort dropdown
  
      // Sort functionality
      $("th").on("click", function () {
        const sortKey = $(this).data("sort");
        const sortedData = [...userData].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
        displayTable(sortedData);
      });
    });
  
    // Filter and display table
    function applyFilters() {
      const searchTerm = $("#search").val().toLowerCase();
      const ageRange = $("#ageRange").val();
      const emailDomain = $("#emailDomain").val().toLowerCase();
      const sortBy = $("#sortBy").val(); // Get the sort option
  
      let filteredData = userData.filter(user => {
        const matchesSearch =
          Object.values(user).some(value => value.toString().toLowerCase().includes(searchTerm));
        const matchesAgeRange = matchAgeRange(user.age, ageRange);
        const matchesEmailDomain = emailDomain
          ? user.email.toLowerCase().endsWith(emailDomain)
          : true;
  
        return matchesSearch && matchesAgeRange && matchesEmailDomain;
      });
  
      // Apply sorting based on selected option
      if (sortBy) {
        filteredData = filteredData.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return -1;
          if (a[sortBy] > b[sortBy]) return 1;
          return 0;
        });
      }
  
      displayTable(filteredData);
    }
  
    // Match age range
    function matchAgeRange(age, range) {
      if (!range) return true;
      const [min, max] = range.split("-").map(Number);
      if (max) return age >= min && age <= max;
      return age >= min; // For "41+"
    }
  
    // Display table
    function displayTable(users) {
      const rows = users.map(user => `
        <tr>
          <td><img src="${user.image}" alt="${user.username}" class="user-pic"></td>
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.age}</td>
        </tr>
      `);
      $("#userTable tbody").html(rows.join(""));
    } 
  });
  