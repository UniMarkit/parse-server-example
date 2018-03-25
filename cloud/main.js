
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('search', function(req, res) {
  var query = createFullTextQuery(req, "itemName", req.params.itemName)
  query.ascending('$score');
  query.select('$score');
  query.find()
    .then(function(results) {
      res.success(results);
    })
    .catch(function(error) {
      console.log(error);
    })
});

function createFullTextQuery(req, key, value) {
    var query = new Parse.Query("Listings");
    if(req.user !== undefined) {
      query.notEqualTo("sellerID", req.user.objectId);
    }
    query.equalTo("BuySell", true);
    query.fullText(key, value);
    return query;
}
