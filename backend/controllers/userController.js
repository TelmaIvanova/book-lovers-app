exports.getAllUsers = (req, res) => {
  res.status(200).json({
    message: 'success!',
  });
};

exports.getUser = (req, res) => {
  res.status(200).json({
    message: "API isn't implemented yet!",
  });
};

exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'Success',
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      book: 'updated here',
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
