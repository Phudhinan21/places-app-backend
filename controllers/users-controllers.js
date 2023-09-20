exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = {
    name,
    email,
    password,
  };

  res.status(200).json({ message: "users routes", user: newUser });
};
