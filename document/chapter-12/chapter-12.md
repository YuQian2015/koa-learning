## 数据操作

### 文档的关联

https://stackoverflow.com/questions/21142524/mongodb-mongoose-how-to-find-subdocument-in-found-document

MongoDB, Mongoose: How to find subdocument in found document

I'm stuck on trying to get subdocument by `_id` in found document.

Example Schema

```
var User = mongoose.Schema({
        name:       String,
        photos:    [{src: String, title: String}]
    });
var Team = db.model('Team', Team);
```

Now I'm getting one user:

```
myUser = User.findOne(...)...
```

How can I get now `src` of his photo by it's `_id` (or `title`)?

Something like:

```
myUser.photos.findOne({'_id': myId})
```

You need to either create a NEW Schema for your embedded documents, or leave the type declaration as a blank array so `mongoose` interprets as a `Mixed` type.

```
var userSchema = new mongoose.Schema({
  name: String,
  photos: []
});
var User = mongoose.model('User', userSchema);
```

### -- OR --

```
var userSchema = new mongoose.Schema({
  name: String,
  photos: [photoSchema]
});

var photoSchema = new mongoose.Schema({
  src: String,
  title: String
});

var User = mongoose.model('User', userSchema);
```

And then you can save thusly:

```
var user = new User({
  name: 'Bob',
  photos: [ { src: '/path/to/photo.png' }, { src: '/path/to/other/photo.png' } ]
});

user.save();
```

From here, you can simply use array primitives to find your embedded docs:

```
User.findOne({name: 'Bob'}, function (err, user) {

  var photo = user.photos.filter(function (photo) {
    return photo.title === 'My awesome photo';
  }).pop();

  console.log(photo); //logs { src: '/path/to/photo.png', title: 'My awesome photo' }
});
```

### -- OR --

You can use the special `id()` method in embedded docs to look up by id:

```
User.findOne({name: 'Bob'}, function (err, user) {
    user.photos.id(photo._id);
});
```

You can read more here: <http://mongoosejs.com/docs/subdocs.html>

Make sure you **DON'T** register the schema with mongoose, otherwise it will create a new collection. Also keep in mind that if the child documents are searched for often, it would be a good idea to use refs and population like below. Even though it hits the DB twice, its much faster because of indexing. Also, `mongoose` will bonk on double nesting docs (i.e. The children have children docs as well)

```
var user = mongoose.Schema({
  name: String,
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
});

var photo = mongoose.Schema({
  src: String,
  title: String
});

User
  .findOne({ name: 'foo' })
  .populate('photos')
  .exec(function (err, user) {
    console.log(user.photos[0].src);
  });
```

Relevant docs can be found here <http://mongoosejs.com/docs/populate.html>



### http://mongoosejs.com/docs/populate.html

## Populate

MongoDB has the join-like [$lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/) aggregation operator in versions >= 3.2. Mongoose has a more powerful alternative called `populate()`, which lets you reference documents in other collections.

Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, plain object, multiple plain objects, or all objects returned from a query. Let's look at some examples.

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var Story = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);
```

So far we've created two [Models](http://mongoosejs.com/docs/models.html). Our `Person` model has its `stories` field set to an array of `ObjectId`s. The `ref`option is what tells Mongoose which model to use during population, in our case the `Story` model. All `_id`s we store here must be document `_id`s from the `Story` model.

**Note**: `ObjectId`, `Number`, `String`, and `Buffer` are valid for use as refs. However, you should use `ObjectId` unless you are an advanced user and have a good reason for doing so.

### [Saving refs](http://mongoosejs.com/docs/populate.html#saving-refs)

Saving refs to other documents works the same way you normally save properties, just assign the `_id` value:

```
var author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

author.save(function (err) {
  if (err) return handleError(err);

  var story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});
```

### [Population](http://mongoosejs.com/docs/populate.html#population)

So far we haven't done anything much different. We've merely created a `Person` and a `Story`. Now let's take a look at populating our story's `author` using the query builder:

```
Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"
  });
```

Populated paths are no longer set to their original `_id` , their value is replaced with the mongoose document returned from the database by performing a separate query before returning the results.

Arrays of refs work the same way. Just call the [populate](http://mongoosejs.com/docs/api.html#query_Query-populate) method on the query and an array of documents will be returned *in place* of the original `_id`s.

### [Setting Populated Fields](http://mongoosejs.com/docs/populate.html#setting-populated-fields)

In Mongoose >= 4.0, you can manually populate a field as well.

```
Story.findOne({ title: 'Casino Royale' }, function(error, story) {
  if (error) {
    return handleError(error);
  }
  story.author = author;
  console.log(story.author.name); // prints "Ian Fleming"
});
```

### [Field Selection](http://mongoosejs.com/docs/populate.html#field-selection)

What if we only want a few specific fields returned for the populated documents? This can be accomplished by passing the usual [field name syntax](http://mongoosejs.com/docs/api.html#query_Query-select) as the second argument to the populate method:

```
Story.
  findOne({ title: /casino royale/i }).
  populate('author', 'name'). // only return the Persons name
  exec(function (err, story) {
    if (err) return handleError(err);

    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"

    console.log('The authors age is %s', story.author.age);
    // prints "The authors age is null'
  });
```

### [Populating Multiple Paths](http://mongoosejs.com/docs/populate.html#populating-multiple-paths)

What if we wanted to populate multiple paths at the same time?

```
Story.
  find(...).
  populate('fans').
  populate('author').
  exec();
```

If you call `populate()` multiple times with the same path, only the last one will take effect.

```
// The 2nd `populate()` call below overwrites the first because they
// both populate 'fans'.
Story.
  find().
  populate({ path: 'fans', select: 'name' }).
  populate({ path: 'fans', select: 'email' });
// The above is equivalent to:
Story.find().populate({ path: 'fans', select: 'email' });
```

### [Query conditions and other options](http://mongoosejs.com/docs/populate.html#query-conditions)

What if we wanted to populate our fans array based on their age, select just their names, and return at most, any 5 of them?

```
Story.
  find(...).
  populate({
    path: 'fans',
    match: { age: { $gte: 21 }},
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id',
    options: { limit: 5 }
  }).
  exec();
```

### [Refs to children](http://mongoosejs.com/docs/populate.html#refs-to-children)

We may find however, if we use the `author` object, we are unable to get a list of the stories. This is because no `story` objects were ever 'pushed' onto `author.stories`.

There are two perspectives here. First, you may want the `author` know which stories are theirs. Usually, your schema should resolve one-to-many relationships by having a parent pointer in the 'many' side. But, if you have a good reason to want an array of child pointers, you can `push()` documents onto the array as shown below.

```
author.stories.push(story1);
author.save(callback);
```

This allows us to perform a `find` and `populate` combo:

```
Person.
  findOne({ name: 'Ian Fleming' }).
  populate('stories'). // only works if we pushed refs to children
  exec(function (err, person) {
    if (err) return handleError(err);
    console.log(person);
  });
```

It is debatable that we really want two sets of pointers as they may get out of sync. Instead we could skip populating and directly `find()` the stories we are interested in.

```
Story.
  find({ author: author._id }).
  exec(function (err, stories) {
    if (err) return handleError(err);
    console.log('The stories are an array: ', stories);
  });
```

The documents returned from [query population](http://mongoosejs.com/docs/api.html#query_Query-populate) become fully functional, `remove`able, `save`able documents unless the [lean](http://mongoosejs.com/docs/api.html#query_Query-lean) option is specified. Do not confuse them with [sub docs](http://mongoosejs.com/docs/subdocs.html). Take caution when calling its remove method because you'll be removing it from the database, not just the array.

### [Populating an existing document](http://mongoosejs.com/docs/populate.html#populate_an_existing_mongoose_document)

If we have an existing mongoose document and want to populate some of its paths, **mongoose >= 3.6** supports the [document#populate()](http://mongoosejs.com/docs/api.html#document_Document-populate) method.

### [Populating multiple existing documents](http://mongoosejs.com/docs/populate.html#populate_multiple_documents)

If we have one or many mongoose documents or even plain objects (_like [mapReduce](http://mongoosejs.com/docs/api.html#model_Model.mapReduce) output_), we may populate them using the [Model.populate()](http://mongoosejs.com/docs/api.html#model_Model.populate) method available in **mongoose >= 3.6**. This is what `document#populate()` and `query#populate()` use to populate documents.

### [Populating across multiple levels](http://mongoosejs.com/docs/populate.html#deep-populate)

Say you have a user schema which keeps track of the user's friends.

```
var userSchema = new Schema({
  name: String,
  friends: [{ type: ObjectId, ref: 'User' }]
});
```

Populate lets you get a list of a user's friends, but what if you also wanted a user's friends of friends? Specify the `populate` option to tell mongoose to populate the `friends` array of all the user's friends:

```
User.
  findOne({ name: 'Val' }).
  populate({
    path: 'friends',
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { path: 'friends' }
  });
```

### [Populating across Databases](http://mongoosejs.com/docs/populate.html#cross-db-populate)

Let's say you have a schema representing events, and a schema representing conversations. Each event has a corresponding conversation thread.

```
var eventSchema = new Schema({
  name: String,
  // The id of the corresponding conversation
  // Notice there's no ref here!
  conversation: ObjectId
});
var conversationSchema = new Schema({
  numMessages: Number
});
```

Also, suppose that events and conversations are stored in separate MongoDB instances.

```
var db1 = mongoose.createConnection('localhost:27000/db1');
var db2 = mongoose.createConnection('localhost:27001/db2');

var Event = db1.model('Event', eventSchema);
var Conversation = db2.model('Conversation', conversationSchema);
```

In this situation, you will **not** be able to `populate()` normally. The `conversation` field will always be null, because `populate()` doesn't know which model to use. However, [you can specify the model explicitly](http://mongoosejs.com/docs/api.html#model_Model.populate).

```
Event.
  find().
  populate({ path: 'conversation', model: Conversation }).
  exec(function(error, docs) { /* ... */ });
```

This is known as a "cross-database populate," because it enables you to populate across MongoDB databases and even across MongoDB instances.

### [Dynamic References](http://mongoosejs.com/docs/populate.html#dynamic-ref)

Mongoose can also populate from multiple collections at the same time. Let's say you have a user schema that has an array of "connections" - a user can be connected to either other users or an organization.

```
var userSchema = new Schema({
  name: String,
  connections: [{
    kind: String,
    item: { type: ObjectId, refPath: 'connections.kind' }
  }]
});

var organizationSchema = new Schema({ name: String, kind: String });

var User = mongoose.model('User', userSchema);
var Organization = mongoose.model('Organization', organizationSchema);
```

The `refPath` property above means that mongoose will look at the `connections.kind` path to determine which model to use for `populate()`. In other words, the `refPath` property enables you to make the `ref` property dynamic.

```
// Say we have one organization:
// `{ _id: ObjectId('000000000000000000000001'), name: "Guns N' Roses", kind: 'Band' }`
// And two users:
// {
//   _id: ObjectId('000000000000000000000002')
//   name: 'Axl Rose',
//   connections: [
//     { kind: 'User', item: ObjectId('000000000000000000000003') },
//     { kind: 'Organization', item: ObjectId('000000000000000000000001') }
//   ]
// },
// {
//   _id: ObjectId('000000000000000000000003')
//   name: 'Slash',
//   connections: []
// }
User.
  findOne({ name: 'Axl Rose' }).
  populate('connections.item').
  exec(function(error, doc) {
    // doc.connections[0].item is a User doc
    // doc.connections[1].item is an Organization doc
  });
```

### [Populate Virtuals](http://mongoosejs.com/docs/populate.html#populate-virtuals)

*New in 4.5.0*

So far you've only populated based on the `_id` field. However, that's sometimes not the right choice. In particular, [arrays that grow without bound are a MongoDB anti-pattern](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/). Using mongoose virtuals, you can define more sophisticated relationships between documents.

```
var PersonSchema = new Schema({
  name: String,
  band: String
});

var BandSchema = new Schema({
  name: String
});
BandSchema.virtual('members', {
  ref: 'Person', // The model to use
  localField: 'name', // Find people where `localField`
  foreignField: 'band', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
});

var Person = mongoose.model('Person', PersonSchema);
var Band = mongoose.model('Band', BandSchema);

/**
 * Suppose you have 2 bands: "Guns N' Roses" and "Motley Crue"
 * And 4 people: "Axl Rose" and "Slash" with "Guns N' Roses", and
 * "Vince Neil" and "Nikki Sixx" with "Motley Crue"
 */
Band.find({}).populate('members').exec(function(error, bands) {
  /* `bands.members` is now an array of instances of `Person` */
});
```

Keep in mind that virtuals are *not* included in `toJSON()` output by default. If you want populate virtuals to show up when using functions that rely on `JSON.stringify()`, like Express' [`res.json()` function](http://expressjs.com/en/4x/api.html#res.json), set the `virtuals: true` option on your schema's `toJSON` options.

```
// Set `virtuals: true` so `res.json()` works
var BandSchema = new Schema({
  name: String
}, { toJSON: { virtuals: true } });
```

If you're using populate projections, make sure `foreignField` is included in the projection.

```
Band.
  find({}).
  populate({ path: 'members', select: 'name' }).
  exec(function(error, bands) {
    // Won't work, foreign field `band` is not selected in the projection
  });

Band.
  find({}).
  populate({ path: 'members', select: 'name band' }).
  exec(function(error, bands) {
    // Works, foreign field `band` is selected
  });
```

### [Populate in Middleware](http://mongoosejs.com/docs/populate.html#populate-middleware)

You can populate in either pre or post [hooks](http://mongoosejs.com/docs/middleware.html). If you want to always populate a certain field, check out the [mongoose-autopopulate plugin](http://npmjs.com/package/mongoose-autopopulate).

```
// Always attach `populate()` to `find()` calls
MySchema.pre('find', function() {
  this.populate('user');
});
```

```
// Always `populate()` after `find()` calls. Useful if you want to selectively populate
// based on the docs found.
MySchema.post('find', async function(docs) {
  for (let doc of docs) {
    if (doc.isPublic) {
      await doc.populate('user').execPopulate();
    }
  }
});
```

```
// `populate()` after saving. Useful for sending populated data back to the client in an
// update API endpoint
MySchema.post('save', function(doc, next) {
  doc.populate('user').execPopulate(function() {
    next();
  });
});
```

### Next Up

Now that we've covered `populate()`, let's take a look at [discriminators](http://mongoosejs.com/docs/discriminators.html).



# [Why can't you modify the data returned by a Mongoose Query (ex: findById)](https://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid)

When I try to change any part of the data returned by a Mongoose Query it has no effect.

I was trying to figure this out for about 2 hours yesterday, with all kinds of `_.clone()`s, using temporary storage variables, etc. Finally, just when I though I was going crazy, I found a solution. So I figured somebody in the future (fyuuuture!) might have the save issue.

```
Survey.findById(req.params.id, function(err, data){
    var len = data.survey_questions.length;
    var counter = 0;

    _.each(data.survey_questions, function(sq){
        Question.findById(sq.question, function(err, q){
            sq.question = q; //has no effect

            if(++counter == len) {
                res.send(data);
            }
        });
    });
});
```

For cases like this where you want a plain JS object instead of a full model instance, you can call [`lean()`](http://mongoosejs.com/docs/api.html#query_Query-lean) on the query chain like so:

```
Survey.findById(req.params.id).lean().exec(function(err, data){
    var len = data.survey_questions.length;
    var counter = 0;

    _.each(data.survey_questions, function(sq){
        Question.findById(sq.question, function(err, q){
            sq.question = q;

            if(++counter == len) {
                res.send(data);
            }
        });
    });
});
```

This way `data` is already a plain JS object you can manipulate as you need to.
