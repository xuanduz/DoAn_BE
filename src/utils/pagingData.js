export const getPageAmount = (length, pageSize) => {
  return length > pageSize ? Math.floor(length / pageSize) + (length % pageSize == 0 ? 0 : 1) : 1;
};

export const getListData = (listData, pageNum, pageSize) => {
  return listData.length ? listData.slice((pageNum - 1) * pageSize, pageNum * pageSize) : [];
};

export const getQueryWithId = (id) => {
  return id
    ? {
        where: {
          id: id,
        },
        required: true,
      }
    : {
        required: false,
      };
};
