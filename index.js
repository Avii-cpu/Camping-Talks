require('dotenv').config();

const express            = require("express"),
      app                = express(),
      bodyParser         = require("body-parser"),
      mongoose           = require("mongoose"),
      Campground         = require("./models/campground"),
      Comment            = require("./models/comment"),
      User               = require("./models/user"),
      flash              = require("connect-flash"),
      methodOverride     = require("method-override"),
      passport           = require("passport"),
      LocalStrategy      = require("passport-local").Strategy,
      path               = require("path");

// Requiring Routes
const commentRoutes      = require("./routes/comments"),
      campgroundRoutes   = require("./routes/campgrounds"),
      indexRoutes        = require("./routes/index");

const PORT = process.env.PORT || 49966;

// MongoDB Connection
mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection failed:", err));

// App Configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass currentUser and flash messages to every template
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

// Use Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});