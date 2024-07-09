import 'chart.js/dist/chart.min.js'

document.addEventListener('turbolinks:load', () => {
  // last week new users
  const labels = gon.label;

  if (document.getElementById('newUsers') != null) {
    const new_users_datapoints =  gon.new_users_last_week;
    const new_users_data = {
      labels: labels,
      datasets: [
        {
          label: 'New Users',
          data: new_users_datapoints,
          borderColor: '#ff7733',
          backgroundColor: '#ffccb3',
          borderWidth: 2,
        },
      ]
    };
    const new_users_config = {
      type: 'bar',
      data: new_users_data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Last week new users (included all companies)'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
          },
        }
      }
    };

    const myChart = new Chart(
      document.getElementById('newUsers'),
      new_users_config
    );
  }

  // last week active users
  if (document.getElementById('activeSessions') != null) {
    const active_sessions_datapoints = gon.active_sessions_last_week;
    const active_sessions_data = {
      labels: labels,
      datasets: [
        {
          label: 'Active Sessions',
          data: active_sessions_datapoints,
          borderColor: '#79d2a6',
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        }
      ]
    };

    const active_sessions_config = {
      type: 'line',
      data: active_sessions_data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Last week active sessions (included all companies)'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          y: {
            min: 0,
            max: 100,
          },
        }
      },
    }

    const activeSessions = new Chart(
      document.getElementById('activeSessions'),
      active_sessions_config
    );
  }

  if (document.getElementById('earning') != null) {
    const earning_last_week = gon.earning_last_week;

    const earning_data = {
      labels: labels,
      datasets: [
        {
          label: 'Earnings',
          data: earning_last_week,
          borderColor: '#1ac6ff',
          backgroundColor: '#b3ecff',
        },
      ]
    };

    const earning_config = {
      type: 'line',
      data: earning_data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Last week earnings (included all companies)'
          }
        },
        scales: {
          y: {
            min: 0,
            display: true,
            title: {
              display: true,
              text: 'Dollars',
              color: '#0086b3',
            }
          },
        }
      },
    };
    const earning = new Chart(
      document.getElementById('earning'),
      earning_config
    );
  }
});
