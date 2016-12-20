function verify() {
  var passOne = document
    .getElementById('newpass1')
    .value;
  var passTwo = document
    .getElementById('newpass2')
    .value;
  if (passOne !== passTwo) {
    throw new Error('Passwords do not match');
  }
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open('PATCH', '/users', true);
  var id = window
    .location
    .pathname
    .split('/')
    .reverse()[0];
  console.log(id, passOne, passTwo);
}
