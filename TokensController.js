const jwt = require('jsonwebtoken');
const { 
  jwt_access_secret,
  jwt_refresh_secret,
  jwt_access_algorithm,
  jwt_refresh_algorithm
} = require('./config');
const Token = require('./TokenModel');
const bcrypt = require('bcryptjs');

module.exports = {
  getAccessRefresh: async (req, res) => {
    try {
      const { guid } = req.query;

      let token = new Token({ guid });

      const accessToken = jwt.sign(
        { guid }, 
        jwt_access_secret,
        { expiresIn: '2m', algorithm: jwt_access_algorithm }
      );

      const refreshToken = jwt.sign(
        { guid },
        jwt_refresh_secret, 
        { algorithm: jwt_refresh_algorithm }
      ); 

      token.refresh_token = await bcrypt.hash(refreshToken, 12);
      
      await token.save();
      res.status(201).json({ accessToken: `Bearer ${accessToken}`,  refreshToken, msg: "пара токенов СОЗДАНА"});
    } catch (e) {
      res.status(500).json({ msg: "Server Error", err: e.message });
    }
  },
  refreshTokens: async (req, res) => {
    const { accessToken, refreshToken, guid } = req.query;

    try {
      const decoded = jwt.verify(accessToken, jwt_access_secret);
      res.status(200).json({ msg: "access token варифицирован" })
    } catch (e) {

      let token = await Token.findOne({ guid });
      if (token) {
        let bcriptRefreshToken = token.refresh_token;

        if (await bcrypt.compare(refreshToken, bcriptRefreshToken)) {
          const accessToken = jwt.sign(
            { guid }, 
            jwt_access_secret,
            { expiresIn: '2m', algorithm: jwt_access_algorithm }
          );
          const refreshToken = jwt.sign(
            { guid },
            jwt_refresh_secret, 
            { algorithm: jwt_refresh_algorithm }
          );
          token.refresh_token = await bcrypt.hash(refreshToken, 12);
          await token.save();
          res.status(200).json({ accessToken: `Bearer ${accessToken}`,  refreshToken, msg: "был задействован refresh token для получения новой пары токенов"})
        } else {
          res.status(401).json({ msg: "требуется пересоздание токенов" })
        }
      } else {
        res.status(401).json({ msg: "guid не найден" })
      }
    }
  }
}