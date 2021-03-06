import passport from 'passport';

export default {
  // Здесь мы проверяем, передаем данные о пользователе в функцию верификации, котоую мы определили выше. 
  // Вообще, passport.authenticate() вызывает метод req.logIn автоматически, здесь же я указал это явно. Это добавляет удобство в отладке. Например, можно вставить сюда console.log(), чтобы посмотреть, что происходит...
  // При удачной авторизации данные пользователя будут храниться в req.user

  login: (req, res, next) => {
    passport.authenticate('local',
      (err, user, info) => {
        return err
          ? next(err)
          : user
            ? req.logIn(user, (err) => {
              return err
                ? next(err)
                : send(user, req, res, 'User logged!')
            })
            : error('custom', req, res, 409, 'Not logged!');
      }
    )(req, res, next);
  },

  logout: (req, res) => {
    req.logout();
    good('ok', req, res, 'You are logged out!');
  }

};
