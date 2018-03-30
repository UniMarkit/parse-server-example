let stripe = require('stripe')(
  process.env.STRIPE_SECRET || "pk_live_UPv6bjQZbcXqgy2fNyZBiJXI"
);

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('search', function(req, res) {
  var query = createFullTextQuery(req, "itemName", req.params.itemName)
  query.ascending('$score');
  query.select(
    '$score',
    'objectId',
    'fee',
    'price',
    'sellerName',
    'updatedAt',
    'itemCategory',
    'itemDesc',
    'School',
    'sellerUsername',
    'Location',
    'imageFile',
    'sellerID',
    'createdAt',
    'userProfileImage',
    'itemName',
    // 'buyerName'
  );
  query.find()
    .then(function(results) {
      res.success(results);
    })
    .catch(function(error) {
      console.log(error);
    })
});

Parse.Cloud.define('hasConnectedStripe', function(req, res) {
  // var query = new Parse.Query("User");
  res.success(false);
  // query.find()
  //   .then(function(results) {
  //     res.success(results);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   })
});

// Parse.Cloud.define('testSearch', function(req, res) {
//   var query = new Parse.Query("Listings");
//   console.error(req.user.id);
//   console.error(req.user['objectId']);
//   console.error(JSON.stringify(req.user, null, 4));
//   query.notEqualTo("sellerID", req.user.id);
//   query.ascending('$score');
//   query.select('$score');
//   query.find()
//     .then(function(results) {
//       res.success(results);
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// });

Parse.Cloud.define('acceptStripeKey', function(req, res) {
  console.log(req);
  res.success("Hi");
});

function createFullTextQuery(req, key, value) {
    var query = new Parse.Query("Listings");
    if(req.user !== undefined) {
      query.notEqualTo("sellerID", req.user.id);
    }
    query.equalTo("BuySell", true);
    query.fullText(key, value);
    return query;
}
