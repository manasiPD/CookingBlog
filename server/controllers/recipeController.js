require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage
 */
// function named homepage, renders index.ejs and exported to recipeRoutes.js
exports.homepage = async(req, res) => {


    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);


        const food = { latest, thai, american, chinese };


        // 2nd arg passes title
        res.render('index', { title: 'Cooking Blog - Home', categories, food });

    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}


/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async(req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}


/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async(req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categoryById });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}


/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async(req, res) => {
    try{
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', {title: 'Cooking Blog - Recipe', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * POST /search
 * Search
 */
exports.searchRecipe = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'Cooking Blog - Search', recipe });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }    
}


/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async(req, res) => {
    try{
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', {title: 'Cooking Blog - Explore Latest', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async(req, res) => {
    try{
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', {title: 'Cooking Blog - Explore Random', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', {title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj });
}


/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async(req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files where uploaded.');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            })
        }
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been added.');
    res.redirect('submit-recipe');
    } catch (error) {
        //res.json(error);
        req.flash('infoErrors', error);
        res.redirect('submit-recipe');
    }
}

// delete recipe
// async function deleteRecipe(){
//     try {
//         await Recipe.deleteOne({ name: 'Oreo milk shake' });
//     } catch (error) {
//         console.log(error);
//     }
// }
// deleteRecipe();


// update recipe
// async function updateRecipe(){
//     try {
//         const res = await Recipe.updateOne({ name: 'Masala Makhana(Lotus Seeds)'}, { name: 'Peri Peri Makhana' });
//         res.n; // Number of documents matched
//         res.nModified; // Number of documents modified
//     } catch (error) {
//         console.log(error);
//     }
// }

// updateRecipe();




// async function insertDummyRecipeData(){
//     try {
//         await Recipe.insertMany([
//                   { 
//                     "name": "Chinese steak & tofu stew",
//                     "description": "Ring the changes with this lovely, light nutritious beef stew - it really hits the spot.",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "250g rump or sirloin steak",
//                         "2 cloves of garlic",
//                         "4cm piece of ginger",
//                         "2 fresh red chilli",
//                         "1 bunch of spring onions",
//                        "2 large carrots",
//                         "250g mooli or radishes",
//                         "1 heaped teaspoon Szechuan peppercorns",
//                         "groundnut oil",
//                         "2 tablespoons Chinese chilli bean paste , (find it in Asian supermarkets)",
//                         "1 litre veg stock",
//                         "1 x 400g tin of aduki beans",
//                        "250g pudding or risotto rice",
//                         "1 tablespoon cornflour",
//                         "200g tenderstem broccoli",
//                         "350g firm silken tofu"
//                     ],
//                     "category": "Chinese", 
//                     "image": "chinese-steak-tofu.jpg"
//                   },
//                   { 
//                     "name": "Chocolate & banofee whoopie pies",
//                     "description": "Everyone's mad for whoopie pies in the States, and they're catching on here too. They're sort of the perfect little sweet sandwich. I've gone for a classic combo here but you can be as inventive as you like.",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "2 heaped tablespoons cocoa powder , plus extra for dusting",
//                         "350 g self-raising flour",
//                         "175 g sugar",
//                         "200 ml milk",
//                         "100 ml nut or rapeseed oil",
//                        "1 large free-range egg",
//                         "BANOFFEE FILLING",
//                         "240 g dulce de leche",
//                         "3 bananas",
//                         "icing sugar , for dusting"
//                     ],
//                     "category": "American", 
//                     "image": "chocolate-banoffee-whoopie-pies.jpg"
//                   },
//                   { 
//                     "name": "Crab cakes",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "3 spring onions",
//                         "½ a bunch of fresh flat-leaf parsley",
//                         "1 large free-range egg",
//                         "750 g cooked crabmeat , from sustainable sources",
//                         "300 g mashed potatoes",
//                         "1 teaspoon ground white pepper",
//                         "1 teaspoon cayenne pepper",
//                         "plain flour , for dusting",
//                         "olive oil",
//                         "watercress",
//                         "tartare sauce"
//                     ],
//                     "category": "American", 
//                     "image": "crab-cakes.jpg"
//                   },
//                   { 
//                     "name": "Grilled lobster rolls",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "85 g butter",
//                         "6 submarine rolls",
//                         "500 g cooked lobster meat, from sustainable sources",
//                         "1 stick of celery",
//                         "2 tablespoons mayonnaise , made using free-range eggs",
//                         "½ an iceberg lettuce",
//                     ],
//                     "category": "American", 
//                     "image": "grilled-lobster-rolls.jpg"
//                   },
//                   { 
//                     "name": "Key lime pie",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "4 large free-range egg yolks",
//                         "400 ml condensed milk",
//                         "5 limes",
//                         "200 ml double cream",
//                         "CRUST",
//                         "135 g unsalted butter",
//                         "12 digestive biscuits",
//                         "45 g caster sugar"
//                     ],
//                     "category": "American", 
//                     "image": "key-lime-pie.jpg"
//                   },
//                   { 
//                     "name": "Southern fried chicken",
//                     "description": "This is an incredible fried chicken recipe, one that I've subtly evolved from that of my dear friend Art Smith, one of the kings of southern American comfort food. I've finished the chicken in the oven, purely because you really do need a big fryer to do it properly, as well as for good temperature control, and this method is much friendlier for home cooking.",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                       "4 free-range chicken thighs , skin on, bone in",
//                       "4 free-range chicken drumsticks",
//                       "200 ml buttermilk",
//                       "4 sweet potatoes",
//                       "200 g plain flour",
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                       "1 level teaspoon onion powder",
//                       "1 level teaspoon garlic powder",
//                       "2 litres groundnut oil",
//                       "BRINE",
//                       "1 tablespoon black peppercorns",
//                       "25 g sea salt",
//                       "100 g brown sugar",
//                       "4 sprigs of fresh thyme",
//                       "4 fresh bay leaves",
//                       "4 cloves of garlic",
//                       "PICKLE",
//                       "1 teaspoon fennel seeds",
//                       "100 ml red wine vinegar",
//                       "1 heaped tablespoon golden caster sugar",
//                       "½ red cabbage , (500g)"
//                     ],
//                     "category": "American", 
//                     "image": "southern-friend-chicken.jpg"
//                   },
//                   { 
//                     "name": "Spring rolls",
//                     "description": "If you look carefully you'll see one side of the spring-roll wrapper is smoother - this side faces outward. Cover the wrappers with a damp tea towel while you're prepping or they'll dry out and crack. ",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "40 g dried Asian mushrooms",
//                         "50 g vermicelli noodles",
//                         "200 g Chinese cabbage",
//                         "1 carrot",
//                         "3 spring onions",
//                         "5 cm piece of ginger",
//                         "1 red chilli",
//                         "1 big bunch of fresh Thai basil , (30g)",
//                         "1 big bunch of fresh coriander , (30g)",
//                         "3 tablespoons toasted peanuts",
//                         "20 ml sesame oil",
//                         "75 g beansprouts , (ready to eat)",
//                         "2 tablespoons low-salt soy sauce",
//                         "2 tablespoons oyster sauce",
//                         "1 tablespoon cornflour",
//                         "16 large spring-roll wrappers , thawed if frozen",
//                         "1 tablespoon five-spice powder",
//                         "1 litre groundnut oil",
//                         "sweet chilli sauce , to serve",
//                     ],
//                     "category": "American", 
//                     "image": "spring-rolls.jpg"
//                   },
//                   { 
//                     "name": "Stir-fried vegetables",
//                     "description": "There are so many things to love about this stir-fry recipe - it's quick, tasty and full of goodness",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "1 clove of garlic",
//                         "1 fresh red chilli",
//                         "3 spring onions",
//                         "1 small red onion",
//                         "1 handful of mangetout",
//                         "a few shiitake mushrooms",
//                         "a few water chestnuts",
//                         "1 handful of shredded green cabbage",
//                        "olive oil",
//                         "2 teaspoons soy sauce",
//                         "sesame oil",
//                         "sesame seeds , to sprinkle on top"
//                     ],
//                     "category": "Chinese", 
//                     "image": "stir-fried-vegetables.jpg"
//                   },
//                   { 
//                     "name": "Thai-Chinese-inspired pinch salad",
//                     "description": "These fragrant, Thai-style mini salads make a great sharing starter or party canapés.",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "5 cm piece of ginger",
//                         "1 fresh red chilli",
//                         "25 g sesame seeds",
//                         "24 raw peeled king prawns , from sustainable sources (defrost first, if using frozen)",
//                         "1 pinch Chinese five-spice powder",
//                         "1 lime",
//                         "sesame oil",
//                         "2 round lettuces",
//                         "50 g fine rice noodles",
//                         "½ a bunch of fresh coriander (15g)"
//                     ],
//                     "category": "Thai", 
//                     "image": "thai-chinese-inspired-pinch-salad.jpg"
//                   },
//                   { 
//                     "name": "Thai green curry",
//                     "description": "The first time I ever had Thai green curry I was sixteen years old and it blew my mind! This green curry paste is so quick to make, yet the flavours are really complex, refreshing and delicious. With Christmas leftovers, it's a dream. Boom.",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "1 butternut squash (1.2kg)",
//                         "groundnut oil",
//                         "2x 400 g tins of light coconut milk",
//                         "400 g leftover cooked greens, such as Brussels sprouts, Brussels tops, kale, cabbage, broccoli",
//                         "350 g firm silken tofu",
//                         "75 g unsalted peanuts",
//                         "sesame oil",
//                         "1 fresh red chilli",
//                         "2 limes",
//                         "CURRY PASTE",
//                         "1 teaspoon cumin seeds",
//                         "2 cloves garlic",
//                         "2 shallots",
//                         "5 cm piece of ginger",
//                         "4 lime leaves",
//                         "2 tablespoons fish sauce",
//                         "4 fresh green chillies",
//                         "2 tablespoons desiccated coconut",
//                         "1 bunch fresh coriander (30g)",
//                         "1 stick lemongrass",
//                         "1 lime",
//                     ],
//                     "category": "Thai", 
//                     "image": "thai-green-curry.jpg"
//                   },
//                   { 
//                     "name": "Thai-inspired vegetable broth",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "3 cloves of garlic",
//                         "5cm piece of ginger",
//                         "200 g mixed Asian greens , such as baby pak choi, choy sum, Chinese cabbage",
//                         "2 spring onions",
//                         "1 fresh red chilli",
//                         "5 sprigs of fresh Thai basil",
//                         "1 stick of lemongrass",
//                         "2 star anise",
//                         "800 ml clear organic vegetable stock",
//                         "1 teaspoon fish sauce , (optional)",
//                         "1 teaspooon soy sauce",
//                         "1 small punnet shiso cress",
//                         "1 lime",
//                     ],
//                     "category": "Thai", 
//                     "image": "thai-inspired-vegetable-broth.jpg"
//                   },
//                   { 
//                     "name": "Thai red chicken soup",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "1 x 1.6 kg whole chicken",
//                         "1 butternut squash (1.2kg)",
//                         "1 bunch of fresh coriander (30g)",
//                         "100 g Thai red curry paste",
//                         "1 x 400 ml tin of light coconut milk"
//                     ],
//                     "category": "Thai", 
//                     "image": "thai-red-chicken-soup.jpg"
//                   },
//                   { 
//                     "name": "Thai-style mussels",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "1 kg mussels , debearded, from sustainable sources",
//                         "4 spring onions",
//                         "2 cloves of garlic",
//                         "½ a bunch of fresh coriander",
//                         "1 stick of lemongrass",
//                         "1 fresh red chilli",
//                         "groundnut oil",
//                         "1 x 400 ml tin of reduced fat coconut milk",
//                         "1 tablespoon fish sauce",
//                         "1 lime"
//                     ],
//                     "category": "Thai", 
//                     "image": "thai-style-mussels.jpg"
//                   },
//                   { 
//                     "name": "Tom Daley's sweet & sour chicken",
//                     "description": "Tom told me this is his guilty pleasure after a competition, so I wanted to show him just how fantastic it can be if you make it from scratch. The joy of cooking at home is that you can really own it - packed with fresh veg, and free from piles of added sugar and fat often found in takeaways, this firm favourite is a real winner.",
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "1 x 227 g tin of pineapple in natural juice",
//                         "1 x 213 g tin of peaches in natural juice",
//                         "1 tablespoon low-salt soy sauce",
//                         "1 tablespoon fish sauce",
//                         "2 teaspoons cornflour",
//                         "2 x 120 g free-range chicken breasts , skin on",
//                         "Chinese five-spice",
//                         "1 lime",
//                         "2 cloves of garlic",
//                         "1 bunch of asparagus , (350g)",
//                         "100 g tenderstem broccoli",
//                         "1 small onion",
//                         "2 fresh red chillies",
//                         "1 red pepper",
//                         "1 yellow pepper",
//                         "7 cm piece of ginger",
//                         "groundnut oil",
//                         "100 g baby sweetcorn",
//                         "1 teaspoon runny honey",
//                         "½ a bunch of fresh coriander , (15g)"
//                     ],
//                     "category": "Chinese", 
//                     "image": "tom-daley.jpg"
//                   },
//                   { 
//                     "name": "Veggie pad Thai",
//                     "description": `Recipe Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                         "150 g rice noodles",
//                         "sesame oil",
//                         "20 g unsalted peanuts",
//                         "2 cloves of garlic",
//                         "80 g silken tofu",
//                         "low-salt soy sauce",
//                         "2 teaspoons tamarind paste",
//                         "2 teaspoons sweet chilli sauce",
//                         "2 limes",
//                         "1 shallot",
//                         "320 g crunchy veg , such as asparagus, purple sprouting broccoli, pak choi, baby corn",
//                         "80 g beansprouts",
//                         "2 large free-range eggs",
//                         "olive oil",
//                         "dried chilli flakes",
//                         "½ a cos lettuce",
//                         "½ a mixed bunch of fresh basil, mint and coriander , (15g)"
//                     ],
//                     "category": "Thai", 
//                     "image": "veggie-pad-thai.jpg"
//                   }
//                 ]);
//     } catch (error) {
//         console.log('err', + error);
//     }
// }

// insertDummyRecipeData();





// below function will save the dummy data in mongo db and will be used as the categories
// if we go in the mongodb collection and change the name of any data it will be reflected on the main page

// async function insertDummyCategoryData(){
//     try {
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             }
//         ]);
//     } catch (error) {
//         console.log('err', + error);
//     }
// }

// insertDummyCategoryData();



