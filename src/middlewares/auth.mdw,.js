export function isAuth(req, res, next) {
  if (!req.session.isAuthenticated) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/signin');
  }

  next();
}

// Admin = 2 - Veterinarian = 1 - Customer = 0

export function isCustomer(req, res, next) {
    if (req.session.authUser.permission !== 0) {
        return res.render('403');
    }
    next();
}

export function isAdmin(req, res, next) {
  if (req.session.authUser.permission !== 1) {
    return res.render('403');
  }

  next();
}