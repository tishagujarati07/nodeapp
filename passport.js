const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models').User;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
