// common info assembling
const commonInfo = (req) => {
    return {
        test: 'ok', // ???
        isAuthenticated: req.isAuthenticated(),
        chat: req.chat, // ???
        user: req.user
    };
};

// gives end of url
const url_end = (req) => {
    const parts = req.url.split('/');
    const end = parts[parts.length - 1];
    return end;
};

// test authentication
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};

// test authentication
const apiEnsureAuthenticated = async (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.json({ ok: false, msg: 'User not logged' });
};


const getUserDB = (by, req, res) => {
    return new Promise(resolve => {
        User.findOne(by, (err, result) => {
            if (err) {
                error(err, req, res, 204, 'User not find')
                resolve(false)
            } else {
                resolve(result)
            };
        });
    });
};

const userExist = (user, req, res) => {
    if (user == null) {
        error('custom', req, res, 204, 'User not exist!')
        return false
    } else return true
};

const getUserSAFE = async (by, req, res) => {
    return new Promise(async resolve => {
        let _user = await getUserDB(by, req, res); // Get user
        userExist(_user, req, res); // Barier
        resolve(_user); // ->
    });
};

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export {
    commonInfo,
    url_end,
    ensureAuthenticated,
    apiEnsureAuthenticated,
    getUserDB,
    userExist,
    getUserSAFE,
    randomIntFromInterval
};