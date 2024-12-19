const getPagination = (page, limit) => {
    const limitPerPage = Math.min(limit, 100);
    const currentPage = page ? page : 1;
    const skip = (currentPage - 1) * limitPerPage;
    return { skip, limit: limitPerPage };
  };
  
export default getPagination;