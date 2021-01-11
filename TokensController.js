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
      const { guid } = req.body;

      let token = await Token.findOne({ guid });

      const accessToken = jwt.sign(
        { guid }, 
        jwt_access_secret,
        { expiresIn: '2m', algorithm: jwt_access_algorithm }
      );

      const refreshToken = jwt.sign(
        { guid },
        jwt_refresh_secret, 
        { algorithm: jwt_refresh_algorithm }
      ); // вносим в базу данных

      if (!token) {
        token = new Token({ guid })
      }
      token.refreshToken = await bcrypt.hash(refreshToken, 1024);
      await user.save();
      res.status(200).json({ accessToken: `Bearer ${accessToken}`,  refreshToken, msg: "пара токенов СОЗДАНА"});
    } catch (e) {
      res.status(500).json({ msg: "Server Error", err: e.message })
    }
  },
  refreshTokens: async (req, res) => {
    const { accessToken, refreshToken } = req.body;

    try {
      const decoded = jwt.verify(accessToken, jwt_access_secret);
      res.status(200).json({ msg: "access token варифицированн" })
    } catch (e) {

      jwt.decode(accessToken, jwt_access_secret, )
      
      let token = await Token.findOne({ refreshToken });

      if (token) {
        const accessToken = jwt.sign(
          { guid: token.guid }, 
          jwt_access_secret,
          { expiresIn: '2m', algorithm: jwt_access_algorithm }
        );
        const newRefreshToken = jwt.sign(
          { guid: token.guid },
          jwt_refresh_secret, 
          { algorithm: jwt_refresh_algorithm }
        );
        token.refreshToken = await bcrypt.hash(refreshToken, 1024);
        token.save();
        res.status(200).json({ accessToken: `Bearer ${accessToken}`,  refreshToken, msg: "был задействован refresh token для получения новой пары токенов"})
      } else {
        res.status(500).json({ msg: "требуется повторная авторизация" })
      }
    }
  }
}