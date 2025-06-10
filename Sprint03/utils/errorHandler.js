const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'P2002') {
    return res.status(409).json({
      message: '이미 존재하는 값입니다.',
      target: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: '요청한 데이터를 찾을 수 없습니다.',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: '요청 데이터가 유효하지 않습니다.',
      details: err.details || err.errors,
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || '서버 내부 오류가 발생했습니다.',
  });
};

module.exports = errorHandler;
