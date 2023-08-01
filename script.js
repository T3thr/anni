// Initialize Firebase (Replace with your Firebase config)
const firebaseConfig = {
  "type": "service_account",
  "project_id": "anni-e336f",
  "private_key_id": "1ff19f993d6a2c1f53025c144edf02964d4cd94b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCvOXg/khfeOAll\nYTmMZnYReRcdOuc96VoBaa6WwG77ZBqXiHupjpNPeYSD45cLAufVz/GiZ/gzJZTc\nu+OW6h/oYp5S+z4h2koab7NmxfCfd8JpBc3l2GO3wrnPHbgFDXYOeHMtO38wZBYb\nERA5rF/N/IxzvRG4HTHzI1U+lrjE6V02CPfzfdJzBBOBEj2TcKNmW5df5AmuHHMY\n4i12WCbp3knhm88PZD1YDzc6NpIAp1OdJuJ+pPVH2H8fvc/C1uUCdGl/5To7zjUI\njLH7B4crC9aP5QcD0ExcnhrAJlXPWspENRepP5Px2Ea3wKj7szNgzdoeV6Pa4h6U\n0FMJG/OHAgMBAAECggEAIF27tfZc3Um5hpXuZN46OeEFoXsTYq67Vt54BtWVym7D\nsLDfssKouDnofdoouLp5K1flOMv+nyf2ds1n7STi7vBkcUyCPguNu5NdboLqfvJG\noVKWpTmStctMuhKxvpEteN/L2pOOW1hpcud0eUq7SZe4M9q9LqaJ5vDkWpLJn2ly\n1tRxUwRIgvAldELMwR6yGNsYECmis9sDfbwOIy7uzwiehPl5hYT59RIpREbIcRel\nkgwMahUmQNeQ6jnkBcb5HHSjhV5Ywl54wfLSSeeaSfopDKXI3/3l8ADlVzj2C+fn\naYmeR3m3uvNz22EZfK5ukdCrozpHdZ6pyYXqM2NiPQKBgQDwKqdwAviN3mil3d6w\nDH0JWr+az6XWnGiG9bWLqSazc3RDHnFI2U4BEjiZncRp+mTHXdk2Y67p/ruvW48H\nVvPfFEO2zd/x+LH7XC6lRYy7PTya41ukkih/01ptBE/gRiAHuw1Xh2zOd4H5m775\nLjoQC+U+2ov0SK8KIooKL4b/5QKBgQC6xsXXK07gS3cpqT6BwqQldWUsmCiRi5+n\n5mgBkAMgtqPv/sUs5TKzShjXm/VfFZm8NJxiPsXc+RLK+GOlaz3tfEupVmb7Ca34\nd4oa8mhczuSfhonL48LZFtmNvDZFuX0tXPeUoUH4gMXLX6MODPsH2yBMmT5X19tE\nZ59ftuX2+wKBgQDEejC220daULyODX/zyJO2Rm6ACSZj91swJe2azwwhPO+9RTdq\nYJSHHc/+JGqeRMGTtHxSGaTsO4ByClZtq74hHyPydmSiQVHiEFz8ynRCbeuZzyyW\n6xeE03SjwSZTlSr5CBb3J4xlMLG9caP/mMjZfdHS5NogRCInCXCiupUX3QKBgQCe\nBf7tBV8+tZqkTOTttFhcuO5YxIPOYGs8CtyENevviZc6PjtkuKYkutQ512HKiOQB\nMCH/nUyaoMEdqPnlws4qV7dMFiYazx250qmuEtnpa8JSlemP76uzMHnwSQVCCKW3\n86gkwCqorYqrfsbd5G2fP+4b4Ku2dpK1VVaqDHyUcQKBgQCkQ4cEqNiMQrFMrAB1\nT+eEEZletJbpI0fbdeeVK1EN7BKKNeJi2M06DdGSbzhjJ230e+cwVNo5SVDZTve/\nJzOOWKmSp+oVAamUyLWZ8ts9ensswO1n/itk3y2SgmaEFZZaAvV+Ltac1YmU5Rex\nhuUvWWr9hdOZXUB9RvQgiAKpLQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-6jr5v@anni-e336f.iam.gserviceaccount.com",
  "client_id": "109646188730468841330",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6jr5v%40anni-e336f.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

document.getElementById('wish-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; // Get the first selected file (if any)

  if (message.trim() !== '') {
    const newWish = {
      name: name || 'Anonymous',
      message,
      pictureURL: null
    };

    if (pictureFile) {
      const pictureReader = new FileReader();
      pictureReader.onload = function() {
        const pictureURL = pictureReader.result;
        newWish.pictureURL = pictureURL;
        saveWish(newWish);
        showThankYouAlert();
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      saveWish(newWish);
      showThankYouAlert();
    }

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';
  }
});

function showThankYouAlert() {
  alert('Thank you for your wishes!');
}

function saveWish(newWish) {
  db.collection('wishes')
    .add(newWish)
    .catch(error => {
      console.error('Error saving wish:', error);
    });
}
