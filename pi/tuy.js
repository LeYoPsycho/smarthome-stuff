const TuyAPI = require('tuyapi');

const stromleiste = new TuyAPI({
    id: '012004762c3ae83ce114',
    key: '96a1451bead3bab4',
});

stromleiste.resolveId().then(() => {
    console.log("Device is ready!");
    stromleiste.get({schema: true}).then((data) => console.log("Data received:", data));
});