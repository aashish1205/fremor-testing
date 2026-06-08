const url = 'https://botchursnmplaerazpsb.supabase.co/rest/v1/destinations?select=id,title,itinerary_route';
const options = {
  headers: {
    'apikey': 'sb_publishable_3MoXgQOFyH8KAPh4pm2UFA_aPVaWsoA',
    'Authorization': 'Bearer sb_publishable_3MoXgQOFyH8KAPh4pm2UFA_aPVaWsoA'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(data => {
    console.log("Itinerary Routes in DB:");
    data.forEach(pkg => {
      console.log(`Title: "${pkg.title}" | Route: "${pkg.itinerary_route}"`);
    });
  })
  .catch(err => console.error(err));
