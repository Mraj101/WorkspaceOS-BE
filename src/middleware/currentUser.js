/**
 * Resolves the identity behind the current request onto `req.user`.
 *
 * ⚠️ TEMPORARY IMPLEMENTATION — every request is treated as the seeded dev
 * user (id 1) because the auth module does not exist yet.
 *
 * This file is the ONLY place that decides who the caller is. The rest of the
 * application — controllers, services, queries — already threads `req.user.id`
 * through to a `WHERE user_id = $1` filter, so shipping real auth means
 * replacing the body of this function (verify a token/session, 401 on failure)
 * and changing nothing else.
 *
 * Corollary: never read `req.user` below the controller layer, and never let a
 * client supply `user_id` in a request body — ownership comes from here only.
 */
const DEV_USER_ID = 1;

module.exports = (req, res, next) => {
  req.user = { id: DEV_USER_ID };
  next();
};
