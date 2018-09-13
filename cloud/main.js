Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('search', function(req, res) {
  var query = createFullTextQuery(req, "i", req.params.itemName)
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

Parse.Cloud.beforeSave("Listings", function(request, response) {
  var forSale = Boolean(request.object.get("BuySell"));
  var outsideOfSchool = Boolean(request.object.get("visibleBeyondSchool"));
  request.object.set("showInSearch", forSale && outsideOfSchool);
  response.success();
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

Parse.Cloud.define('refer/:id', function(req, res) {
  const Gold = Parse.Object.extend("Gold");
	const query = new Parse.Query(Gold);
	query.equalTo("userID", req.params.id);
	console.log(req.params.id);
	query.first().then((goldStatus) => {
		console.log(goldStatus.get("totalReferralsMade"))
		goldStatus.set(1)
	  goldStatus.save()
		res.redirect(301, 'https://itunes.apple.com/us/app/unimarkit/id1377345929?mt=8');
	}, (error) => {
		console.log(error);
		console.log("logged error")
		res.redirect(404, 'https://itunes.apple.com/us/app/unimarkit/id1377345929?mt=8');
	});
})

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
