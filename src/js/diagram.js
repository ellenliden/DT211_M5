// diagram.js

/**
 * Hämtar JSON-data från extern källa
 * @returns {Promise<Array>} array med dataobjekt
 */
async function fetchData() {
  const response = await fetch("https://studenter.miun.se/~mallar/dt211g/");
  const data = await response.json();
  return data;
}

/**
 * Skapar ett stapeldiagram över mest sökta kurser
 * @param {Array} data - JSON-data med statistik
 */
function renderBarChart(data) {
  const topCourses = data
    .filter((item) => item.type === "Kurs")
    .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
    .slice(0, 6);

  const ctx = document.getElementById("barChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: topCourses.map((course) => course.name),
      datasets: [
        {
          label: "Antal sökande",
          data: topCourses.map((course) => course.applicantsTotal),
          backgroundColor: "#b77a7a",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

/**
 * Skapar ett cirkeldiagram över mest sökta program
 * @param {Array} data - JSON-data med statistik
 */
function renderPieChart(data) {
  const topPrograms = data
    .filter((item) => item.type === "Program")
    .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
    .slice(0, 5);

  const ctx = document.getElementById("pieChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: topPrograms.map((p) => p.name),
      datasets: [
        {
          label: "Antal sökande",
          data: topPrograms.map((p) => p.applicantsTotal),
          backgroundColor: [
            "#00587b", // primary
            "#b77a7a", // secondary
            "#ffbdbd", // accent
            "#3386a3", // light primary 1
            "#66a9c1", // light primary 2
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// kör funktionerna
fetchData().then((data) => {
  renderBarChart(data);
  renderPieChart(data);
});
