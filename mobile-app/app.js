function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
        reject,
      );
    }
  });
}

async function handleOrderNow(e) {
  e.preventDefault();
  const status = document.getElementById('status');
  status.textContent = 'Placing order…';
  try {
    const location = await getLocation();
    status.textContent = `Fuel will be delivered to: ${location}`;
  } catch (err) {
    status.textContent = `Unable to get location: ${err.message}`;
  }
}

async function handleSchedule(e) {
  e.preventDefault();
  const time = document.getElementById('delivery-time').value;
  const address = document.getElementById('address').value;
  const status = document.getElementById('schedule-status');
  status.textContent = `Scheduled for ${time} at ${address}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const nowForm = document.getElementById('now-form');
  if (nowForm) nowForm.addEventListener('submit', handleOrderNow);
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) scheduleForm.addEventListener('submit', handleSchedule);
});
