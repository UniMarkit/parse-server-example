
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('search', function(req, res) {
  var query = new Parse.Query("Listings");
  if(req.params.currentUser !== null) {
    query.notEqualTo("sellerID", req.params.currentUser);
  }
  query.equalTo("buySell", true);
  query.fullText("itemName", req.params.itemName)
  query.ascending('$score');
  query.select('$score');
  query.find()
    .then(function(results) {
      response.success(results);
    })
    .catch(function(error) {
      console.log(error);
    })


});
